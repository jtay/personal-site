import type { LayoutDefinition, LayoutRenderProps } from './types';
import { headingStyle } from '../domain/theme';
import { SlotHotspot } from '../components/SlotHotspot';

const EditorialDuoLayout: React.FC<LayoutRenderProps> = ({ slots, theme, selectedSlotId, onSlotSelect }) => {
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const columnLeft = slots.columnLeft?.type === 'text' ? slots.columnLeft.value : '';
  const columnRight = slots.columnRight?.type === 'text' ? slots.columnRight.value : '';

  return (
    <div className="cb-page-a4" style={{ padding: '56px 48px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <SlotHotspot
        slotId="heading"
        label="Heading"
        selected={selectedSlotId === 'heading'}
        onSelect={onSlotSelect}
        empty={!heading}
        emptyHint="Click to add heading"
        style={{ minHeight: 38 }}
      >
        {heading && <h1 style={{ fontSize: 30, margin: 0, color: 'var(--theme-color-primary)', ...headingStyle(theme) }}>{heading}</h1>}
      </SlotHotspot>
      <div style={{ display: 'flex', gap: 32, flex: 1 }}>
        <SlotHotspot
          slotId="columnLeft"
          label="Left Column"
          selected={selectedSlotId === 'columnLeft'}
          onSelect={onSlotSelect}
          empty={!columnLeft}
          emptyHint="Click to add body copy"
          style={{ flex: 1, minHeight: 60 }}
        >
          <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--theme-color-secondary)', whiteSpace: 'pre-wrap', margin: 0 }}>
            {columnLeft}
          </p>
        </SlotHotspot>
        <SlotHotspot
          slotId="columnRight"
          label="Right Column"
          selected={selectedSlotId === 'columnRight'}
          onSelect={onSlotSelect}
          empty={!columnRight}
          emptyHint="Click to add body copy"
          style={{ flex: 1, minHeight: 60 }}
        >
          <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--theme-color-secondary)', whiteSpace: 'pre-wrap', margin: 0 }}>
            {columnRight}
          </p>
        </SlotHotspot>
      </div>
    </div>
  );
};

/** Text-only two-column spread, no imagery - for brand story, "about us" or care/sizing information pages. */
export const editorialDuoLayout: LayoutDefinition = {
  id: 'editorial-duo',
  name: 'Editorial Duo',
  thumbnail: '',
  familyId: 'editorial',
  familyName: 'Editorial',
  slots: [
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'Our Story' },
    { id: 'columnLeft', type: 'text', label: 'Left Column', placeholder: 'First half of the copy...' },
    { id: 'columnRight', type: 'text', label: 'Right Column', placeholder: 'Second half of the copy...' }
  ],
  Component: EditorialDuoLayout
};
