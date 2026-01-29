"use client"

import useSWR from 'swr';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function RulesPage() {
    const { data: rules, error, isLoading } = useSWR('/rules/rules', fetcher);

    if (isLoading) return <div>Loading rules...</div>

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Risk Rules</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Decision Rules</CardTitle>
                    <CardDescription>Manage the logic for automated COD decisions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Priority</TableHead>
                                <TableHead>Rule Name</TableHead>
                                <TableHead>Condition</TableHead>
                                <TableHead>Decision</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rules?.map((rule: any) => (
                                <TableRow key={rule.id}>
                                    <TableCell>{rule.priority}</TableCell>
                                    <TableCell className="font-medium">{rule.name}</TableCell>
                                    <TableCell>
                                        <code className="text-xs bg-gray-100 p-1 rounded">
                                            {rule.condition.field} {rule.condition.op} {rule.condition.value}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{rule.decision}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Switch checked={rule.is_active} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
