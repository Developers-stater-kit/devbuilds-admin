import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL!,
    plugins: [
        adminClient(),
    ],
    fetchOptions: {
        credentials: "include",
    },
})

export const {
    signIn,
    signOut,
    useSession,
} = authClient;


export async function GetAdmin() {
    try {
        const session = useSession();

        if (session?.data?.user.role === "ADMIN") {
            return { isAdmin: true, user: session.data.user };
        }

        return { isAdmin: false, user: null };
    } catch (error) {
        return { isAdmin: false, user: null };
    }
}

