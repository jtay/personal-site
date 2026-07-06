import type { LayoutDefinition, LayoutRenderProps } from './types';
import { resolveProductCard } from '../product-cards/registry';

const ProductGridLayout: React.FC<LayoutRenderProps> = ({ slots, theme, shopDomain }) => {
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const productsSlot = slots.products?.type === 'productGrid' ? slots.products : null;
  const products = productsSlot?.products ?? [];
  const Card = resolveProductCard(theme.productCardVariant, productsSlot?.cardCode ?? null).Component;

  return (
    <div className="cb-page-a4" style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {heading && (
        <h2 style={{ fontSize: 22, margin: 0, color: 'var(--theme-color-primary)' }}>{heading}</h2>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {products.slice(0, 9).map((product) => (
          <Card key={product.id} product={product} theme={theme} shopDomain={shopDomain} />
        ))}
      </div>
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
