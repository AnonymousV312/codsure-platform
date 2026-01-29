from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Boolean, JSON, ForeignKey, DateTime
from sqlalchemy.sql import func
from datetime import datetime
from app.db.base import Base

class RiskRule(Base):
    __tablename__ = "risk_rules"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    
    # Condition stored as JSON: {"field": "total_price", "op": "gt", "value": 5000}
    condition: Mapped[dict] = mapped_column(JSON) 
    
    decision: Mapped[str] = mapped_column(String) # COD_ALLOWED, PARTIAL_ADVANCE, FULL_ADVANCE, BLOCK
    priority: Mapped[int] = mapped_column(Integer, default=10) # Lower runs first? Or Higher? Let's say Lower = Higher Priority (1 is top)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class RiskDecision(Base):
    __tablename__ = "risk_decisions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    
    decision: Mapped[str] = mapped_column(String)
    reasons: Mapped[list[str]] = mapped_column(JSON) # List of rule names that triggered
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
