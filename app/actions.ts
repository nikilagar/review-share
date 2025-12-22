'use server'

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

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

    // Transaction to ensure data consistency
    await prisma.$transaction([
        // 1. Create Review
        prisma.review.create({
            data: {
                productId,
                userId: session.user.id,
                verified: true // Simulated
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

    revalidatePath('/') // Revalidate everything just in case
    redirect('/market') // Go back to market to find more products
}
