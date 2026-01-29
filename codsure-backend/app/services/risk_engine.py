from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.order import Order
from app.models.risk import RiskRule, RiskDecision

class RiskEngine:
    @staticmethod
    async def evaluate_order(db: AsyncSession, order: Order) -> str:
        """
        Evaluate an order against active risk rules.
        """
        # 1. Fetch active rules ordered by priority (Ascending: 1 is top)
        result = await db.execute(select(RiskRule).where(RiskRule.is_active == True).order_by(RiskRule.priority.asc()))
        rules = result.scalars().all()
        
        triggered_rules = []
        final_decision = "COD_ALLOWED" # Default safe
        
        # 2. Iterate Rules
        for rule in rules:
            if RiskEngine._check_condition(rule.condition, order):
                triggered_rules.append(rule.name)
                final_decision = rule.decision
                break # First match wins strategy? Or accumulate? 
                      # Requirement says "First matching rule applies"
        
        # 3. Create Decision Record
        decision_record = RiskDecision(
            order_id=order.id,
            decision=final_decision,
            reasons=triggered_rules
        )
        db.add(decision_record)
        
        # 4. Update Order
        order.risk_decision = final_decision
        order.risk_reasons = {"rules": triggered_rules}
        # order.risk_score could be calculated too, but keeping simple
        
        await db.commit()
        return final_decision

    @staticmethod
    async def evaluate_cart(db: AsyncSession, cart_data: dict) -> dict:
        """
        Evaluate a cart (pre-order) against rules. 
        Returns simplified decision object for Checkout API.
        """
        # 1. Fetch active rules
        result = await db.execute(select(RiskRule).where(RiskRule.is_active == True).order_by(RiskRule.priority.asc()))
        rules = result.scalars().all()
        
        triggered_rules = []
        final_decision = "COD_ALLOWED"
        
        # 2. Iterate Rules
        for rule in rules:
            if RiskEngine._check_condition(rule.condition, cart_data):
                triggered_rules.append(rule.name)
                final_decision = rule.decision
                break 
        
        return {
            "decision": final_decision,
            "reasons": triggered_rules
        }

    @staticmethod
    def _check_condition(condition: dict, data: any) -> bool:
        """
        Check if data matches condition. Data can be Order object or Cart dict.
        """
        field = condition.get("field")
        op = condition.get("op")
        value = condition.get("value")
        
        data_value = None
        
        # Support both object attribute and dict access
        def get_val(obj, key):
            if isinstance(obj, dict):
                return obj.get(key)
            return getattr(obj, key, None)

        if field == "total_price":
            data_value = get_val(data, "total_price")
        elif field == "city":
            data_value = get_val(data, "customer_city") or get_val(data, "city")
        
        # Operator check
        try:
            if op == "gt":
                return float(data_value or 0) > float(value)
            elif op == "lt":
                return float(data_value or 0) < float(value)
            elif op == "eq":
                return str(data_value).lower() == str(value).lower()
        except:
            return False
            
        return False
