import type { LayoutDefinition, LayoutRenderProps } from './types';
import { headingStyle } from '../domain/theme';
import { resolveProductCard } from '../product-cards/registry';
import { SlotHotspot } from '../components/SlotHotspot';

const ProductListLayout: React.FC<LayoutRenderProps> = ({
  slots,
  theme,
  shopDomain,
  selectedSlotId,
  onSlotSelect,
  onSlotDropProduct
}) => {
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const productsSlot = slots.products?.type === 'productGrid' ? slots.products : null;
  const products = productsSlot?.products ?? [];
  const Card = resolveProductCard(theme.productCardVariant, productsSlot?.cardCode ?? null).Component;

  return (
    <div className="cb-page-a4" style={{ padding: '40px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SlotHotspot
        slotId="heading"
        label="Heading"
        selected={selectedSlotId === 'heading'}
        onSelect={onSlotSelect}
        empty={!heading}
        emptyHint="Click to add heading"
        style={{ minHeight: 30 }}
      >
        {heading && <h2 style={{ fontSize: 22, margin: 0, color: 'var(--theme-color-primary)', ...headingStyle(theme) }}>{heading}</h2>}
      </SlotHotspot>
      <SlotHotspot
        slotId="products"
        label="Products"
        selected={selectedSlotId === 'products'}
        onSelect={onSlotSelect}
        onDropProduct={onSlotDropProduct}
        empty={products.length === 0}
        emptyHint="Click, then add products from the library"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {products.slice(0, 12).map((product) => (
          <Card key={product.id} product={product} theme={theme} shopDomain={shopDomain} />
        ))}
      </SlotHotspot>
    </div>
  );
};

/** A dense, row-based list rather than a grid - built for wholesale price lists where merchants want to scan many SKUs at once. Pairs best with the "Row" product card. */
export const productListLayout: LayoutDefinition = {
  id: 'product-list',
  name: 'Price List',
  thumbnail: '',
  familyId: 'product-grid',
  familyName: 'Product Grid',
  slots: [
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'Wholesale Price List' },
    { id: 'products', type: 'productGrid', label: 'Products', maxItems: 12 }
  ],
  Component: ProductListLayout
};
