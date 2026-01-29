"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck } from "lucide-react"
import { SiteMobileMenu } from "@/components/site/SiteMobileMenu"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4 md:px-6 justify-between">
                <div className="flex items-center gap-2">
                    <SiteMobileMenu />
                    <Link className="flex items-center space-x-2 font-bold" href="/">
                        <img src="/logo.png" alt="CODSure" className="h-8 w-8 rounded-md" />
                        <span className="hidden sm:inline-block">CODSure</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link className="text-sm font-medium hover:text-primary transition-colors" href="/how-it-works">
                        How It Works
                    </Link>
                    <Link className="text-sm font-medium hover:text-primary transition-colors" href="/pricing">
                        Pricing
                    </Link>
                    <Link className="text-sm font-medium hover:text-primary transition-colors" href="/about">
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

                {/* Mobile CTA (only show Get Started if space allows, otherwise relying on menu) */}
                <div className="flex md:hidden items-center gap-2">
                    <Link href="/auth?signup=true">
                        <Button size="sm" className="h-8 text-xs px-3">Get Started</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
