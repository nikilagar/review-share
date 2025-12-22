'use server'

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { verifyReview } from "@/lib/scraper"

export async function submitReview(productId: string, ownerId: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return;

    // Check if already reviewed (optional validation)
    const existing = await prisma.review.findFirst({
        where: {
            productId,
            userId: session.user.id
        }
    })

    if (existing) {
        // Already reviewed
        return;
    }

    // 4. Verify Review
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return;

    const isVerified = await verifyReview(product.chromeStoreUrl, session.user.name || "");

    if (!isVerified) {
        // Create Suspect Entry
        await prisma.suspect.create({
            data: {
                userId: session.user.id,
                productId,
                productUrl: product.chromeStoreUrl,
                name: session.user.name || "Unknown",
                email: session.user.email,
                status: "PENDING"
            }
        });

        // Return failure status instead of error throwing
        return {
            success: false,
            verified: false,
            message: "Verification Failed. We could not find your review. This attempt has been flagged."
        };
    }

    // Transaction to ensure data consistency
    await prisma.$transaction([
        // 1. Create Review
        prisma.review.create({
            data: {
                productId,
                userId: session.user.id,
                verified: true
            }
        }),
        // 2. Increment Reviewer Respect
        prisma.user.update({
            where: { id: session.user.id },
            data: { respect: { increment: 1 } }
        }),
        // 3. Decrement Owner Respect
        prisma.user.update({
            where: { id: ownerId },
            data: { respect: { decrement: 1 } }
        })
    ])

    // revalidatePath('/') // Removed to prevent UI unmount
    return { success: true, verified: true };
}
