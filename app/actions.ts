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
    const reviewer = await prisma.user.findUnique({ where: { id: session.user.id } });

    let respectIncrement = 1;
    if (reviewer) {
        const { validateProStatus } = await import("@/lib/billing");
        const isValidPro = await validateProStatus(reviewer);
        respectIncrement = isValidPro ? 2 : 1;
    }

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
            data: { respect: { increment: respectIncrement } }
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

export async function rewardShare() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return { success: false, error: "Not authenticated" };

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { respect: { increment: 1 } }
        })
        revalidatePath('/profile')
        return { success: true };
    } catch (error) {
        console.error("Failed to reward share:", error);
        return { success: false, error: "Failed to reward share" };
    }
}

export async function cancelSubscription() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return { success: false, error: "Not authenticated" };

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user?.dodoSubscriptionId) {
        return { success: false, error: "No active subscription found" };
    }

    try {
        const { dodo } = await import("@/lib/dodo")
        await dodo.subscriptions.update(user.dodoSubscriptionId, {
            cancel_at_next_billing_date: true
        });

        await prisma.user.update({
            where: { id: session.user.id },
            data: { cancelAtPeriodEnd: true }
        });

        revalidatePath('/billing')
        return { success: true };
    } catch (error: any) {
        console.error("Failed to cancel subscription:", error);
        return { success: false, error: error.message || "Failed to cancel subscription" };
    }
}
