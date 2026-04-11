import { pgTable, uuid, text, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user",{
    id: text('id').notNull().primaryKey(),
    email: text('email').notNull(),
    emailVerified: boolean('email_verified').notNull().default(false),

    name: text('name').notNull(),
    role: text('role').default('user'),
    image: text('image'),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})


// The accounts table for social logins and authentication
export const accounts = pgTable('account', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),    
    providerId: text('provider_id').notNull(),
    accountId: text('account_id').notNull(),
    idToken: text('id_token'),
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    // password: text('password'),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// The sessions table
export const sessions = pgTable('session', {
    id: text('id').notNull().primaryKey(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    token: text('token').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),

    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// The verification tokens table
export const verificationTokens = pgTable('verification_token', {
  id: text('id').notNull().primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});