from typing import Any
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import AsyncAttrs

class Base(AsyncAttrs, DeclarativeBase):
    pass

# Import models for Alembic/Initialisation
from app.models.user import User
from app.models.store import Store
from app.models.order import Order
from app.models.risk import RiskRule, RiskDecision
from app.models.feature_store import CustomerFeatures
