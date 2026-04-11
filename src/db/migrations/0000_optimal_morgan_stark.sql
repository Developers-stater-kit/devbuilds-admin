-- 1. Create Enums only if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feature_type') THEN
        CREATE TYPE "public"."feature_type" AS ENUM('AUTHENTICATION', 'DATABASE', 'PAYMENTS');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN
        CREATE TYPE "public"."status" AS ENUM('ACTIVE', 'INACTIVE', 'DEPRECATED', 'PENDING');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'scope') THEN
        CREATE TYPE "public"."scope" AS ENUM('FRONTEND', 'BACKEND', 'FULLSTACK');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pricing_type') THEN
        CREATE TYPE "public"."pricing_type" AS ENUM('FREE', 'PAID');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
        CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');
    END IF;
END $$;

-- 2. Create Auth Tables (Using IF NOT EXISTS to be safe)
CREATE TABLE IF NOT EXISTS "user" (
    "id" text PRIMARY KEY NOT NULL,
    "email" text NOT NULL,
    "email_verified" boolean DEFAULT false NOT NULL,
    "name" text NOT NULL,
    "role" "role" DEFAULT 'USER' NOT NULL,
    "image" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "account" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
    "provider_id" text NOT NULL,
    "account_id" text NOT NULL,
    "id_token" text,
    "refresh_token" text,
    "access_token" text,
    "access_token_expires_at" timestamp,
    "refresh_token_expires_at" timestamp,
    "scope" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "session" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
    "token" text NOT NULL,
    "ip_address" text,
    "user_agent" text,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification_token" (
    "id" text PRIMARY KEY NOT NULL,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);