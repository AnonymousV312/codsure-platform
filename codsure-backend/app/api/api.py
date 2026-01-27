from fastapi import APIRouter
from app.api.endpoints import auth, risk, feedback

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(risk.router, prefix="/risk", tags=["risk"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
