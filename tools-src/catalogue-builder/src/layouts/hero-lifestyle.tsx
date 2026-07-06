import type { LayoutDefinition, LayoutRenderProps } from './types';
import { formatMoney } from '../domain/money';
import { headingStyle } from '../domain/theme';
import { SlotHotspot } from '../components/SlotHotspot';

const HeroLifestyleLayout: React.FC<LayoutRenderProps> = ({
  slots,
  theme,
  assets,
  selectedSlotId,
  onSlotSelect,
  onSlotDropProduct
}) => {
  const imageSlot = slots.image;
  const asset = imageSlot?.type === 'image' && imageSlot.assetId ? assets[imageSlot.assetId] : undefined;
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const body = slots.body?.type === 'text' ? slots.body.value : '';
  const product = slots.featuredProduct?.type === 'product' ? slots.featuredProduct.product : null;

  return (
    <div className="cb-page-a4" style={{ display: 'flex', alignItems: 'flex-end' }}>
      <SlotHotspot
        slotId="image"
        label="Image"
        selected={selectedSlotId === 'image'}
        onSelect={onSlotSelect}
        empty={!asset}
        style={{ position: 'absolute', inset: 0 }}
      >
        {asset && <img src={asset.printDataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </SlotHotspot>
      <div
        style={{
          position: 'relative',
          width: '100%',
          padding: '32px 40px 40px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
          color: '#fff',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 20
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <SlotHotspot
            slotId="heading"
            label="Heading"
            selected={selectedSlotId === 'heading'}
            onSelect={onSlotSelect}
            empty={!heading}
            emptyHint="Click to add heading"
            style={{ minHeight: 40 }}
          >
            {heading && <h1 style={{ fontSize: 32, margin: 0, ...headingStyle(theme) }}>{heading}</h1>}
          </SlotHotspot>
          <SlotHotspot
            slotId="body"
            label="Body Text"
            selected={selectedSlotId === 'body'}
            onSelect={onSlotSelect}
            empty={!body}
            emptyHint="Click to add supporting copy"
            style={{ minHeight: 20, marginTop: 8, maxWidth: 420 }}
          >
            {body && <p style={{ fontSize: 14, margin: 0, opacity: 0.9, lineHeight: 1.6 }}>{body}</p>}
          </SlotHotspot>
        </div>
        <SlotHotspot
          slotId="featuredProduct"
          label="Featured Product"
          selected={selectedSlotId === 'featuredProduct'}
          onSelect={onSlotSelect}
          onDropProduct={onSlotDropProduct}
          empty={!product}
          emptyHint="Click, then add a product"
          style={{
            background: '#fff',
            borderRadius: 'var(--theme-border-radius)',
            padding: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
            minWidth: 160
          }}
        >
          {product && (
            <>
              {product.featuredImage && (
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: theme.borderRadius }}
                />
              )}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: theme.colorPrimary }}>{product.title}</div>
                <div style={{ fontSize: 11, color: theme.colorAccent }}>{formatMoney(product.priceRange.minVariantPrice)}</div>
              </div>
            </>
          )}
        </SlotHotspot>
      </div>
    </div>
  );
};

/** Full-bleed lifestyle photography with a callout card for the product it's selling - a softer, editorial-feeling alternative to the Full Page Ad. */
export const heroLifestyleLayout: LayoutDefinition = {
  id: 'hero-lifestyle',
  name: 'Lifestyle Feature',
  thumbnail: '',
  familyId: 'hero',
  familyName: 'Hero',
  slots: [
    { id: 'image', type: 'image', label: 'Image' },
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'Made for Every Day' },
    { id: 'body', type: 'text', label: 'Body Text', placeholder: 'A short line about the mood or moment' },
    { id: 'featuredProduct', type: 'product', label: 'Featured Product' }
  ],
  Component: HeroLifestyleLayout
};
