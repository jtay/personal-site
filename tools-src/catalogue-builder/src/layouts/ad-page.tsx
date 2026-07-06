import type { LayoutDefinition, LayoutRenderProps } from './types';
import { CodeSlot } from '../components/CodeSlot';

const AdPageLayout: React.FC<LayoutRenderProps> = ({ slots, assets, shopDomain }) => {
  const imageSlot = slots.backgroundImage;
  const asset = imageSlot?.type === 'image' && imageSlot.assetId ? assets[imageSlot.assetId] : undefined;
  const headline = slots.headline?.type === 'text' ? slots.headline.value : '';
  const subheadline = slots.subheadline?.type === 'text' ? slots.subheadline.value : '';
  const promoCode = slots.promoCode?.type === 'code' ? slots.promoCode : null;

  return (
    <div className="cb-page-a4" style={{ display: 'flex', alignItems: 'flex-end' }}>
      {asset && (
        <img
          src={asset.printDataUrl}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
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
        <div>
          {headline && <h1 style={{ fontSize: 34, margin: 0 }}>{headline}</h1>}
          {subheadline && <p style={{ fontSize: 15, margin: '8px 0 0', opacity: 0.9 }}>{subheadline}</p>}
        </div>
        {promoCode && (
          <div style={{ background: '#fff', padding: 6, borderRadius: 4, flexShrink: 0 }}>
            <CodeSlot value={promoCode} slots={slots} shopDomain={shopDomain} />
          </div>
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
