"use client"

import { useMerchants } from "@/lib/hooks/useAdmin"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminMerchantsPage() {
    const { merchants, isLoading, toggleStatus } = useMerchants()

    if (isLoading) return <div>Loading Merchants...</div>

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold">Merchant Management</h1>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Store Name</TableHead>
                            <TableHead>Platform</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {merchants?.map((m: any) => (
                            <TableRow key={m.id}>
                                <TableCell>{m.email}</TableCell>
                                <TableCell>{m.store_name}</TableCell>
                                <TableCell>{m.store_domain}</TableCell>
                                <TableCell>{new Date(m.joined_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant={m.is_active ? "default" : "destructive"}>
                                        {m.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleStatus(m.id)}
                                    >
                                        {m.is_active ? "Deactivate" : "Activate"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
