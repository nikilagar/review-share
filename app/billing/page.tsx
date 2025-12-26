'use client'

import { useState, useEffect } from "react"
import { cancelSubscription } from "../actions"
import Link from "next/link"
import PricingPage from "../pricing/page"

interface BillingData {
    isPro: boolean
    subscriptionExpiresAt: string | null
    dodoSubscriptionId: string | null
    cancelAtPeriodEnd: boolean
}

export default function BillingPage() {
    const [loading, setLoading] = useState(true)
    const [billingData, setBillingData] = useState<BillingData | null>(null)
    const [cancelling, setCancelling] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [showCancelModal, setShowCancelModal] = useState(false)

    useEffect(() => {
        const fetchBilling = async () => {
            try {
                const res = await fetch('/api/user/billing')
                if (res.ok) {
                    const data = await res.json()
                    setBillingData(data)
                }
            } catch (error) {
                console.error('Failed to fetch billing data', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBilling()
    }, [])

    const handleCancelClick = () => {
        setShowCancelModal(true)
    }

    const confirmCancel = async () => {
        setCancelling(true)
        setMessage(null)
        try {
            const res = await cancelSubscription()
            if (res.success) {
                setMessage({ type: 'success', text: "Your subscription has been cancelled. You will remain Pro until the end of your billing period." })
                // Refresh data
                const updatedRes = await fetch('/api/user/billing')
                const updatedData = await updatedRes.json()
                setBillingData(updatedData)
                setShowCancelModal(false)
            } else {
                setMessage({ type: 'error', text: res.error || "Failed to cancel subscription" })
                setShowCancelModal(false)
            }
        } catch (err) {
            setMessage({ type: 'error', text: "An unexpected error occurred" })
            setShowCancelModal(false)
        } finally {
            setCancelling(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (!billingData?.isPro) {
        return <PricingPage />
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 relative">
            {/* Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Stop Auto-Renewal?</h3>
                        <p className="text-gray-500 mb-6">
                            You will lose access to pinned products and 2x respect earning at the end of your current billing period.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Keep Subscription
                            </button>
                            <button
                                onClick={confirmCancel}
                                disabled={cancelling}
                                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                {cancelling ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        Stopping...
                                    </>
                                ) : (
                                    "Stop Renewal"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-2xl mx-auto space-y-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Billing & Subscription</h1>
                    <p className="text-gray-500 text-lg">Manage your Pro features and billing history</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} animate-in slide-in-from-top-2 duration-300`}>
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
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* ... (Current Plan section remains) ... */}

                    <div className="p-8 space-y-6">
                        <div className="flex justify-between items-center py-2">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Price</p>
                                <p className="text-xl font-bold text-gray-900">$1.99 / week</p>
                            </div>
                            {/* Auto-Renewal Indicator Removed */}
                        </div>

                        {billingData?.subscriptionExpiresAt && (
                            <div className="flex justify-between items-center py-2 border-t border-gray-50 pt-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        {new Date(billingData.subscriptionExpiresAt) < new Date() ? 'Expired On' : (billingData.cancelAtPeriodEnd ? 'Ends On' : 'Next Billing Date')}
                                    </p>
                                    <p className={`text-lg font-semibold ${new Date(billingData.subscriptionExpiresAt) < new Date() ? 'text-red-600' : 'text-gray-900'}`}>
                                        {new Date(billingData.subscriptionExpiresAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {billingData.cancelAtPeriodEnd && !loading && (
                                    <div className="text-right">
                                        <p className="text-xs text-red-500 font-medium">Auto-renewal stopped</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {billingData?.isPro && !billingData.cancelAtPeriodEnd && (
                            <div className="pt-6 border-t border-gray-100">
                                <button
                                    onClick={handleCancelClick}
                                    className="text-red-600 font-semibold hover:text-red-700 transition-colors flex items-center gap-2"
                                >
                                    Stop Auto-Renewal
                                </button>
                                <p className="text-xs text-gray-400 mt-2">
                                    You will keep your Pro benefits until the end of your billing period.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-gray-400 text-sm">
                        Payments secured by Dodo Payments.
                    </p>
                </div>
            </div>
        </main>
    )
}
