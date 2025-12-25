/**
 * Blog Post Type Definitions
 */

import type { StrapiDocument, StrapiMedia, StrapiContent } from './strapi';

// Category document structure
export interface CategoryDocument extends StrapiDocument {
  name: string;
}

// Blog post document structure
export interface BlogPostDocument extends StrapiDocument {
  handle: string;
  title: string;
  subtitle: string;
  content: StrapiContent;
  featuredImage_landscape: StrapiMedia | null;
  featuredImage_portrait: StrapiMedia | null;
  categories?: CategoryDocument[];
}

// Blog post with populated relations (when using populate in query)
export interface BlogPostPopulated extends BlogPostDocument {
  featuredImage_landscape: StrapiMedia;
  featuredImage_portrait: StrapiMedia;
  categories: CategoryDocument[];
}

// Blog post list item (minimal data for lists)
export interface BlogPostListItem {
  id: number;
  documentId: string;
  handle: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  featuredImage_landscape?: {
    url: string;
    alternativeText: string | null;
    formats: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
    };
  };
}

// Blog post create/update payload
export interface BlogPostInput {
  handle: string;
  title: string;
  subtitle: string;
  content?: StrapiContent;
  featuredImage_landscape?: number; // Media ID
  featuredImage_portrait?: number; // Media ID
  categories?: string[]; // Category documentIds
}

// Blog post filters for queries
export interface BlogPostFilters {
  handle?: {
    $eq?: string;
    $ne?: string;
    $in?: string[];
    $notIn?: string[];
    $contains?: string;
  };
  title?: {
    $contains?: string;
    $containsi?: string;
    $startsWith?: string;
  };
  subtitle?: {
    $contains?: string;
    $containsi?: string;
  };
  publishedAt?: {
    $null?: boolean;
    $notNull?: boolean;
    $gt?: string;
    $gte?: string;
    $lt?: string;
    $lte?: string;
  };
  categories?: {
    documentId?: {
      $in?: string[];
    };
  };
  $or?: Array<{
    title?: { $containsi?: string };
    subtitle?: { $containsi?: string };
  }>;
}

// Hook return type for blog filter state
export interface UseBlogFiltersReturn {
  selectedCategoryIds: string[];
  setSelectedCategoryIds: (ids: string[]) => void;
  selectedYear: number | null;
  setSelectedYear: (year: number | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
  filters: BlogPostFilters;
}