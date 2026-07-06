import type { LayoutDefinition, LayoutRenderProps } from './types';
import { formatMoney } from '../domain/money';
import { headingStyle } from '../domain/theme';
import { SlotHotspot } from '../components/SlotHotspot';

const OrderFormLayout: React.FC<LayoutRenderProps> = ({ slots, theme, selectedSlotId, onSlotSelect, onSlotDropProduct }) => {
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const productsSlot = slots.products?.type === 'productGrid' ? slots.products : null;
  const products = productsSlot?.products ?? [];
  const terms = slots.terms?.type === 'text' ? slots.terms.value : '';

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
      <div
        style={{
          display: 'flex',
          fontSize: 10,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          color: theme.colorSecondary,
          borderBottom: `1px solid ${theme.colorSecondary}55`,
          paddingBottom: 6
        }}
      >
        <div style={{ flex: '0 0 44px' }} />
        <div style={{ flex: 1 }}>Item</div>
        <div style={{ flex: '0 0 80px', textAlign: 'right' }}>Price</div>
        <div style={{ flex: '0 0 60px', textAlign: 'center' }}>Qty</div>
      </div>
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
        {products.slice(0, 10).map((product) => (
          <div
            key={product.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 0',
              borderBottom: `1px solid ${theme.colorSecondary}22`
            }}
          >
            <div style={{ flex: '0 0 44px', height: 44, overflow: 'hidden', borderRadius: theme.borderRadius, background: '#f2f2f2' }}>
              {product.featuredImage && (
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
            <div style={{ flex: 1, fontSize: 12, color: theme.colorPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.title}
            </div>
            <div style={{ flex: '0 0 80px', textAlign: 'right', fontSize: 12, color: theme.colorAccent }}>
              {formatMoney(product.priceRange.minVariantPrice)}
            </div>
            <div style={{ flex: '0 0 60px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 36, height: 20, border: `1px solid ${theme.colorSecondary}66`, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </SlotHotspot>
      <SlotHotspot
        slotId="terms"
        label="Terms"
        selected={selectedSlotId === 'terms'}
        onSelect={onSlotSelect}
        empty={!terms}
        emptyHint="Click to add payment/shipping terms"
        style={{ minHeight: 20 }}
      >
        {terms && <p style={{ fontSize: 10, color: theme.colorSecondary, margin: 0, lineHeight: 1.6 }}>{terms}</p>}
      </SlotHotspot>
    </div>
  );
};

/** A printable wholesale order form - each row leaves a blank quantity box for a buyer to fill in by hand or fax back. */
export const orderFormLayout: LayoutDefinition = {
  id: 'order-form',
  name: 'Order Form',
  thumbnail: '',
  familyId: 'wholesale',
  familyName: 'Wholesale',
  slots: [
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'Wholesale Order Form' },
    { id: 'products', type: 'productGrid', label: 'Products', maxItems: 10 },
    { id: 'terms', type: 'text', label: 'Terms', placeholder: 'Net 30. Minimum order $250. Freight not included.' }
  ],
  Component: OrderFormLayout
};
