"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"
import { useAuth } from "@/components/providers/AuthContext"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { countries } from "@/lib/countries"

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const { login } = useAuth()
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")

    // New Fields
    const [countryCode, setCountryCode] = useState("+92")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [storeName, setStoreName] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            if (isLogin) {
                // Login Flow
                const params = new URLSearchParams()
                params.append('username', email)
                params.append('password', password)

                const response = await api.post("/auth/login/access-token", params, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })

                login(response.data.access_token)
            } else {
                if (!storeName) {
                    setError("Store name is required")
                    setLoading(false)
                    return
                }

                // Signup Flow
                await api.post("/auth/signup", {
                    email,
                    password,
                    full_name: fullName,
                    phone_number: phoneNumber,
                    country_code: countryCode,
                    store_name: storeName,
                    platform: "shopify"
                })

                // Auto-login after signup
                const params = new URLSearchParams()
                params.append('username', email)
                params.append('password', password)

                const response = await api.post("/auth/login/access-token", params, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                login(response.data.access_token)
            }
        } catch (err: any) {
            console.error(err)
            if (err.response) {
                setError(err.response.data.detail || "Authentication failed")
            } else {
                setError("Network error. Is backend running?")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <img src="/logo.png" alt="CODSure" className="h-12 w-12 rounded-lg" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">
                        {isLogin ? "Login to CODSure" : "Create an account"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your email below to {isLogin ? "login" : "create your account"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {!isLogin && (
                            <>
                                <div className="space-y-2">
                                    <label htmlFor="fullname" className="text-sm font-medium leading-none">Full Name</label>
                                    <Input
                                        id="fullname"
                                        type="text"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="space-y-2 col-span-1">
                                        <label htmlFor="country" className="text-sm font-medium leading-none">Code</label>
                                        <select
                                            id="country"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                        >
                                            {countries.map((c) => (
                                                <option key={c.code} value={c.dial_code}>
                                                    {c.code} ({c.dial_code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label htmlFor="phone" className="text-sm font-medium leading-none">Phone</label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="300 1234567"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="storename" className="text-sm font-medium leading-none">Store Name</label>
                                    <Input
                                        id="storename"
                                        type="text"
                                        placeholder="My Awesome Store"
                                        value={storeName}
                                        onChange={(e) => setStoreName(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-gray-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary hover:underline font-medium"
                        >
                            {isLogin ? "Create account" : "Sign in"}
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
