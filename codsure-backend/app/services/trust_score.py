from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.models.trust import Customer, Feedback
from app.models.store import Store
from app.models.order import Order

class TrustService:
    async def update_customer_score(self, db: AsyncSession, customer_id: int):
        """
        Calculates Customer Trust Score.
        Formula:
        - Base Score: 50
        - Successful Order: +10 points
        - Refusal: -20 points
        - High Value Order (>10k) & Success: Bonus +5
        - Last 10 Orders Weight: 1.5x (Implicitly handled by cumulative updates for now, 
          simple version updates absolute score)
        Max: 100, Min: 0
        """
        # Get Customer
        result = await db.execute(select(Customer).where(Customer.id == customer_id))
        customer = result.scalars().first()
        if not customer:
            return

        # Simple Recalculation (In prod, use event sourcing or running average)
        score = 50.0
        score += (customer.successful_orders * 10)
        score -= (customer.refused_orders * 20)
        
        # Clamp
        score = max(0.0, min(100.0, score))
        
        customer.trust_score = score
        db.add(customer)
        await db.commit()

    async def update_store_score(self, db: AsyncSession, store_id: int):
        """
        Calculates Store Trust Score based on Authenticity Feedbacks.
        """
        result = await db.execute(select(Feedback).where(Feedback.store_id == store_id))
        feedbacks = result.scalars().all()
        
        if not feedbacks:
            return 100.0 # Default High Trust
            
        total_score = sum([f.authenticity_rating for f in feedbacks])
        # Normalize 1-5 rating to 0-100
        # 5 -> 100, 1 -> 0. (Rating - 1) * 25
        normalized_score = (total_score / len(feedbacks) - 1) * 25
        
        # Clamp
        final_score = max(0.0, min(100.0, normalized_score))
        
        stmt = update(Store).where(Store.id == store_id).values(trust_score=final_score)
        await db.execute(stmt)
        await db.commit()

trust_service = TrustService()
