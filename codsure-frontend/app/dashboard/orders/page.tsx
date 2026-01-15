import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function OrdersPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
                <Button>Export CSV</Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>A list of all orders analyzed by CODSure.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-full md:w-1/3">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <Input
                                className="pl-8"
                                placeholder="Filter by Order ID or Score..."
                                type="search"
                            />
                        </div>
                    </div>
                    <div className="rounded-md border">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Order ID</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Customer</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">City</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Amount</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Risk Score</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Decision</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <tr key={i} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">#ORD-{2000 + i}</td>
                                        <td className="p-4 align-middle">0300-123456{i}</td>
                                        <td className="p-4 align-middle">{i % 2 === 0 ? "Lahore" : "Karachi"}</td>
                                        <td className="p-4 align-middle">PKR {1000 * i + 500}</td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">{i * 10}</span>
                                                <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className={`h-full ${i * 10 > 70 ? 'bg-red-500' : i * 10 > 30 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${i * 10}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${i * 10 > 70 ? 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80' : 'border-transparent bg-green-500 text-white hover:bg-green-600'}`}>
                                                {i * 10 > 70 ? "BLOCK" : i * 10 > 30 ? "PARTIAL" : "COD OK"}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
