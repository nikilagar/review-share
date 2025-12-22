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
