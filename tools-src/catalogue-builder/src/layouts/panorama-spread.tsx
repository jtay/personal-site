import type { LayoutDefinition, LayoutRenderProps } from './types';
import { SlotHotspot } from '../components/SlotHotspot';

const PanoramaSpreadLayout: React.FC<LayoutRenderProps> = ({ slots, assets, selectedSlotId, onSlotSelect }) => {
  const imageSlot = slots.image;
  const asset = imageSlot?.type === 'image' && imageSlot.assetId ? assets[imageSlot.assetId] : undefined;
  const caption = slots.caption?.type === 'text' ? slots.caption.value : '';

  return (
    <div className="cb-spread-a4">
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
      {/* Caption sits on the right sheet only - text straddling the centre seam would be
          split awkwardly by the physical page/binding cut. */}
      <SlotHotspot
        slotId="caption"
        label="Caption"
        selected={selectedSlotId === 'caption'}
        onSelect={onSlotSelect}
        empty={!caption}
        emptyHint="Click to add caption"
        style={{ position: 'absolute', right: 64, bottom: 48, minWidth: 160, minHeight: 24, maxWidth: 500 }}
      >
        {caption && (
          <div
            style={{
              padding: '10px 18px',
              background: 'rgba(0,0,0,0.55)',
              color: '#fff',
              fontSize: 14,
              borderRadius: 4
            }}
          >
            {caption}
          </div>
        )}
      </SlotHotspot>
    </div>
  );
};

/** Double-page spread: one full-bleed image stretched across both sheets. */
export const panoramaSpreadLayout: LayoutDefinition = {
  id: 'panorama-spread',
  name: 'Panorama Spread',
  thumbnail: '',
  familyId: 'image-pages',
  familyName: 'Image Pages',
  spansSpread: true,
  slots: [
    { id: 'image', type: 'image', label: 'Image' },
    { id: 'caption', type: 'text', label: 'Caption', placeholder: 'Optional caption overlay' }
  ],
  Component: PanoramaSpreadLayout
};
