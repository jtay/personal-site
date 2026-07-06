import type { ShopifyCollection, ShopifyProduct, ShopifyVariant } from '../domain/product';
import type { ShopConnection } from '../domain/project';

const API_VERSION = '2024-10';

export class ShopifyStorefrontError extends Error {}

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

function normalizeDomain(domain: string): string {
  return domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
}

async function storefrontFetch<T>(
  connection: ShopConnection,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const url = `https://${normalizeDomain(connection.shopDomain)}/api/${API_VERSION}/graphql.json`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': connection.storefrontAccessToken
    },
    body: JSON.stringify({ query, variables })
  });

  if (!res.ok) {
    throw new ShopifyStorefrontError(`Shopify request failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new ShopifyStorefrontError(json.errors.map((e) => e.message).join('; '));
  }
  if (!json.data) {
    throw new ShopifyStorefrontError('Shopify returned an empty response.');
  }
  return json.data;
}

const COLLECTIONS_QUERY = `
  query Collections($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          handle
          title
        }
      }
      pageInfo { hasNextPage }
    }
  }
`;

interface CollectionsQueryResult {
  collections: {
    edges: { cursor: string; node: { id: string; handle: string; title: string } }[];
    pageInfo: { hasNextPage: boolean };
  };
}

export async function fetchAllCollections(connection: ShopConnection): Promise<ShopifyCollection[]> {
  const collections: ShopifyCollection[] = [];
  let after: string | undefined;

  for (;;) {
    const data = await storefrontFetch<CollectionsQueryResult>(connection, COLLECTIONS_QUERY, {
      first: 50,
      after
    });
    for (const edge of data.collections.edges) {
      collections.push({
        id: edge.node.id,
        handle: edge.node.handle,
        title: edge.node.title
      });
    }
    if (!data.collections.pageInfo.hasNextPage) break;
    after = data.collections.edges[data.collections.edges.length - 1]?.cursor;
    if (!after) break;
  }

  return collections;
}

const PRODUCTS_BY_COLLECTION_QUERY = `
  query ProductsByCollection($id: ID!, $first: Int!, $after: String) {
    collection(id: $id) {
      products(first: $first, after: $after) {
        edges {
          cursor
          node {
            id
            handle
            title
            description
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            featuredImage { url altText width height }
            images(first: 10) {
              edges { node { url altText width height } }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  selectedOptions { name value }
                  price { amount currencyCode }
                  barcode
                }
              }
            }
          }
        }
        pageInfo { hasNextPage }
      }
    }
  }
`;

interface ProductsByCollectionResult {
  collection: {
    products: {
      edges: { cursor: string; node: RawProduct }[];
      pageInfo: { hasNextPage: boolean };
    };
  } | null;
}

interface RawProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: ShopifyProduct['priceRange'];
  featuredImage: ShopifyProduct['featuredImage'];
  images: { edges: { node: ShopifyProduct['featuredImage'] }[] };
  variants: { edges: { node: ShopifyVariant }[] };
}

function toShopifyProduct(raw: RawProduct): ShopifyProduct {
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    priceRange: raw.priceRange,
    featuredImage: raw.featuredImage,
    images: raw.images.edges.map((e) => e.node).filter((img): img is NonNullable<typeof img> => img !== null),
    variants: raw.variants.edges.map((e) => e.node)
  };
}

export async function fetchProductsForCollection(
  connection: ShopConnection,
  collectionId: string
): Promise<ShopifyProduct[]> {
  const products: ShopifyProduct[] = [];
  let after: string | undefined;

  for (;;) {
    const data = await storefrontFetch<ProductsByCollectionResult>(connection, PRODUCTS_BY_COLLECTION_QUERY, {
      id: collectionId,
      first: 50,
      after
    });
    if (!data.collection) break;
    for (const edge of data.collection.products.edges) {
      products.push(toShopifyProduct(edge.node));
    }
    if (!data.collection.products.pageInfo.hasNextPage) break;
    after = data.collection.products.edges[data.collection.products.edges.length - 1]?.cursor;
    if (!after) break;
  }

  return products;
}

/** Cheap connectivity/credentials check used by the connection panel before loading the catalog. */
export async function verifyConnection(connection: ShopConnection): Promise<{ shopName: string }> {
  const data = await storefrontFetch<{ shop: { name: string } }>(
    connection,
    `query { shop { name } }`
  );
  return { shopName: data.shop.name };
}
