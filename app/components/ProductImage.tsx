'use client'

import { useState, useEffect, useRef } from 'react'

// Array of colorful gradient placeholders
const FALLBACK_GRADIENTS = [
    'from-blue-400 to-indigo-500',
    'from-purple-400 to-pink-500',
    'from-green-400 to-teal-500',
    'from-orange-400 to-red-500',
    'from-cyan-400 to-blue-500',
    'from-rose-400 to-purple-500',
    'from-amber-400 to-orange-500',
    'from-emerald-400 to-cyan-500',
]

interface ProductImageProps {
    src: string
    alt: string
    className?: string
}

export default function ProductImage({ src, alt, className = '' }: ProductImageProps) {
    const [hasError, setHasError] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)

    // Generate a consistent gradient based on the alt text (product name)
    const gradientIndex = alt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % FALLBACK_GRADIENTS.length
    const gradient = FALLBACK_GRADIENTS[gradientIndex]

    // Check if image is already broken on mount (handles SSR hydration case)
    useEffect(() => {
        const img = imgRef.current
        if (img && img.complete && img.naturalWidth === 0) {
            setHasError(true)
        }
    }, [src])

    if (hasError) {
        return (
            <div className={`bg-gradient-to-br ${gradient} flex items-center justify-center ${className}`}>
                <span className="text-white font-bold text-2xl">
                    {alt.charAt(0).toUpperCase()}
                </span>
            </div>
        )
    }

    return (
        <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={className}
            onError={() => setHasError(true)}
        />
    )
}
