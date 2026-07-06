import { useEffect, useState } from 'react';
import { useCatalogueStore } from '../state/store';
import { getLayout } from '../layouts/registry';
import { themeToCssVars } from '../domain/theme';
import { computeBookViews, findViewIndexForPage, primaryPageIdForView, type BookView } from '../domain/book';
import type { Page } from '../domain/project';

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const SPREAD_GAP = 4;
const STAGE_PADDING = 32;

/**
 * Uses a callback ref (rather than useRef + an empty-deps effect) so the ResizeObserver
 * attaches whenever the stage node actually mounts - including when it mounts *after*
 * the initial render (e.g. the canvas is conditionally rendered until a page exists).
 */
function useFitToStageScale(contentWidth: number, contentHeight: number): [(node: HTMLDivElement | null) => void, number] {
  const [stageNode, setStageNode] = useState<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!stageNode) return;

    const recompute = () => {
      const availableWidth = stageNode.clientWidth - STAGE_PADDING * 2;
      const availableHeight = stageNode.clientHeight - STAGE_PADDING * 2;
      const nextScale = Math.min(availableWidth / contentWidth, availableHeight / contentHeight, 1);
      setScale(Math.max(nextScale, 0.1));
    };

    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(stageNode);
    return () => observer.disconnect();
  }, [stageNode, contentWidth, contentHeight]);

  return [setStageNode, scale];
}

const PageSurface: React.FC<{ page: Page; scale: number; width?: number; focused?: boolean; onSelect?: () => void }> = ({
  page,
  scale,
  width = PAGE_WIDTH,
  focused,
  onSelect
}) => {
  const project = useCatalogueStore((s) => s.project);
  const layout = getLayout(page.layoutId);

  return (
    <div
      onClick={onSelect}
      style={{
        flexShrink: 0,
        width: width * scale,
        height: PAGE_HEIGHT * scale,
        overflow: 'hidden',
        position: 'relative',
        cursor: onSelect ? 'pointer' : undefined,
        outline: focused ? '3px solid var(--cb-color-accent)' : 'none',
        outlineOffset: 2
      }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', ...themeToCssVars(project.theme) }}>
        <layout.Component
          slots={page.slots}
          theme={project.theme}
          assets={project.assets}
          shopDomain={project.connection?.shopDomain ?? null}
        />
      </div>
    </div>
  );
};

const BlankPageSurface: React.FC<{ scale: number }> = ({ scale }) => (
  <div
    style={{
      flexShrink: 0,
      width: PAGE_WIDTH * scale,
      height: PAGE_HEIGHT * scale,
      background: 'repeating-linear-gradient(45deg, #f5f5f5, #f5f5f5 10px, #fafafa 10px, #fafafa 20px)'
    }}
  />
);

function viewLabel(view: BookView): string {
  if (view.kind === 'cover') return view.side === 'front' ? 'Front Cover' : 'Back Cover';
  if (view.kind === 'fullSpread') return 'Double-Page Spread';
  return 'Spread';
}

export const PageCanvas: React.FC = () => {
  const pages = useCatalogueStore((s) => s.project.pages);
  const selectedPageId = useCatalogueStore((s) => s.selectedPageId);
  const selectedSlotId = useCatalogueStore((s) => s.selectedSlotId);
  const selectSlot = useCatalogueStore((s) => s.selectSlot);
  const selectPage = useCatalogueStore((s) => s.selectPage);

  const views = computeBookViews(pages);
  const viewIndex = findViewIndexForPage(views, selectedPageId);
  const view = views[viewIndex];

  const isWide = view?.kind === 'spread' || view?.kind === 'fullSpread';
  const contentWidth = isWide ? PAGE_WIDTH * 2 + SPREAD_GAP : PAGE_WIDTH;
  const [stageRef, scale] = useFitToStageScale(contentWidth, PAGE_HEIGHT);

  if (!view) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cb-color-muted)' }}>
        Select or add a page to start editing.
      </div>
    );
  }

  const goToView = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= views.length) return;
    const pageId = primaryPageIdForView(views, nextIndex);
    if (pageId) selectPage(pageId);
  };

  const focusedPage =
    view.kind === 'cover' || view.kind === 'fullSpread'
      ? view.page
      : view.left?.id === selectedPageId
        ? view.left
        : view.right;
  const layoutForChips = focusedPage ? getLayout(focusedPage.layoutId) : null;

  return (
    <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 24, overflow: 'auto' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--cb-color-muted)' }}>
        <button onClick={() => goToView(viewIndex - 1)} disabled={viewIndex === 0} style={{ cursor: 'pointer' }}>
          ← Prev
        </button>
        <span>
          {viewLabel(view)} ({viewIndex + 1}/{views.length})
        </span>
        <button onClick={() => goToView(viewIndex + 1)} disabled={viewIndex === views.length - 1} style={{ cursor: 'pointer' }}>
          Next →
        </button>
      </div>

      <div ref={stageRef} style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: SPREAD_GAP }}>
          {view.kind === 'cover' && <PageSurface page={view.page} scale={scale} />}
          {view.kind === 'fullSpread' && (
            <PageSurface page={view.page} scale={scale} width={PAGE_WIDTH * 2 + SPREAD_GAP} focused />
          )}
          {view.kind === 'spread' && (
            <>
              {view.left ? (
                <PageSurface page={view.left} scale={scale} focused={view.left.id === selectedPageId} onSelect={() => selectPage(view.left!.id)} />
              ) : (
                <BlankPageSurface scale={scale} />
              )}
              {view.right ? (
                <PageSurface page={view.right} scale={scale} focused={view.right.id === selectedPageId} onSelect={() => selectPage(view.right!.id)} />
              ) : (
                <BlankPageSurface scale={scale} />
              )}
            </>
          )}
        </div>
      </div>

      {layoutForChips && (
        <div style={{ flexShrink: 0, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: contentWidth * scale }}>
          {layoutForChips.slots.map((slotSchema) => (
            <button
              key={slotSchema.id}
              onClick={() => selectSlot(slotSchema.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 4,
                border: '1px solid var(--cb-color-border)',
                background: slotSchema.id === selectedSlotId ? 'var(--cb-color-accent)' : '#fff',
                color: slotSchema.id === selectedSlotId ? '#fff' : 'inherit',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              {slotSchema.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
