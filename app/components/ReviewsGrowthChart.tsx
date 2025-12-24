'use client'
import { useEffect, useRef, useState } from 'react'

// Data points showing growth in 2024
const dataPoints = [
    { month: 'Jan 24', reviews: 4 },
    { month: 'Feb 24', reviews: 9 },
    { month: 'Mar 24', reviews: 15 },
    { month: 'Apr 24', reviews: 21 },
    { month: 'May 24', reviews: 28 },
    { month: 'Jun 24', reviews: 34 },
    { month: 'Jul 24', reviews: 40 },
    { month: 'Aug 24', reviews: 46 },
    { month: 'Sep 24', reviews: 51 },
    { month: 'Oct 24', reviews: 55 },
    { month: 'Nov 24', reviews: 59 },
    { month: 'Dec 24', reviews: 63 },
]

const milestones = [
    { reviews: 20, label: '20 reviews' },
    { reviews: 40, label: '40 reviews' },
    { reviews: 60, label: '60+ reviews' },
]

export default function ReviewsGrowthChart() {
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
            { threshold: 0.3 }
        )

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => observer.disconnect()
    }, [])

    // Chart dimensions
    const width = 700
    const height = 300
    const padding = { top: 40, right: 30, bottom: 50, left: 60 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    const maxReviews = Math.max(...dataPoints.map(d => d.reviews))

    // Generate SVG path
    const points = dataPoints.map((d, i) => {
        const x = padding.left + (i / (dataPoints.length - 1)) * chartWidth
        const y = padding.top + chartHeight - (d.reviews / maxReviews) * chartHeight
        return { x, y, ...d }
    })

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`

    // Calculate path length for animation
    const pathLength = 1500 // Approximate

    return (
        <div
            ref={containerRef}
            className="w-full py-16 bg-gradient-to-b from-gray-50 to-white"
        >
            <div className="text-center mb-10">
                <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-2">
                    Growing Every Day
                </p>
                <h2 className="text-3xl font-bold text-gray-900">
                    Watch our community thrive
                </h2>
            </div>

            <div className="flex justify-center">
                <div className="relative overflow-hidden">
                    <svg
                        viewBox={`0 0 ${width} ${height}`}
                        className="w-full max-w-3xl h-auto"
                        style={{ minHeight: '250px' }}
                    >
                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.02" />
                            </linearGradient>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgb(37, 99, 235)" />
                                <stop offset="100%" stopColor="rgb(147, 51, 234)" />
                            </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                            <line
                                key={ratio}
                                x1={padding.left}
                                y1={padding.top + chartHeight * (1 - ratio)}
                                x2={padding.left + chartWidth}
                                y2={padding.top + chartHeight * (1 - ratio)}
                                stroke="#e5e7eb"
                                strokeWidth="1"
                            />
                        ))}

                        {/* Y-axis labels */}
                        {[0, 20, 40, 60, 80].map((value, i) => (
                            <text
                                key={value}
                                x={padding.left - 10}
                                y={padding.top + chartHeight - (value / maxReviews) * chartHeight}
                                textAnchor="end"
                                alignmentBaseline="middle"
                                className="text-xs fill-gray-400"
                            >
                                {value}
                            </text>
                        ))}

                        {/* X-axis labels */}
                        {points.filter((_, i) => i % 3 === 0).map((p) => (
                            <text
                                key={p.month}
                                x={p.x}
                                y={height - 15}
                                textAnchor="middle"
                                className="text-xs fill-gray-400"
                            >
                                {p.month}
                            </text>
                        ))}

                        {/* Animated area fill */}
                        <path
                            d={areaPath}
                            fill="url(#areaGradient)"
                            className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                        />

                        {/* Animated line */}
                        <path
                            d={linePath}
                            fill="none"
                            stroke="url(#lineGradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                strokeDasharray: pathLength,
                                strokeDashoffset: isVisible ? 0 : pathLength,
                                transition: 'stroke-dashoffset 2s ease-out',
                            }}
                        />

                        {/* Data points */}
                        {points.map((p, i) => (
                            <circle
                                key={i}
                                cx={p.x}
                                cy={p.y}
                                r="4"
                                fill="white"
                                stroke="rgb(59, 130, 246)"
                                strokeWidth="2"
                                className={`transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                                style={{ transitionDelay: `${1500 + i * 50}ms` }}
                            />
                        ))}

                        {/* Milestone annotations */}
                        {milestones.map((m) => {
                            const point = points.find(p => p.reviews >= m.reviews)
                            if (!point) return null
                            return (
                                <g key={m.label} className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '2s' }}>
                                    <circle cx={point.x} cy={point.y} r="6" fill="rgb(147, 51, 234)" />
                                    <rect
                                        x={point.x - 40}
                                        y={point.y - 28}
                                        width="80"
                                        height="20"
                                        rx="4"
                                        fill="rgb(147, 51, 234)"
                                    />
                                    <text
                                        x={point.x}
                                        y={point.y - 15}
                                        textAnchor="middle"
                                        className="text-xs fill-white font-medium"
                                    >
                                        {m.label}
                                    </text>
                                </g>
                            )
                        })}
                    </svg>
                </div>
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
                Cumulative reviews exchanged through Friendly Review in 2024
            </p>
        </div>
    )
}
