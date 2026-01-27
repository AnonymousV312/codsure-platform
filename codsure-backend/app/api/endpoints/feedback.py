from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.db.session import get_db
from app.models.trust import Feedback, Customer
from app.models.order import Order
from app.models.store import Store
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.services.trust_score import trust_service

router = APIRouter()

@router.post("/submit", response_model=FeedbackResponse)
async def submit_feedback(
    *,
    db: AsyncSession = Depends(get_db),
    feedback_in: FeedbackCreate,
) -> Any:
    """
    Public Endpoint for Customers to submit feedback.
    Ideally protected by a unique Order Token (skipped for V1 simplicty).
    """
    # 1. Get Order
    result = await db.execute(select(Order).where(Order.id == feedback_in.order_id))
    order = result.scalars().first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # 2. Get/Create Customer (Logic usually in Order creation, but ensuring here)
    # We assume customer exists if Order exists in V2 models, but finding by phone for safety
    result = await db.execute(select(Customer).where(Customer.phone == order.customer_phone))
    customer = result.scalars().first()
    
    # 3. Save Feedback
    feedback = Feedback(
        order_id=order.id,
        customer_id=customer.id if customer else 0, # Fallback, should link proper
        store_id=order.store_id,
        authenticity_rating=feedback_in.authenticity_rating,
        public_rating=feedback_in.public_rating,
        comment=feedback_in.comment,
        is_verified_delivery=feedback_in.is_verified_delivery
    )
    db.add(feedback)
    await db.commit()
    
    # 4. Trigger Trust Score Updates (Async in prod)
    if customer:
        # Update Customer Trust (Mocking Successful order logic)
        customer.successful_orders += 1
        await trust_service.update_customer_score(db, customer.id)
        
    # Update Store Trust
    await trust_service.update_store_score(db, order.store_id)
    
    return {"id": feedback.id, "status": "recorded"}
