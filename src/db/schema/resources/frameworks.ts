import { pgTable, uuid, text, pgEnum, timestamp, boolean, unique } from "drizzle-orm/pg-core";
import { features } from "./features";
import { scope, Status } from "../helper";



export const frameworks = pgTable("frameworks", {
    id: uuid("id").defaultRandom().primaryKey(),
    uniqueKey: text('unique_key').notNull().unique(),
    name: text('name').notNull(),
    repoName: text('repo_name').notNull(),
    status: Status('status').default('PENDING'),
    isExperimental: boolean('is_experimental').notNull().default(false),
    scope: scope("scope").array().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});



export const frameworkFeatures = pgTable("framework_features", {
    id: uuid("id").defaultRandom().primaryKey(),
    frameworkId: uuid("framework_id").references(() => frameworks.id, { onDelete: 'cascade' }).notNull(),
    featureId: uuid("feature_id").references(() => features.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
},(t) => ({
    uniqueFrameworkFeature: unique().on(t.frameworkId, t.featureId),
}))