
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
            // Check if user is banned
            const dbUser = await prisma.user.findUnique({
                where: { email: user.email || "" }
            })
            if (dbUser && dbUser.isBanned) {
                return false; // Block login
            }
            return true;
        },
        session: async ({ session, user }) => {
            if (session?.user) {
                // @ts-ignore
                if (user.isBanned) {
                    // @ts-ignore
                    session.user = null; // Invalidate user
                    return session;
                }
                session.user.id = user.id;
            }
            return session;
        },
    },
}
