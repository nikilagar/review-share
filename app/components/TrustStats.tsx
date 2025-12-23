'use client'
import { useEffect, useRef, useState } from 'react'

interface StatItem {
    icon: string
    value: number
    suffix: string
    label: string
    prefix?: string
}

const stats: StatItem[] = [
    { icon: '👨‍💻', value: 100, suffix: '+', label: 'Developers Satisfied' },
    { icon: '⭐', value: 60, suffix: '+', label: 'Reviews Exchanged' },
    { icon: '🏆', value: 4.8, suffix: '', label: 'Average Rating', prefix: '' },
]

function AnimatedCounter({
    value,
    suffix,
    prefix = '',
    isVisible
}: {
    value: number
    suffix: string
    prefix?: string
    isVisible: boolean
}) {
    const [count, setCount] = useState(0)
    const isDecimal = value % 1 !== 0

    useEffect(() => {
        if (!isVisible) return

        const duration = 2000
        const steps = 60
        const increment = value / steps
        let current = 0

        const timer = setInterval(() => {
            current += increment
            if (current >= value) {
                setCount(value)
                clearInterval(timer)
            } else {
                setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current))
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [isVisible, value, isDecimal])

    return (
        <span className="tabular-nums">
            {prefix}{isDecimal ? count.toFixed(1) : count.toLocaleString()}{suffix}
        </span>
    )
}

export default function TrustStats() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.2 }
        )

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={containerRef}
            className="w-full py-16"
        >
            <div className="text-center mb-10">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                    Trusted by the Community
                </p>
                <h2 className="text-3xl font-bold text-gray-900">
                    Join thousands of developers
                </h2>
            </div>

            <div className="grid grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                    <div
                        key={stat.label}
                        className={`text-center p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                        style={{
                            transitionDelay: `${index * 100}ms`,
                            transitionProperty: 'opacity, transform, box-shadow'
                        }}
                    >
                        <div className="text-4xl mb-3">{stat.icon}</div>
                        <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                            <AnimatedCounter
                                value={stat.value}
                                suffix={stat.suffix}
                                prefix={stat.prefix}
                                isVisible={isVisible}
                            />
                        </div>
                        <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
