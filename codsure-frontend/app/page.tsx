import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, BarChart3, Lock } from "lucide-react"

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center space-x-2" href="#">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl">CODSure</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                        Features
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                        Pricing
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                        About
                    </Link>
                </nav>
                <div className="ml-4">
                    <Link href="/auth">
                        <Button variant="default">Login / Signup</Button>
                    </Link>
                </div>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-50 dark:bg-gray-900/50">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    Be sure before you ship COD.
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    Stop RTOs and fake orders. CODSure analyzes risk signals to help you decide which orders are safe.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Link href="/auth">
                                    <Button size="lg" className="h-11">Get Started</Button>
                                </Link>
                                <Button variant="outline" size="lg" className="h-11">Learn more</Button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-black">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                            <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                                <ShieldCheck className="h-10 w-10 text-primary mb-2" />
                                <h2 className="text-xl font-bold">Rule-Based Intelligence</h2>
                                <p className="text-center text-sm text-gray-500">
                                    Determine risk based on city, history, and order behavior.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                                <BarChart3 className="h-10 w-10 text-accent mb-2" />
                                <h2 className="text-xl font-bold">Dashboard Analytics</h2>
                                <p className="text-center text-sm text-gray-500">
                                    Track your Money Saved and RTO reduction in real-time.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                                <Lock className="h-10 w-10 text-secondary mb-2" />
                                <h2 className="text-xl font-bold">Secure Integration</h2>
                                <p className="text-center text-sm text-gray-500">
                                    Seamlessly connects with your Shopify store securely.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 CODSure. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    )
}
