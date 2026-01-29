from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, case
from datetime import datetime, timedelta

from app.api import deps
from app.db.session import get_db
from app.models.user import User
from app.models.store import Store
from app.models.order import Order
from app.db.seed import seed_data

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get aggregated dashboard stats for the current user's stores.
    """
    # Get user's stores
    result = await db.execute(select(Store.id).where(Store.owner_id == current_user.id))
    store_ids = result.scalars().all()
    
    if not store_ids:
        return {
            "total_revenue": 0,
            "total_orders": 0,
            "return_rate": 0,
            "risk_saved": 0
        }

    # Query Orders for these stores
    # Total Revenue
    revenue_query = select(func.sum(Order.total_price)).where(
        Order.store_id.in_(store_ids),
        Order.status != "cancelled",
        Order.status != "returned"
    )
    revenue_result = await db.execute(revenue_query)
    total_revenue = revenue_result.scalar() or 0.0

    # Total Orders
    count_query = select(func.count(Order.id)).where(Order.store_id.in_(store_ids))
    count_result = await db.execute(count_query)
    total_orders = count_result.scalar() or 0

    # Return Rate (Assuming 'returned' status)
    return_query = select(func.count(Order.id)).where(
        Order.store_id.in_(store_ids),
        Order.status == "returned"
    )
    return_result = await db.execute(return_query)
    returned_orders = return_result.scalar() or 0
    return_rate = (returned_orders / total_orders * 100) if total_orders > 0 else 0.0

    # Risk Blocked Revenue/Money Saved (Orders we blocked)
    # Assuming 'risk_decision' == 'BLOCK' means we saved that money from potential loss
    # This is a simplification; in real life, 'saved' = blocked * (probability of return)
    # For now, let's just count blocked orders count or something simple.
    # Let's count High Risk orders blocked.
    risk_query = select(func.count(Order.id)).where(
        Order.store_id.in_(store_ids),
        Order.risk_decision == "BLOCK"
    )
    risk_result = await db.execute(risk_query)
    risk_blocked_count = risk_result.scalar() or 0


    return {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "return_rate": round(return_rate, 1),
        "risk_blocked_count": risk_blocked_count
    }

@router.get("/chart")
async def get_dashboard_chart(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get daily revenue/order count for charts (last 30 days).
    """
    result = await db.execute(select(Store.id).where(Store.owner_id == current_user.id))
    store_ids = result.scalars().all()
    
    if not store_ids:
        return []

    # Group by date (simplified for Postgres using date_trunc or casting)
    # Using python processing for simplicity if dataset is small, or simple SQL
    
    # Let's just fetch last 30 days orders and process in python for MVP (easier than complex sqlalchemy group by for now)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    
    query = select(Order).where(
        Order.store_id.in_(store_ids),
        Order.analyzed_at >= thirty_days_ago
    ).order_by(Order.analyzed_at)
    
    result = await db.execute(query)
    orders = result.scalars().all()
    
    # Process
    daily_data = {}
    for o in orders:
        day_str = o.analyzed_at.strftime("%Y-%m-%d")
        if day_str not in daily_data:
            daily_data[day_str] = {"date": day_str, "revenue": 0, "orders": 0, "risk_high": 0}
        
        daily_data[day_str]["orders"] += 1
        if o.risk_score > 70:
            daily_data[day_str]["risk_high"] += 1
        
        if o.status not in ["cancelled", "returned"]:
             daily_data[day_str]["revenue"] += o.total_price

    return sorted(list(daily_data.values()), key=lambda x: x["date"])

@router.get("/recent-orders")
async def get_recent_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get recent orders.
    """
    result = await db.execute(select(Store.id).where(Store.owner_id == current_user.id))
    store_ids = result.scalars().all()
    
    if not store_ids:
        return []

    query = select(Order).where(Order.store_id.in_(store_ids)).order_by(desc(Order.analyzed_at)).limit(10)
    result = await db.execute(query)
    orders = result.scalars().all()
    
    return orders

@router.post("/seed")
async def trigger_seed(
    db: AsyncSession = Depends(get_db),
    # current_user: User = Depends(deps.get_current_active_superuser), # Ideally admin only
) -> Any:
    """
    Trigger DB Seeding (Dev only).
    """
    await seed_data()
    return {"status": "seeded"}
