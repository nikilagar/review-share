
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import AddProductForm from "./AddProductForm"
import ProductImage from "@/app/components/ProductImage"

// Validate Chrome Web Store URL format
// Expected: https://chromewebstore.google.com/detail/{name}/{id}
const CHROME_STORE_PATTERN = /^https:\/\/chromewebstore\.google\.com\/detail\/[^\/]+\/[a-z]{32}(\?.*)?$/i;

async function createProduct(formData: FormData): Promise<{ error?: string; success?: boolean } | void> {
    'use server'
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return { error: "Not authenticated" };

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const chromeStoreUrl = formData.get("chromeStoreUrl") as string
    const iconUrl = formData.get("iconUrl") as string

    if (!name || !description || !chromeStoreUrl || !iconUrl) {
        return { error: "All fields are required" };
    }

    // Length Validations
    if (name.length > 50) return { error: "Name must be 50 characters or less" };
    if (description.length > 300) return { error: "Description must be 300 characters or less" };
    if (chromeStoreUrl.length > 1000) return { error: "Store URL is too long" };
    if (iconUrl.length > 1000) return { error: "Icon URL is too long" };

    // Server-side validation of Chrome Web Store URL
    if (!CHROME_STORE_PATTERN.test(chromeStoreUrl)) {
        return { error: "Invalid Chrome Web Store URL format" };
    }

    // Extract Extension ID
    // Pattern matches /detail/name/id
    const parts = chromeStoreUrl.split('/');
    const idWithParams = parts[parts.length - 1]; // "abcdef...?hl=en"
    const extensionId = idWithParams.split('?')[0];

    if (!extensionId || extensionId.length !== 32) {
        return { error: "Could not extract valid Extension ID" };
    }

    try {
        console.log("[createProduct] Creating product:", { name, extensionId });
        await prisma.product.create({
            data: {
                name,
                description,
                chromeStoreUrl,
                extensionId,
                iconUrl,
                owner: { connect: { email: session.user.email } }
            }
        })
        console.log("[createProduct] Product created successfully");
        revalidatePath('/profile')
        return { success: true };
    } catch (e: any) {
        if (e.code === 'P2002') {
            return { error: "This extension has already been added to the platform." };
        }
        // Log other errors
        console.error("Failed to create product:", e);
        return { error: "An unexpected error occurred while creating the product." };
    }
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
                <div className={`bg-white p-6 rounded-xl shadow-sm border ${user.isPro ? 'border-indigo-400 ring-2 ring-indigo-400' : 'border-gray-100'} flex items-center justify-between relative`}>
                    {user.isPro && (
                        <div className="absolute -top-3 left-6 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                            </svg>
                            <span>PRO</span>
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Respect</div>
                        <div className="text-4xl font-extrabold text-blue-600">{user.respect}</div>
                    </div>
                </div>

                {/* Pro Upgrade CTA (for non-Pro users) */}
                {!user.isPro && (
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-sm text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                                    </svg>
                                    Upgrade to Pro
                                </h2>
                                <p className="text-white/90 mt-1">Get 2x respect, pinned products, and a Pro badge!</p>
                            </div>
                            <a href="/pricing" className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-colors">
                                $4.99/week
                            </a>
                        </div>
                    </div>
                )}

                {/* Add Product Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Add Your Product</h2>
                    <AddProductForm createProduct={createProduct} userRespect={user.respect} />
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
                                    <ProductImage src={product.iconUrl} alt={product.name} className="w-16 h-16 rounded-lg object-contain bg-gray-50" />
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
