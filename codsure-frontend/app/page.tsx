"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site/SiteHeader"
import { SiteFooter } from "@/components/site/SiteFooter"
import { ShieldCheck, ArrowRight, Ban, TrendingUp, DollarSign, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <SiteHeader />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-12 md:py-32 lg:py-40">
                    <div className="container relative z-10 px-4 md:px-6">
                        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                    Trusted by 500+ Pakistani Merchants
                                </span>
                            </motion.div>
                            <motion.h1
                                className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                Control Cash on Delivery. <br className="hidden sm:inline" />
                                <span className="text-primary">Not the Other Way Around.</span>
                            </motion.h1>
                            <motion.p
                                className="mt-6 max-w-[600px] text-lg text-muted-foreground md:text-xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                Reduce fake orders, authorize only trusted customers, and collect advance payments automatically. Built for Shopify in Pakistan.
                            </motion.p>
                            <motion.div
                                className="mt-8 flex gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Link href="/auth?signup=true">
                                    <Button size="lg" className="h-10 md:h-12 px-6 md:px-8 text-sm md:text-base">Install on Shopify</Button>
                                </Link>
                                <Link href="/how-it-works">
                                    <Button variant="outline" size="lg" className="h-10 md:h-12 px-6 md:px-8 text-sm md:text-base">See How It Works</Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                    {/* Abstract Background Elements */}
                    <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[100px]" />
                </section>

                {/* Pain Points Section */}
                <section className="bg-gray-50 py-24 dark:bg-gray-900/40">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-[800px] text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The Reality of COD in Pakistan</h2>
                            <p className="mt-4 text-muted-foreground">Every merchant knows the pain. We built the cure.</p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                                <Ban className="mb-4 h-10 w-10 text-red-500" />
                                <h3 className="text-xl font-bold">Fake Orders</h3>
                                <p className="mt-2 text-sm text-gray-600">Competitors and pranksters placing orders that never get delivered, draining your marketing budget.</p>
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                                <TrendingUp className="mb-4 h-10 w-10 text-amber-500" />
                                <h3 className="text-xl font-bold">High RTO Rates</h3>
                                <p className="mt-2 text-sm text-gray-600">Parcels travelled across the country only to be refused at the doorstep. Double shipping costs.</p>
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                                <DollarSign className="mb-4 h-10 w-10 text-green-500" />
                                <h3 className="text-xl font-bold">Cashflow Gaps</h3>
                                <p className="mt-2 text-sm text-muted-foreground">Money stuck with courier companies for weeks while you need to restock inventory.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Preview */}
                <section className="py-24">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Intelligent Logic for Every Order</h2>
                                <p className="mt-4 text-lg text-muted-foreground">
                                    CODSure sits between your Shopify checkout and the order confirmation. It silently evaluates every customer in milliseconds.
                                </p>
                                <ul className="mt-8 space-y-4">
                                    {[
                                        "Analyzes customer history & city risk",
                                        "Checks for fake phone numbers",
                                        "Enforces partial advance for high-value orders",
                                        "Blocks blacklisted customers instantly"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8">
                                    <Link href="/how-it-works" className="inline-flex items-center font-medium text-primary hover:underline">
                                        Explore the Logic Flow <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="relative rounded-xl border bg-muted/50 p-2">
                                <div className="rounded-lg bg-background p-6 shadow-sm">
                                    {/* Mock UI of analysis */}
                                    <div className="flex items-center justify-between border-b pb-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">JD</div>
                                            <div>
                                                <div className="font-bold">John Doe</div>
                                                <div className="text-xs text-muted-foreground">Karachi, Sindh</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold">PKR 12,500</div>
                                            <div className="text-xs text-muted-foreground">3 items</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">City Risk</span>
                                            <span className="font-medium text-green-600">Low</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Order Value</span>
                                            <span className="font-medium text-amber-600">High (&gt; 10k)</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">History</span>
                                            <span className="font-medium text-green-600">No Returns</span>
                                        </div>
                                        <div className="mt-4 rounded-md bg-amber-50 p-3 text-amber-900 text-sm font-medium border border-amber-200">
                                            Decision: Partial Advance Required (20%)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust Section */}
                <section className="bg-primary text-primary-foreground py-20">
                    <div className="container px-4 md:px-6 text-center">
                        <h2 className="text-2xl font-bold sm:text-3xl">Ready to secure your revenue?</h2>
                        <p className="mt-4 text-primary-foreground/80 max-w-[600px] mx-auto">
                            Join hundreds of Pakistani brands reducing their RTOs with CODSure.
                            Setup takes 5 minutes.
                        </p>
                        <div className="mt-8">
                            <Link href="/auth?signup=true">
                                <Button size="lg" variant="secondary" className="h-12 px-8 font-semibold">Start Free Trial</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    )
}
