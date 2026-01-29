from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api import deps
from app.db.session import get_db
from app.models.risk import RiskRule, RiskDecision
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

class RuleCreate(BaseModel):
    name: str
    condition: dict
    decision: str
    priority: int = 10
    is_active: bool = True

@router.get("/rules")
async def get_risk_rules(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user) # Simplify permissions
) -> Any:
    """
    List all risk rules.
    """
    result = await db.execute(select(RiskRule).order_by(RiskRule.priority.asc()))
    return result.scalars().all()

@router.post("/rules")
async def create_risk_rule(
    rule_in: RuleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Create a new risk rule.
    """
    rule = RiskRule(**rule_in.dict())
    db.add(rule)
    await db.commit()
    return rule

@router.post("/evaluate/{order_id}")
async def evaluate_order_manually(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Manually re-evaluate an order (Dev tool).
    """
    from app.services.risk_engine import RiskEngine
    from app.models.order import Order
    
    order = await db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    decision = await RiskEngine.evaluate_order(db, order)
    return {"status": "success", "decision": decision}
