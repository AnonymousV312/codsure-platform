"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import api from "@/lib/api"
import { useAuth } from "@/components/providers/AuthContext"

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Risk Tolerance</CardTitle>
                    <CardDescription>Adjust how aggressive the risk engine should be.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Risk Threshold Level</span>
                            <span className="text-sm text-gray-500">Balanced (Default)</span>
                        </div>
                        <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Conservative</span>
                            <span>Balanced</span>
                            <span>Aggressive</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Store Details</CardTitle>
                    <CardDescription>Manage your store profile.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Store Name</label>
                                <Input defaultValue="My Awesome Store" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Platform</label>
                                <Input defaultValue="Shopify" disabled />
                            </div>
                        </div>
                        <Button>Save Changes</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Checkout Enforcement</CardTitle>
                    <CardDescription>Automatically restrict payment methods based on risk decisions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <span className="text-sm font-medium">Enable Active Enforcement</span>
                                <p className="text-xs text-muted-foreground">If risky, COD will be hidden or restricted at checkout.</p>
                            </div>
                            <Switch defaultChecked={false} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Required Advance Percentage</label>
                            <div className="flex gap-2">
                                <Input type="number" defaultValue="20" className="w-24" />
                                <span className="flex items-center text-sm text-muted-foreground">%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">The % of order value to collect via card/bank for risky orders.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-900/50">
                <CardHeader>
                    <CardTitle className="text-red-500">Developer Tools</CardTitle>
                    <CardDescription>Internal tools for testing.</CardDescription>
                </CardHeader>
                <CardContent>
                    <MakeMeAdminButton />
                </CardContent>
            </Card>
        </div>
    )
}

function MakeMeAdminButton() {
    const [loading, setLoading] = useState(false)
    const { logout } = useAuth()

    const handleMakeAdmin = async () => {
        if (!confirm("This will make you an admin and log you out. Continue?")) return
        setLoading(true)
        try {
            await api.post("/auth/dev/make-me-admin")
            alert("Success! You are now an admin. Please log in again.")
            logout()
        } catch (e) {
            console.error(e)
            alert("Failed to update role")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button variant="destructive" onClick={handleMakeAdmin} disabled={loading}>
            {loading ? "Processing..." : "Become Admin (Dev)"}
        </Button>
    )
}
