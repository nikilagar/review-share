'use client'

import React from 'react'

interface PostShareDialogProps {
    isOpen: boolean
    onClose: () => void
    userRespect: number
    productName: string
}

export default function PostShareDialog({ isOpen, onClose, userRespect, productName }: PostShareDialogProps) {
    if (!isOpen) return null

    const isFeatured = userRespect > 0

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in-05 slide-in-from-bottom-4 duration-300">
                {/* Success Icon */}
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-10 h-10 text-green-600 animate-in zoom-in duration-500 delay-150"
                    >
                        <path
                            fillRule="evenodd"
                            d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Product Added!
                </h2>

                <p className="text-gray-600 mb-8 text-lg">
                    <span className="font-semibold text-gray-900">{productName}</span> has been successfully added to your profile.
                </p>

                {/* Conditional Featured Section */}
                {isFeatured ? (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-6 mb-8 transform hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl mb-3 animate-bounce">🚀✨</div>
                        <h3 className="text-lg font-bold text-indigo-900 mb-1">
                            Featured in Market!
                        </h3>
                        <p className="text-indigo-700 text-sm">
                            Since you have <span className="font-bold">{userRespect} respect</span>, your product is now live and featured for others to review.
                        </p>
                        <p className="text-red-600 text-xs mt-3 bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-2 text-left">
                            <span className="text-lg">⚠️</span>
                            <span>
                                <strong>Important:</strong> It will be removed from the market if your respect drops to 0. (Your respect decreases when someone reviews your extension).
                            </span>
                        </p>
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                        <div className="text-4xl mb-3 grayscale opacity-70">🔒</div>
                        <h3 className="text-lg font-bold text-gray-700 mb-1">
                            Not Yet Featured
                        </h3>
                        <p className="text-gray-600 text-sm">
                            You need <span className="font-bold text-gray-900">Respect {'>'} 0</span> to be featured in the market. Review other products to earn respect!
                        </p>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                    Awesome, Let's Go!
                </button>
            </div>
        </div>
    )
}
