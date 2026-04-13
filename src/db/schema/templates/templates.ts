import { pgTable, uuid, text, timestamp, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";

export const pricingTypeEnum = pgEnum('pricing_type', ['FREE', 'PAID']);

export const templates = pgTable("templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  subtitle: text("subtitle"),
  description: text("description"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  category: text("category"),
  thumbnail: text("thumbnail"),
  videoUrl: text("video_url"),
  previewUrl: text("preview_url"),
  githubUrl: text("github_url"),
  cliCommand: text("cli_command"),
  pricingType: pricingTypeEnum("pricing_type").default('FREE').notNull(),
  authorName: text("author_name"),
  authorAvatar: text("author_avatar").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});