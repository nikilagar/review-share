
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import ReviewButton from "./ReviewButton"

export default async function ReviewPage({ params }: { params: Promise<{ productId: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/")

    const { productId } = await params
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { owner: true }
    })

    if (!product) {
        return <div>Product not found</div>
    }

    // Check if already reviewed
    const hasReviewed = await prisma.review.findFirst({
        where: {
            productId: product.id,
            userId: session.user.id
        }
    })

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full text-center space-y-6">
                <img src={product.iconUrl} alt={product.name} className="w-24 h-24 mx-auto rounded-xl object-contain" />

                <div>
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-gray-500 mt-2">{product.description}</p>
                </div>

                <div className="py-6 border-t border-b border-gray-100 flex flex-col gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm">
                        <strong>Step 1:</strong> Visit the Chrome Web Store and install/review the extension.
                    </div>
                    <a
                        href={product.chromeStoreUrl}
                        target="_blank"
                        className="inline-block w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Open in Chrome Web Store
                    </a>
                </div>

                <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg text-green-800 text-sm">
                        <strong>Step 2:</strong> Confirm you have reviewed it to earn +1 Respect.
                    </div>

                    {hasReviewed ? (
                        <div className="p-4 bg-gray-100 rounded-lg text-gray-600 font-semibold">
                            You have already reviewed this product.
                        </div>
                    ) : (
                        <ReviewButton productId={product.id} ownerId={product.owner.id} />
                    )}
                </div>

                <Link href="/market" className="block text-gray-400 hover:text-gray-600 text-sm">Cancel</Link>
            </div>
        </main>
    )
}
