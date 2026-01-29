"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useDashboardChart } from "@/lib/hooks/useDashboard"

export function Overview() {
    const { chartData, isLoading } = useDashboardChart()

    if (isLoading) return <div className="h-[350px] flex items-center justify-center text-muted-foreground">Loading chart...</div>
    if (!chartData || chartData.length === 0) return <div className="h-[350px] flex items-center justify-center text-muted-foreground">No data available (Run seed?)</div>

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
                <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: string) => value.slice(5)} // Show MM-DD
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) => `₨${value}`}
                />
                <Tooltip
                    formatter={(value: number) => [`₨${value}`, "Revenue"]}
                    labelFormatter={(label: string) => `Date: ${label}`}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="revenue" fill="var(--primary, #0f172a)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}
