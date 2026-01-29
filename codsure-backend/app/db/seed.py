import asyncio
import random
from datetime import datetime, timedelta
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.models.store import Store
from app.models.order import Order
from app.core import security
from sqlalchemy import select

# Constants
CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"]
STATUSES = ["pending", "delivered", "returned", "cancelled"]
PAYMENT_METHODS = ["COD", "COD", "COD", "PREPAID"] # Weighted towards COD
RISK_DECISIONS = ["COD", "COD", "PARTIAL_ADVANCE", "BLOCK"]

async def seed_data():
    async with AsyncSessionLocal() as db:
        print("Seeding data...")
        
        # 1. Create Demo User if not exists
        result = await db.execute(select(User).where(User.email == "demo@codsure.io"))
        user = result.scalars().first()
        
        if not user:
            print("Creating demo user...")
            user = User(
                email="demo@codsure.io",
                hashed_password=security.get_password_hash("password123"),
                full_name="Demo Merchant",
                is_active=True,
                phone_number="+923001234567",
                country_code="+92"
            )
            db.add(user)
            await db.flush()
            
            # Create Store
            store = Store(
                name="Demo Electronics",
                platform="shopify",
                domain="demo-electronics.myshopify.com",
                owner_id=user.id,
                risk_tolerance=60,
                trust_score=85.5
            )
            db.add(store)
            await db.commit()
            await db.refresh(store)
            print(f"Created user {user.email} and store {store.name}")
        else:
            print("Demo user exists.")
            # Get store
            result = await db.execute(select(Store).where(Store.owner_id == user.id))
            store = result.scalars().first()

        # 2. Generate Orders (if few exist)
        result = await db.execute(select(Order).where(Order.store_id == store.id))
        existing_orders = result.scalars().all()
        
        if len(existing_orders) < 50:
            print(f"Generating orders for store {store.name}...")
            orders_to_create = []
            
            for i in range(100):
                # Random date in last 30 days
                days_ago = random.randint(0, 30)
                order_date = datetime.now() - timedelta(days=days_ago)
                
                risk_score = random.randint(10, 95)
                # Logic: Higher risk score = more likely to return/block
                decision = "COD"
                if risk_score > 80: decision = "BLOCK"
                elif risk_score > 60: decision = "PARTIAL_ADVANCE"
                
                status = random.choice(STATUSES)
                if decision == "BLOCK": status = "cancelled"
                
                order = Order(
                    external_order_id=f"ORD-{1000+i}",
                    order_number=f"#{1000+i}",
                    customer_phone=f"+923{random.randint(10,99)}{random.randint(1000000, 9999999)}",
                    customer_city=random.choice(CITIES),
                    total_price=float(random.randint(1500, 25000)),
                    status=status,
                    payment_method=random.choice(PAYMENT_METHODS),
                    risk_score=risk_score,
                    risk_decision=decision,
                    risk_reasons={"rules_matched": ["high_value", "city_risk"] if risk_score > 50 else []},
                    store_id=store.id,
                    analyzed_at=order_date
                )
                orders_to_create.append(order)
            
            db.add_all(orders_to_create)
            await db.commit()
            print(f"Created {len(orders_to_create)} new orders.")
        else:
            print("Already has sufficient order data.")

if __name__ == "__main__":
    asyncio.run(seed_data())
