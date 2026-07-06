import type { LayoutDefinition, LayoutRenderProps } from './types';
import { resolveProductCard } from '../product-cards/registry';

const ProductGridDenseLayout: React.FC<LayoutRenderProps> = ({ slots, theme, shopDomain }) => {
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const productsSlot = slots.products?.type === 'productGrid' ? slots.products : null;
  const products = productsSlot?.products ?? [];
  const Card = resolveProductCard(theme.productCardVariant, productsSlot?.cardCode ?? null).Component;

  return (
    <div className="cb-page-a4" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {heading && <h2 style={{ fontSize: 18, margin: 0, color: 'var(--theme-color-primary)' }}>{heading}</h2>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {products.slice(0, 16).map((product) => (
          <Card key={product.id} product={product} theme={theme} shopDomain={shopDomain} />
        ))}
      </div>
    </div>
  );
};

export const productGridDenseLayout: LayoutDefinition = {
  id: 'product-grid-dense',
  name: 'Dense (4x4)',
  thumbnail: '',
  familyId: 'product-grid',
  familyName: 'Product Grid',
  slots: [
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'Full Range' },
    { id: 'products', type: 'productGrid', label: 'Products', maxItems: 16 }
  ],
  Component: ProductGridDenseLayout
};
