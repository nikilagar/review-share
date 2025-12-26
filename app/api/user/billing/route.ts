import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            isPro: true,
            subscriptionExpiresAt: true,
            dodoSubscriptionId: true,
            cancelAtPeriodEnd: true
        }
    });

    if (user) {
        const { validateProStatus } = await import("@/lib/billing");
        user.isPro = await validateProStatus(user);
    }

    return NextResponse.json(user);
}
