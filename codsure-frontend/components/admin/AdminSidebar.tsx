"use client"

import Link from "next/link"
import { LayoutDashboard, Users, ShoppingCart, Activity, LogOut, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="hidden border-r bg-gray-900 text-white lg:block w-64 min-h-screen">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b border-gray-800 px-6">
                    <Link className="flex items-center gap-2 font-semibold" href="/admin">
                        <ShieldAlert className="h-6 w-6 text-red-500" />
                        <span className="">CODSure Admin</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <NavItem href="/admin" icon={LayoutDashboard} label="Overview" active={pathname === "/admin"} />
                        <NavItem href="/admin/merchants" icon={Users} label="Merchants" active={pathname.startsWith("/admin/merchants")} />
                        <NavItem href="/admin/orders" icon={ShoppingCart} label="All Orders" active={pathname.startsWith("/admin/orders")} />
                        <NavItem href="/admin/logs" icon={Activity} label="System Logs" active={pathname.startsWith("/admin/logs")} />
                    </nav>
                </div>
            </div>
        </div>
    )
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
    return (
        <Link
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-800",
                active ? "bg-gray-800 text-white" : "text-gray-400"
            )}
            href={href}
        >
            <Icon className="h-4 w-4" />
            {label}
        </Link>
    )
}
