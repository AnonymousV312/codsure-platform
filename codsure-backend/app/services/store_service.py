from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.store import Store

class StoreService:
    @staticmethod
    async def update_trust_score(db: AsyncSession, store_id: int, event_type: str):
        """
        Updates Store Trust Score based on event:
        - ORDER_DELIVERED: +0.1 (Small implicit trust boost)
        - DISPUTE_LOST: -5.0 (Merchant made false claim against courier)
        - HIGH_RTO_RATE: -1.0 (Periodic check, not implemented yet)
        """
        result = await db.execute(select(Store).where(Store.id == store_id))
        store = result.scalars().first()
        
        if not store:
            return None

        if event_type == "ORDER_DELIVERED":
            # Slow build of trust
            store.trust_score = min(100.0, store.trust_score + 0.1)
            
        elif event_type == "DISPUTE_LOST":
            # Significant penalty for crying wolf
            store.trust_score = max(0.0, store.trust_score - 5.0)
            
        await db.commit()
        await db.refresh(store)
        return store
