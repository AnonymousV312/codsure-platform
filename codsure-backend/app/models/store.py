from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Integer, DateTime
from sqlalchemy.sql import func
from datetime import datetime
from app.db.base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .user import User
    from .order import Order

class Store(Base):
    __tablename__ = "stores"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    platform: Mapped[str] = mapped_column(String, default="shopify") # shopify, woocommerce
    domain: Mapped[str] = mapped_column(String, unique=True, index=True)
    access_token: Mapped[str | None] = mapped_column(String, nullable=True) # Encrypt this in production
    
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    owner: Mapped["User"] = relationship(back_populates="stores")

    orders: Mapped[list["Order"]] = relationship(back_populates="store")
    
    risk_tolerance: Mapped[int] = mapped_column(Integer, default=50) # 0-100 (Conservative -> Aggressive)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
