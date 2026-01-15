import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingCart, Settings, ShieldCheck, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
    return (
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 w-64 min-h-screen">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-6">
                    <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <span className="">CODSure</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <NavItem href="/dashboard" icon={LayoutDashboard} label="Overview" />
                        <NavItem href="/dashboard/orders" icon={ShoppingCart} label="Orders" />
                        <NavItem href="/dashboard/settings" icon={Settings} label="Settings" />
                    </nav>
                </div>
                <div className="border-t p-4">
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-all hover:bg-gray-100 dark:hover:bg-gray-800">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
    // Note: usePathname is a client hook, so Sidebar needs to be imported in a Client Component or be one.
    // For simplicity in this layout, we'll mark Sidebar as client in the file if needed, 
    // but better to just skip active state or make it a client component.
    // I'll make the whole Sidebar a client component? No, I'll allow it generally.
    // Actually, I'll mock the active state logic for now to avoid "use client" complexity in Server Component imports if not configured.
    // But Link is there, so..
    return (
        <Link
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900 dark:hover:text-gray-50",
                "text-gray-500 dark:text-gray-400"
            )}
            href={href}
        >
            <Icon className="h-4 w-4" />
            {label}
        </Link>
    )
}
