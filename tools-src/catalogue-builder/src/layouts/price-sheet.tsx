import type { LayoutDefinition, LayoutRenderProps } from './types';
import { formatMoney } from '../domain/money';
import { headingStyle } from '../domain/theme';
import { SlotHotspot } from '../components/SlotHotspot';

const PriceSheetLayout: React.FC<LayoutRenderProps> = ({ slots, theme, selectedSlotId, onSlotSelect, onSlotDropProduct }) => {
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const productsSlot = slots.products?.type === 'productGrid' ? slots.products : null;
  const products = productsSlot?.products ?? [];
  const half = Math.ceil(products.length / 2);
  const columns = [products.slice(0, half), products.slice(half)];

  return (
    <div className="cb-page-a4" style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SlotHotspot
        slotId="heading"
        label="Heading"
        selected={selectedSlotId === 'heading'}
        onSelect={onSlotSelect}
        empty={!heading}
        emptyHint="Click to add heading"
        style={{ minHeight: 28 }}
      >
        {heading && <h2 style={{ fontSize: 20, margin: 0, color: 'var(--theme-color-primary)', ...headingStyle(theme) }}>{heading}</h2>}
      </SlotHotspot>
      <SlotHotspot
        slotId="products"
        label="Products"
        selected={selectedSlotId === 'products'}
        onSelect={onSlotSelect}
        onDropProduct={onSlotDropProduct}
        empty={products.length === 0}
        emptyHint="Click, then add products from the library"
        style={{ flex: 1, display: 'flex', gap: 32 }}
      >
        {columns.map((column, colIndex) => (
          <div key={colIndex} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {column.map((product) => (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 8,
                  padding: '6px 0',
                  borderBottom: `1px dotted ${theme.colorSecondary}55`,
                  fontSize: 12
                }}
              >
                <span style={{ color: theme.colorPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {product.title}
                </span>
                <span style={{ color: theme.colorAccent, fontWeight: 600, flexShrink: 0 }}>
                  {formatMoney(product.priceRange.minVariantPrice)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </SlotHotspot>
    </div>
  );
};

/** No imagery at all - just name and price, two columns, as many rows as fit. The fastest way to hand a buyer every price in the range. */
export const priceSheetLayout: LayoutDefinition = {
  id: 'price-sheet',
  name: 'Price Sheet',
  thumbnail: '',
  familyId: 'wholesale',
  familyName: 'Wholesale',
  slots: [
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'Price Sheet' },
    { id: 'products', type: 'productGrid', label: 'Products', maxItems: 24 }
  ],
  Component: PriceSheetLayout
};
