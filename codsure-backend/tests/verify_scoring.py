import asyncio
import sys
import os

# Add parent dir to path to allow importing app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.services.scoring_service import ScoringService
from app.models.trust import Customer
from sqlalchemy import text

async def verify_scoring():
    print("--- Starting Scoring Logic Verification ---")
    
    # 1. Reset DB for clean test (WARNING: This wipes data, strictly for dev verification)
    async destory_db():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    
    # We'll just assume tables exist or are created. For this specific test script, 
    # we might need to handle the schema update if it wasn't applied.
    # But let's proceed assuming the user will handle the migration/reset 
    # or that the app handles it on startup.
    # Actually, let's try to verify with a session.

    async with SessionLocal() as db:
        # Cleanup test user
        await db.execute(text("DELETE FROM customers WHERE phone = '+923001234567'"))
        await db.commit()

        # Step 1: New Customer
        print("\n1. creating new customer...")
        customer = await ScoringService.get_or_create_customer(db, "+923001234567", "Test User", "test@codsure.pk")
        print(f"   Initial Score: {customer.cod_score} [{customer.trust_tier}]")
        assert customer.cod_score == 5.0
        
        # Step 2: Successful Delivery
        print("\n2. Simulating DELIVERED event...")
        customer = await ScoringService.update_score(db, customer.id, "DELIVERED")
        print(f"   New Score: {customer.cod_score} [{customer.trust_tier}]")
        assert customer.cod_score == 5.5
        
        # Step 3: Another Delivery
        print("\n3. Simulating DELIVERED event...")
        customer = await ScoringService.update_score(db, customer.id, "DELIVERED")
        print(f"   New Score: {customer.cod_score} [{customer.trust_tier}]")
        assert customer.cod_score == 6.0
        
        # Step 4: Refusal (Hit)
        print("\n4. Simulating REFUSED event...")
        customer = await ScoringService.update_score(db, customer.id, "REFUSED")
        print(f"   New Score: {customer.cod_score} [{customer.trust_tier}]")
        assert customer.cod_score == 4.0
        
        # Step 5: Courier Fault (Restoration)
        print("\n5. Simulating DISPUTE_RESOLVED_COURIER_FAULT...")
        customer = await ScoringService.update_score(db, customer.id, "DISPUTE_RESOLVED_COURIER_FAULT")
        print(f"   New Score: {customer.cod_score} [{customer.trust_tier}]")
        assert customer.cod_score == 6.0 # Should be back to 6.0
        
        # Step 6: Fake Order (Big Hit)
        print("\n6. Simulating FAKE event...")
        customer = await ScoringService.update_score(db, customer.id, "FAKE")
        print(f"   New Score: {customer.cod_score} [{customer.trust_tier}]")
        assert customer.cod_score == 1.0
        assert customer.trust_tier == "BLOCKED"
        
        print("\n✅ VERIFICATION SUCCESSFUL: Scoring Logic is solid.")

if __name__ == "__main__":
    asyncio.run(verify_scoring())
