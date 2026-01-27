from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Integer, Float, DateTime, Boolean, Text
from sqlalchemy.sql import func
from datetime import datetime
from app.db.base import Base

class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    phone: Mapped[str] = mapped_column(String, unique=True, index=True)
    
    trust_score: Mapped[float] = mapped_column(Float, default=50.0) # 0-100
    total_orders: Mapped[int] = mapped_column(Integer, default=0)
    successful_orders: Mapped[int] = mapped_column(Integer, default=0)
    refused_orders: Mapped[int] = mapped_column(Integer, default=0)
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    feedbacks: Mapped[list["Feedback"]] = relationship(back_populates="customer")

class Feedback(Base):
    __tablename__ = "feedbacks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id")) # Link to Order
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    store_id: Mapped[int] = mapped_column(ForeignKey("stores.id"))
    
    # Security/Truth
    authenticity_rating: Mapped[int] = mapped_column(Integer) # 1-5, Private
    # Experience
    public_rating: Mapped[int] = mapped_column(Integer) # 1-5, Public
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    is_verified_delivery: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    customer: Mapped["Customer"] = relationship(back_populates="feedbacks")
    
class CourierReport(Base):
    __tablename__ = "courier_reports"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    
    is_courier_fault: Mapped[bool] = mapped_column(Boolean, default=False)
    description: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String, default="pending") # pending, approved, rejected
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
