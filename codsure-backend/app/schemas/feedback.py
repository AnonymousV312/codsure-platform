from pydantic import BaseModel
from typing import Optional

class FeedbackCreate(BaseModel):
    order_id: int
    authenticity_rating: int # 1-5
    public_rating: int # 1-5
    comment: Optional[str] = None
    is_verified_delivery: bool = True

class FeedbackResponse(BaseModel):
    id: int
    status: str = "received"
