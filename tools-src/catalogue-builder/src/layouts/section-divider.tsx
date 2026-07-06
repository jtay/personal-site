import type { LayoutDefinition, LayoutRenderProps } from './types';
import { SlotHotspot } from '../components/SlotHotspot';

const SectionDividerLayout: React.FC<LayoutRenderProps> = ({ slots, selectedSlotId, onSlotSelect }) => {
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const subheading = slots.subheading?.type === 'text' ? slots.subheading.value : '';

  return (
    <div
      className="cb-page-a4"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: 'var(--theme-color-primary)',
        color: '#fff',
        gap: 12,
        padding: '0 60px'
      }}
    >
      <SlotHotspot
        slotId="heading"
        label="Heading"
        selected={selectedSlotId === 'heading'}
        onSelect={onSlotSelect}
        empty={!heading}
        emptyHint="Click to add heading"
        style={{ minHeight: 48, minWidth: 200 }}
      >
        {heading && <h1 style={{ fontSize: 40, margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>{heading}</h1>}
      </SlotHotspot>
      <SlotHotspot
        slotId="subheading"
        label="Subheading"
        selected={selectedSlotId === 'subheading'}
        onSelect={onSlotSelect}
        empty={!subheading}
        emptyHint="Click to add subheading"
        style={{ minHeight: 20, minWidth: 200 }}
      >
        {subheading && <p style={{ fontSize: 15, margin: 0, opacity: 0.75 }}>{subheading}</p>}
      </SlotHotspot>
    </div>
  );
};

/** A minimal section-break/intermediary page - just a heading, useful between chapters of the catalogue. */
export const sectionDividerLayout: LayoutDefinition = {
  id: 'section-divider',
  name: 'Section Divider',
  thumbnail: '',
  slots: [
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'New Arrivals' },
    { id: 'subheading', type: 'text', label: 'Subheading', placeholder: 'Optional supporting line' }
  ],
  Component: SectionDividerLayout
};
