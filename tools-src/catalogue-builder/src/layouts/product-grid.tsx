import type { LayoutDefinition, LayoutRenderProps } from './types';
import { headingStyle } from '../domain/theme';
import { resolveProductCard } from '../product-cards/registry';
import { SlotHotspot } from '../components/SlotHotspot';

const ProductGridLayout: React.FC<LayoutRenderProps> = ({
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
    <div className="cb-page-a4" style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 20 }}>
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
        style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignContent: 'start' }}
      >
        {products.slice(0, 9).map((product) => (
          <Card key={product.id} product={product} theme={theme} shopDomain={shopDomain} />
        ))}
      </SlotHotspot>
    </div>
  );
};

export const productGridLayout: LayoutDefinition = {
  id: 'product-grid',
  name: 'Classic (3x3)',
  thumbnail: '',
  familyId: 'product-grid',
  familyName: 'Product Grid',
  slots: [
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'New Arrivals' },
    { id: 'products', type: 'productGrid', label: 'Products', maxItems: 9 }
  ],
  Component: ProductGridLayout
};
