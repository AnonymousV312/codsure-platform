from datetime import datetime
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import hmac
import hashlib
import json

from app.api import deps
from app.core.config import settings
from app.db.session import get_db
from app.models.store import Store
from app.models.order import Order
from app.services.shopify_service import ShopifyService

router = APIRouter()

SHOPIFY_API_SECRET = os.getenv("SHOPIFY_API_SECRET", "your-api-secret")

import os

async def verify_shopify_webhook(request: Request, x_shopify_hmac_sha256: str = Header(None)):
    """
    Dependency to verify Shopify Webhook HMAC.
    """
    if not x_shopify_hmac_sha256:
        raise HTTPException(status_code=401, detail="Missing HMAC header")
        
    body = await request.body()
    secret = SHOPIFY_API_SECRET.encode()
    digest = hmac.new(secret, body, hashlib.sha256).base64digest() # Shopify uses base64
    
    # Note: hmac.compare_digest expects bytes or str, check implementation/lib
    # Usually standard is hexdigest but Shopify is base64
    import base64
    digest_b64 = base64.b64encode(hmac.new(secret, body, hashlib.sha256).digest()).decode()

    if not hmac.compare_digest(digest_b64, x_shopify_hmac_sha256):
        # Allow dev bypass if secret is placeholder
        if SHOPIFY_API_SECRET == "your-api-secret":
            pass # TODO: Remove in true prod
        else:
             raise HTTPException(status_code=401, detail="Invalid HMAC")
    return True

@router.post("/shopify/orders")
async def handle_shopify_order(
    request: Request,
    db: AsyncSession = Depends(get_db),
    # verified: bool = Depends(verify_shopify_webhook) # Enable for security
    x_shopify_topic: str = Header(None),
    x_shopify_shop_domain: str = Header(None),
):
    """
    Handle Shopify Order Webhooks (orders/create, orders/updated)
    """
    payload = await request.json()
    
    # Identify Store
    if not x_shopify_shop_domain:
        # Fallback implies maybe we check payload or fail
        # For now assume header exists
        return {"status": "ignored", "reason": "no shop header"}

    result = await db.execute(select(Store).where(Store.domain == x_shopify_shop_domain))
    store = result.scalars().first()
    
    if not store:
        # Store disconnected or unknown => Log and ignore
        return {"status": "ignored", "reason": "unknown store"}

    # Process Order
    shopify_order_id = str(payload.get("id"))
    
    # Check if exists
    result = await db.execute(select(Order).where(Order.external_order_id == shopify_order_id))
    existing_order = result.scalars().first()
    
    customer_info = ShopifyService.extract_customer_info(payload)
    is_cod = ShopifyService.is_cod_order(payload)
    
    if existing_order:
        # Update
        existing_order.total_price = float(payload.get("total_price", 0))
        existing_order.status = "cancelled" if payload.get("cancelled_at") else ( "returned" if payload.get("financial_status") == "refunded" else "pending") # Simplified
        existing_order.payment_method = "COD" if is_cod else "PREPAID"
        existing_order.is_cod = is_cod
        existing_order.fulfillment_status = payload.get("fulfillment_status")
        existing_order.updated_at = datetime.utcnow()
        existing_order.raw_data = payload # Create audit trail
    else:
        # Create
        new_order = Order(
            external_order_id=shopify_order_id,
            order_number=str(payload.get("order_number")),
            customer_id=customer_info["id"],
            customer_email=customer_info["email"],
            customer_phone=customer_info["phone"],
            customer_city=customer_info["city"],
            total_price=float(payload.get("total_price", 0)),
            currency=payload.get("currency", "PKR"),
            status="pending", # Simplification
            fulfillment_status=payload.get("fulfillment_status"),
            payment_method="COD" if is_cod else "PREPAID",
            is_cod=is_cod,
            risk_score=0, # Default (Not analyzed yet)
            risk_decision="PENDING", 
            risk_reasons={},
            store_id=store.id,
            raw_data=payload
        )
        db.add(new_order)
    
    await db.commit()
    return {"status": "success"}
