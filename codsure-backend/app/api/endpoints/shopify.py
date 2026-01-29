from datetime import datetime
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import httpx
import hmac
import hashlib
import json
import urllib.parse
import re
import os

from app.api import deps
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.models.store import Store
from app.core import crypto
from app.services.shopify_service import ShopifyService

router = APIRouter()

# Shopify API Config - In production these should be strictly env vars
SHOPIFY_API_KEY = os.getenv("SHOPIFY_API_KEY", "your-api-key")
SHOPIFY_API_SECRET = os.getenv("SHOPIFY_API_SECRET", "your-api-secret")
SCOPES = "read_orders,read_customers,read_fulfillments"
REDIRECT_URI = f"{settings.SERVER_HOST}/api/v1/shopify/callback"

import os

@router.get("/install")
async def shopify_install(
    shop: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Initiates the Shopify OAuth flow.
    """
    if not shop:
        raise HTTPException(status_code=400, detail="Missing shop parameter")

    # Clean shop URL
    shop_domain = shop.replace("https://", "").replace("http://", "").split("/")[0]
    if not shop_domain.endswith(".myshopify.com"):
        shop_domain += ".myshopify.com"
        
    # State generation (security) - Embedding user_id to link callback
    state = crypto.encrypt_token(f"{current_user.id}:{shop_domain}")
    
    install_url = (
        f"https://{shop_domain}/admin/oauth/authorize?"
        f"client_id={SHOPIFY_API_KEY}&"
        f"scope={SCOPES}&"
        f"redirect_uri={REDIRECT_URI}&"
        f"state={state}"
    )
    
    return {"url": install_url}

@router.get("/callback")
async def shopify_callback(
    request: Request,
    shop: str,
    code: str,
    state: str,
    hmac: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Handles the Shopify OAuth callback.
    """
    # 1. Verify HMAC
    query_params = dict(request.query_params)
    if "hmac" in query_params:
        del query_params["hmac"]
        
    encoded_params = urllib.parse.urlencode(query_params)
    
    secret = SHOPIFY_API_SECRET.encode()
    digest = hmac.new(secret, encoded_params.encode(), hashlib.sha256).hexdigest()
    
    if not hmac.compare_digest(digest, hmac):
        raise HTTPException(status_code=400, detail="Invalid HMAC")
        
    # 2. Decode State to get User ID
    try:
        decrypted_state = crypto.decrypt_token(state)
        user_id_str, expected_shop = decrypted_state.split(":")
        user_id = int(user_id_str)
        
        if shop != expected_shop:
             raise HTTPException(status_code=400, detail="Shop domain mismatch")
             
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid state parameter")

    # 3. Exchange Code for Access Token
    access_token_url = f"https://{shop}/admin/oauth/access_token"
    payload = {
        "client_id": SHOPIFY_API_KEY,
        "client_secret": SHOPIFY_API_SECRET,
        "code": code
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(access_token_url, json=payload)
        
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get access token from Shopify")
        
    data = response.json()
    access_token = data.get("access_token")
    scope = data.get("scope")

    # 4. Save/Update Store in DB
    user = await db.get(User, user_id)
    if not user:
         raise HTTPException(status_code=404, detail="User not found")
         
    # Check if store exists for this user or update
    result = await db.execute(select(Store).where(Store.owner_id == user_id))
    store = result.scalars().first()
    
    encrypted_token = crypto.encrypt_token(access_token)
    
    if store:
        store.domain = shop
        store.access_token = encrypted_token
        store.scope = scope
        store.status = "connected"
        store.connected_at = datetime.utcnow()
    else:
        # Should normally exist from signup, but safe fallback
        store = Store(
            name=shop.split(".")[0],
            domain=shop,
            platform="shopify",
            owner_id=user_id,
            access_token=encrypted_token,
            scope=scope,
            status="connected",
            connected_at=datetime.utcnow()
        )
        db.add(store)
        
    await db.commit()
    
    # Redirect back to frontend dashboard
    frontend_url = f"{settings.SERVER_HOST.replace(':8000', ':3000')}/dashboard?connected=true"
    return RedirectResponse(url=frontend_url)

@router.post("/sync")
async def sync_store_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Trigger manual sync for user's store.
    """
    result = await db.execute(select(Store).where(Store.owner_id == current_user.id))
    store = result.scalars().first()
    
    if not store:
        raise HTTPException(status_code=404, detail="No store connected")
        
    success, message = await ShopifyService.sync_orders(db, store.id)
    
    if not success:
        raise HTTPException(status_code=400, detail=message)
        
    return {"status": "success", "message": message}
