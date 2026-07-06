import type { LayoutDefinition, LayoutRenderProps } from './types';
import { formatMoney } from '../domain/money';
import { headingStyle } from '../domain/theme';
import { VariantDisplay } from '../components/VariantDisplay';
import { SlotHotspot } from '../components/SlotHotspot';

const HeroTriptychLayout: React.FC<LayoutRenderProps> = ({ slots, theme, selectedSlotId, onSlotSelect, onSlotDropProduct }) => {
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const productA = slots.productA?.type === 'product' ? slots.productA.product : null;
  const productB = slots.productB?.type === 'product' ? slots.productB.product : null;
  const productC = slots.productC?.type === 'product' ? slots.productC.product : null;

  const Third: React.FC<{ slotId: string; label: string; product: typeof productA }> = ({ slotId, label, product }) => (
    <SlotHotspot
      slotId={slotId}
      label={label}
      selected={selectedSlotId === slotId}
      onSelect={onSlotSelect}
      onDropProduct={onSlotDropProduct}
      empty={!product}
      emptyHint="Click, then add a product from the library"
      style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}
    >
      <div style={{ aspectRatio: '3 / 4', background: '#f2f2f2', overflow: 'hidden', borderRadius: theme.borderRadius }}>
        {product?.featuredImage && (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--theme-color-primary)' }}>{product?.title ?? 'Product'}</div>
      {product && <div style={{ fontSize: 12, color: 'var(--theme-color-accent)' }}>{formatMoney(product.priceRange.minVariantPrice)}</div>}
      {product && <VariantDisplay variants={product.variants} theme={theme} />}
    </SlotHotspot>
  );

  return (
    <div className="cb-page-a4" style={{ padding: '44px 36px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SlotHotspot
        slotId="heading"
        label="Heading"
        selected={selectedSlotId === 'heading'}
        onSelect={onSlotSelect}
        empty={!heading}
        emptyHint="Click to add heading"
        style={{ minHeight: 34, textAlign: 'center' }}
      >
        {heading && <h2 style={{ fontSize: 24, margin: 0, textAlign: 'center', color: 'var(--theme-color-primary)', ...headingStyle(theme) }}>{heading}</h2>}
      </SlotHotspot>
      <div style={{ display: 'flex', gap: 20, flex: 1 }}>
        <Third slotId="productA" label="Product A" product={productA} />
        <Third slotId="productB" label="Product B" product={productB} />
        <Third slotId="productC" label="Product C" product={productC} />
      </div>
    </div>
  );
};

/** Three products side by side, evenly weighted - for showcasing a coordinated set or a size/colour range. */
export const heroTriptychLayout: LayoutDefinition = {
  id: 'hero-triptych',
  name: 'Hero Triptych',
  thumbnail: '',
  familyId: 'hero',
  familyName: 'Hero',
  slots: [
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'The Collection' },
    { id: 'productA', type: 'product', label: 'Product A' },
    { id: 'productB', type: 'product', label: 'Product B' },
    { id: 'productC', type: 'product', label: 'Product C' }
  ],
  Component: HeroTriptychLayout
};
