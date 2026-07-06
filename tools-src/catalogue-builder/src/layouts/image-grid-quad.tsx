import type { LayoutDefinition, LayoutRenderProps } from './types';
import { SlotHotspot } from '../components/SlotHotspot';

const SLOT_IDS = ['imageA', 'imageB', 'imageC', 'imageD'] as const;

const ImageGridQuadLayout: React.FC<LayoutRenderProps> = ({ slots, assets, selectedSlotId, onSlotSelect }) => (
  <div
    className="cb-page-a4"
    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4 }}
  >
    {SLOT_IDS.map((slotId) => {
      const imageSlot = slots[slotId];
      const asset = imageSlot?.type === 'image' && imageSlot.assetId ? assets[imageSlot.assetId] : undefined;
      return (
        <SlotHotspot
          key={slotId}
          slotId={slotId}
          label="Image"
          selected={selectedSlotId === slotId}
          onSelect={onSlotSelect}
          empty={!asset}
          style={{ background: '#f2f2f2', overflow: 'hidden' }}
        >
          {asset && <img src={asset.printDataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </SlotHotspot>
      );
    })}
  </div>
);

/** A four-image mosaic - good for a lookbook moodboard page with no text at all. */
export const imageGridQuadLayout: LayoutDefinition = {
  id: 'image-grid-quad',
  name: 'Image Grid (2x2)',
  thumbnail: '',
  familyId: 'image-pages',
  familyName: 'Image Pages',
  slots: SLOT_IDS.map((id) => ({ id, type: 'image' as const, label: 'Image' })),
  Component: ImageGridQuadLayout
};
