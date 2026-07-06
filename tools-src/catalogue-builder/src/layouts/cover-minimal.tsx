import type { LayoutDefinition, LayoutRenderProps } from './types';
import { headingStyle } from '../domain/theme';
import { SlotHotspot } from '../components/SlotHotspot';

const CoverMinimalLayout: React.FC<LayoutRenderProps> = ({ slots, theme, assets, selectedSlotId, onSlotSelect }) => {
  const logo = theme.logoAssetId ? assets[theme.logoAssetId] : undefined;
  const title = slots.title?.type === 'text' ? slots.title.value : '';
  const subtitle = slots.subtitle?.type === 'text' ? slots.subtitle.value : '';

  return (
    <div
      className="cb-page-a4"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 20,
        padding: '0 60px'
      }}
    >
      {logo && <img src={logo.previewDataUrl} alt="" style={{ width: 88, height: 88, objectFit: 'contain', marginBottom: 8 }} />}
      <SlotHotspot
        slotId="title"
        label="Title"
        selected={selectedSlotId === 'title'}
        onSelect={onSlotSelect}
        empty={!title}
        emptyHint="Click to add title"
        style={{ minHeight: 48, minWidth: 240 }}
      >
        {title && <h1 style={{ fontSize: 38, margin: 0, color: 'var(--theme-color-primary)', ...headingStyle(theme) }}>{title}</h1>}
      </SlotHotspot>
      <SlotHotspot
        slotId="subtitle"
        label="Subtitle"
        selected={selectedSlotId === 'subtitle'}
        onSelect={onSlotSelect}
        empty={!subtitle}
        emptyHint="Click to add subtitle"
        style={{ minHeight: 20, minWidth: 200 }}
      >
        {subtitle && <p style={{ fontSize: 16, margin: 0, color: 'var(--theme-color-secondary)' }}>{subtitle}</p>}
      </SlotHotspot>
    </div>
  );
};

/** No hero photography - just the logo and typography, for wholesale line sheets and brand-first catalogues. */
export const coverMinimalLayout: LayoutDefinition = {
  id: 'cover-minimal',
  name: 'Cover Minimal',
  thumbnail: '',
  familyId: 'cover',
  familyName: 'Cover',
  slots: [
    { id: 'title', type: 'text', label: 'Title', placeholder: 'Wholesale Line Sheet' },
    { id: 'subtitle', type: 'text', label: 'Subtitle', placeholder: 'Fall / Winter 2026' }
  ],
  Component: CoverMinimalLayout
};
