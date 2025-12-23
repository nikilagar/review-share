import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { dodo } from "@/lib/dodo";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Create a payment link or session
        // Dodo Payments API for creating a session
        console.log("Dodo Debug:", {
            env: process.env.NODE_ENV,
            keyPrefix: process.env.DODO_PAYMENTS_API_KEY?.substring(0, 5),
            productId: process.env.DODO_PRODUCT_ID
        });

        // For recurring products, use subscriptions.create
        const subscription = await dodo.subscriptions.create({
            billing: {
                city: "San Francisco",
                country: "US",
                street: "123 Main St",
                zipcode: "94105",
                state: "CA",
            },
            customer: {
                email: session.user.email,
                name: session.user.name || "Customer",
            },
            product_id: process.env.DODO_PRODUCT_ID!,
            quantity: 1,
            payment_link: true,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?success=true`,
            metadata: {
                userId: session.user.id,
            },
        });

        return NextResponse.json({ url: subscription.payment_link });
    } catch (error: any) {
        console.error("[DODO_CHECKOUT]", error);
        const message = error?.status === 401
            ? "Authentication Failed. Check DODO_PAYMENTS_API_KEY."
            : (error.message || "Internal Server Error");
        return NextResponse.json({ error: message }, { status: error?.status || 500 });
    }
}
