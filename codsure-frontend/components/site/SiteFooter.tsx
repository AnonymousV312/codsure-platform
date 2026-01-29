import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export function SiteFooter() {
    return (
        <footer className="border-t bg-gray-50 dark:bg-gray-900/50">
            <div className="container px-4 py-12 md:px-6 md:py-16">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="col-span-2 md:col-span-1">
                        <Link className="flex items-center space-x-2 font-bold" href="/">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                            <span>CODSure</span>
                        </Link>
                        <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                            Infrastructure for Pakistan's payment on delivery ecosystem. Secure, smart, and reliable.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Product</h3>
                        <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                            <li><Link href="/how-it-works">How it Works</Link></li>
                            <li><Link href="/pricing">Pricing</Link></li>
                            <li><Link href="#">Integration</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Company</h3>
                        <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                            <li><Link href="#">About</Link></li>
                            <li><Link href="#">Contact</Link></li>
                            <li><Link href="#">Privacy Policy</Link></li>
                            <li><Link href="#">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Connect</h3>
                        <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                            <li><Link href="#">Twitter</Link></li>
                            <li><Link href="#">LinkedIn</Link></li>
                            <li><Link href="#">GitHub</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} CODSure Inc. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
