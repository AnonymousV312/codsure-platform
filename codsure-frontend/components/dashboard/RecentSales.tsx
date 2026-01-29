"use client"

import { useRecentOrders } from "@/lib/hooks/useDashboard"
import { Badge } from "@/components/ui/badge"

export function RecentSales() {
    const { orders, isLoading } = useRecentOrders()

    if (isLoading) return <div className="p-4 text-center text-muted-foreground">Loading orders...</div>
    if (!orders || orders.length === 0) return <div className="p-4 text-center text-muted-foreground">No recent orders.</div>

    return (
        <div className="space-y-4">
            {orders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${order.risk_decision === 'BLOCK' ? 'bg-red-500' : (order.risk_decision === 'PARTIAL_ADVANCE' ? 'bg-yellow-500' : 'bg-green-500')}`} />
                        <div>
                            <p className="text-sm font-medium leading-none">Order {order.external_order_id}</p>
                            <p className="text-sm text-muted-foreground">{order.customer_city} • {order.customer_phone}</p>
                        </div>
                    </div>
                    <div className="flex items-col space-y-1 text-right">
                        <div className="text-sm font-bold">₨ {order.total_price.toLocaleString()}</div>
                        <Badge variant={order.risk_decision === 'BLOCK' ? 'destructive' : 'outline'} className="ml-auto text-xs">
                            {order.risk_decision}
                        </Badge>
                    </div>
                </div>
            ))}
        </div>
    )
}
