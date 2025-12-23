import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from 'crypto';

export async function POST(req: Request) {
    const body = await req.json(); // Dodo sends JSON body
    const headersList = await headers();
    const signature = headersList.get("webhook-signature") || headersList.get("x-dodo-signature");

    console.log("Webhook received:", JSON.stringify(body, null, 2));
    console.log("Webhook signature:", signature);

    // Temporarily skip signature verification for testing
    // TODO: Enable signature verification in production
    /*
    if (!signature) {
        return new NextResponse("Missing signature", { status: 400 });
    }
    */

    // Verify signature (Generic HMAC verification for Dodo if SDK doesn't have a helper yet or for manual control)
    // NOTE: In production, verify this against DODO_PAYMENTS_WEBHOOK_ID/SECRET
    // For now, assuming Dodo SDK might have a verification utility, but standard HMAC is safe.
    /*
    const generatedSignature = crypto
      .createHmac('sha256', process.env.DODO_PAYMENTS_WEBHOOK_SECRET!)
      .update(JSON.stringify(body))
      .digest('hex');
  
    if (generatedSignature !== signature) {
        return new NextResponse("Invalid signature", { status: 400 });
    }
    */

    const event = body;

    try {
        if (event.type === "payment.succeeded" || event.type === "subscription.active") {
            const metadata = event.data.metadata;

            if (metadata?.userId) {
                // Calculate expiration based on event content if available, or default to 1 week
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 7);

                await prisma.user.update({
                    where: {
                        id: metadata.userId,
                    },
                    data: {
                        isPro: true,
                        subscriptionExpiresAt: expiresAt,
                    },
                });
            }
        }
    } catch (error) {
        console.error("Webhook processing error:", error);
        return new NextResponse("Server Error", { status: 500 });
    }

    return new NextResponse("Webhook Received", { status: 200 });
}
