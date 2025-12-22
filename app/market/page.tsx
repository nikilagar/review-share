
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
                email: { not: session.user.email }
            }
        },
        include: {
            owner: {
                select: { name: true, respect: true }
            }
        }
    })

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Market</h1>
                    <p className="text-gray-500">Review products to earn respect</p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-700">No products available to review right now.</h3>
                        <p className="text-gray-500 mt-2">Come back later or add your own product!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
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
