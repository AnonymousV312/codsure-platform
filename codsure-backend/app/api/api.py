from fastapi import APIRouter
from app.api.endpoints import auth, risk, feedback, dashboard, admin, shopify, webhooks, checkout, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(risk.router, prefix="/risk", tags=["risk"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(shopify.router, prefix="/shopify", tags=["shopify"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(risk.router, prefix="/rules", tags=["rules"])
api_router.include_router(checkout.router, prefix="/checkout", tags=["checkout"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
