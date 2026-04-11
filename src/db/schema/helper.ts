import { pgEnum } from 'drizzle-orm/pg-core';

//  Feature and framework status
export const Status = pgEnum('status', [
    'ACTIVE',
    'INACTIVE',
    'DEPRECATED',
    'PENDING'
]);
//  framework Scope
export const scope = pgEnum('scope', [
    'FRONTEND',
    'BACKEND',
    'FULLSTACK'
]);

//  feature type
export const FeatureType = pgEnum('feature_type', [
    'AUTHENTICATION',
    'DATABASE',
    'PAYMENTS'
]);