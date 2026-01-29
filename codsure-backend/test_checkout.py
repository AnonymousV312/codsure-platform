import asyncio
import httpx

async def test_checkout_decision():
    url = "http://localhost:8000/api/v1/checkout/decision"
    
    # 1. Low Value (Safe)
    payload_safe = {
        "shop_domain": "demo-electronics.myshopify.com",
        "cart_total": 800,
        "shipping_city": "Karachi"
    }
    
    # 2. High Value (Risky - based on default rules)
    payload_risky = {
        "shop_domain": "demo-electronics.myshopify.com",
        "cart_total": 6000, 
        "shipping_city": "Karachi"
    }

    async with httpx.AsyncClient() as client:
        print("Testing Safe Cart (<1000)...")
        r = await client.post(url, json=payload_safe)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")
        
        print("\nTesting Risky Cart (>5000)...")
        r = await client.post(url, json=payload_risky)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")

if __name__ == "__main__":
    asyncio.run(test_checkout_decision())
