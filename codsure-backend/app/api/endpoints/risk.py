from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.db.session import get_db
from app.models.user import User
from app.models.store import Store
from app.models.order import Order
from app.schemas.risk import RiskAnalysisRequest, RiskAnalysisResponse
from app.services.risk_engine import risk_engine
from datetime import datetime

router = APIRouter()

@router.post("/analyze", response_model=RiskAnalysisResponse)
async def analyze_order(
    *,
    db: AsyncSession = Depends(get_db),
    risk_in: RiskAnalysisRequest,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Analyze an order for COD risk.
    """
    # 1. Verify Store ownership (or allowed access)
    result = await db.execute(select(Store).where(Store.id == risk_in.store_id))
    store = result.scalars().first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    if store.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized to access this store")

    # 2. Get history (Mocked for now, in real app query Customers table)
    customer_history = {
        "refusal_rate": 10, # Mock
        "total_orders": 5   # Mock
    }
    
    # 3. Calculate Risk
    risk_result = risk_engine.calculate_risk(risk_in.model_dump(), customer_history)
    
    # 4. Save Order
    order = Order(
        external_order_id=risk_in.order_id, # This field name in schema is order_id, model is external_order_id
        order_number=risk_in.order_id, # Reusing ID as number for simplified V1
        customer_phone=risk_in.customer_phone,
        customer_city=risk_in.city,
        total_price=risk_in.total_price,
        risk_score=risk_result["risk_score"],
        risk_decision=risk_result["decision"],
        risk_reasons=risk_result["reasons"],
        store_id=store.id
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)
    
    return {
        "risk_score": order.risk_score,
        "decision": order.risk_decision,
        "reasons": order.risk_reasons,
        "timestamp": order.analyzed_at.isoformat()
    }
