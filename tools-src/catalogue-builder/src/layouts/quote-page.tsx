import type { LayoutDefinition, LayoutRenderProps } from './types';
import { SlotHotspot } from '../components/SlotHotspot';

const QuotePageLayout: React.FC<LayoutRenderProps> = ({ slots, selectedSlotId, onSlotSelect }) => {
  const quote = slots.quote?.type === 'text' ? slots.quote.value : '';
  const attribution = slots.attribution?.type === 'text' ? slots.attribution.value : '';

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
        gap: 24,
        padding: '0 80px'
      }}
    >
      <SlotHotspot
        slotId="quote"
        label="Quote"
        selected={selectedSlotId === 'quote'}
        onSelect={onSlotSelect}
        empty={!quote}
        emptyHint="Click to add a quote or testimonial"
        style={{ minHeight: 80, minWidth: 240 }}
      >
        {quote && (
          <blockquote style={{ margin: 0, fontSize: 30, fontStyle: 'italic', lineHeight: 1.4 }}>
            &ldquo;{quote}&rdquo;
          </blockquote>
        )}
      </SlotHotspot>
      <SlotHotspot
        slotId="attribution"
        label="Attribution"
        selected={selectedSlotId === 'attribution'}
        onSelect={onSlotSelect}
        empty={!attribution}
        emptyHint="Click to add attribution"
        style={{ minHeight: 20, minWidth: 160 }}
      >
        {attribution && <p style={{ fontSize: 13, margin: 0, opacity: 0.75, letterSpacing: 0.5, textTransform: 'uppercase' }}>{attribution}</p>}
      </SlotHotspot>
    </div>
  );
};

/** A full-page testimonial or brand statement - a breathing-room page between denser product spreads. */
export const quotePageLayout: LayoutDefinition = {
  id: 'quote-page',
  name: 'Quote Page',
  thumbnail: '',
  familyId: 'editorial',
  familyName: 'Editorial',
  slots: [
    { id: 'quote', type: 'text', label: 'Quote', placeholder: 'A striking testimonial or brand statement' },
    { id: 'attribution', type: 'text', label: 'Attribution', placeholder: 'Jane Doe, Customer' }
  ],
  Component: QuotePageLayout
};
