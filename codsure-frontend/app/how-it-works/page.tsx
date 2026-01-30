"use client"

import { SiteHeader } from "@/components/site/SiteHeader"
import { SiteFooter } from "@/components/site/SiteFooter"
import { ArrowDown, CheckCircle, Search, Settings, Shield, Truck, Users, Activity, BarChart3, Lock } from "lucide-react"

export default function HowItWorks() {
    return (
        <div className="flex min-h-screen flex-col bg-white text-slate-900">
            <SiteHeader />
            <main className="flex-1 py-12 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-[800px] text-center mb-16">
                        <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800 mb-6">
                            <Activity className="w-4 h-4 mr-2" /> End-to-End Protection
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-slate-900">
                            How CODSure Works
                        </h1>
                        <p className="mt-4 text-xl text-slate-600">
                            The only platform that protects you before, during, and after the delivery.
                        </p>
                    </div>

                    <div className="mx-auto max-w-[800px] relative">
                        {/* Connecting vertical line */}
                        <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-slate-200 -z-10 md:left-1/2 md:-translate-x-1/2" />

                        <div className="space-y-12">
                            {/* Step 1 */}
                            <WorkStep
                                num="1"
                                title="Merchant Connects CODSure"
                                desc="Connect your Shopify store in one click. We automatically pull your full historical orders and customer data to build your initial risk profile."
                                icon={Settings}
                                align="right"
                            />

                            {/* Step 2 */}
                            <WorkStep
                                num="2"
                                title="Universal Customer Intelligence"
                                desc="We verify every customer against our network of thousands of merchants. Even first-time visitors already have a detailed history and risk score."
                                icon={Users}
                                align="left"
                            />

                            {/* Step 3 */}
                            <WorkStep
                                num="3"
                                title="The CODSure Score"
                                desc="Every customer gets a bespoke 0-10 Trust Score based on successful deliveries, refusals, fake attempts, and verified courier disputes."
                                icon={BarChart3}
                                align="right"
                            />

                            {/* Step 4 */}
                            <WorkStep
                                num="4"
                                title="Smart COD Decision"
                                desc="Our engine automatically decides: Allow COD, Require Partial Advance, or Require Full Payment. You set the rules; we enforce them."
                                icon={Lock}
                                align="left"
                            />

                            {/* Step 5 */}
                            <WorkStep
                                num="5"
                                title="Courier Accountability"
                                desc="If a delivery fails, the reason is tracked. We identify courier negligence so you (and the customer) don't pay the price for their mistakes."
                                icon={Truck}
                                align="right"
                            />

                            {/* Step 6 */}
                            <WorkStep
                                num="6"
                                title="Feedback & Trust Loop"
                                desc="Successful deliveries build your Store Transparency Score. High-trust merchants attract high-trust customers. The network gets stronger every day."
                                icon={CheckCircle}
                                align="left"
                                isLast={true}
                            />
                        </div>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}

function WorkStep({ num, title, desc, icon: Icon, align, isLast }: { num: string, title: string, desc: string, icon: any, align: 'left' | 'right', isLast?: boolean }) {
    return (
        <div className={`relative flex flex-col md:flex-row${align === 'left' ? '-reverse' : ''} md:items-center gap-8`}>
            <div className={`ml-16 md:ml-0 md:w-1/2 ${align === 'right' ? 'md:text-right' : 'md:text-left'}`}>
                <h3 className="text-xl font-bold text-slate-900">{num}. {title}</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">{desc}</p>
            </div>

            <div className="absolute left-0 h-14 w-14 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center text-white font-bold text-xl md:left-1/2 md:-translate-x-1/2 shadow-lg z-10">
                {num}
            </div>

            <div className="md:w-1/2 hidden md:flex justify-center">
                <div className="h-24 w-24 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
                    <Icon className="h-10 w-10 text-slate-400" />
                </div>
            </div>
        </div>
    )
}
