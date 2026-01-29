"use client"

import { useAuth } from "@/components/providers/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!isLoading && !user && pathname.startsWith("/dashboard")) {
            router.push("/auth")
        }
    }, [user, isLoading, router, pathname])

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    // If not logged in and on a protected route, don't render content (will redirect)
    if (!user && pathname.startsWith("/dashboard")) {
        return null
    }

    return <>{children}</>
}
