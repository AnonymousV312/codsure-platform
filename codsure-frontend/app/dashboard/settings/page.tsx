import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Risk Tolerance</CardTitle>
                    <CardDescription>Adjust how aggressive the risk engine should be.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Risk Threshold Level</span>
                            <span className="text-sm text-gray-500">Balanced (Default)</span>
                        </div>
                        <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Conservative</span>
                            <span>Balanced</span>
                            <span>Aggressive</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Store Details</CardTitle>
                    <CardDescription>Manage your store profile.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Store Name</label>
                                <Input defaultValue="My Awesome Store" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Platform</label>
                                <Input defaultValue="Shopify" disabled />
                            </div>
                        </div>
                        <Button>Save Changes</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
