from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from datetime import datetime, timedelta

from app.api import deps
from app.db.session import get_db
from app.models.user import User
from app.models.store import Store
from app.models.order import Order
from app.models.event import SystemEvent

router = APIRouter()

# --- ADMIN PERMISSION CHECK ---
def check_admin_privileges(current_user: User = Depends(deps.get_current_active_user)) -> User:
    if current_user.role != "admin" and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges",
        )
    return current_user

@router.get("/overview")
async def get_admin_overview(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(check_admin_privileges),
) -> Any:
    """
    Get aggregated admin stats (platform wide).
    """
    # Total Users/Merchants
    merchants_count = await db.scalar(select(func.count(User.id)).where(User.role == "merchant"))
    
    # Total Orders
    orders_count = await db.scalar(select(func.count(Order.id)))
    
    # Total Revenue (sum of all orders not cancelled/returned)
    revenue = await db.scalar(select(func.sum(Order.total_price)).where(Order.status.not_in(["cancelled", "returned"]))) or 0
    
    # High Risk Orders Count
    high_risk_count = await db.scalar(select(func.count(Order.id)).where(Order.risk_decision == "BLOCK")) or 0

    return {
        "merchants_count": merchants_count,
        "orders_count": orders_count,
        "total_revenue": revenue,
        "high_risk_orders_count": high_risk_count,
        "status": "healthy"
    }

@router.get("/merchants")
async def list_merchants(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(check_admin_privileges),
) -> Any:
    """
    List all merchants with their store details.
    """
    query = select(User).where(User.role != "admin").order_by(desc(User.created_at))
    result = await db.execute(query)
    users = result.scalars().all()
    
    merchants_data = []
    for user in users:
        # Get store info
        store_result = await db.execute(select(Store).where(Store.owner_id == user.id))
        store = store_result.scalars().first()
        
        merchants_data.append({
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "joined_at": user.created_at,
            "is_active": user.is_active,
            "store_name": store.name if store else "N/A",
            "store_domain": store.domain if store else "N/A"
        })
        
    return merchants_data

@router.post("/merchants/{user_id}/toggle")
async def toggle_merchant_status(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(check_admin_privileges),
) -> Any:
    """
    Activate/Deactivate a merchant.
    """
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.is_active = not user.is_active
    await db.commit()
    
    # Log event
    event = SystemEvent(
        type="merchant_status_change",
        details={"admin_id": current_admin.id, "target_user_id": user_id, "new_status": user.is_active}
    )
    db.add(event)
    await db.commit()
    
    return {"status": "success", "is_active": user.is_active}

@router.get("/orders")
async def list_all_orders(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(check_admin_privileges),
    skip: int = 0,
    limit: int = 50
) -> Any:
    """
    List all orders system-wide (recent first).
    """
    query = select(Order).order_by(desc(Order.analyzed_at)).offset(skip).limit(limit)
    result = await db.execute(query)
    orders = result.scalars().all()
    return orders

@router.get("/logs")
async def list_system_events(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(check_admin_privileges),
    limit: int = 50
) -> Any:
    """
    List recent system events.
    """
    query = select(SystemEvent).order_by(desc(SystemEvent.timestamp)).limit(limit)
    result = await db.execute(query)
    events = result.scalars().all()
    return events
