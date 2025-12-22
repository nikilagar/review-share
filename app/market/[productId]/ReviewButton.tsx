'use client'

import { useTransition, useState } from "react"
import { submitReview } from "@/app/actions"

export default function ReviewButton({ productId, ownerId }: { productId: string, ownerId: string }) {
    const [isPending, startTransition] = useTransition()
    const [showModal, setShowModal] = useState(false)

    const handleConfirm = () => {
        setShowModal(false)
        startTransition(() => {
            submitReview(productId, ownerId)
        })
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                disabled={isPending}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? "Submitting..." : "I Have Reviewed It (+1 Respect)"}
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
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
                                className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-2.5 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Yes, I Reviewed It
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
