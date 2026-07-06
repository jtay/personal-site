import type { LayoutDefinition, LayoutRenderProps } from './types';
import { SlotHotspot } from '../components/SlotHotspot';

const LookbookSpreadLayout: React.FC<LayoutRenderProps> = ({ slots, assets, selectedSlotId, onSlotSelect }) => {
  const resolve = (slotId: string) => {
    const imageSlot = slots[slotId];
    return imageSlot?.type === 'image' && imageSlot.assetId ? assets[imageSlot.assetId] : undefined;
  };
  const assetA = resolve('imageA');
  const assetB = resolve('imageB');
  const assetC = resolve('imageC');
  const caption = slots.caption?.type === 'text' ? slots.caption.value : '';

  return (
    <div className="cb-spread-a4" style={{ display: 'flex', gap: 4 }}>
      <SlotHotspot
        slotId="imageA"
        label="Image A"
        selected={selectedSlotId === 'imageA'}
        onSelect={onSlotSelect}
        empty={!assetA}
        style={{ flex: '0 0 794px', background: '#f2f2f2', overflow: 'hidden' }}
      >
        {assetA && <img src={assetA.printDataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </SlotHotspot>
      <div style={{ flex: '0 0 790px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <SlotHotspot
          slotId="imageB"
          label="Image B"
          selected={selectedSlotId === 'imageB'}
          onSelect={onSlotSelect}
          empty={!assetB}
          style={{ flex: '1 1 60%', background: '#f2f2f2', overflow: 'hidden' }}
        >
          {assetB && <img src={assetB.printDataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </SlotHotspot>
        <SlotHotspot
          slotId="imageC"
          label="Image C"
          selected={selectedSlotId === 'imageC'}
          onSelect={onSlotSelect}
          empty={!assetC}
          style={{ flex: '1 1 40%', background: '#f2f2f2', overflow: 'hidden' }}
        >
          {assetC && <img src={assetC.printDataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </SlotHotspot>
      </div>
      <SlotHotspot
        slotId="caption"
        label="Caption"
        selected={selectedSlotId === 'caption'}
        onSelect={onSlotSelect}
        empty={!caption}
        emptyHint="Click to add caption"
        style={{ position: 'absolute', left: 40, bottom: 32, minWidth: 160, minHeight: 24, maxWidth: 500 }}
      >
        {caption && (
          <div style={{ padding: '10px 18px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 14, borderRadius: 4 }}>
            {caption}
          </div>
        )}
      </SlotHotspot>
    </div>
  );
};

/** Double-page lookbook mosaic: one large image on the left sheet, two stacked images on the right - an asymmetric alternative to Panorama Spread. */
export const lookbookSpreadLayout: LayoutDefinition = {
  id: 'lookbook-spread',
  name: 'Lookbook Spread',
  thumbnail: '',
  familyId: 'image-pages',
  familyName: 'Image Pages',
  spansSpread: true,
  slots: [
    { id: 'imageA', type: 'image', label: 'Image A' },
    { id: 'imageB', type: 'image', label: 'Image B' },
    { id: 'imageC', type: 'image', label: 'Image C' },
    { id: 'caption', type: 'text', label: 'Caption', placeholder: 'Optional caption overlay' }
  ],
  Component: LookbookSpreadLayout
};
