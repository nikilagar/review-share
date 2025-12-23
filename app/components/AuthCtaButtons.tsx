'use client'

import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

interface AuthCtaButtonsProps {
    variant?: 'light' | 'dark'
}

export default function AuthCtaButtons({ variant = 'light' }: AuthCtaButtonsProps) {
    const { data: session } = useSession()
    const router = useRouter()

    const handleAction = (path: string) => {
        if (!session) {
            signIn("google", { callbackUrl: path })
        } else {
            router.push(path)
        }
    }

    const primaryClasses = variant === 'dark'
        ? "px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
        : "px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"

    const secondaryClasses = variant === 'dark'
        ? "px-8 py-3 bg-transparent text-white rounded-lg font-semibold hover:bg-white/10 transition-colors border border-white/30"
        : "px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors border border-gray-200"

    return (
        <div className="flex gap-4 justify-center pt-4">
            <button
                onClick={() => handleAction('/market')}
                className={primaryClasses}
            >
                Browse Market
            </button>
            <button
                onClick={() => handleAction('/profile')}
                className={secondaryClasses}
            >
                Share Your Product
            </button>
        </div>
    )
}
