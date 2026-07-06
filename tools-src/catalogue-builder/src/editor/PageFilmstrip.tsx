import { useState } from 'react';
import { useCatalogueStore } from '../state/store';
import { getLayout } from '../layouts/registry';
import { LayoutThumbnail } from '../components/LayoutThumbnail';
import { IconCopy, IconPlus, IconTrash } from '../components/icons';

const CARD_WIDTH = 64;
const CARD_HEIGHT = 90;

/**
 * Horizontal, drag-to-reorder page strip - replaces the old scrolling sidebar list. Frees up
 * vertical space for the canvas and turns "move page 8 to position 2" from six ↑ clicks into
 * one drag.
 */
export const PageFilmstrip: React.FC<{ onAddPage: () => void }> = ({ onAddPage }) => {
  const pages = useCatalogueStore((s) => s.project.pages);
  const selectedPageId = useCatalogueStore((s) => s.selectedPageId);
  const selectPage = useCatalogueStore((s) => s.selectPage);
  const removePage = useCatalogueStore((s) => s.removePage);
  const duplicatePage = useCatalogueStore((s) => s.duplicatePage);
  const reorderPages = useCatalogueStore((s) => s.reorderPages);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  return (
    <div className="cb-filmstrip">
      {pages.map((page, index) => {
        const layout = getLayout(page.layoutId);
        const isCover = pages.length > 1 && (index === 0 || index === pages.length - 1);
        const coverLabel = index === 0 ? 'Front' : 'Back';

        return (
          <div
            key={page.id}
            className={`cb-filmstrip-card${page.id === selectedPageId ? ' cb-filmstrip-card--selected' : ''}${
              overIndex === index ? ' cb-filmstrip-card--drop-target' : ''
            }`}
            draggable
            onClick={() => selectPage(page.id)}
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => {
              e.preventDefault();
              setOverIndex(index);
            }}
            onDragLeave={() => setOverIndex((cur) => (cur === index ? null : cur))}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex !== null && dragIndex !== index) reorderPages(dragIndex, index);
              setDragIndex(null);
              setOverIndex(null);
            }}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
            style={{ width: CARD_WIDTH }}
            title={layout.name}
          >
            <div style={{ width: CARD_WIDTH, height: CARD_HEIGHT, position: 'relative' }}>
              <LayoutThumbnail slots={layout.slots} />
              <div className="cb-filmstrip-card-actions">
                <button
                  aria-label="Duplicate page"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicatePage(page.id);
                  }}
                >
                  <IconCopy size={11} />
                </button>
                <button
                  aria-label="Remove page"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePage(page.id);
                  }}
                >
                  <IconTrash size={11} />
                </button>
              </div>
            </div>
            <div className="cb-filmstrip-card-label">
              <span>{index + 1}</span>
              {isCover && <span className="cb-filmstrip-card-badge">{coverLabel}</span>}
            </div>
          </div>
        );
      })}

      <button className="cb-filmstrip-add" onClick={onAddPage} aria-label="Add page">
        <IconPlus size={18} />
      </button>
    </div>
  );
};
