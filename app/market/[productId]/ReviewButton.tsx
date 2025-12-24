'use client'

import { useState, useEffect, useRef } from "react"
import { submitReview } from "@/app/actions"
import Link from "next/link"

export default function ReviewButton({ productId, ownerId }: { productId: string, ownerId: string }) {
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE')
    const [showModal, setShowModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [countdown, setCountdown] = useState<number | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        // Cleanup timer on unmount
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [])

    // Trigger verification when countdown finishes
    useEffect(() => {
        if (countdown === 0) {
            setCountdown(null)
            handleConfirm()
        }
    }, [countdown])

    const handleConfirm = async () => {
        setStatus('LOADING')
        try {
            const result = await submitReview(productId, ownerId);
            if (result?.success) {
                setStatus('SUCCESS')
            } else {
                setStatus('ERROR')
                setErrorMessage(result?.message || "Verification Failed")
            }
        } catch (e) {
            setStatus('ERROR')
            setErrorMessage("An unexpected error occurred")
        }
    }

    const startCountdown = () => {
        setCountdown(15)
        timerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev === null || prev <= 1) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current)
                        timerRef.current = null
                    }
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }



    return (
        <>
            {status === 'SUCCESS' ? (
                <div className="w-full py-4 bg-green-50 text-green-700 font-bold rounded-lg text-center border border-green-200">
                    Verified! (+1 Respect)
                </div>
            ) : (
                <button
                    onClick={() => setShowModal(true)}
                    disabled={status === 'LOADING'}
                    className="w-full py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'LOADING' ? "Verifying..." : "I Have Reviewed It (+1 Respect)"}
                </button>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">

                        {status === 'SUCCESS' ? (
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-green-800">Verified!</h3>
                                <p className="text-green-700">You earned +1 Respect.</p>
                                <Link
                                    href="/market"
                                    className="block w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Back to Market
                                </Link>
                            </div>
                        ) : status === 'ERROR' ? (
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-red-800">Verification Failed</h3>
                                <p className="text-red-600">{errorMessage}</p>
                                <p className="text-xs text-gray-500">Your account has been flagged for manual review.</p>
                                <Link
                                    href="/market"
                                    className="block w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Back to Market
                                </Link>
                            </div>
                        ) : countdown !== null ? (
                            <div className="text-center space-y-4">
                                <div className="relative mx-auto w-20 h-20">
                                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#E5E7EB"
                                            strokeWidth="3"
                                        />
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#3B82F6"
                                            strokeWidth="3"
                                            strokeDasharray={`${((15 - countdown) / 15) * 100}, 100`}
                                            className="transition-all duration-1000 ease-linear"
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-600">
                                        {countdown}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Waiting for Google...</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    It takes a few seconds for Google to publish your review. <br />
                                    Please wait while we verify...
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                    <h3 className="text-xl font-bold">Warning</h3>
                                </div>

                                <p className="text-gray-600 leading-relaxed">
                                    Please confirm that you have <strong>actually reviewed</strong> this extension on the Chrome Web Store.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    False reporting or abusing this system is a violation of our terms and will result in your account being <strong>permanently banned</strong>.
                                </p>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        disabled={status === 'LOADING'}
                                        className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={startCountdown}
                                        disabled={status === 'LOADING'}
                                        className="flex-1 py-2.5 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex justify-center"
                                    >
                                        {status === 'LOADING' ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : "Yes, I Reviewed It"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
