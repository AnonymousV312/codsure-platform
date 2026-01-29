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
                break 

        # 3. AI Augmentation (Consult ML Service)
        from app.services.ml_service import MLService
        # Calculate a basic risk score from rules (e.g. if BLOCK, score is high)
        rule_score = 100 if final_decision == "BLOCK" else 0 
        
        # Predict probability of success (0.0 - 1.0)
        ai_prob = MLService.predict_risk({
            "total_price": order.total_price,
            "customer_city": order.customer_city
        }, current_risk_score=rule_score)
        
        ai_score_percent = int(ai_prob * 100)
        triggered_rules.append(f"AI_Confidence: {ai_score_percent}%")
        
        # Safety: If AI is very confident it will fail (< 30%), flag it
        if ai_prob < 0.3 and final_decision == "COD_ALLOWED":
            final_decision = "PARTIAL_ADVANCE"
            triggered_rules.append("AI_Override_High_Risk")

        # 4. Create Decision Record
        decision_record = RiskDecision(
            order_id=order.id,
            decision=final_decision,
            reasons=triggered_rules
        )
        db.add(decision_record)
        
        # 5. Update Order
        order.risk_decision = final_decision
        order.risk_reasons = {"rules": triggered_rules, "ai_score": ai_score_percent}
        
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
        
        # 3. AI Augmentation
        from app.services.ml_service import MLService
        rule_score = 100 if final_decision == "BLOCK" else 0
        ai_prob = MLService.predict_risk(cart_data, current_risk_score=rule_score)
        ai_score_percent = int(ai_prob * 100)
        
        triggered_rules.append(f"AI_Confidence: {ai_score_percent}%")
        
        if ai_prob < 0.3 and final_decision == "COD_ALLOWED":
             final_decision = "PARTIAL_ADVANCE"
             triggered_rules.append("AI_Override_High_Risk")

        return {
            "decision": final_decision,
            "reasons": triggered_rules,
            "ai_score": ai_score_percent
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
