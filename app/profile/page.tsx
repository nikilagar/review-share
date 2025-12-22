
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

async function createProduct(formData: FormData) {
    'use server'
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return;

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const chromeStoreUrl = formData.get("chromeStoreUrl") as string
    const iconUrl = formData.get("iconUrl") as string

    if (!name || !description || !chromeStoreUrl || !iconUrl) {
        // Basic validation
        return;
    }

    await prisma.product.create({
        data: {
            name,
            description,
            chromeStoreUrl,
            iconUrl,
            owner: { connect: { email: session.user.email } }
        }
    })
    revalidatePath('/profile')
}

async function deleteProduct(productId: string) {
    'use server'
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return;

    // Verify ownership
    const product = await prisma.product.findUnique({
        where: { id: productId }
    })

    if (product?.userId === session.user.id) {
        await prisma.product.delete({
            where: { id: productId }
        })
        revalidatePath('/profile')
    }
}

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
        include: { products: true }
    })

    if (!user) return <div>User not found</div>

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Stats */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Respect</div>
                        <div className="text-4xl font-extrabold text-blue-600">{user.respect}</div>
                    </div>
                </div>

                {/* Add Product Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Add Your Product</h2>
                    <form action={createProduct} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input name="name" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="My Awesome Extension" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
                                <input name="chromeStoreUrl" type="url" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://chrome.google.com/webstore/..." />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea name="description" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={3} placeholder="Describe what your extension does..."></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL (128x128)</label>
                            <input name="iconUrl" type="url" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://example.com/icon.png" />
                        </div>
                        <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                            Add Product
                        </button>
                    </form>
                </div>

                {/* My Products List */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Your Products</h2>
                    {user.products.length === 0 ? (
                        <div className="text-gray-500 text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                            No products added yet. Share one to start earning reviews!
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {user.products.map(product => (
                                <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                                    <img src={product.iconUrl} alt={product.name} className="w-16 h-16 rounded-lg object-contain bg-gray-50" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg">{product.name}</h3>
                                            <form action={deleteProduct.bind(null, product.id)}>
                                                <button className="text-red-500 text-sm hover:underline">Delete</button>
                                            </form>
                                        </div>
                                        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                                        <a href={product.chromeStoreUrl} target="_blank" className="text-blue-500 text-xs mt-1 inline-block hover:underline">View on Store</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
