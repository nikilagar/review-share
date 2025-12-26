'use client'

import React, { useState } from 'react'
import { rewardShare } from '../actions'

interface PostShareDialogProps {
    isOpen: boolean
    onClose: () => void
    userRespect: number
    productName: string
}

export default function PostShareDialog({ isOpen, onClose, userRespect, productName }: PostShareDialogProps) {
    const [isSharing, setIsSharing] = useState(false)
    const [rewardClaimed, setRewardClaimed] = useState(false)

    if (!isOpen) return null

    const isFeatured = userRespect > 0

    const handleShareOnX = async () => {
        setIsSharing(true)
        const text = encodeURIComponent(`Just listed ${productName} on @ReviewShare! 🚀\n\nIf you're a Chrome extension developer, come exchange reviews with us and build trust faster.\n\n#buildinpublic #chromeextensions #indiehacker`)
        const url = encodeURIComponent('https://friendlyreview.com') // Or specific product URL if available
        const xUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`

        window.open(xUrl, '_blank')

        // Reward the user
        if (!rewardClaimed) {
            try {
                const res = await rewardShare()
                if (res?.success) {
                    setRewardClaimed(true)
                }
            } catch (err) {
                console.error("Failed to reward share:", err)
            }
        }
        setIsSharing(false)
    }

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

                <p className="text-gray-600 mb-6 text-lg">
                    <span className="font-semibold text-gray-900">{productName}</span> has been successfully added to your profile.
                </p>

                {/* Viral Share Reward */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
                    <p className="text-blue-800 text-sm font-medium mb-3">
                        🚀 Spread the word & rank higher!
                    </p>
                    <button
                        onClick={handleShareOnX}
                        disabled={isSharing || rewardClaimed}
                        className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold transition-all shadow-sm ${rewardClaimed
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] active:scale-[0.98]'
                            }`}
                    >
                        {rewardClaimed ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                                </svg>
                                Respect Received! (+1)
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                </svg>
                                Share on X for +1 Respect
                            </>
                        )}
                    </button>
                    {!rewardClaimed && (
                        <p className="text-[10px] text-blue-400 mt-2 uppercase tracking-wider font-bold">
                            One-time bonus per product
                        </p>
                    )}
                </div>

                {/* Conditional Featured Section */}
                {isFeatured ? (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5 mb-8">
                        <h3 className="text-base font-bold text-indigo-900 mb-1">
                            Live in Market
                        </h3>
                        <p className="text-indigo-700 text-xs text-balance">
                            Maintain <span className="font-bold">{'>'} 0 respect</span> to stay featured.
                            <br />
                            <span className="opacity-80 mt-1 block">Respect decreases when you receive a review.</span>
                        </p>
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
                        <h3 className="text-base font-bold text-gray-700 mb-1">
                            Not Yet Featured
                        </h3>
                        <p className="text-gray-600 text-xs text-balance">
                            You need <span className="font-bold text-gray-900">Respect {'>'} 0</span> to be featured. Review products or share this to earn respect!
                        </p>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                    Done
                </button>
            </div>
        </div>
    )
}
