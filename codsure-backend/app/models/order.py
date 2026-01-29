from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Integer, Float, DateTime, JSON, Boolean
from sqlalchemy.sql import func
from datetime import datetime
from app.db.base_class import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .store import Store

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    external_order_id: Mapped[str] = mapped_column(String, index=True, unique=True) # Shopify Order ID (unique)
    order_number: Mapped[str] = mapped_column(String)
    
    customer_id: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
    customer_email: Mapped[str | None] = mapped_column(String, nullable=True)
    customer_phone: Mapped[str | None] = mapped_column(String, index=True, nullable=True) # Normalized
    customer_city: Mapped[str | None] = mapped_column(String, nullable=True)
    
    total_price: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String, default="PKR")
    
    status: Mapped[str] = mapped_column(String, default="pending") # pending, delivered, returned, cancelled
    fulfillment_status: Mapped[str | None] = mapped_column(String, nullable=True)
    
    payment_method: Mapped[str] = mapped_column(String, default="COD") # COD, PREPAID
    is_cod: Mapped[bool] = mapped_column(Boolean, default=True)
    
    raw_data: Mapped[dict] = mapped_column(JSON, nullable=True) # Audit trail
    
    risk_score: Mapped[int] = mapped_column(Integer) # 0-100
    risk_decision: Mapped[str] = mapped_column(String) # COD, PARTIAL_ADVANCE, FULL_ADVANCE, BLOCK
    risk_reasons: Mapped[dict] = mapped_column(JSON) # Detailed reasons
    
    store_id: Mapped[int] = mapped_column(ForeignKey("stores.id"))
    store: Mapped["Store"] = relationship(back_populates="orders")
    
    analyzed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
