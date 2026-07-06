import type { ThemeConfig } from './theme';
import type { SlotValue } from './slot';
import type { AssetLibrary } from './asset';

export interface ShopConnection {
  shopDomain: string; // e.g. my-shop.myshopify.com
  storefrontAccessToken: string;
}

export interface Page {
  id: string;
  layoutId: string;
  slots: Record<string, SlotValue>;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  connection: ShopConnection | null;
  theme: ThemeConfig;
  pages: Page[];
  assets: AssetLibrary;
  /** Bumped whenever the save-file shape changes, so loadProject can migrate old files. */
  schemaVersion: number;
}

export const PROJECT_SCHEMA_VERSION = 1;
