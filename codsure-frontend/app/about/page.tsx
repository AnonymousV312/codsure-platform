"use client"

import { SiteHeader } from "@/components/site/SiteHeader"
import { SiteFooter } from "@/components/site/SiteFooter"

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-1 py-12 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-[800px]">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-center mb-12">About CODSure</h1>

                        <div className="prose dark:prose-invert mx-auto">
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                CODSure was built to solve a specific, expensive problem: <span className="text-foreground font-medium">The uncertainty of Cash on Delivery in Pakistan.</span>
                            </p>

                            <h2 className="text-2xl font-bold mt-12 mb-4">Our Mission</h2>
                            <p className="text-muted-foreground">
                                We believe that e-commerce in Pakistan can only mature when merchants have control over their revenue.
                                By bringing data intelligence to the checkout process, we empower brands to ship confidently and reject bad actors.
                            </p>

                            <h2 className="text-2xl font-bold mt-12 mb-4">The Problem</h2>
                            <p className="text-muted-foreground">
                                For years, merchants have accepted high Return-to-Origin (RTO) rates as "the cost of doing business".
                                We disagree. Fake orders, rider refusals, and pranksters are not a cost—they are a leak.
                            </p>

                            <h2 className="text-2xl font-bold mt-12 mb-4">Our Solution</h2>
                            <p className="text-muted-foreground">
                                We built an infrastructure that sits between Shopify and the real world.
                                It evaluates risk in milliseconds and enforces rules that save you money.
                                It's not magic; it's just good data.
                            </p>

                            <div className="mt-16 border-t pt-8">
                                <h3 className="text-lg font-bold">Contact Us</h3>
                                <p className="text-muted-foreground mt-2">
                                    Have questions? Reach our support team at <a href="mailto:support@codsure.pk" className="text-primary hover:underline">support@codsure.pk</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
