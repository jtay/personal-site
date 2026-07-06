import { useEffect, useState, useSyncExternalStore } from 'react';
import { TopBar } from './editor/TopBar';
import { ConnectionPanel } from './editor/ConnectionPanel';
import { CollectionBrowser } from './editor/CollectionBrowser';
import { LayoutPicker } from './editor/LayoutPicker';
import { PageCanvas } from './editor/PageCanvas';
import { PageFilmstrip } from './editor/PageFilmstrip';
import { InspectorPanel } from './editor/InspectorPanel';
import { ThemePanel } from './editor/ThemePanel';
import { IconRail, type FlyoutId } from './editor/IconRail';
import { FlyoutPanel } from './editor/FlyoutPanel';
import { CommandPalette } from './editor/CommandPalette';
import { ToastStack } from './editor/ToastStack';
import { useCatalogueStore } from './state/store';
import { useBookNavigation } from './editor/useBookNavigation';
import { downloadProject } from './persistence/save';

const MIN_WIDTH = 1100;

function subscribeToResize(callback: () => void): () => void {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function useIsDesktopWidth(): boolean {
  return useSyncExternalStore(subscribeToResize, () => window.innerWidth >= MIN_WIDTH);
}

const FLYOUT_TITLES: Record<FlyoutId, string> = {
  products: 'Products',
  layouts: 'Add a page',
  design: 'Design',
  connection: 'Shopify connection'
};

function isTypingInField(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el as HTMLElement).isContentEditable;
}

/** Global keyboard shortcuts - guarded so they never hijack typing in a form field. */
function useGlobalShortcuts(onOpenPalette: () => void) {
  const selectedPageId = useCatalogueStore((s) => s.selectedPageId);
  const removePage = useCatalogueStore((s) => s.removePage);
  const duplicatePage = useCatalogueStore((s) => s.duplicatePage);
  const project = useCatalogueStore((s) => s.project);
  const { goToPrevView, goToNextView } = useBookNavigation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;

      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenPalette();
        return;
      }

      if (isTypingInField()) return;

      if (meta && e.key.toLowerCase() === 's') {
        e.preventDefault();
        downloadProject(project);
        return;
      }
      if (meta && e.key.toLowerCase() === 'd') {
        if (selectedPageId) {
          e.preventDefault();
          duplicatePage(selectedPageId);
        }
        return;
      }
      if (e.key === 'ArrowLeft') {
        goToPrevView();
        return;
      }
      if (e.key === 'ArrowRight') {
        goToNextView();
        return;
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedPageId) {
        e.preventDefault();
        removePage(selectedPageId);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedPageId, removePage, duplicatePage, project, goToPrevView, goToNextView, onOpenPalette]);
}

export const App: React.FC = () => {
  const isDesktopWidth = useIsDesktopWidth();
  const connection = useCatalogueStore((s) => s.project.connection);
  const [activeFlyout, setActiveFlyout] = useState<FlyoutId | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useGlobalShortcuts(() => setPaletteOpen(true));

  if (!isDesktopWidth) {
    return (
      <div className="cb-unsupported">
        Catalogue Builder needs a wider screen (desktop only) — please resize your window or use a larger display.
      </div>
    );
  }

  const toggleFlyout = (id: FlyoutId) => setActiveFlyout((cur) => (cur === id ? null : id));

  return (
    <div className="cb-app">
      <TopBar onOpenPalette={() => setPaletteOpen(true)} />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        <IconRail active={activeFlyout} onToggle={toggleFlyout} connected={!!connection} />

        {activeFlyout && (
          <FlyoutPanel title={FLYOUT_TITLES[activeFlyout]} onClose={() => setActiveFlyout(null)}>
            {activeFlyout === 'products' && <CollectionBrowser />}
            {activeFlyout === 'layouts' && <LayoutPicker />}
            {activeFlyout === 'design' && <ThemePanel />}
            {activeFlyout === 'connection' && <ConnectionPanel />}
          </FlyoutPanel>
        )}

        <PageCanvas />
        <InspectorPanel />
      </div>
      <PageFilmstrip onAddPage={() => setActiveFlyout('layouts')} />

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onOpenFlyout={setActiveFlyout} />
      <ToastStack />
    </div>
  );
};
