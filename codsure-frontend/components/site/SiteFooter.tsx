import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export function SiteFooter() {
    return (
        <footer className="border-t bg-gray-50 dark:bg-gray-900/50">
            <div className="container px-4 py-12 md:px-6 md:py-16">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="col-span-2 md:col-span-1">
                        <Link className="flex items-center space-x-2 font-bold" href="/">
                            <img src="/logo.png" alt="CODSure" className="h-6 w-6 rounded-sm bg-primary/10 p-0.5" />
                            <span>CODSure</span>
                        </Link>
                        <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                            Infrastructure for Pakistan's payment on delivery ecosystem. Secure, smart, and reliable.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">Product</h3>
                        <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <li><Link href="/how-it-works" className="hover:text-primary">How it Works</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-primary">Integration</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">Company</h3>
                        <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <li><Link href="/about" className="hover:text-primary">About</Link></li>
                            <li><Link href="/about" className="hover:text-primary">Contact</Link></li>
                            <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">Connect</h3>
                        <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <li><Link href="#" className="hover:text-primary">Twitter</Link></li>
                            <li><Link href="#" className="hover:text-primary">LinkedIn</Link></li>
                            <li><Link href="#" className="hover:text-primary">GitHub</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 pt-8 text-center text-xs text-slate-500 font-medium">
                    © {new Date().getFullYear()} CODSure Inc. All rights reserved. <span className="opacity-50 ml-2 text-[10px]">v1.2.0</span>
                </div>
            </div>
        </footer>
    )
}
