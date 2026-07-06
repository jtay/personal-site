import type { LayoutDefinition, LayoutRenderProps } from './types';
import { headingStyle } from '../domain/theme';
import { SlotHotspot } from '../components/SlotHotspot';

const TocLayout: React.FC<LayoutRenderProps> = ({ slots, theme, selectedSlotId, onSlotSelect }) => {
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const entries = slots.entries?.type === 'list' ? slots.entries.items : [];

  return (
    <div className="cb-page-a4" style={{ padding: '64px 56px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <SlotHotspot
        slotId="heading"
        label="Heading"
        selected={selectedSlotId === 'heading'}
        onSelect={onSlotSelect}
        empty={!heading}
        emptyHint="Click to add heading"
        style={{ minHeight: 44 }}
      >
        {heading && <h1 style={{ fontSize: 32, margin: 0, color: 'var(--theme-color-primary)', ...headingStyle(theme) }}>{heading}</h1>}
      </SlotHotspot>
      <SlotHotspot
        slotId="entries"
        label="Entries"
        selected={selectedSlotId === 'entries'}
        onSelect={onSlotSelect}
        empty={entries.length === 0}
        emptyHint="Click to add entries"
        style={{ flex: 1, minHeight: 60 }}
      >
        {entries.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {entries.filter(e => e.text).map((entry) => (
              <div
                key={entry.id}
                style={{
                  fontSize: 15,
                  color: 'var(--theme-color-secondary)',
                  paddingBottom: 10,
                  borderBottom: `1px solid ${theme.colorSecondary}33`
                }}
              >
                {entry.text}
              </div>
            ))}
          </div>
        )}
      </SlotHotspot>
    </div>
  );
};

/** A manual contents list - one line per entry, since pages aren't dynamically numbered. Useful for longer catalogues split into sections. */
export const tocLayout: LayoutDefinition = {
  id: 'toc',
  name: 'Table of Contents',
  thumbnail: '',
  familyId: 'back-matter',
  familyName: 'Back Matter',
  slots: [
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'Contents' },
    { id: 'entries', type: 'list', label: 'Entries', placeholder: 'New Arrivals ... 04' }
  ],
  Component: TocLayout
};
