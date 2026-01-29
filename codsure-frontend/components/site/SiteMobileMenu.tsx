"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteMobileMenu() {
    const [open, setOpen] = useState(false)

    return (
        <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="-ml-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex flex-col bg-background animate-in slide-in-from-top duration-200">
                    <div className="flex h-16 items-center justify-between px-4 border-b">
                        <span className="font-bold text-lg">Menu</span>
                        <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                    <nav className="flex flex-col p-6 gap-6 text-lg font-medium">
                        <Link href="/how-it-works" onClick={() => setOpen(false)} className="hover:text-primary">
                            How It Works
                        </Link>
                        <Link href="/pricing" onClick={() => setOpen(false)} className="hover:text-primary">
                            Pricing
                        </Link>
                        <Link href="/about" onClick={() => setOpen(false)} className="hover:text-primary">
                            About
                        </Link>
                        <hr className="my-2" />
                        <Link href="/auth" onClick={() => setOpen(false)}>
                            <Button variant="outline" className="w-full justify-start text-lg h-12">Log in</Button>
                        </Link>
                        <Link href="/auth?signup=true" onClick={() => setOpen(false)}>
                            <Button className="w-full justify-start text-lg h-12">Get Started</Button>
                        </Link>
                    </nav>
                </div>
            )}
        </div>
    )
}
