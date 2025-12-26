
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string
            isBanned: boolean
            isPro: boolean
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        isBanned: boolean
        isPro: boolean
        subscriptionExpiresAt: Date | null
        dodoSubscriptionId: string | null
    }
}
