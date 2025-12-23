'use client'
import { useEffect, useState } from 'react'

const testimonials = [
    {
        name: 'Alex Chen',
        role: 'Chrome Extension Developer',
        avatar: '👨‍💻',
        quote: 'Finally a fair way to get genuine reviews! Got 5 authentic reviews in my first week.',
        extension: 'TruthLens',
        rating: 5,
    },
    {
        name: 'Sarah Johnson',
        role: 'Indie Developer',
        avatar: '👩‍💻',
        quote: 'The respect system is brilliant. Quality reviews, quality community.',
        extension: 'AI Resume Tailor',
        rating: 5,
    },
    {
        name: 'Mike Rodriguez',
        role: 'Full-Stack Developer',
        avatar: '🧑‍💻',
        quote: 'Grew my extension from 200 to 2000+ users after getting featured here.',
        extension: 'Funny Reader',
        rating: 5,
    },
]



function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    )
}

export default function SocialProof() {
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="w-full py-16">
            {/* Chrome Web Store Badge */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className="w-5 h-5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-900">4.8</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">60+ reviews on Chrome Web Store</span>
                </div>
            </div>



            {/* Testimonials carousel */}
            <div className="max-w-2xl mx-auto">
                <div className="relative h-64 overflow-hidden">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.name}
                            className={`absolute inset-0 transition-all duration-500 ease-in-out ${index === activeIndex
                                ? 'opacity-100 translate-x-0'
                                : index < activeIndex
                                    ? 'opacity-0 -translate-x-full'
                                    : 'opacity-0 translate-x-full'
                                }`}
                        >
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-3xl">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-lg text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">For</span>
                                        <span className="text-sm font-medium text-blue-600">{testimonial.extension}</span>
                                    </div>
                                    <StarRating rating={testimonial.rating} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Carousel dots */}
                <div className="flex justify-center gap-2 mt-4">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === activeIndex
                                ? 'bg-blue-600 w-6'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
