import { z } from "zod";

export const composeSchema = z.object({
    framework: z.string().min(1), // uniqueKey for framework
    isShadcn: z.boolean(),
    setupUpto: z.enum(["framework", "auth", "db-orm", "payments"]),

    dbEngine: z.string().optional(),
    dbProvider: z.string().optional(),
    orm: z.string().min(1).optional(),

    authLib: z.string().min(1).optional(), // uniqueKey for  Auth Provider
    authMethods: z.array(z.enum(["email", "social", "otp"])).optional(),
    socialProviders: z.array(z.enum(["google", "github", "custom"])).optional(),
    paymentProvider: z.string().optional(),
});

export type ComposeInput = z.infer<typeof composeSchema>;