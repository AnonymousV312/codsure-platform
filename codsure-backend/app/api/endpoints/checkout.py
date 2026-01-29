from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api import deps
from app.db.session import get_db
from app.models.store import Store
from app.services.risk_engine import RiskEngine
from pydantic import BaseModel

router = APIRouter()

class CartItem(BaseModel):
    variant_id: str | None = None
    product_id: str | None = None
    quantity: int
    price: float

class CheckoutPayload(BaseModel):
    shop_domain: str
    cart_total: float
    currency: str = "PKR"
    customer_email: str | None = None
    customer_phone: str | None = None
    shipping_city: str | None = None
    items: List[CartItem] = []

class CheckoutDecision(BaseModel):
    allow_cod: bool
    requires_advance: bool
    advance_percentage: int
    advance_amount: float
    message: str | None = None
    reasons: List[str] = []

@router.post("/decision", response_model=CheckoutDecision)
async def get_checkout_decision(
    payload: CheckoutPayload,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Evaluate cart for checkout enforcement.
    Public endpoint for Shopify Extensions.
    """
    # 1. Verify Store
    result = await db.execute(select(Store).where(Store.domain == payload.shop_domain))
    store = result.scalars().first()
    
    if not store:
        # Fail safe: Allow COD if store not found (or log error)
        return CheckoutDecision(
            allow_cod=True, requires_advance=False, advance_percentage=0, advance_amount=0
        )

    # 2. Check Enforcement Switch
    if not store.enforcement_enabled:
        return CheckoutDecision(
            allow_cod=True, requires_advance=False, advance_percentage=0, advance_amount=0
        )

    # 3. Prepare Data for Engine
    cart_data = {
        "total_price": payload.cart_total,
        "customer_city": payload.shipping_city,
        "customer_phone": payload.customer_phone
        # Add more mappings as needed
    }

    # 4. Run Risk Engine
    risk_result = await RiskEngine.evaluate_cart(db, cart_data)
    decision = risk_result["decision"]
    reasons = risk_result["reasons"]

    # 5. Formulate Response
    # Logic:
    # COD_ALLOWED -> Allow COD
    # PARTIAL_ADVANCE -> Hide COD (or require advance)
    # FULL_ADVANCE -> Hide COD
    # BLOCK -> Hide COD

    if decision == "COD_ALLOWED":
        return CheckoutDecision(
            allow_cod=True, requires_advance=False, advance_percentage=0, advance_amount=0, reasons=reasons
        )
    
    # Calculate Advance
    advance_pct = store.partial_advance_percentage
    if decision == "FULL_ADVANCE" or decision == "BLOCK":
        advance_pct = 100
    
    advance_amt = round((payload.cart_total * advance_pct) / 100, 2)

    return CheckoutDecision(
        allow_cod=False, # COD is "hidden" or "restricted"
        requires_advance=True,
        advance_percentage=advance_pct,
        advance_amount=advance_amt,
        message=f"Advance payment of {advance_pct}% required due to order history/value.",
        reasons=reasons
    )
