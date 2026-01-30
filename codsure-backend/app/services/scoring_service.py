from sqlalchemy.ext.asyncio import AsyncSession
from app.models.trust import Customer
from sqlalchemy import select

class ScoringService:
    @staticmethod
    async def get_or_create_customer(db: AsyncSession, phone: str, name: str = None, email: str = None, shopify_id: str = None) -> Customer:
        result = await db.execute(select(Customer).where(Customer.phone == phone))
        customer = result.scalars().first()
        
        if not customer:
            customer = Customer(
                phone=phone,
                name=name,
                email=email,
                shopify_customer_id=shopify_id,
                cod_score=5.0
            )
            db.add(customer)
            await db.commit()
            await db.refresh(customer)
        
        return customer

    @staticmethod
    async def update_score(db: AsyncSession, customer_id: int, event_type: str):
        """
        Updates COD Score based on event:
        - DELIVERED: +0.5
        - REFUSED: -2.0
        - FAKE: -5.0
        - DISPUTE_WON: Restore score (logic to be added)
        """
        result = await db.execute(select(Customer).where(Customer.id == customer_id))
        customer = result.scalars().first()
        
        if not customer:
            return None

        # Base logic
        if event_type == "DELIVERED":
            customer.successful_orders += 1
            customer.cod_score = min(10.0, customer.cod_score + 0.5)
        
        elif event_type == "REFUSED":
            customer.refused_orders += 1
            customer.cod_score = max(0.0, customer.cod_score - 2.0)
            
        elif event_type == "FAKE":
            customer.fake_attempt_count += 1
            customer.cod_score = max(0.0, customer.cod_score - 5.0)
            
        elif event_type == "DISPUTE_RESOLVED_COURIER_FAULT":
            # Reverse the Refusal penalty (assuming it was -2.0)
            # This logic assumes the dispute is resolving a previous "REFUSED" event penalty
            customer.refused_orders = max(0, customer.refused_orders - 1)
            customer.cod_score = min(10.0, customer.cod_score + 2.0)
            
        # Update Tier
        if customer.cod_score >= 7.0:
            customer.trust_tier = "TRUSTED"
        elif customer.cod_score < 3.0:
            customer.trust_tier = "BLOCKED"
        elif customer.cod_score < 5.0:
            customer.trust_tier = "SUSPICIOUS"
        else:
            customer.trust_tier = "NEUTRAL"
            
        customer.total_orders = customer.successful_orders + customer.refused_orders + customer.fake_attempt_count
        
        await db.commit()
        await db.refresh(customer)
        return customer
