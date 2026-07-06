import type { ShopifyProduct } from './product';
import type { CardCodeConfig, CodeDataSource, CodeGraphicType } from './code';

/** Kinds of content a layout slot can accept. Extend here when a new slot type is needed. */
export type SlotType = 'text' | 'image' | 'product' | 'productGrid' | 'code';

export interface SlotSchema {
  id: string;
  type: SlotType;
  label: string;
  /** Extra per-type constraints, e.g. max product count for a productGrid slot. */
  maxItems?: number;
  placeholder?: string;
}

export type SlotValue =
  | { type: 'text'; value: string }
  | { type: 'image'; assetId: string | null }
  | { type: 'product'; product: ShopifyProduct | null; cardCode: CardCodeConfig | null }
  | { type: 'productGrid'; products: ShopifyProduct[]; cardCode: CardCodeConfig | null }
  | { type: 'code'; codeType: CodeGraphicType; dataSource: CodeDataSource; boundProductSlotId: string | null };

/**
 * Shared by the click-to-add flow (CollectionBrowser) and drag-and-drop onto a canvas slot
 * (PageCanvas), so "assign a product to a slot" has one rule set: replace for a single
 * product slot, append (respecting maxItems and de-duping) for a grid. Returns null when the
 * slot can't accept a product, or the grid is already full/contains it.
 */
export function applyProductToSlot(
  schema: SlotSchema,
  current: SlotValue | undefined,
  product: ShopifyProduct
): SlotValue | null {
  if (schema.type === 'product') {
    const cardCode = current?.type === 'product' ? current.cardCode : null;
    return { type: 'product', product, cardCode };
  }
  if (schema.type === 'productGrid') {
    const existing = current?.type === 'productGrid' ? current.products : [];
    const cardCode = current?.type === 'productGrid' ? current.cardCode : null;
    const max = schema.maxItems ?? Infinity;
    if (existing.some((p) => p.id === product.id) || existing.length >= max) return null;
    return { type: 'productGrid', products: [...existing, product], cardCode };
  }
  return null;
}

export function emptySlotValue(schema: SlotSchema): SlotValue {
  switch (schema.type) {
    case 'text':
      return { type: 'text', value: '' };
    case 'image':
      return { type: 'image', assetId: null };
    case 'product':
      return { type: 'product', product: null, cardCode: null };
    case 'productGrid':
      return { type: 'productGrid', products: [], cardCode: null };
    case 'code':
      return { type: 'code', codeType: 'qr', dataSource: { kind: 'custom', value: '' }, boundProductSlotId: null };
  }
}
