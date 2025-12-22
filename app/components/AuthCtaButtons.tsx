'use client'

import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AuthCtaButtons() {
    const { data: session } = useSession()
    const router = useRouter()

    const handleAction = (path: string) => {
        if (!session) {
            signIn("google", { callbackUrl: path })
        } else {
            router.push(path)
        }
    }

    return (
        <div className="flex gap-4 justify-center pt-4">
            <button
                onClick={() => handleAction('/market')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
            >
                Browse Market
            </button>
            <button
                onClick={() => handleAction('/profile')}
                className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors border border-gray-200"
            >
                Share Your Product
            </button>
        </div>
    )
}
