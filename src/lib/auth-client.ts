import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export const authClient = createAuthClient({
    baseURL: BACKEND_URL,
    plugins: [
        adminClient(),
    ],
    fetchOptions: {
        credentials: "include", // IMPORTANT → send cookies across subdomains
    },
})

export const {
    signIn,
    signOut,
    useSession,
} = authClient;


export async function GetAdmin() {
    try {
        const session = await authClient.getSession();

        if (session?.data?.user.role === "ADMIN") {
            return { isAdmin: true, user: session.data.user };
        }

        return { isAdmin: false, user: null };
    } catch (error) {
        return { isAdmin: false, user: null };
    }
}

