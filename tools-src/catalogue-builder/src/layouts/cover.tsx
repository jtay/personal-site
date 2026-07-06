import type { LayoutDefinition, LayoutRenderProps } from './types';
import { headingStyle } from '../domain/theme';
import { SlotHotspot } from '../components/SlotHotspot';

const CoverLayout: React.FC<LayoutRenderProps> = ({ slots, theme, assets, selectedSlotId, onSlotSelect }) => {
  const imageSlot = slots.coverImage;
  const asset = imageSlot?.type === 'image' && imageSlot.assetId ? assets[imageSlot.assetId] : undefined;
  const title = slots.title?.type === 'text' ? slots.title.value : '';
  const subtitle = slots.subtitle?.type === 'text' ? slots.subtitle.value : '';

  return (
    <div className="cb-page-a4" style={{ display: 'flex', flexDirection: 'column' }}>
      <SlotHotspot
        slotId="coverImage"
        label="Cover Image"
        selected={selectedSlotId === 'coverImage'}
        onSelect={onSlotSelect}
        empty={!asset}
        style={{ flex: 1, background: '#eee' }}
      >
        {asset && <img src={asset.printDataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </SlotHotspot>
      <div style={{ padding: '40px 48px', background: '#fff' }}>
        <SlotHotspot slotId="title" label="Title" selected={selectedSlotId === 'title'} onSelect={onSlotSelect}>
          <h1 style={{ fontSize: 36, margin: 0, color: 'var(--theme-color-primary)', ...headingStyle(theme) }}>{title || 'Catalogue Title'}</h1>
        </SlotHotspot>
        <SlotHotspot
          slotId="subtitle"
          label="Subtitle"
          selected={selectedSlotId === 'subtitle'}
          onSelect={onSlotSelect}
          style={{ marginTop: 8 }}
        >
          <p style={{ fontSize: 16, margin: 0, color: 'var(--theme-color-secondary)' }}>{subtitle}</p>
        </SlotHotspot>
      </div>
    </div>
  );
};

export const coverLayout: LayoutDefinition = {
  id: 'cover',
  name: 'Cover Page',
  thumbnail: '',
  familyId: 'cover',
  familyName: 'Cover',
  slots: [
    { id: 'coverImage', type: 'image', label: 'Cover Image' },
    { id: 'title', type: 'text', label: 'Title', placeholder: 'Spring Collection 2026' },
    { id: 'subtitle', type: 'text', label: 'Subtitle', placeholder: 'Season highlights' }
  ],
  Component: CoverLayout
};
