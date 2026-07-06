import type { LayoutDefinition, LayoutRenderProps } from './types';
import { headingStyle } from '../domain/theme';
import { CodeSlot } from '../components/CodeSlot';
import { SlotHotspot } from '../components/SlotHotspot';

const AdPageLayout: React.FC<LayoutRenderProps> = ({ slots, theme, assets, shopDomain, selectedSlotId, onSlotSelect }) => {
  const imageSlot = slots.backgroundImage;
  const asset = imageSlot?.type === 'image' && imageSlot.assetId ? assets[imageSlot.assetId] : undefined;
  const headline = slots.headline?.type === 'text' ? slots.headline.value : '';
  const subheadline = slots.subheadline?.type === 'text' ? slots.subheadline.value : '';
  const promoCode = slots.promoCode?.type === 'code' ? slots.promoCode : null;

  return (
    <div className="cb-page-a4" style={{ display: 'flex', alignItems: 'flex-end' }}>
      <SlotHotspot
        slotId="backgroundImage"
        label="Background Image"
        selected={selectedSlotId === 'backgroundImage'}
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
            slotId="headline"
            label="Headline"
            selected={selectedSlotId === 'headline'}
            onSelect={onSlotSelect}
            empty={!headline}
            emptyHint="Click to add headline"
            style={{ minHeight: 40 }}
          >
            {headline && <h1 style={{ fontSize: 34, margin: 0, ...headingStyle(theme) }}>{headline}</h1>}
          </SlotHotspot>
          <SlotHotspot
            slotId="subheadline"
            label="Subheadline"
            selected={selectedSlotId === 'subheadline'}
            onSelect={onSlotSelect}
            empty={!subheadline}
            emptyHint="Click to add subheadline"
            style={{ minHeight: 20, marginTop: 8 }}
          >
            {subheadline && <p style={{ fontSize: 15, margin: 0, opacity: 0.9 }}>{subheadline}</p>}
          </SlotHotspot>
        </div>
        {promoCode && (
          <SlotHotspot
            slotId="promoCode"
            label="Promo Code"
            selected={selectedSlotId === 'promoCode'}
            onSelect={onSlotSelect}
            style={{ background: '#fff', padding: 6, borderRadius: 4, flexShrink: 0 }}
          >
            <CodeSlot value={promoCode} slots={slots} shopDomain={shopDomain} />
          </SlotHotspot>
        )}
      </div>
    </div>
  );
};

export const adPageLayout: LayoutDefinition = {
  id: 'ad-page',
  name: 'Full Page Ad',
  thumbnail: '',
  slots: [
    { id: 'backgroundImage', type: 'image', label: 'Background Image' },
    { id: 'headline', type: 'text', label: 'Headline', placeholder: '30% Off This Week' },
    { id: 'subheadline', type: 'text', label: 'Subheadline', placeholder: 'Terms and conditions apply' },
    { id: 'promoCode', type: 'code', label: 'Promo Code' }
  ],
  Component: AdPageLayout
};
