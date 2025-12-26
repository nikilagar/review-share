
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        signIn: async ({ user }) => {
            // Allow login even if banned, so we can show the "Banned" screen
            return true;
        },
        session: async ({ session, user }) => {
            if (session?.user) {
                const { validateProStatus } = await import("./billing");

                session.user.id = user.id;
                // @ts-ignore
                session.user.isBanned = user.isBanned;

                // Validate and update Pro status if expired
                // @ts-ignore
                const isValidPro = await validateProStatus({
                    id: user.id,
                    // @ts-ignore
                    isPro: user.isPro,
                    // @ts-ignore
                    subscriptionExpiresAt: user.subscriptionExpiresAt
                });

                session.user.isPro = isValidPro;
            }
            return session;
        },
    },
}
