"use client"

import { useState } from "react"
import api from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import useSWR from "swr"

export default function AdminMerchantsPage() {
    // Mock data handling if API isn't ready, but assuming /admin/merchants works
    const { data: merchants, mutate } = useSWR("/admin/merchants", (url) => api.get(url).then(res => res.data))

    const toggleStatus = async (id: number) => {
        await api.post(`/admin/merchants/${id}/toggle`)
        mutate() // Refresh
    }

    if (!merchants) return <div className="p-8">Loading merchants...</div>

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Active Merchants</h2>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Platform Merchants ({merchants.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Store Name</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Domain</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Active</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {merchants.map((m: any) => (
                                    <TableRow key={m.id}>
                                        <TableCell className="font-medium">{m.store_name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{m.full_name}</span>
                                                <span className="text-xs text-muted-foreground">{m.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{m.store_domain}</TableCell>
                                        <TableCell>
                                            <Badge variant={m.is_active ? "outline" : "destructive"}>
                                                {m.is_active ? "Active" : "Suspended"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={m.is_active}
                                                onCheckedChange={() => toggleStatus(m.id)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
