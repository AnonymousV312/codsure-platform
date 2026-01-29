"use client"

import { useAuth } from "@/components/providers/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

export default function AdminRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/auth")
            } else if (user.role !== "admin") {
                router.push("/dashboard") // Redirect non-admins to merchant dashboard
            }
        }
    }, [user, isLoading, router, pathname])

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    // If not admin, don't render content (will redirect)
    if (!user || user.role !== "admin") {
        return null
    }

    return <>{children}</>
}
