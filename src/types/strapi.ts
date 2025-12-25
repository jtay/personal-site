/**
 * Base Strapi v5 Type Definitions
 */

// Common timestamp fields
export interface StrapiTimestamps {
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// Base document structure
export interface StrapiDocument extends StrapiTimestamps {
  id: number;
  documentId: string;
}

// Image format for responsive images
export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

// Standard image formats provided by Strapi
export interface StrapiImageFormats {
  thumbnail?: StrapiImageFormat;
  small?: StrapiImageFormat;
  medium?: StrapiImageFormat;
  large?: StrapiImageFormat;
}

// Media/Image document
export interface StrapiMedia extends StrapiDocument {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: StrapiImageFormats | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown;
}

// Pagination meta
export interface StrapiPaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiPagination {
  meta: {
    pagination: StrapiPaginationMeta;
  };
}

// Single response wrapper
export interface StrapiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

// Collection response wrapper
export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination: StrapiPaginationMeta;
  };
}

// Error response
export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details: Record<string, unknown>;
}

export interface StrapiErrorResponse {
  data: null;
  error: StrapiError;
}

// Query parameters
export interface StrapiQueryParams {
  sort?: string | string[];
  filters?: Record<string, unknown>;
  populate?: string | string[] | Record<string, unknown>;
  fields?: string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  publicationState?: 'live' | 'preview';
  locale?: string;
}

// Rich text content types
export interface StrapiContentText {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
}

export interface StrapiContentLink {
  type: 'link';
  url: string;
  children: StrapiContentText[];
}

export type StrapiContentInline = StrapiContentText | StrapiContentLink;

export interface StrapiContentParagraph {
  type: 'paragraph';
  children: StrapiContentInline[];
}

export interface StrapiContentHeading {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: StrapiContentInline[];
}

export interface StrapiContentListItem {
  type: 'list-item';
  children: StrapiContentInline[];
}

export interface StrapiContentList {
  type: 'list';
  format: 'ordered' | 'unordered';
  children: StrapiContentListItem[];
}

export interface StrapiContentQuote {
  type: 'quote';
  children: StrapiContentInline[];
}

export interface StrapiContentCode {
  type: 'code';
  language?: string;
  children: StrapiContentText[];
}

export interface StrapiContentImage {
  type: 'image';
  image: StrapiMedia;
  children: StrapiContentText[];
}

export type StrapiContentNode =
  | StrapiContentParagraph
  | StrapiContentHeading
  | StrapiContentList
  | StrapiContentQuote
  | StrapiContentCode
  | StrapiContentImage;

export type StrapiContent = StrapiContentNode[];