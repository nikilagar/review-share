'use client'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"

export default function Navbar() {
    const { data: session } = useSession()

    return (
        <nav className="p-4 bg-white border-b flex justify-between items-center sticky top-0 z-50">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Review Share
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
                        <div className="flex items-center gap-3 pl-4 border-l">
                            {session.user?.image && (
                                <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
                            )}
                            <button
                                onClick={() => signOut()}
                                className="text-sm text-red-500 hover:text-red-700 font-medium"
                            >
                                Sign Out
                            </button>
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
