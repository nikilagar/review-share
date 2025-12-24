'use client'

import { useState } from "react"

// Validate Chrome Web Store URL format
// Expected: https://chromewebstore.google.com/detail/{name}/{id}
const CHROME_STORE_PATTERN = /^https:\/\/chromewebstore\.google\.com\/detail\/[^\/]+\/[a-z]{32}(\?.*)?$/i;

interface AddProductFormProps {
    createProduct: (formData: FormData) => Promise<{ error?: string; success?: boolean } | void>
}

export default function AddProductForm({ createProduct }: AddProductFormProps) {
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [nameCount, setNameCount] = useState(0)
    const [descCount, setDescCount] = useState(0)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
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
            if (result && result.error) {
                setError(result.error)
            } else {
                // Reset form on success
                form.reset()
                setNameCount(0)
                setDescCount(0)
            }
        } catch (err) {
            console.error("Client-side error during product creation:", err);
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span className="text-xs text-gray-400 font-normal ml-1">({nameCount}/50)</span>
                    </label>
                    <input
                        name="name"
                        type="text"
                        required
                        maxLength={50}
                        onChange={(e) => setNameCount(e.target.value.length)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="My Awesome Extension"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
                    <input
                        name="chromeStoreUrl"
                        type="url"
                        required
                        maxLength={1000}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://chromewebstore.google.com/detail/..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        e.g. https://chromewebstore.google.com/detail/extension-name/abcdefghijklmnopqrstuvwxyz123456
                    </p>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-xs text-gray-400 font-normal ml-1">({descCount}/300)</span>
                </label>
                <textarea
                    name="description"
                    required
                    maxLength={300}
                    onChange={(e) => setDescCount(e.target.value.length)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    placeholder="Describe what your extension does..."
                ></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL (128x128)</label>
                <input
                    name="iconUrl"
                    type="url"
                    required
                    maxLength={1000}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://example.com/icon.png"
                />
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
