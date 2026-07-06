import type { ShopifyProduct } from '../domain/product';
import { fetchProductsForCollection } from './client';
import type { ShopConnection } from '../domain/project';

const productsByCollection = new Map<string, ShopifyProduct[]>();

/** Session-lifetime cache so switching between collections in the browser doesn't re-fetch. */
export async function getProductsForCollectionCached(
  connection: ShopConnection,
  collectionId: string
): Promise<ShopifyProduct[]> {
  const cached = productsByCollection.get(collectionId);
  if (cached) return cached;

  const products = await fetchProductsForCollection(connection, collectionId);
  productsByCollection.set(collectionId, products);
  return products;
}

export function clearProductCache(): void {
  productsByCollection.clear();
}
