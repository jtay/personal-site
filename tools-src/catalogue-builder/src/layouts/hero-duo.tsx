import type { LayoutDefinition, LayoutRenderProps } from './types';
import { formatMoney } from '../domain/money';
import { VariantDisplay } from '../components/VariantDisplay';

const HeroDuoLayout: React.FC<LayoutRenderProps> = ({ slots, theme }) => {
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const productA = slots.productA?.type === 'product' ? slots.productA.product : null;
  const productB = slots.productB?.type === 'product' ? slots.productB.product : null;

  const Half: React.FC<{ product: typeof productA }> = ({ product }) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ aspectRatio: '4 / 5', background: '#f2f2f2', overflow: 'hidden', borderRadius: theme.borderRadius }}>
        {product?.featuredImage && (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--theme-color-primary)' }}>{product?.title ?? 'Product'}</div>
      {product && <div style={{ fontSize: 14, color: 'var(--theme-color-accent)' }}>{formatMoney(product.priceRange.minVariantPrice)}</div>}
      {product && <VariantDisplay variants={product.variants} theme={theme} />}
    </div>
  );

  return (
    <div className="cb-page-a4" style={{ padding: '44px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {heading && <h2 style={{ fontSize: 26, margin: 0, textAlign: 'center', color: 'var(--theme-color-primary)' }}>{heading}</h2>}
      <div style={{ display: 'flex', gap: 28, flex: 1 }}>
        <Half product={productA} />
        <Half product={productB} />
      </div>
    </div>
  );
};

export const heroDuoLayout: LayoutDefinition = {
  id: 'hero-duo',
  name: 'Hero Duo',
  thumbnail: '',
  familyId: 'hero',
  familyName: 'Hero',
  slots: [
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'Side by Side' },
    { id: 'productA', type: 'product', label: 'Product A' },
    { id: 'productB', type: 'product', label: 'Product B' }
  ],
  Component: HeroDuoLayout
};
