import type { LayoutDefinition, LayoutRenderProps } from './types';
import { headingStyle } from '../domain/theme';
import { CodeSlot } from '../components/CodeSlot';
import { SlotHotspot } from '../components/SlotHotspot';

const BackCoverLayout: React.FC<LayoutRenderProps> = ({ slots, theme, assets, shopDomain, selectedSlotId, onSlotSelect }) => {
  const logo = theme.logoAssetId ? assets[theme.logoAssetId] : undefined;
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const details = slots.details?.type === 'text' ? slots.details.value : '';
  const scanCode = slots.scanCode?.type === 'code' ? slots.scanCode : null;

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
        background: 'var(--theme-color-primary)',
        color: '#fff',
        padding: '0 60px'
      }}
    >
      {logo && <img src={logo.previewDataUrl} alt="" style={{ width: 64, height: 64, objectFit: 'contain' }} />}
      <SlotHotspot
        slotId="heading"
        label="Heading"
        selected={selectedSlotId === 'heading'}
        onSelect={onSlotSelect}
        empty={!heading}
        emptyHint="Click to add heading"
        style={{ minHeight: 34, minWidth: 220 }}
      >
        {heading && <h2 style={{ fontSize: 24, margin: 0, ...headingStyle(theme) }}>{heading}</h2>}
      </SlotHotspot>
      <SlotHotspot
        slotId="details"
        label="Contact Details"
        selected={selectedSlotId === 'details'}
        onSelect={onSlotSelect}
        empty={!details}
        emptyHint="Click to add address, phone, email, website"
        style={{ minHeight: 60, minWidth: 240 }}
      >
        {details && <p style={{ fontSize: 13, margin: 0, opacity: 0.85, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{details}</p>}
      </SlotHotspot>
      {scanCode && (
        <SlotHotspot
          slotId="scanCode"
          label="Scan Code"
          selected={selectedSlotId === 'scanCode'}
          onSelect={onSlotSelect}
          style={{ background: '#fff', padding: 8, borderRadius: 4 }}
        >
          <CodeSlot value={scanCode} slots={slots} shopDomain={shopDomain} />
        </SlotHotspot>
      )}
    </div>
  );
};

/** Closing page: brand mark, contact details and a scannable link back to the store - the last thing a reader sees. */
export const backCoverLayout: LayoutDefinition = {
  id: 'back-cover',
  name: 'Back Cover',
  thumbnail: '',
  familyId: 'back-matter',
  familyName: 'Back Matter',
  slots: [
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'Thank You' },
    { id: 'details', type: 'text', label: 'Contact Details', placeholder: '123 Main St\nhello@brand.com\nbrand.com' },
    { id: 'scanCode', type: 'code', label: 'Scan Code' }
  ],
  Component: BackCoverLayout
};
