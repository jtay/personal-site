import type { LayoutDefinition, LayoutRenderProps } from './types';

const CoverLayout: React.FC<LayoutRenderProps> = ({ slots, assets }) => {
  const imageSlot = slots.coverImage;
  const asset = imageSlot?.type === 'image' && imageSlot.assetId ? assets[imageSlot.assetId] : undefined;
  const title = slots.title?.type === 'text' ? slots.title.value : '';
  const subtitle = slots.subtitle?.type === 'text' ? slots.subtitle.value : '';

  return (
    <div className="cb-page-a4" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, background: '#eee' }}>
        {asset && <img src={asset.printDataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ padding: '40px 48px', background: '#fff' }}>
        <h1 style={{ fontSize: 36, margin: 0, color: 'var(--theme-color-primary)' }}>{title || 'Catalogue Title'}</h1>
        <p style={{ fontSize: 16, margin: '8px 0 0', color: 'var(--theme-color-secondary)' }}>{subtitle}</p>
      </div>
    </div>
  );
};

export const coverLayout: LayoutDefinition = {
  id: 'cover',
  name: 'Cover Page',
  thumbnail: '',
  slots: [
    { id: 'coverImage', type: 'image', label: 'Cover Image' },
    { id: 'title', type: 'text', label: 'Title', placeholder: 'Spring Collection 2026' },
    { id: 'subtitle', type: 'text', label: 'Subtitle', placeholder: 'Season highlights' }
  ],
  Component: CoverLayout
};
