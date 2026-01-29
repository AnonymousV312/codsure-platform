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
                <div key={order.order_number} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-2">
                    <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${order.status === 'BLOCK' ? 'bg-red-500' : (order.status === 'PARTIAL_ADVANCE' ? 'bg-yellow-500' : 'bg-green-500')}`} />
                        <div>
                            <p className="text-sm font-medium leading-none">Order {order.order_number}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{order.customer_name}</p>
                        </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto pl-7 sm:pl-0 gap-2">
                        <div className="text-sm font-bold">₨ {order.amount.toLocaleString()}</div>
                        <Badge variant={
                            order.status === 'BLOCK' ? 'destructive' :
                                (order.status === 'PARTIAL_ADVANCE' ? 'secondary' :
                                    (order.status === 'FULL_ADVANCE' ? 'destructive' : 'outline'))
                        } className="text-[10px] px-1.5 h-5">
                            {order.status.replace("_", " ")}
                        </Badge>
                    </div>
                </div>
            ))}
        </div>
    )
}
