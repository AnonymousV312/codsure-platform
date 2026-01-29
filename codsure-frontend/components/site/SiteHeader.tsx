"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck } from "lucide-react"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4 md:px-6">
                <Link className="flex items-center space-x-2 font-bold" href="/">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <span className="hidden sm:inline-block">CODSure</span>
                </Link>
                <nav className="ml-auto flex items-center gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:text-primary transition-colors" href="/how-it-works">
                        How It Works
                    </Link>
                    <Link className="text-sm font-medium hover:text-primary transition-colors" href="/pricing">
                        Pricing
                    </Link>
                    <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">
                        About
                    </Link>
                    <div className="flex items-center gap-2 ml-2">
                        <Link href="/auth">
                            <Button variant="ghost" size="sm">Log in</Button>
                        </Link>
                        <Link href="/auth?signup=true">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    )
}
