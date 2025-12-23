
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import Link from "next/link"

export default async function MarketPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) redirect("/") // Simple protection

    const products = await prisma.product.findMany({
        where: {
            owner: {
                respect: { gt: 0 },
                email: { not: session.user.email },
                isBanned: false
            }
        },
        include: {
            owner: {
                select: { name: true, respect: true, isPro: true }
            }
        },
        orderBy: [
            { owner: { isPro: 'desc' } }, // Pro users first
            { createdAt: 'desc' } // Then newest
        ]
    })

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Market</h1>
                    <p className="text-gray-500 text-lg">Review products to earn respect</p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-700">No products available to review right now.</h3>
                        <p className="text-gray-500 mt-2">Come back later or add your own product!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <div key={product.id} className={`bg-white rounded-xl shadow-sm border ${product.owner.isPro ? 'border-yellow-400 ring-1 ring-yellow-400' : 'border-gray-100'} p-6 flex flex-col h-full hover:shadow-md transition-shadow relative`}>
                                {product.owner.isPro && (
                                    <div className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                            <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                                        </svg>
                                        <span>PRO</span>
                                    </div>
                                )}
                                <div className="flex items-start justify-between mb-4">
                                    <img src={product.iconUrl} alt={product.name} className="w-16 h-16 rounded-lg object-contain bg-gray-50" />
                                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                                        Owner Respect: {product.owner.respect}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {product.description}
                                </p>
                                <div className="mt-auto pt-4 border-t">
                                    <Link
                                        href={`/market/${product.id}`}
                                        className="block w-full text-center py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                                    >
                                        Review This
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
