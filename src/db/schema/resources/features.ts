import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { FeatureType, Status } from "../helper";




export const features = pgTable("features",{
    id: uuid("id").defaultRandom().primaryKey(),
    uniqueKey: text('unique_key').notNull().unique(),
    featureType:FeatureType('feature_type').notNull(), 
    name: text('name').notNull(),
    repoName: text('repo_name').notNull(),
    status: Status('status').default('PENDING'),
    isExperimental: boolean('is_experimental').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});