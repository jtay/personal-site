import type { LayoutDefinition, LayoutRenderProps } from './types';
import { headingStyle } from '../domain/theme';
import { SlotHotspot } from '../components/SlotHotspot';

const CoverSplitLayout: React.FC<LayoutRenderProps> = ({ slots, theme, assets, selectedSlotId, onSlotSelect }) => {
  const imageSlot = slots.coverImage;
  const asset = imageSlot?.type === 'image' && imageSlot.assetId ? assets[imageSlot.assetId] : undefined;
  const logo = theme.logoAssetId ? assets[theme.logoAssetId] : undefined;
  const title = slots.title?.type === 'text' ? slots.title.value : '';
  const subtitle = slots.subtitle?.type === 'text' ? slots.subtitle.value : '';

  return (
    <div className="cb-page-a4" style={{ display: 'flex' }}>
      <div
        style={{
          flex: '0 0 40%',
          background: 'var(--theme-color-primary)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 16,
          padding: '0 40px'
        }}
      >
        {logo && <img src={logo.previewDataUrl} alt="" style={{ width: 64, height: 64, objectFit: 'contain' }} />}
        <SlotHotspot
          slotId="title"
          label="Title"
          selected={selectedSlotId === 'title'}
          onSelect={onSlotSelect}
          empty={!title}
          emptyHint="Click to add title"
          style={{ minHeight: 60 }}
        >
          {title && <h1 style={{ fontSize: 32, margin: 0, ...headingStyle(theme) }}>{title}</h1>}
        </SlotHotspot>
        <SlotHotspot
          slotId="subtitle"
          label="Subtitle"
          selected={selectedSlotId === 'subtitle'}
          onSelect={onSlotSelect}
          empty={!subtitle}
          emptyHint="Click to add subtitle"
          style={{ minHeight: 20 }}
        >
          {subtitle && <p style={{ fontSize: 15, margin: 0, opacity: 0.85 }}>{subtitle}</p>}
        </SlotHotspot>
      </div>
      <SlotHotspot
        slotId="coverImage"
        label="Cover Image"
        selected={selectedSlotId === 'coverImage'}
        onSelect={onSlotSelect}
        empty={!asset}
        style={{ flex: '1 1 60%', background: '#eee' }}
      >
        {asset && <img src={asset.printDataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </SlotHotspot>
    </div>
  );
};

/** A brand-forward alternative to the plain photographic cover - a solid color panel carries the logo and title, image fills the rest. */
export const coverSplitLayout: LayoutDefinition = {
  id: 'cover-split',
  name: 'Cover Split',
  thumbnail: '',
  familyId: 'cover',
  familyName: 'Cover',
  slots: [
    { id: 'coverImage', type: 'image', label: 'Cover Image' },
    { id: 'title', type: 'text', label: 'Title', placeholder: 'Spring Collection 2026' },
    { id: 'subtitle', type: 'text', label: 'Subtitle', placeholder: 'Season highlights' }
  ],
  Component: CoverSplitLayout
};
