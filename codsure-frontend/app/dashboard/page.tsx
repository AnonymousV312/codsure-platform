"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Ban, ShieldCheck, RefreshCcw } from "lucide-react"
import { useDashboardStats } from "@/lib/hooks/useDashboard"
import { Overview } from "@/components/dashboard/Overview"
import { RecentSales } from "@/components/dashboard/RecentSales"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { CalendarDateRangePicker } from "@/components/dashboard/DateRangePicker"
import DashboardLoading from "@/app/dashboard/loading"
import { useState } from "react"

export default function DashboardPage() {
    const { stats, isLoading: statsLoading } = useDashboardStats()
    const [seeding, setSeeding] = useState(false)

    const handleSeed = async () => {
        setSeeding(true)
        try {
            await api.post("/dashboard/seed")
            window.location.reload()
        } catch (e) {
            console.error(e)
            alert("Failed to seed - check console")
        } finally {
            setSeeding(false)
        }
    }

    if (statsLoading) {
        return <DashboardLoading />
    }

    // Default to zero if stats failed to load or are empty
    const s = stats || { total_revenue: 0, total_orders: 0, return_rate: 0, risk_blocked_count: 0 }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Overview</h1>
                <div className="flex items-center gap-2">
                    <div className="hidden md:block">
                        <CalendarDateRangePicker />
                    </div>
                    <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding}>
                        <RefreshCcw className={`mr-2 h-4 w-4 ${seeding ? 'animate-spin' : ''}`} />
                        {seeding ? 'Seeding...' : 'Reset Data'}
                    </Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₨ {s.total_revenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">From {s.total_orders} orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Orders Analyzed</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{s.total_orders}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Blocked (Risk)</CardTitle>
                        <Ban className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{s.risk_blocked_count}</div>
                        <p className="text-xs text-muted-foreground">High risk orders blocked</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Store Trust Score</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">98.5</div>
                        <p className="text-xs text-muted-foreground">
                            High Trust (Top 5%)
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>Daily revenue for the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Risk Decisions</CardTitle>
                        <CardDescription>Latest orders processed by CODSure</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentSales />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
