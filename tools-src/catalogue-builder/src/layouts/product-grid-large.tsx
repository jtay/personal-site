import type { LayoutDefinition, LayoutRenderProps } from './types';
import { resolveProductCard } from '../product-cards/registry';

const ProductGridLargeLayout: React.FC<LayoutRenderProps> = ({ slots, theme, shopDomain }) => {
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const productsSlot = slots.products?.type === 'productGrid' ? slots.products : null;
  const products = productsSlot?.products ?? [];
  const Card = resolveProductCard(theme.productCardVariant, productsSlot?.cardCode ?? null).Component;

  return (
    <div className="cb-page-a4" style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {heading && <h2 style={{ fontSize: 26, margin: 0, color: 'var(--theme-color-primary)' }}>{heading}</h2>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
        {products.slice(0, 4).map((product) => (
          <Card key={product.id} product={product} theme={theme} shopDomain={shopDomain} />
        ))}
      </div>
    </div>
  );
};

export const productGridLargeLayout: LayoutDefinition = {
  id: 'product-grid-large',
  name: 'Large (2x2)',
  thumbnail: '',
  familyId: 'product-grid',
  familyName: 'Product Grid',
  slots: [
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'Featured' },
    { id: 'products', type: 'productGrid', label: 'Products', maxItems: 4 }
  ],
  Component: ProductGridLargeLayout
};
