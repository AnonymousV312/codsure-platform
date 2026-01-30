from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api import deps
from app.models.trust import CourierReport, Customer
from app.models.order import Order
from app.services.scoring_service import ScoringService
from pydantic import BaseModel

router = APIRouter()

class DisputeCreate(BaseModel):
    order_id: int
    reason: str
    description: str

class DisputeResolution(BaseModel):
    status: str # approved, rejected
    admin_notes: str | None = None

@router.post("/", response_model=dict)
async def create_dispute(
    dispute: DisputeCreate,
    current_user = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """
    Merchant opens a dispute against a courier for a specific order.
    """
    # 1. Get Order
    result = await db.execute(select(Order).where(Order.id == dispute.order_id))
    order = result.scalars().first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    # 2. Check if already disputed
    # (Simplified for v1)
    
    # 3. Create Report
    report = CourierReport(
        order_id=order.id,
        is_courier_fault=True, # Alleged
        description=dispute.description,
        status="pending"
    )
    db.add(report)
    await db.commit()
    
    return {"message": "Dispute submitted successfully", "report_id": report.id}

@router.post("/{report_id}/resolve", response_model=dict)
async def resolve_dispute(
    report_id: int,
    resolution: DisputeResolution,
    current_user = Depends(deps.get_current_active_admin), # Admin only
    db: AsyncSession = Depends(deps.get_db)
):
    """
    Admin resolves the dispute. If approved (Courier Fault), we restore Customer Score.
    """
    result = await db.execute(select(CourierReport).where(CourierReport.id == report_id))
    report = result.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Dispute not found")
        
    report.status = resolution.status
    
    if resolution.status == "approved":
        # It WAS courier fault. Fix Customer Score.
        # Need to find the customer associated with the order
        order_result = await db.execute(select(Order).where(Order.id == report.order_id))
        order = order_result.scalars().first()
        
        if order and order.customer_id:
            # We need to find the internal Customer ID from the order's customer_id/phone
            # For this V2, we might strictly link via phone if customer_id is the string Shopify ID
            # Assuming we can find them via phone for now:
            c_result = await db.execute(select(Customer).where(Customer.phone == order.customer_phone))
            customer = c_result.scalars().first()
            
            if customer:
                await ScoringService.update_score(db, customer.id, "DISPUTE_RESOLVED_COURIER_FAULT")
                # Also mark customer stats?
                customer.courier_disputes_count += 1
                
    await db.commit()
    return {"message": "Dispute resolved", "status": report.status}
