import { useEffect, useState, useSyncExternalStore } from 'react';
import { TopBar } from './editor/TopBar';
import { AccordionSection } from './editor/AccordionSection';
import { ResizableSidebar } from './editor/ResizableSidebar';
import { ConnectionPanel } from './editor/ConnectionPanel';
import { CollectionBrowser } from './editor/CollectionBrowser';
import { PageList } from './editor/PageList';
import { LayoutPicker } from './editor/LayoutPicker';
import { PageCanvas } from './editor/PageCanvas';
import { SlotInspector } from './editor/SlotInspector';
import { ThemePanel } from './editor/ThemePanel';
import { loadSidebarWidths, saveSidebarWidths, type SidebarWidths } from './persistence/sidebarWidthStorage';

const MIN_WIDTH = 1100;
const DEFAULT_SIDEBAR_WIDTHS: SidebarWidths = { left: 260, right: 280 };
const SIDEBAR_MIN = 200;
const SIDEBAR_MAX = 480;

function subscribeToResize(callback: () => void): () => void {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function useIsDesktopWidth(): boolean {
  return useSyncExternalStore(subscribeToResize, () => window.innerWidth >= MIN_WIDTH);
}

/** Sidebar widths persist per viewport-width bucket, so a laptop and an ultrawide monitor keep separate layouts. */
function useSidebarWidths(): [SidebarWidths, (next: SidebarWidths) => void] {
  const [widths, setWidths] = useState<SidebarWidths>(() => loadSidebarWidths(window.innerWidth, DEFAULT_SIDEBAR_WIDTHS));

  useEffect(() => {
    saveSidebarWidths(window.innerWidth, widths);
  }, [widths]);

  return [widths, setWidths];
}

export const App: React.FC = () => {
  const isDesktopWidth = useIsDesktopWidth();
  const [sidebarWidths, setSidebarWidths] = useSidebarWidths();

  if (!isDesktopWidth) {
    return (
      <div className="cb-unsupported">
        Catalogue Builder needs a wider screen (desktop only) — please resize your window or use a larger display.
      </div>
    );
  }

  return (
    <div className="cb-app">
      <TopBar />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: `${sidebarWidths.left}px 1fr ${sidebarWidths.right}px`,
          overflow: 'hidden'
        }}
      >
        <ResizableSidebar
          width={sidebarWidths.left}
          onResize={(left) => setSidebarWidths({ ...sidebarWidths, left })}
          minWidth={SIDEBAR_MIN}
          maxWidth={SIDEBAR_MAX}
          handleSide="right"
          borderStyle={{ borderRight: '1px solid var(--cb-color-border)' }}
        >
          <AccordionSection id="connection" title="Shopify Connection">
            <ConnectionPanel />
          </AccordionSection>
          <AccordionSection id="catalog" title="Catalog">
            <CollectionBrowser />
          </AccordionSection>
        </ResizableSidebar>

        <PageCanvas />

        <ResizableSidebar
          width={sidebarWidths.right}
          onResize={(right) => setSidebarWidths({ ...sidebarWidths, right })}
          minWidth={SIDEBAR_MIN}
          maxWidth={SIDEBAR_MAX}
          handleSide="left"
          borderStyle={{ borderLeft: '1px solid var(--cb-color-border)' }}
        >
          <AccordionSection id="add-page" title="Add Page">
            <LayoutPicker />
          </AccordionSection>
          <AccordionSection id="pages" title="Pages">
            <PageList />
          </AccordionSection>
          <AccordionSection id="slot" title="Slot">
            <SlotInspector />
          </AccordionSection>
          <AccordionSection id="theme" title="Theme" defaultOpen={false}>
            <ThemePanel />
          </AccordionSection>
        </ResizableSidebar>
      </div>
    </div>
  );
};
