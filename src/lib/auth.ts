// src/lib/auth.ts (Backend)
import { db } from "@/db/drizzle";
import { accounts, sessions, user, verificationTokens } from "@/db/schema/user";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import { admin } from "better-auth/plugins/admin";

export const auth = betterAuth({
    appName: 'DevBuilds Admin',
    // plugins: [
    //     admin({
    //         defaultRole: 'USER',
    //         adminRoles: ['ADMIN'],
    //     }),
    // ],
    socialProviders: {
        google: {
            prompt: 'select_account consent',
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: user,
            account: accounts,
            session: sessions,
            verification: verificationTokens,

        },
    }),
    user: {
        additionalFields: {
            role: { type: "string", defaultValue: "USER" }
        }
    },
    trustedOrigins: [
        'http://localhost:3000',
        "https://admin.devbuilds.in",
        "https://backend.devbuilds.in",
        "https://devbuilds.in",
    ],
    // advanced: {
    //     useSecureCookies: true,
    //     crossSubDomainCookies: {
    //         enabled: true,
    //         domain: ".devbuilds.in",
    //     },
    //     defaultCookieAttributes: {
    //         sameSite: "none",
    //         secure: true,
    //     }
    // },
});