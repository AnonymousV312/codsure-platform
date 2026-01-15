import { Sidebar } from "@/components/dashboard/Sidebar"
import { Header } from "@/components/dashboard/Header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
            <Sidebar />
            <div className="flex flex-col flex-1 min-h-screen">
                <Header />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 bg-gray-50/50 dark:bg-gray-900/50">
                    {children}
                </main>
            </div>
        </div>
    )
}
