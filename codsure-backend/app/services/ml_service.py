import pandas as pd
import joblib
import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.order import Order
from app.models.feature_store import CustomerFeatures
from app.services.risk_engine import RiskEngine

MODEL_PATH = "ml_models/risk_model_v1.joblib"
try:
    os.makedirs("ml_models", exist_ok=True)
except Exception as e:
    print(f"Warning: Could not create ml_models directory: {e}")

class MLService:
    @staticmethod
    async def train_model(db: AsyncSession):
        """
        Train a Logistic Regression model on historical orders.
        Target: 1 if Delivered, 0 if Returned/Cancelled.
        """
        # 1. Fetch Data
        result = await db.execute(select(Order))
        orders = result.scalars().all()
        
        if len(orders) < 50:
            return {"status": "skipped", "reason": "Not enough data (<50 orders)"}
            
        data = []
        for o in orders:
            # Simple Feature extraction
            # In a real system, we'd join with CustomerFeatures
            is_success = 1 if o.status == 'delivered' else 0
            
            data.append({
                "total_price": o.total_price,
                "risk_score": o.risk_score or 0, # Rule engine score as feature
                "hour_of_day": o.analyzed_at.hour if o.analyzed_at else 12,
                "target": is_success
            })
            
        df = pd.DataFrame(data)
        
        # 2. Train
        from sklearn.linear_model import LogisticRegression
        from sklearn.model_selection import train_test_split
        
        X = df[["total_price", "risk_score", "hour_of_day"]]
        y = df["target"]
        
        # Handle class imbalance if needed (not done here for simplicity)
        model = LogisticRegression(class_weight='balanced')
        model.fit(X, y)
        
        # 3. Save
        joblib.dump(model, MODEL_PATH)
        
        return {"status": "success", "accuracy": model.score(X, y)}

    @staticmethod
    def predict_risk(cart_data: dict, current_risk_score: int = 0) -> float:
        """
        Predict probability of success (0.0 to 1.0).
        Returns 0.5 (neutral) if model doesn't exist.
        """
        if not os.path.exists(MODEL_PATH):
            return 0.5
            
        try:
            model = joblib.load(MODEL_PATH)
            
            # Create feature vector matching training
            features = pd.DataFrame([{
                "total_price": float(cart_data.get("total_price", 0)),
                "risk_score": current_risk_score,
                "hour_of_day": 12 # Default/Mean imputation
            }])
            
            # Predict Probability of Class 1 (Success)
            prob_success = model.predict_proba(features)[0][1]
            return float(prob_success)
        except Exception as e:
            print(f"ML Inference Error: {e}")
            return 0.5
