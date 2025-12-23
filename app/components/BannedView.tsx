'use client'

import { signOut } from "next-auth/react"

export default function BannedView() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Suspended</h1>
                    <p className="text-gray-600 text-lg">
                        Your account has been flagged for violating our community guidelines regarding review verification.
                    </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="text-red-800 font-medium">
                        If you believe this is a mistake, please contact us:
                    </p>
                    <a href="mailto:contact@friendlyreview.com" className="text-red-700 font-bold underline hover:text-red-900 mt-1 block">
                        contact@friendlyreview.com
                    </a>
                </div>

                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-500/20"
                >
                    Sign Out
                </button>
            </div>
        </div>
    )
}
