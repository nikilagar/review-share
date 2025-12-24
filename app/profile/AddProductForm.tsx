'use client'

import { useState } from "react"

// Validate Chrome Web Store URL format
// Expected: https://chromewebstore.google.com/detail/{name}/{id}
const CHROME_STORE_PATTERN = /^https:\/\/chromewebstore\.google\.com\/detail\/[^\/]+\/[a-z]{32}(\?.*)?$/i;

interface AddProductFormProps {
    createProduct: (formData: FormData) => Promise<{ error?: string } | void>
}

export default function AddProductForm({ createProduct }: AddProductFormProps) {
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        const chromeStoreUrl = formData.get("chromeStoreUrl") as string

        // Client-side validation
        if (!CHROME_STORE_PATTERN.test(chromeStoreUrl)) {
            setError("Invalid Chrome Web Store URL. Expected format: https://chromewebstore.google.com/detail/{extension-name}/{extension-id}")
            setIsSubmitting(false)
            return
        }

        try {
            const result = await createProduct(formData)
            if (result?.error) {
                setError(result.error)
            } else {
                // Reset form on success
                e.currentTarget.reset()
            }
        } catch (err) {
            setError("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input name="name" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="My Awesome Extension" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
                    <input
                        name="chromeStoreUrl"
                        type="url"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://chromewebstore.google.com/detail/..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        e.g. https://chromewebstore.google.com/detail/extension-name/abcdefghijklmnopqrstuvwxyz123456
                    </p>
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
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Adding..." : "Add Product"}
            </button>
        </form>
    )
}
