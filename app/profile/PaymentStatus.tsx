'use client'

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function PaymentStatus() {
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const status = searchParams.get('status')

        if (status === 'active') {
            setMessage({ type: 'success', text: "Payment successful! You are now a Pro member." })
            // Clean up the URL
            const newUrl = window.location.pathname
            window.history.replaceState({}, '', newUrl)
            // Refresh to update server component data (isPro status)
            router.refresh()
        } else if (status === 'failed' || status === 'cancelled') {
            setMessage({ type: 'error', text: "Payment was not completed. Please try again." })
            const newUrl = window.location.pathname
            window.history.replaceState({}, '', newUrl)
        }
    }, [searchParams, router])

    if (!message) return null

    return (
        <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} animate-in slide-in-from-top-2 duration-300`}>
            <div className="flex items-center gap-3">
                {message.type === 'success' ? (
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
                <p className="font-medium">{message.text}</p>
            </div>
        </div>
    )
}
