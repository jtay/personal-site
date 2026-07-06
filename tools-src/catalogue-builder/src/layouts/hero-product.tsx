import type { LayoutDefinition, LayoutRenderProps } from './types';
import { formatMoney } from '../domain/money';
import { CodeSlot } from '../components/CodeSlot';
import { VariantDisplay } from '../components/VariantDisplay';

const HeroProductLayout: React.FC<LayoutRenderProps> = ({ slots, theme, shopDomain }) => {
  const product = slots.featuredProduct?.type === 'product' ? slots.featuredProduct.product : null;
  const notes = slots.notes?.type === 'text' ? slots.notes.value : '';
  const codeValue = slots.scanCode?.type === 'code' ? slots.scanCode : null;

  return (
    <div className="cb-page-a4" style={{ display: 'flex' }}>
      <div style={{ flex: '1 1 55%', background: '#f2f2f2' }}>
        {product?.featuredImage && (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>
      <div style={{ flex: '1 1 45%', padding: '48px 36px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ fontSize: 28, margin: 0, color: 'var(--theme-color-primary)' }}>{product?.title ?? 'Featured Product'}</h2>
        {product && (
          <div style={{ fontSize: 18, color: 'var(--theme-color-accent)' }}>
            {formatMoney(product.priceRange.minVariantPrice)}
          </div>
        )}
        {product && <VariantDisplay variants={product.variants} theme={theme} />}
        <p style={{ fontSize: 13, color: 'var(--theme-color-secondary)', lineHeight: 1.6 }}>
          {notes || product?.description}
        </p>
        {codeValue && (
          <div style={{ marginTop: 'auto' }}>
            <CodeSlot value={codeValue} slots={slots} shopDomain={shopDomain} />
          </div>
        )}
      </div>
    </div>
  );
};

export const heroProductLayout: LayoutDefinition = {
  id: 'hero-product',
  name: 'Single Product',
  thumbnail: '',
  familyId: 'hero',
  familyName: 'Hero',
  slots: [
    { id: 'featuredProduct', type: 'product', label: 'Featured Product' },
    { id: 'notes', type: 'text', label: 'Notes', placeholder: 'Optional custom description override' },
    { id: 'scanCode', type: 'code', label: 'Scan Code' }
  ],
  Component: HeroProductLayout
};
