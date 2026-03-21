import type { StrapiMedia } from './strapi';

export interface ToolboxItem {
  id?: number;
  documentId?: string;
  slug: string;
  title: string;
  subtitle?: string;
  image?: string;
  htmlPath: string;
  color?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ToolboxItemDocument = ToolboxItem;
