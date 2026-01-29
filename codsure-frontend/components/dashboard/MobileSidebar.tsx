"use client"

import { useState } from "react"
import Link from "next/link"
import { LayoutDashboard, ShoppingCart, Settings, ShieldCheck, LogOut, ShoppingBag, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MobileSidebar() {
    const [open, setOpen] = useState(false)

    return (
        <div className="lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="relative flex h-full w-64 flex-col bg-background border-r shadow-xl animate-in slide-in-from-left duration-300">
                        <div className="flex h-14 items-center justify-between border-b px-6">
                            <Link className="flex items-center gap-2 font-semibold" href="/dashboard" onClick={() => setOpen(false)}>
                                <img src="/logo.png" alt="CODSure" className="h-6 w-6 rounded-md" />
                                <span>CODSure</span>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="-mr-2">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-auto py-4">
                            <nav className="grid items-start px-4 text-sm font-medium gap-1">
                                <MobileNavItem href="/dashboard" icon={LayoutDashboard} label="Overview" onClick={() => setOpen(false)} />
                                <MobileNavItem href="/dashboard/orders" icon={ShoppingCart} label="Orders" onClick={() => setOpen(false)} />
                                <MobileNavItem href="/dashboard/connect-store" icon={ShoppingBag} label="Connect Store" onClick={() => setOpen(false)} />
                                <MobileNavItem href="/admin/rules" icon={ShieldCheck} label="Risk Rules" onClick={() => setOpen(false)} />
                                <MobileNavItem href="/dashboard/settings" icon={Settings} label="Settings" onClick={() => setOpen(false)} />
                            </nav>
                        </div>

                        <div className="border-t p-4">
                            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function MobileNavItem({ href, icon: Icon, label, onClick }: { href: string; icon: any; label: string; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
        >
            <Icon className="h-4 w-4" />
            {label}
        </Link>
    )
}
