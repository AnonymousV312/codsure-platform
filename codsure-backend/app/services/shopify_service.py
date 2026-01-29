import re
from typing import Any

class ShopifyService:
    @staticmethod
    def normalize_phone(phone: str) -> str | None:
        """
        Normalize phone number to Pakistani format +923...
        """
        if not phone:
            return None
            
        # Remove non-digits
        digits = re.sub(r'\D', '', phone)
        
        # Handle 03... format (local)
        if digits.startswith('03') and len(digits) == 11:
            return '+92' + digits[1:]
            
        # Handle 923... format
        if digits.startswith('923') and len(digits) == 12:
            return '+' + digits
            
        # Handle 3... format (missing leading zero)
        if digits.startswith('3') and len(digits) == 10:
            return '+92' + digits
            
        return phone # Return raw/best effort if not matched

    @staticmethod
    def is_cod_order(order_data: dict) -> bool:
        """
        Determine if an order is Cash on Delivery.
        """
        gateway = order_data.get('gateway', '').lower()
        payment_gateway_names = [name.lower() for name in order_data.get('payment_gateway_names', [])]
        
        cod_keywords = ['manual', 'cod', 'cash on delivery', 'cash_on_delivery']
        
        if any(k in gateway for k in cod_keywords):
            return True
            
        if any(any(k in name for k in cod_keywords) for name in payment_gateway_names):
            return True
            
        # Check transactions if needed (advanced)
        return False
        
    @staticmethod
    def extract_customer_info(order_data: dict) -> dict:
        """
        Extract relevant customer info safely.
        """
        customer = order_data.get('customer', {}) or {}
        billing = order_data.get('billing_address', {}) or {}
        shipping = order_data.get('shipping_address', {}) or {}
        
        # Prefer shipping phone, then billing, then customer
        raw_phone = shipping.get('phone') or billing.get('phone') or customer.get('phone')
        
        return {
            "id": str(customer.get('id', '')),
            "email": customer.get('email') or order_data.get('email'),
            "phone": ShopifyService.normalize_phone(raw_phone),
            "city": shipping.get('city') or billing.get('city')
        }

    @staticmethod
    async def sync_orders(db: Any, store_id: int): # Type hint Any for simplicity with circular imports
        """
        Sync last 60 days of orders for a store.
        """
        from app.models.store import Store
        from app.models.order import Order
        from app.core import crypto
        from datetime import datetime, timedelta
        import httpx
        from sqlalchemy import select
        
        # 1. Get Store & Token
        result = await db.execute(select(Store).where(Store.id == store_id))
        store = result.scalars().first()
        
        if not store or not store.access_token:
            return False, "Store not connected"
            
        access_token = crypto.decrypt_token(store.access_token)
        shop_domain = store.domain
        
        # 2. Fetch Orders (last 60 days)
        sixty_days_ago = (datetime.utcnow() - timedelta(days=60)).isoformat()
        
        url = f"https://{shop_domain}/admin/api/2023-10/orders.json?status=any&created_at_min={sixty_days_ago}&limit=250"
        headers = {
            "X-Shopify-Access-Token": access_token
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            
        if response.status_code != 200:
            return False, f"Shopify Error: {response.text}"
            
        orders_data = response.json().get("orders", [])
        
        count = 0
        for payload in orders_data:
            shopify_order_id = str(payload.get("id"))
            
            # Check exist
            result = await db.execute(select(Order).where(Order.external_order_id == shopify_order_id))
            existing = result.scalars().first()
            
            if existing:
                continue
                
            customer_info = ShopifyService.extract_customer_info(payload)
            is_cod = ShopifyService.is_cod_order(payload)
            
            new_order = Order(
                external_order_id=shopify_order_id,
                order_number=str(payload.get("order_number")),
                customer_id=customer_info["id"],
                customer_email=customer_info["email"],
                customer_phone=customer_info["phone"],
                customer_city=customer_info["city"],
                total_price=float(payload.get("total_price", 0)),
                currency=payload.get("currency", "PKR"),
                status="pending",
                fulfillment_status=payload.get("fulfillment_status"),
                payment_method="COD" if is_cod else "PREPAID",
                is_cod=is_cod,
                risk_score=0,
                risk_decision="PENDING", 
                risk_reasons={},
                store_id=store.id,
                raw_data=payload,
                analyzed_at=datetime.fromisoformat(payload.get("created_at").replace("Z", "+00:00")) # Use creation date
            )
            db.add(new_order)
            count += 1
            
        await db.commit()
        return True, f"Synced {count} orders"

