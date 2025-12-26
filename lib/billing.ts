import { prisma } from "./prisma";

export async function validateProStatus(user: { id: string; isPro: boolean; subscriptionExpiresAt: Date | null }) {
    if (!user.isPro) return false;

    if (user.subscriptionExpiresAt && new Date() > user.subscriptionExpiresAt) {
        // Subscription has expired
        try {
            await prisma.user.update({
                where: { id: user.id },
                data: { isPro: false }
            });
            console.log(`User ${user.id} subscription expired and status updated to false.`);
            return false;
        } catch (error) {
            console.error(`Failed to update expired subscription for user ${user.id}:`, error);
            // Even if update fails, we should treat them as non-pro for the current request
            return false;
        }
    }

    return true;
}
