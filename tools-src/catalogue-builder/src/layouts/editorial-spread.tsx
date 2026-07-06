import type { LayoutDefinition, LayoutRenderProps } from './types';

const EditorialSpreadLayout: React.FC<LayoutRenderProps> = ({ slots, assets }) => {
  const imageSlot = slots.image;
  const asset = imageSlot?.type === 'image' && imageSlot.assetId ? assets[imageSlot.assetId] : undefined;
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const pullQuote = slots.pullQuote?.type === 'text' ? slots.pullQuote.value : '';
  const body = slots.body?.type === 'text' ? slots.body.value : '';

  return (
    <div className="cb-spread-a4" style={{ display: 'flex' }}>
      <div style={{ flex: '0 0 794px', background: '#f2f2f2' }}>
        {asset && <img src={asset.printDataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: '0 0 794px', padding: '72px 64px', display: 'flex', flexDirection: 'column', gap: 24, justifyContent: 'center' }}>
        {heading && <h1 style={{ fontSize: 40, margin: 0, color: 'var(--theme-color-primary)' }}>{heading}</h1>}
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
        <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--theme-color-secondary)', whiteSpace: 'pre-wrap' }}>{body}</p>
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
