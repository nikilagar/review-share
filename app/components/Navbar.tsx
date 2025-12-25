'use client'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

export default function Navbar() {
    const { data: session } = useSession()
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <nav className="p-4 bg-white border-b flex justify-between items-center sticky top-0 z-50">
            <Link href="/" className="flex items-center gap-2 group">
                <img
                    src="/review-friendly-logo.png"
                    alt="Friendly Review Logo"
                    className="w-10 h-10 object-contain"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Friendly Review
                </span>
            </Link>
            <div className="flex gap-6 items-center">
                {session ? (
                    <>
                        <Link href="/market" className="text-gray-600 hover:text-blue-600 transition-colors">Market</Link>
                        <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">My Profile</Link>
                        {/* @ts-ignore - isPro added in auth callback */}
                        {!session.user?.isPro && (
                            <Link href="/pricing" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium hover:shadow-md transition-shadow flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                                </svg>
                                Go Pro
                            </Link>
                        )}
                        <div className="relative pl-4 border-l" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                    </div>
                                )}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-100">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                        </svg>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <button
                        onClick={() => signIn("google")}
                        className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium text-sm"
                    >
                        Sign In with Google
                    </button>
                )}
            </div>
        </nav>
    )
}
