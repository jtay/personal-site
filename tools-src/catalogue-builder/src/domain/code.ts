import type { ShopifyProduct } from './product';
import type { SlotValue } from './slot';

export type CodeGraphicType = 'qr' | 'barcode';

/**
 * Whether/how a product/productGrid slot decorates its cards with a QR or barcode.
 * Lives on the slot value (not ThemeConfig) so different slots on the same project - even
 * the same page - can make different calls, e.g. a promo grid with QR codes next to a plain
 * grid with none.
 */
export interface CardCodeConfig {
  codeType: CodeGraphicType;
  size?: number;
}

/** Where a code slot/card-variant pulls its encoded value from. */
export type CodeDataSource =
  | { kind: 'custom'; value: string }
  | { kind: 'productUrl' }
  | { kind: 'productId' }
  | { kind: 'variantId' }
  | { kind: 'variantBarcode' };

export const CODE_DATA_SOURCE_LABELS: Record<CodeDataSource['kind'], string> = {
  custom: 'Custom text / URL',
  productUrl: "Product's storefront URL",
  productId: 'Shopify product ID',
  variantId: 'Shopify variant ID (first variant)',
  variantBarcode: "Variant's barcode field"
};

function extractNumericId(gid: string): string {
  const match = gid.match(/(\d+)$/);
  return match ? match[1] : gid;
}

/**
 * Resolves a data source against a product to the literal string that gets encoded.
 * Returns null when the source can't be satisfied (e.g. no product selected yet, or the
 * product has no barcode set) so callers can render a helpful placeholder instead of junk.
 */
/** Looks up the product bound to a code slot (via a reference to a product/productGrid slot on the same page). */
export function resolveBoundProduct(slots: Record<string, SlotValue>, boundProductSlotId: string | null): ShopifyProduct | null {
  if (!boundProductSlotId) return null;
  const bound = slots[boundProductSlotId];
  if (!bound) return null;
  if (bound.type === 'product') return bound.product;
  if (bound.type === 'productGrid') return bound.products[0] ?? null;
  return null;
}

export function resolveCodeValue(source: CodeDataSource, product: ShopifyProduct | null, shopDomain?: string): string | null {
  if (source.kind === 'custom') {
    return source.value.trim() || null;
  }
  if (!product) return null;

  switch (source.kind) {
    case 'productUrl':
      return shopDomain ? `https://${shopDomain}/products/${product.handle}` : null;
    case 'productId':
      return extractNumericId(product.id);
    case 'variantId':
      return product.variants[0] ? extractNumericId(product.variants[0].id) : null;
    case 'variantBarcode':
      return product.variants[0]?.barcode ?? null;
  }
}
