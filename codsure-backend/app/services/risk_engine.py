from typing import Dict, Any

class RiskEngine:
    def __init__(self):
        # Mock Data for V1
        self.high_risk_cities = ["Karachi", "Lahore"] # Example, in reality specific areas
        self.city_risk_index = {"Karachi": 30, "Lahore": 20, "Islamabad": 5}
    
    def calculate_risk(self, order_data: Dict[str, Any], customer_history: Dict[str, Any], store_trust_score: float = 100.0) -> Dict[str, Any]:
        """
        Deterministic Rule-Based Risk Engine V2 (with Trust Scores).
        """
        score = 0
        reasons = []
        
        # 1. Customer Trust Score (The most potent signal)
        customer_trust = customer_history.get("trust_score", 50.0)
        
        # If High Trust, give massive discount on risk
        if customer_trust > 80:
            score -= 40
            reasons.append("High Trust Customer")
        elif customer_trust < 30:
            score += 50
            reasons.append("Low Trust Customer")

        # 2. Historical Refusal Rate (Legacy check, kept for new customers with no score yet)
        refusal_rate = customer_history.get("refusal_rate", 0)
        if refusal_rate > 50 and customer_history.get("total_orders", 0) > 2:
            score += 80
            reasons.append("High historical refusal rate")
            
        # 3. City Risk
        city = order_data.get("city", "Unknown")
        city_risk = self.city_risk_index.get(city, 10) 
        score += city_risk
        if city_risk > 20:
            reasons.append(f"High risk city: {city}")
            
        # 4. Store Trust Score (Fraud Seller Protection)
        # If the seller themselves have low trust (selling fakes), we block COD to protect buyers
        if store_trust_score < 40:
            score += 100
            reasons.append("Seller Trust Score Low (Potential Fraud)")
        
        # Clamp Score
        score = max(0, min(score, 100))
        
        # Decision Logic
        decision = "COD"
        if score >= 80:
            decision = "BLOCK"
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
