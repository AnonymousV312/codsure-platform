"use client"

import { useState } from "react"
import { useMerchantOrders, useShopifySync } from "@/lib/hooks/useMerchant"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RefreshCw, Download } from "lucide-react"

export default function OrdersPage() {
    const [page, setPage] = useState(1)
    const { data, isLoading, mutate } = useMerchantOrders(page)
    const { triggerSync } = useShopifySync()
    const [syncing, setSyncing] = useState(false)

    const handleSync = async () => {
        setSyncing(true)
        try {
            await triggerSync()
            mutate() // Refresh list
            alert("Sync started/completed successfully")
        } catch (e) {
            alert("Sync failed. Ensure store is connected.")
        } finally {
            setSyncing(false)
        }
    }

    if (isLoading) return <div>Loading Orders...</div>

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? "Syncing..." : "Sync from Shopify"}
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                    <CardDescription>View and manage your store orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Risk</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.orders?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24">
                                        No orders found. Try syncing from Shopify.
                                    </TableCell>
                                </TableRow>
                            )}
                            {data?.orders?.map((order: any) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.order_number}</TableCell>
                                    <TableCell>{new Date(order.analyzed_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{order.customer_name || "Guest"}</span>
                                            <span className="text-xs text-gray-500">{order.customer_email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            order.status === 'BLOCK' ? 'destructive' :
                                                (order.status === 'PARTIAL_ADVANCE' ? 'secondary' :
                                                    (order.status === 'FULL_ADVANCE' ? 'destructive' : 'outline'))
                                        }>
                                            {order.status.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold">{order.payment_method}</span>
                                            {order.is_cod && <span className="text-[10px] text-blue-600">COD</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className={`font-bold ${order.risk_score > 70 ? "text-red-500" :
                                            order.risk_score > 30 ? "text-yellow-500" : "text-green-500"
                                            }`}>
                                            {order.risk_score}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {order.currency} {order.total_price}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                        <div>Page {data?.page} of {data?.pages || 1}</div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= (data?.pages || 1)}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
