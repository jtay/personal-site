import type { LayoutDefinition, LayoutRenderProps } from './types';

const ImageCaptionLayout: React.FC<LayoutRenderProps> = ({ slots, assets }) => {
  const imageSlot = slots.image;
  const asset = imageSlot?.type === 'image' && imageSlot.assetId ? assets[imageSlot.assetId] : undefined;
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const caption = slots.caption?.type === 'text' ? slots.caption.value : '';

  return (
    <div className="cb-page-a4" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: '1 1 auto', background: '#f2f2f2' }}>
        {asset && <img src={asset.printDataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ padding: '28px 40px', background: '#fff' }}>
        {heading && <h2 style={{ fontSize: 22, margin: '0 0 8px', color: 'var(--theme-color-primary)' }}>{heading}</h2>}
        {caption && <p style={{ fontSize: 13, margin: 0, color: 'var(--theme-color-secondary)', lineHeight: 1.6 }}>{caption}</p>}
      </div>
    </div>
  );
};

export const imageCaptionLayout: LayoutDefinition = {
  id: 'image-caption',
  name: 'Image + Caption',
  thumbnail: '',
  familyId: 'image-pages',
  familyName: 'Image Pages',
  slots: [
    { id: 'image', type: 'image', label: 'Image' },
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'Behind the Scenes' },
    { id: 'caption', type: 'text', label: 'Caption', placeholder: 'A short story about this image' }
  ],
  Component: ImageCaptionLayout
};
