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
                <div key={order.order_number} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${order.status === 'BLOCK' ? 'bg-red-500' : (order.status === 'PARTIAL_ADVANCE' ? 'bg-yellow-500' : 'bg-green-500')}`} />
                        <div>
                            <p className="text-sm font-medium leading-none">Order {order.order_number}</p>
                            <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                        </div>
                    </div>
                    <div className="flex items-col space-y-1 text-right">
                        <div className="text-sm font-bold">₨ {order.amount.toLocaleString()}</div>
                        <Badge variant={
                            order.status === 'BLOCK' ? 'destructive' :
                                (order.status === 'PARTIAL_ADVANCE' ? 'secondary' :
                                    (order.status === 'FULL_ADVANCE' ? 'destructive' : 'outline'))
                        } className="ml-auto text-xs">
                            {order.status.replace("_", " ")}
                        </Badge>
                    </div>
                </div>
            ))}
        </div>
    )
}
