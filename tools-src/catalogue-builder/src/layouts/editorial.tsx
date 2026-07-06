import type { LayoutDefinition, LayoutRenderProps } from './types';

const EditorialLayout: React.FC<LayoutRenderProps> = ({ slots, assets }) => {
  const imageSlot = slots.image;
  const asset = imageSlot?.type === 'image' && imageSlot.assetId ? assets[imageSlot.assetId] : undefined;
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const pullQuote = slots.pullQuote?.type === 'text' ? slots.pullQuote.value : '';
  const body = slots.body?.type === 'text' ? slots.body.value : '';

  return (
    <div className="cb-page-a4" style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {heading && <h1 style={{ fontSize: 30, margin: 0, color: 'var(--theme-color-primary)' }}>{heading}</h1>}
      <div style={{ display: 'flex', gap: 24, flex: 1, minHeight: 0 }}>
        <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {pullQuote && (
            <blockquote
              style={{
                margin: 0,
                fontSize: 20,
                fontStyle: 'italic',
                color: 'var(--theme-color-accent)',
                borderLeft: '3px solid var(--theme-color-accent)',
                paddingLeft: 16
              }}
            >
              {pullQuote}
            </blockquote>
          )}
          <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--theme-color-secondary)', whiteSpace: 'pre-wrap' }}>{body}</p>
        </div>
        <div style={{ flex: '1 1 55%', background: '#f2f2f2', borderRadius: 'var(--theme-border-radius)', overflow: 'hidden' }}>
          {asset && <img src={asset.printDataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
      </div>
    </div>
  );
};

export const editorialLayout: LayoutDefinition = {
  id: 'editorial',
  name: 'Editorial',
  thumbnail: '',
  familyId: 'editorial',
  familyName: 'Editorial',
  slots: [
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'The Story So Far' },
    { id: 'pullQuote', type: 'text', label: 'Pull Quote', placeholder: 'A striking line worth calling out' },
    { id: 'body', type: 'text', label: 'Body Text', placeholder: 'Longer editorial copy...' },
    { id: 'image', type: 'image', label: 'Image' }
  ],
  Component: EditorialLayout
};
