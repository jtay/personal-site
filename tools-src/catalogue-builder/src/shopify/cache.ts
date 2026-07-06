import type { ShopifyProduct } from '../domain/product';
import { fetchProductsForCollection } from './client';
import type { ShopConnection } from '../domain/project';

const productsByCollection = new Map<string, ShopifyProduct[]>();

/** Scoped by shop domain too, not just collectionId - otherwise switching stores mid-session without a page reload could serve another shop's cached products under a same-valued collection id. */
function cacheKey(connection: ShopConnection, collectionId: string): string {
  return `${connection.shopDomain}::${collectionId}`;
}

/** Session-lifetime cache so switching between collections in the browser doesn't re-fetch. */
export async function getProductsForCollectionCached(
  connection: ShopConnection,
  collectionId: string
): Promise<ShopifyProduct[]> {
  const key = cacheKey(connection, collectionId);
  const cached = productsByCollection.get(key);
  if (cached) return cached;

  const products = await fetchProductsForCollection(connection, collectionId);
  productsByCollection.set(key, products);
  return products;
}

export function clearProductCache(): void {
  productsByCollection.clear();
}
