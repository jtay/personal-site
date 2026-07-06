import type { LayoutDefinition, LayoutRenderProps } from './types';
import { headingStyle } from '../domain/theme';
import { SlotHotspot } from '../components/SlotHotspot';

const EditorialSpreadLayout: React.FC<LayoutRenderProps> = ({ slots, theme, assets, selectedSlotId, onSlotSelect }) => {
  const imageSlot = slots.image;
  const asset = imageSlot?.type === 'image' && imageSlot.assetId ? assets[imageSlot.assetId] : undefined;
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const pullQuote = slots.pullQuote?.type === 'text' ? slots.pullQuote.value : '';
  const body = slots.body?.type === 'text' ? slots.body.value : '';

  return (
    <div className="cb-spread-a4" style={{ display: 'flex' }}>
      <SlotHotspot
        slotId="image"
        label="Image"
        selected={selectedSlotId === 'image'}
        onSelect={onSlotSelect}
        empty={!asset}
        style={{ flex: '0 0 794px', background: '#f2f2f2' }}
      >
        {asset && <img src={asset.printDataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </SlotHotspot>
      <div style={{ flex: '0 0 794px', padding: '72px 64px', display: 'flex', flexDirection: 'column', gap: 24, justifyContent: 'center' }}>
        <SlotHotspot
          slotId="heading"
          label="Heading"
          selected={selectedSlotId === 'heading'}
          onSelect={onSlotSelect}
          empty={!heading}
          emptyHint="Click to add heading"
          style={{ minHeight: 48 }}
        >
          {heading && <h1 style={{ fontSize: 40, margin: 0, color: 'var(--theme-color-primary)', ...headingStyle(theme) }}>{heading}</h1>}
        </SlotHotspot>
        <SlotHotspot
          slotId="pullQuote"
          label="Pull Quote"
          selected={selectedSlotId === 'pullQuote'}
          onSelect={onSlotSelect}
          empty={!pullQuote}
          emptyHint="Click to add a pull quote"
          style={{ minHeight: 30 }}
        >
          {pullQuote && (
            <blockquote
              style={{
                margin: 0,
                fontSize: 24,
                fontStyle: 'italic',
                color: 'var(--theme-color-accent)',
                borderLeft: '3px solid var(--theme-color-accent)',
                paddingLeft: 20
              }}
            >
              {pullQuote}
            </blockquote>
          )}
        </SlotHotspot>
        <SlotHotspot
          slotId="body"
          label="Body Text"
          selected={selectedSlotId === 'body'}
          onSelect={onSlotSelect}
          empty={!body}
          emptyHint="Click to add body copy"
          style={{ minHeight: 60 }}
        >
          <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--theme-color-secondary)', whiteSpace: 'pre-wrap', margin: 0 }}>
            {body}
          </p>
        </SlotHotspot>
      </div>
    </div>
  );
};

/** Double-page spread: full-bleed image on the left sheet, copy on the right sheet. */
export const editorialSpreadLayout: LayoutDefinition = {
  id: 'editorial-spread',
  name: 'Editorial Spread',
  thumbnail: '',
  familyId: 'editorial',
  familyName: 'Editorial',
  spansSpread: true,
  slots: [
    { id: 'image', type: 'image', label: 'Image' },
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'The Story So Far' },
    { id: 'pullQuote', type: 'text', label: 'Pull Quote', placeholder: 'A striking line worth calling out' },
    { id: 'body', type: 'text', label: 'Body Text', placeholder: 'Longer editorial copy...' }
  ],
  Component: EditorialSpreadLayout
};
