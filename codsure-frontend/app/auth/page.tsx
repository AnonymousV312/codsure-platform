"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const router = useRouter()

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock Auth -> Redirect to dashboard
        router.push("/dashboard")
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <ShieldCheck className="h-10 w-10 text-primary" />
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
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                            <Input id="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                            <Input id="password" type="password" required />
                        </div>
                        {!isLogin && (
                            <div className="space-y-2">
                                <label htmlFor="store-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Store Name</label>
                                <Input id="store-name" type="text" placeholder="My Awesome Store" required />
                            </div>
                        )}
                        <Button className="w-full" type="submit">
                            {isLogin ? "Sign In" : "Sign Up"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-gray-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary hover:underline font-medium"
                        >
                            {isLogin ? "Sign up" : "Login"}
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
