"use client"

import { useState } from "react"
import useSWR from "swr"
import api from "@/lib/api"
import { SiteHeader } from "@/components/site/SiteHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react"

// Mock fetcher for now until we have a dedicated hook


export default function AdminDisputesPage() {
    // In real implementation, fetching from /api/v1/admin/disputes or similar
    // For now mocking the list or using a mock hook
    // const { data: disputes, error } = useSWRRaw("/admin/disputes", (url) => api.get(url).then(res => res.data))

    const [disputes, setDisputes] = useState([
        { id: 1, order_id: "ORD-1234", merchant: "Outfitters", reason: "Courier Fake Attempt", status: "pending", description: "Courier marked 'Customer Refused' but customer has CCTV proof no one came." },
        { id: 2, order_id: "ORD-5678", merchant: "Khaadi", reason: "Lost in Transit", status: "approved", description: "Tracking stuck for 14 days." },
    ])

    const handleResolve = async (id: number, status: "approved" | "rejected") => {
        try {
            await api.post(`/disputes/${id}/resolve`, { status })

            // Optimistic update
            setDisputes(prev => prev.map(d => d.id === id ? { ...d, status } : d))
            alert(`Dispute ${status}`)
        } catch (e) {
            console.error(e)
            alert("Failed to resolve dispute")
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dispute Resolution Center</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {disputes.map((dispute) => (
                        <Card key={dispute.id} className="border-l-4 border-l-amber-500">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-base font-bold">{dispute.merchant}</CardTitle>
                                        <CardDescription>Order #{dispute.order_id}</CardDescription>
                                    </div>
                                    <Badge variant={dispute.status === 'pending' ? 'outline' : (dispute.status === 'approved' ? 'default' : 'destructive')}>
                                        {dispute.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-medium mb-2">{dispute.reason}</div>
                                <p className="text-sm text-muted-foreground mb-4 bg-muted p-2 rounded-md">
                                    "{dispute.description}"
                                </p>

                                {dispute.status === 'pending' && (
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="sm" onClick={() => handleResolve(dispute.id, "rejected")}>
                                            <XCircle className="w-4 h-4 mr-1 text-red-500" /> Reject
                                        </Button>
                                        <Button size="sm" onClick={() => handleResolve(dispute.id, "approved")}>
                                            <CheckCircle2 className="w-4 h-4 mr-1" /> Approve (Fix Score)
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
