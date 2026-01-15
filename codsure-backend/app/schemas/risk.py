from pydantic import BaseModel
from typing import List, Optional

class RiskAnalysisRequest(BaseModel):
    store_id: int
    order_id: str
    customer_phone: str
    city: str
    total_price: float
    items: List[dict] = []

class RiskAnalysisResponse(BaseModel):
    risk_score: int
    decision: str
    reasons: List[str]
    timestamp: str
