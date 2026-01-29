"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"

export default function ConnectStorePage() {
    const [shopDomain, setShopDomain] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            // Get the install URL from backend
            const response = await api.get(`/shopify/install?shop=${shopDomain}`)
            const { url } = response.data

            // Redirect to Shopify
            window.location.href = url
        } catch (error) {
            console.error(error)
            alert("Failed to initiate connection. Please check the domain.")
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
                        <ShoppingBag className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle>Connect your Shopify Store</CardTitle>
                    <CardDescription>
                        Enter your store domain to install the CODSure app and enable risk analysis.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleConnect} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Store Domain</label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    placeholder="your-store"
                                    value={shopDomain}
                                    onChange={(e) => setShopDomain(e.target.value)}
                                    required
                                />
                                <span className="text-sm text-muted-foreground whitespace-nowrap">.myshopify.com</span>
                            </div>
                        </div>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Redirecting to Shopify..." : "Connect Store"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
