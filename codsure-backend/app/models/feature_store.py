from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Float, DateTime
from sqlalchemy.sql import func
from datetime import datetime
from app.db.base_class import Base

class CustomerFeatures(Base):
    __tablename__ = "customer_features"

    customer_phone: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    
    total_orders: Mapped[int] = mapped_column(Integer, default=0)
    delivered_count: Mapped[int] = mapped_column(Integer, default=0)
    returned_count: Mapped[int] = mapped_column(Integer, default=0)
    cancelled_count: Mapped[int] = mapped_column(Integer, default=0)
    
    total_spent: Mapped[float] = mapped_column(Float, default=0.0)
    avg_order_value: Mapped[float] = mapped_column(Float, default=0.0)
    
    last_order_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Computed scores
    return_rate: Mapped[float] = mapped_column(Float, default=0.0)
    trust_score: Mapped[float] = mapped_column(Float, default=0.5) # 0.0 to 1.0
    
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
