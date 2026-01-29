from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, JSON, Integer, Text
from sqlalchemy.sql import func
from datetime import datetime
from app.db.base import Base

class SystemEvent(Base):
    __tablename__ = "system_events"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    type: Mapped[str] = mapped_column(String, index=True) # login, signup, error, store_connected
    details: Mapped[dict] = mapped_column(JSON, default={})
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
