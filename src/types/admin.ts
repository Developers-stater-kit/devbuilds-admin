// Enums from Schema
export type Status = 'ACTIVE' | 'INACTIVE' | 'DEPRECATED' | 'PENDING';
export type Scope = 'FRONTEND' | 'BACKEND' | 'FULLSTACK';
export type FeatureType = 'AUTHENTICATION' | 'DATABASE' | 'PAYMENTS';
export type PricingType = 'FREE' | 'PAID';

// Base Entity (Common fields)
export interface BaseEntity {
  id: string;
  uniqueKey: string;
  name: string;
  repoName: string;
  status: Status;
  isExperimental: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Specific Entities
export interface Framework extends BaseEntity {
  scope: Scope[];
}

export interface Feature extends BaseEntity {
  featureType: FeatureType;
}

export interface Template {
  id: string;
  title: string;
  slug: string;
  subtitle?: any;
  description?: string;
  isFeatured: boolean;
  category?: string;
  thumbnail?: string;
  videoUrl?: string;
  previewUrl?: string;
  githubUrl?: string;
  cliCommand?: string;
  pricingType: PricingType;
  authorName?: string;
  authorAvatar?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  mssg: string;
  data: T;
}