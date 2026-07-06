import type { ShopConnection } from '../domain/project';

const STORAGE_KEY = 'catalogue-builder:default-connection';

/**
 * The Storefront access token here is a public, read-only, domain-restricted credential
 * (the same class of key Shopify expects to ship inside client-side storefront JS), so
 * caching it in localStorage carries the same exposure as embedding it in a theme.
 */
export function saveDefaultConnection(connection: ShopConnection): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connection));
  } catch {
    // Storage can fail in private-browsing contexts; saving a default is a convenience, not critical.
  }
}

export function loadDefaultConnection(): ShopConnection | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.shopDomain === 'string' && typeof parsed?.storefrontAccessToken === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearDefaultConnection(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
