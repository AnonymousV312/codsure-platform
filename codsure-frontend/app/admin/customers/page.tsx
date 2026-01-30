"use client"

import { useState } from "react"
import api from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, ShieldAlert, ShieldCheck, User as UserIcon } from "lucide-react"

export default function AdminCustomersPage() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query) return
        
        setLoading(true)
        try {
            const res = await api.get(`/admin/customers/search?q=${query}`)
            setResults(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Global Customer Database</h2>
                </div>
                
                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>Search & Profile</CardTitle>
                        <CardDescription>Look up any customer by phone number or name.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input 
                                placeholder="+923..." 
                                value={query} 
                                onChange={(e) => setQuery(e.target.value)} 
                            />
                            <Button type="submit" disabled={loading}>
                                <Search className="w-4 h-4 mr-2" />
                                {loading ? "Searching..." : "Search"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {results.map((c) => (
                        <Card key={c.id} className={c.trust_tier === 'BLOCKED' ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : ''}>
                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Customer #{c.id}</CardTitle>
                                {c.trust_tier === 'TRUSTED' && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                                {c.trust_tier === 'BLOCKED' && <ShieldAlert className="h-4 w-4 text-red-500" />}
                            </CardHeader>
                            <CardContent className="mt-4">
                                <div className="text-2xl font-bold flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                                        <UserIcon className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div>
                                        <div className="text-lg">{c.name || 'Unknown'}</div>
                                        <div className="text-xs text-muted-foreground font-normal">{c.phone}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">COD Score</p>
                                        <div className="text-2xl font-bold text-indigo-600">{c.cod_score.toFixed(1)}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Trust Tier</p>
                                        <Badge variant={c.trust_tier === 'BLOCKED' ? "destructive" : "outline"}>
                                            {c.trust_tier}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Success Rate</p>
                                        <div className="font-bold">
                                            {c.total_orders > 0 ? Math.round((c.successful_orders / c.total_orders) * 100) : 0}%
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Fake Attempts</p>
                                        <div className="font-bold text-red-600">{c.fake_attempt_count}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {results.length === 0 && query && !loading && (
                        <div className="text-muted-foreground p-4">No results found.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
