import type { ProductCardVariant } from './types';
import type { CardCodeConfig } from '../domain/code';
import { MinimalProductCard } from './minimal';
import { BoxedProductCard } from './boxed';
import { RowProductCard } from './row';
import { withCode } from './withCode';

// Note: withCode() composition still lives in ./withCode.tsx, but is applied dynamically
// per-slot (see domain/code.ts CardCodeConfig) rather than pre-registered here as separate
// named variants - QR/barcode is a per-slot choice, not a base card style choice.
const registry = new Map<string, ProductCardVariant>();

export function registerProductCard(variant: ProductCardVariant): void {
  registry.set(variant.id, variant);
}

export function getProductCard(id: string): ProductCardVariant {
  const variant = registry.get(id);
  if (!variant) {
    throw new Error(`Unknown product card variant "${id}". Registered: ${[...registry.keys()].join(', ')}`);
  }
  return variant;
}

export function listProductCards(): ProductCardVariant[] {
  return [...registry.values()];
}

/** Resolves the base card style plus whatever QR/barcode a specific slot has asked for. */
export function resolveProductCard(baseId: string, cardCode: CardCodeConfig | null): ProductCardVariant {
  const base = getProductCard(baseId);
  return cardCode ? withCode(base, cardCode.codeType, { size: cardCode.size }) : base;
}

registerProductCard({ id: 'minimal', name: 'Minimal', Component: MinimalProductCard });
registerProductCard({ id: 'boxed', name: 'Boxed', Component: BoxedProductCard });
registerProductCard({ id: 'row', name: 'Row (wholesale)', Component: RowProductCard });
