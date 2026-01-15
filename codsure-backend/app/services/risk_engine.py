from typing import Dict, Any

class RiskEngine:
    def __init__(self):
        # Mock Data for V1
        self.high_risk_cities = ["Karachi", "Lahore"] # Example, in reality specific areas
        self.city_risk_index = {"Karachi": 30, "Lahore": 20, "Islamabad": 5}
    
    def calculate_risk(self, order_data: Dict[str, Any], customer_history: Dict[str, Any]) -> Dict[str, Any]:
        """
        Deterministic Rule-Based Risk Engine V1.
        
        Inputs:
        - order_data: {total_price, city, customer_phone, ...}
        - customer_history: {total_orders, returned_orders, refusal_rate, ...}
        """
        score = 0
        reasons = []
        
        # 1. Historical Refusal Rate
        refusal_rate = customer_history.get("refusal_rate", 0)
        if refusal_rate > 50 and customer_history.get("total_orders", 0) > 2:
            score += 80
            reasons.append("High historical refusal rate")
        elif refusal_rate > 20:
            score += 40
            reasons.append("Moderate refusal rate")
            
        # 2. City Risk
        city = order_data.get("city", "Unknown")
        city_risk = self.city_risk_index.get(city, 10) # Default risk
        score += city_risk
        if city_risk > 20:
            reasons.append(f"High risk city: {city}")
            
        # 3. Order Value
        total_price = order_data.get("total_price", 0)
        if total_price > 50000:
            score += 50
            reasons.append("High order value (>50k)")
        elif total_price > 20000:
            score += 20
        
        # Clamp Score
        score = min(score, 100)
        
        # Decision Logic
        decision = "COD"
        if score >= 80:
            decision = "BLOCK" # Or FULL_ADVANCE based on preferences
        elif score >= 50:
            decision = "FULL_ADVANCE"
        elif score >= 30:
            decision = "PARTIAL_ADVANCE"
        
        return {
            "risk_score": score,
            "decision": decision,
            "reasons": reasons
        }

risk_engine = RiskEngine()
