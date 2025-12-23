'use client'

import { useState } from 'react'

export default function PricingPage() {
    const [loading, setLoading] = useState(false)

    const handleSubscribe = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/dodo/checkout', { method: 'POST' })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to start checkout')
            }

            if (data.url) {
                window.location.href = data.url
            }
        } catch (error: any) {
            console.error(error)
            alert(error.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-3xl mx-auto space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <h1 className="text-4xl font-bold text-gray-900">Upgrade to Pro</h1>
                <p className="text-xl text-gray-500">
                    Get more respect and visibility for your products.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left mt-8">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Free Plan</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>• Earn 1 Respect per review</li>
                            <li>• Standard visibility</li>
                            <li>• Basic community access</li>
                        </ul>
                    </div>
                    <div className="space-y-4 bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-yellow-900">Pro Plan</h3>
                            <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">POPULAR</span>
                        </div>
                        <ul className="space-y-2 text-gray-700">
                            <li>• <strong className="text-black">2x Respect earnings</strong> (2 per review)</li>
                            <li>• <strong className="text-black">Pinned to top</strong> of Market</li>
                            <li>• "PRO" badge on profile</li>
                            <li>• Premium visibility</li>
                        </ul>
                        <div className="pt-4">
                            <span className="text-3xl font-bold">$4.99</span>
                            <span className="text-gray-500">/week</span>
                        </div>
                        <button
                            onClick={handleSubscribe}
                            disabled={loading}
                            className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Upgrade Now'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
