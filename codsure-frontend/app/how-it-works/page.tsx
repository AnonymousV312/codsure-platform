"use client"

import { SiteHeader } from "@/components/site/SiteHeader"
import { SiteFooter } from "@/components/site/SiteFooter"
import { ArrowDown, CheckCircle, Search, Settings, Shield } from "lucide-react"

export default function HowItWorks() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-1 py-12 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-[800px] text-center mb-16">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">How CODSure Works</h1>
                        <p className="mt-4 text-xl text-muted-foreground">From installation to your first secure order in 5 minutes.</p>
                    </div>

                    <div className="mx-auto max-w-[700px] relative">
                        {/* Connecting vertical line */}
                        <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-border -z-10 md:left-1/2 md:-translate-x-1/2" />

                        <div className="space-y-12">
                            {/* Step 1 */}
                            <div className="relative flex flex-col md:flex-row md:items-center gap-8">
                                <div className="ml-16 md:ml-0 md:w-1/2 md:text-right">
                                    <h3 className="text-xl font-bold">1. Install & Connect</h3>
                                    <p className="mt-2 text-muted-foreground">Add CODSure to your Shopify store with one click. We automatically sync your past 60 days of orders to train your risk model instantly.</p>
                                </div>
                                <div className="absolute left-0 h-14 w-14 rounded-full border-4 border-background bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl md:left-1/2 md:-translate-x-1/2">1</div>
                                <div className="md:w-1/2">
                                    {/* Diagram/Icon */}
                                    <div className="h-24 w-full bg-muted/30 rounded-lg flex items-center justify-center border border-dashed">
                                        <Settings className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative flex flex-col md:flex-row-reverse md:items-center gap-8">
                                <div className="ml-16 md:ml-0 md:w-1/2 md:text-left">
                                    <h3 className="text-xl font-bold">2. Define Your Rules</h3>
                                    <p className="mt-2 text-muted-foreground">Set your tolerance. Want to block everyone from a specific city? Or require 20% advance for orders over 10k? You are in control.</p>
                                </div>
                                <div className="absolute left-0 h-14 w-14 rounded-full border-4 border-background bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl md:left-1/2 md:-translate-x-1/2">2</div>
                                <div className="md:w-1/2">
                                    <div className="h-24 w-full bg-muted/30 rounded-lg flex items-center justify-center border border-dashed">
                                        <Search className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative flex flex-col md:flex-row md:items-center gap-8">
                                <div className="ml-16 md:ml-0 md:w-1/2 md:text-right">
                                    <h3 className="text-xl font-bold">3. Checkout Protection</h3>
                                    <p className="mt-2 text-muted-foreground">When a customer reaches checkout, CODSure silently evaluates them. If they are risky, the COD option is hidden or they are prompted to pay an advance.</p>
                                </div>
                                <div className="absolute left-0 h-14 w-14 rounded-full border-4 border-background bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl md:left-1/2 md:-translate-x-1/2">3</div>
                                <div className="md:w-1/2">
                                    <div className="h-24 w-full bg-muted/30 rounded-lg flex items-center justify-center border border-dashed">
                                        <Shield className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="relative flex flex-col md:flex-row-reverse md:items-center gap-8">
                                <div className="ml-16 md:ml-0 md:w-1/2 md:text-left">
                                    <h3 className="text-xl font-bold">4. Ship Confidently</h3>
                                    <p className="mt-2 text-muted-foreground">You only see orders that have passed your checks. Ship them knowing they are 3x more likely to be delivered.</p>
                                </div>
                                <div className="absolute left-0 h-14 w-14 rounded-full border-4 border-background bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl md:left-1/2 md:-translate-x-1/2">4</div>
                                <div className="md:w-1/2">
                                    <div className="h-24 w-full bg-muted/30 rounded-lg flex items-center justify-center border border-dashed">
                                        <CheckCircle className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
