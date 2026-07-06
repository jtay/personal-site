import type { SlotSchema, SlotValue } from '../domain/slot';
import type { ThemeConfig } from '../domain/theme';
import type { AssetLibrary } from '../domain/asset';
import type { ShopifyProduct } from '../domain/product';

export interface LayoutRenderProps {
  slots: Record<string, SlotValue>;
  theme: ThemeConfig;
  assets: AssetLibrary;
  /** Needed to resolve a 'code' slot's productUrl data source. Null when not connected. */
  shopDomain: string | null;
  /** Undefined during PDF export, where nothing is selectable. */
  selectedSlotId?: string | null;
  onSlotSelect?: (slotId: string) => void;
  /** Undefined during PDF export. Layouts pass this to their product/productGrid slot's SlotHotspot only. */
  onSlotDropProduct?: (slotId: string, product: ShopifyProduct) => void;
}

export interface LayoutDefinition {
  id: string;
  name: string;
  /** Small SVG/PNG shown in the layout picker. */
  thumbnail: string;
  slots: SlotSchema[];
  Component: React.FC<LayoutRenderProps>;
  /**
   * Groups visually-related layouts (e.g. several product-grid styles) under one entry in
   * the layout picker. Layouts without a family render as a flat top-level entry, same as today.
   */
  familyId?: string;
  familyName?: string;
  /**
   * A double-page layout: one Page occupies an entire spread by itself (not paired with a
   * sibling interior page). Rendered as one continuous wide canvas in the editor; export
   * still emits two ordinary A4 sheets (see PrintExportButton) so a normal printer/PDF
   * viewer sees a correct page sequence - only the editor treats it as a single spread.
   */
  spansSpread?: boolean;
}
