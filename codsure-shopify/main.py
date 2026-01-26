from fastapi import FastAPI, Request, BackgroundTasks
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="CODSure Shopify Connector")

CODSURE_API_URL = os.getenv("CODSURE_API_URL", "http://localhost:8000/api/v1")
SHOPIFY_API_SECRET = os.getenv("SHOPIFY_API_SECRET", "secret")
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "INTERNAL_SERVICE_SECRET_KEY_CHANGE_ME")

@app.post("/webhooks/orders/create")
async def handle_order_create(request: Request, background_tasks: BackgroundTasks):
    """
    Shopify webhook for Order Creation.
    1. Validate Request.
    2. Extract Order Data.
    3. Send to CODSure Backend for Analysis.
    4. Receive Decision.
    5. Tag Order in Shopify.
    """
    # Verify HMAC (omitted for brevity in V1)
    data = await request.json()
    
    background_tasks.add_task(process_order, data)
    return {"status": "received"}

async def process_order(order_data: dict):
    # Extract relevant fields
    order_id = str(order_data.get("id"))
    total_price = float(order_data.get("total_price", 0))
    customer = order_data.get("customer", {})
    phone = customer.get("phone", "")
    address = order_data.get("shipping_address", {})
    city = address.get("city", "")
    
    # Payload for CODSure Risk API
    payload = {
        "store_id": 1, # Placeholder, needs dynamic store lookup
        "order_id": order_id,
        "customer_phone": phone,
        "city": city,
        "total_price": total_price,
        "items": []
    }
    
    async with httpx.AsyncClient() as client:
        # Call Risk API
        try:
            headers = {"x-internal-key": INTERNAL_API_KEY}
            response = await client.post(f"{CODSURE_API_URL}/risk/analyze", json=payload, headers=headers)
            if response.status_code == 200:
                decision = response.json()
                await tag_shopify_order(order_id, decision["decision"])
            else:
                print(f"Risk API Error: {response.status_code} {response.text}")
        except Exception as e:
            print(f"Error processing order: {e}")

async def tag_shopify_order(order_id: str, decision: str):
    print(f"Tagging Shopify Order {order_id} with {decision}")
    # Implementation of Shopify Admin API call to add tags
    pass

@app.get("/health")
def health():
    return {"status": "ok"}
