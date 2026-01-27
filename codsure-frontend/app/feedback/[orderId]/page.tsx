"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, ThumbsUp, ThumbsDown, ShieldCheck } from "lucide-react"

export default function FeedbackPage({ params }: { params: { orderId: string } }) {
    const [authenticity, setAuthenticity] = useState(0)
    const [rating, setRating] = useState(0)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock API Call to /api/v1/feedback/submit
        console.log("Submitting feedback", { authenticity, rating })
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <ShieldCheck className="h-12 w-12 text-green-600" />
                        </div>
                        <CardTitle>Thank You!</CardTitle>
                        <CardDescription>Your feedback helps make the community safer.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>How was your oder?</CardTitle>
                    <CardDescription>Order #{params.orderId}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Authenticity Section (Private) */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Was the product authentic?</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setAuthenticity(5)}
                                    className={`flex flex-1 flex-col items-center p-4 border rounded-lg hover:bg-gray-50 ${authenticity === 5 ? 'border-green-600 bg-green-50 ring-1 ring-green-600' : ''}`}
                                >
                                    <ThumbsUp className={`h-6 w-6 mb-2 ${authenticity === 5 ? 'text-green-600' : 'text-gray-400'}`} />
                                    <span className="text-xs">Original</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAuthenticity(1)}
                                    className={`flex flex-1 flex-col items-center p-4 border rounded-lg hover:bg-gray-50 ${authenticity === 1 ? 'border-red-600 bg-red-50 ring-1 ring-red-600' : ''}`}
                                >
                                    <ThumbsDown className={`h-6 w-6 mb-2 ${authenticity === 1 ? 'text-red-600' : 'text-gray-400'}`} />
                                    <span className="text-xs">Fake/Copy</span>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500">This feedback is private and affects the seller's trust score.</p>
                        </div>

                        <div className="border-t pt-4 space-y-3">
                            <label className="text-sm font-medium">Rate your experience</label>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="p-1 hover:scale-110 transition-transform"
                                    >
                                        <Star
                                            className={`h-8 w-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Comments (Optional)</label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Tell us more about the product quality..."
                            />
                        </div>

                        <Button className="w-full" type="submit" disabled={!authenticity || !rating}>
                            Submit Feedback
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
