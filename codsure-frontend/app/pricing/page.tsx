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
                        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">Starter</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-3xl font-bold text-slate-900">Free</span>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">For new stores testing the waters.</p>
                            <ul className="mt-6 space-y-3 text-sm text-slate-700">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Up to 50 orders/month</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Basic Risk Rules</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Analytics Dashboard</li>
                            </ul>
                            <div className="mt-8">
                                <Link href="/auth?signup=true">
                                    <Button variant="outline" className="w-full border-slate-300 text-slate-900">Get Started</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Pro Tier */}
                        <div className="rounded-xl border-2 border-primary bg-white p-8 shadow-lg relative transform md:-translate-y-4">
                            <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-primary text-white px-3 py-1 text-xs font-bold rounded-full shadow-md">
                                POPULAR
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Growth</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-3xl font-bold text-slate-900">PKR 5,000</span>
                                <span className="ml-1 text-slate-500">/mo</span>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">For growing brands reducing RTOs.</p>
                            <ul className="mt-6 space-y-3 text-sm text-slate-700">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Up to 1,000 orders/month</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Advanced AI Rules</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Partial Advance Collection</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Priority Support</li>
                            </ul>
                            <div className="mt-8">
                                <Link href="/auth?signup=true">
                                    <Button className="w-full shadow-lg">Start 14-Day Trial</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Scale Tier */}
                        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">Scale</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-3xl font-bold text-slate-900">PKR 15,000</span>
                                <span className="ml-1 text-slate-500">/mo</span>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">For high-volume powerhouses.</p>
                            <ul className="mt-6 space-y-3 text-sm text-slate-700">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Unlimited orders</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Custom Risk Models</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Dedicated Account Manager</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> API Access</li>
                            </ul>
                            <div className="mt-8">
                                <Button variant="outline" className="w-full border-slate-300 text-slate-900">Contact Sales</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
