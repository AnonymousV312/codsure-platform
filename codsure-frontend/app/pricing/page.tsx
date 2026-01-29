"use client"

import { SiteHeader } from "@/components/site/SiteHeader"
import { SiteFooter } from "@/components/site/SiteFooter"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-1 py-24">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-[800px] text-center mb-16">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Simple, Transparent Pricing</h1>
                        <p className="mt-4 text-xl text-muted-foreground">Start for free. Scale as you grow. No hidden commissions.</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3 max-w-[1000px] mx-auto">
                        {/* Free Tier */}
                        <div className="rounded-xl border bg-card p-8 shadow-sm">
                            <h3 className="text-lg font-semibold">Starter</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-3xl font-bold">Free</span>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">For new stores testing the waters.</p>
                            <ul className="mt-6 space-y-3 text-sm">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Up to 50 orders/month</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Basic Risk Rules</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Analytics Dashboard</li>
                            </ul>
                            <div className="mt-8">
                                <Link href="/auth?signup=true">
                                    <Button variant="outline" className="w-full">Get Started</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Pro Tier */}
                        <div className="rounded-xl border-2 border-primary bg-card p-8 shadow-md relative">
                            <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-full">
                                POPULAR
                            </div>
                            <h3 className="text-lg font-semibold">Growth</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-3xl font-bold">PKR 5,000</span>
                                <span className="ml-1 text-muted-foreground">/mo</span>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">For growing brands reducing RTOs.</p>
                            <ul className="mt-6 space-y-3 text-sm">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Up to 1,000 orders/month</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Advanced AI Rules</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Partial Advance Collection</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Priority Support</li>
                            </ul>
                            <div className="mt-8">
                                <Link href="/auth?signup=true">
                                    <Button className="w-full">Start 14-Day Trial</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Scale Tier */}
                        <div className="rounded-xl border bg-card p-8 shadow-sm">
                            <h3 className="text-lg font-semibold">Scale</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-3xl font-bold">PKR 15,000</span>
                                <span className="ml-1 text-muted-foreground">/mo</span>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">For high-volume powerhouses.</p>
                            <ul className="mt-6 space-y-3 text-sm">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited orders</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Custom Risk Models</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Dedicated Account Manager</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> API Access</li>
                            </ul>
                            <div className="mt-8">
                                <Button variant="outline" className="w-full">Contact Sales</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
