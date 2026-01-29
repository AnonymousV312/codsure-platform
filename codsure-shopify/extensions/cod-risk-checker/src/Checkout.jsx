import {
    reactExtension,
    Banner,
    BlockStack,
    useCartLines,
    useTotalAmount,
    useExtensionCapability,
    useBuyerJourneyIntercept,
    useShop,
    Text,
    List,
    ListItem,
} from '@shopify/ui-extensions-react/checkout';
import React, { useEffect, useState } from 'react';

// export default reactExtension('purchase.checkout.block.render', () => <App />);
// Using the named export style often preferred in newer CLI templates
export default reactExtension('purchase.checkout.block.render', () => <App />);

function App() {
    const { myshopifyDomain } = useShop();
    const total = useTotalAmount();
    const [decision, setDecision] = useState(null);
    const [loading, setLoading] = useState(false);

    // Use intercept to block checkout if needed
    const intercept = useBuyerJourneyIntercept(({ canBlockProgress }) => {
        if (canBlockProgress && decision && !decision.allow_cod) {
            // Logic: If user selects COD (we can't easily detect payment method selection in 'block.render' 
            // without 'purchase.checkout.payment-method-list.render' or similar traits, 
            // but for V1 we block indiscriminately if risk is high OR we warn.)

            // Better V1 approach: Just warn heavily. Blocking indiscriminately prevents PREPAID too,
            // unless we can detect payment method.
            // 'purchase.checkout.payment-method-list.render' is strictly for payment UI modification 
            // but 'block.render' is generic.

            // For now, let's just use the Banner to inform.
            // Use block_progress only if we are absolutely sure.
            return {
                behavior: "allow", // Change to "block" if we want to stop bad actors entirely
                reason: "High Risk Order",
                perform: (result) => {
                    if (result.behavior === "block") {
                        return { behavior: "block", reason: "Order blocked due to high risk" };
                    }
                    return result;
                }
            };
        }
        return { behavior: "allow" };
    });

    useEffect(() => {
        async function checkRisk() {
            setLoading(true);
            try {
                // Call CODSure Backend
                const response = await fetch('https://codsure-backend.onrender.com/api/v1/checkout/decision', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        shop_domain: myshopifyDomain,
                        cart_total: total.amount,
                        currency: total.currencyCode
                    })
                });

                const data = await response.json();
                setDecision(data);
            } catch (error) {
                console.error("Risk check failed", error);
            } finally {
                setLoading(false);
            }
        }

        if (total && myshopifyDomain) {
            checkRisk();
        }
    }, [total, myshopifyDomain]);

    if (loading) {
        return null;
    }

    if (decision && !decision.allow_cod) {
        return (
            <Banner title="Advance Payment Required" status="warning">
                <BlockStack spacing="base">
                    <Text>
                        CODSure Analysis Recommendation:
                    </Text>
                    <Text>
                        {decision.message || "Due to delivery history, Cash on Delivery is unavailable for this order."}
                    </Text>
                    {decision.advance_amount > 0 && (
                        <Text>
                            Please pay {decision.advance_amount} {total.currencyCode} as advance to proceed.
                        </Text>
                    )}
                </BlockStack>
            </Banner>
        );
    }

    return null;
}
