import { useCatalogueStore } from '../state/store';
import { getLayout } from '../layouts/registry';
import { SlotInspector } from './SlotInspector';
import type { SlotValue } from '../domain/slot';
import { IconChevronLeft, IconChevronRight } from '../components/icons';

function isSlotFilled(value: SlotValue | undefined): boolean {
  if (!value) return false;
  switch (value.type) {
    case 'text':
      return value.value.trim() !== '';
    case 'image':
      return value.assetId !== null;
    case 'product':
      return value.product !== null;
    case 'productGrid':
      return value.products.length > 0;
    case 'code':
      return true;
  }
}

/**
 * Always-visible right panel (no longer an accordion you have to expand) - it updates to
 * whatever is selected on the canvas, so the fields you need are already open by the time
 * you've clicked a slot. When nothing is selected yet, it lists every slot on the page as a
 * fallback way in, for anyone who'd rather not hunt for the right spot on the canvas.
 */
export const InspectorPanel: React.FC = () => {
  const project = useCatalogueStore((s) => s.project);
  const selectedPageId = useCatalogueStore((s) => s.selectedPageId);
  const selectedSlotId = useCatalogueStore((s) => s.selectedSlotId);
  const selectSlot = useCatalogueStore((s) => s.selectSlot);

  const page = project.pages.find((p) => p.id === selectedPageId);
  const pageIndex = page ? project.pages.indexOf(page) : -1;
  const layout = page ? getLayout(page.layoutId) : null;

  return (
    <div className="cb-inspector">
      <div className="cb-inspector-header">
        {page ? (
          <>
            <span className="cb-inspector-header-page">Page {pageIndex + 1}</span>
            <span className="cb-inspector-header-layout">{layout?.name}</span>
          </>
        ) : (
          <span className="cb-inspector-header-page">No page selected</span>
        )}
      </div>
      <div className="cb-inspector-body">
        {selectedSlotId ? (
          <>
            <button className="cb-inspector-back" onClick={() => selectSlot(null)}>
              <IconChevronLeft size={13} /> All slots
            </button>
            <SlotInspector />
          </>
        ) : page && layout ? (
          <div className="cb-slot-list">
            <div className="cb-slot-list-hint">Click an element on the page, or pick a slot here.</div>
            {layout.slots.map((schema) => {
              const filled = isSlotFilled(page.slots[schema.id]);
              return (
                <button key={schema.id} className="cb-slot-list-item" onClick={() => selectSlot(schema.id)}>
                  <span className={`cb-slot-list-dot${filled ? ' cb-slot-list-dot--filled' : ''}`} />
                  <span className="cb-slot-list-label">{schema.label}</span>
                  <IconChevronRight size={13} />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="cb-inspector-empty">Select or add a page to start editing.</div>
        )}
      </div>
    </div>
  );
};
