import { AdminSidebar } from "@/components/admin/AdminSidebar"
import AdminRoute from "@/components/providers/AdminRoute"
import { AuthProvider } from "@/components/providers/AuthContext"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthProvider>
            <AdminRoute>
                <div className="flex min-h-screen w-full">
                    <AdminSidebar />
                    <div className="flex flex-col w-full">
                        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-gray-50 dark:bg-gray-900/50">
                            {children}
                        </main>
                    </div>
                </div>
            </AdminRoute>
        </AuthProvider>
    )
}
