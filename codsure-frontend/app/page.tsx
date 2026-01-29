"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site/SiteHeader"
import { SiteFooter } from "@/components/site/SiteFooter"
import { motion } from "framer-motion"
import { ArrowRight, Ban, CheckCircle2, DollarSign, ShieldCheck, TrendingUp, Truck, Users, XCircle } from "lucide-react"

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-white text-slate-900">
            <SiteHeader />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-16 md:py-32 lg:py-40 bg-slate-50 dark:bg-slate-950">
                    <div className="container relative z-10 px-4 md:px-6">
                        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-800 shadow-sm mb-6">
                                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                                    V2.0 Now Live in Pakistan
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                                    Powering Pakistan’s Most <span className="text-primary">Profitable</span> COD Businesses
                                </h1>
                                <p className="mx-auto mt-6 max-w-[700px] text-lg text-slate-600 md:text-xl leading-relaxed">
                                    Eliminate fake orders, slash return rates, and reward your best customers.
                                    The first intelligent trust infrastructure for Cash on Delivery.
                                </p>
                            </motion.div>
                            <motion.div
                                className="mt-8 flex flex-col gap-4 min-[400px]:flex-row justify-center w-full sm:w-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Link href="/auth?signup=true" className="w-full sm:w-auto">
                                    <Button size="lg" className="h-12 px-8 text-base font-bold w-full sm:w-auto shadow-lg shadow-primary/20">
                                        Start Free Trial
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/how-it-works" className="w-full sm:w-auto">
                                    <Button variant="outline" size="lg" className="h-12 px-8 text-base font-medium w-full sm:w-auto bg-white hover:bg-slate-50">
                                        See How It Works
                                    </Button>
                                </Link>
                            </motion.div>

                            {/* Trust Badge */}
                            <div className="mt-12 opacity-80">
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Trusted by thousands of fast-growing merchants</p>
                                <div className="flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-60">
                                    {/* Placeholders for logos (Text for now to keep it clean) */}
                                    <span className="text-xl font-bold text-slate-400">Shopify</span>
                                    <span className="text-xl font-bold text-slate-400">WooCommerce</span>
                                    <span className="text-xl font-bold text-slate-400">TCS</span>
                                    <span className="text-xl font-bold text-slate-400">Leopards</span>
                                    <span className="text-xl font-bold text-slate-400">Call Courier</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Problem (Seller Pain) */}
                <section className="py-20 md:py-32 bg-white">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-[800px] text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-slate-900">
                                Stop Losing Money on <span className="text-red-500">Fake Orders</span>
                            </h2>
                            <p className="mt-4 text-lg text-slate-600">
                                Every returned parcel isn't just lost revenue—it's double shipping costs and wasted ad spend.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            <Card
                                icon={Ban}
                                color="text-red-500"
                                title="Block Fake Buyers"
                                desc="Automatically detect and block competitors, pranksters, and habitual rejectors before you ship."
                            />
                            <Card
                                icon={TrendingUp}
                                color="text-amber-500"
                                title="Slash RTO Rates"
                                desc="Filter out low-intent buyers. Reduce your Return-to-Origin rate by up to 40% in week one."
                            />
                            <Card
                                icon={DollarSign}
                                color="text-emerald-500"
                                title="Fix Cashflow Gaps"
                                desc="Stop getting your capital stuck with couriers for weeks. Ship only to those who pay."
                            />
                        </div>
                    </div>
                </section>

                {/* The Solution (Visual Flow) */}
                <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-[800px] text-center mb-16">
                            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                                Intelligent Automation
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-slate-900 dark:text-white">
                                How CODSure Protects You
                            </h2>
                        </div>

                        {/* Visual Flow Diagram */}
                        <div className="relative max-w-4xl mx-auto">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0 -translate-y-1/2"></div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                {/* Step 1 */}
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-xl font-bold">1</div>
                                    <h3 className="text-xl font-bold mb-2">Order Placed</h3>
                                    <p className="text-slate-600 text-sm">Customer hits 'Buy Now' on your store.</p>
                                </div>

                                {/* Step 2 */}
                                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl border-4 border-emerald-500/20 flex flex-col items-center text-center scale-105 transform">
                                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">2</div>
                                    <h3 className="text-xl font-bold mb-2">Risk Analyzed</h3>
                                    <p className="text-slate-300 text-sm">We check their history, phone, and address instantly.</p>
                                    <div className="mt-4 inline-flex items-center bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/50">
                                        <ShieldCheck className="w-3 h-3 mr-1" /> SAFETY CHECK
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 text-xl font-bold">3</div>
                                    <h3 className="text-xl font-bold mb-2">Action Taken</h3>
                                    <p className="text-slate-600 text-sm">Safe? COD Approved. <br />Risky? Advance Required.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Merchant Benefits / Social Proof */}
                <section className="py-20 md:py-32 bg-white">
                    <div className="container px-4 md:px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 mb-6">
                                    Build a Brand That <br />Shoppers Trust
                                </h2>
                                <div className="space-y-6">
                                    <BenefitItem
                                        icon={Users}
                                        title="Customer Profiling"
                                        desc="Know who is buying. Our 'COD Score' behaves like a credit score for delivery reliability."
                                    />
                                    <BenefitItem
                                        icon={Truck}
                                        title="Courier Accountability"
                                        desc="We track courier performance. If they fake a delivery attempt, we flag it so your customer isn't penalized."
                                    />
                                    <BenefitItem
                                        icon={CheckCircle2}
                                        title="Implicit Feedback Loop"
                                        desc="Successful deliveries build your Store Trust Score. Good sellers get better customers."
                                    />
                                </div>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                {/* Mock UI for Trust Score */}
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-700">JS</div>
                                            <div>
                                                <div className="font-bold text-slate-900">Jameel S.</div>
                                                <div className="text-xs text-slate-500">Lahore, Punjab</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-emerald-600">9.2</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase">COD Score</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-slate-50 rounded-lg p-2">
                                            <div className="text-lg font-bold text-slate-800">14</div>
                                            <div className="text-[10px] text-slate-500">Delivered</div>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-2">
                                            <div className="text-lg font-bold text-slate-800">1</div>
                                            <div className="text-[10px] text-slate-500">Returned</div>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-2">
                                            <div className="text-lg font-bold text-emerald-600">93%</div>
                                            <div className="text-[10px] text-slate-500">Success</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t flex items-center text-xs text-emerald-600 font-medium">
                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                        Verified High-Trust Buyer
                                    </div>
                                </div>
                                <div className="text-center text-sm text-slate-400 italic">
                                    Example Customer Profile
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <SiteFooter />
            </main>
        </div>
    )
}

function Card({ icon: Icon, color, title, desc }: { icon: any, color: string, title: string, desc: string }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
            <Icon className={`mb-4 h-10 w-10 ${color}`} />
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
        </div>
    )
}

function BenefitItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div>
                <h4 className="text-lg font-bold text-slate-900">{title}</h4>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
