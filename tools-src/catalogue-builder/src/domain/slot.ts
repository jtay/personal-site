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
