import type { LayoutDefinition, LayoutRenderProps } from './types';
import { SlotHotspot } from '../components/SlotHotspot';

const FullBleedImageLayout: React.FC<LayoutRenderProps> = ({ slots, assets, selectedSlotId, onSlotSelect }) => {
  const imageSlot = slots.image;
  const asset = imageSlot?.type === 'image' && imageSlot.assetId ? assets[imageSlot.assetId] : undefined;
  const caption = slots.caption?.type === 'text' ? slots.caption.value : '';

  return (
    <div className="cb-page-a4">
      <SlotHotspot
        slotId="image"
        label="Image"
        selected={selectedSlotId === 'image'}
        onSelect={onSlotSelect}
        empty={!asset}
        style={{ position: 'absolute', inset: 0 }}
      >
        {asset && <img src={asset.printDataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </SlotHotspot>
      <SlotHotspot
        slotId="caption"
        label="Caption"
        selected={selectedSlotId === 'caption'}
        onSelect={onSlotSelect}
        empty={!caption}
        emptyHint="Click to add caption"
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 40 }}
      >
        {caption && (
          <div
            style={{
              padding: '24px 36px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
              color: '#fff',
              fontSize: 14
            }}
          >
            {caption}
          </div>
        )}
      </SlotHotspot>
    </div>
  );
};

export const fullBleedImageLayout: LayoutDefinition = {
  id: 'full-bleed-image',
  name: 'Full Bleed Image',
  thumbnail: '',
  familyId: 'image-pages',
  familyName: 'Image Pages',
  slots: [
    { id: 'image', type: 'image', label: 'Image' },
    { id: 'caption', type: 'text', label: 'Caption', placeholder: 'Optional caption overlay' }
  ],
  Component: FullBleedImageLayout
};
