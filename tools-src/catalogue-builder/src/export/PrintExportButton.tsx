import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Project, Page } from '../domain/project';
import type { ThemeConfig } from '../domain/theme';
import type { AssetLibrary } from '../domain/asset';
import { getLayout } from '../layouts/registry';
import { themeToCssVars } from '../domain/theme';
import { computeBookViews } from '../domain/book';
import { buttonPrimary } from '../editor/panelStyles';

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const PRINT_WINDOW_FEATURES = 'width=900,height=1150,menubar=no,toolbar=no,location=no,status=no';

function clonePageStylesInto(doc: Document): void {
  document.head.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    doc.head.appendChild(node.cloneNode(true));
  });
}

interface RenderCtx {
  theme: ThemeConfig;
  assets: AssetLibrary;
  shopDomain: string | null;
}

const SinglePageSheet: React.FC<{ page: Page; ctx: RenderCtx }> = ({ page, ctx }) => {
  const layout = getLayout(page.layoutId);
  return (
    <div className="cb-page-a4" style={themeToCssVars(ctx.theme)}>
      <layout.Component slots={page.slots} theme={ctx.theme} assets={ctx.assets} shopDomain={ctx.shopDomain} />
    </div>
  );
};

const BlankPageSheet: React.FC = () => <div className="cb-page-a4" />;

/**
 * A spread-spanning layout renders once, at double-page width, inside each of the two
 * physical A4 sheets the spread occupies - each sheet clips to its own half via an
 * absolutely-positioned, horizontally-shifted copy of the same full-width render. This
 * keeps a normal printer/PDF viewer seeing an ordinary sequential page stack.
 */
const SpreadHalfSheet: React.FC<{ page: Page; ctx: RenderCtx; side: 'left' | 'right' }> = ({ page, ctx, side }) => {
  const layout = getLayout(page.layoutId);
  return (
    <div className="cb-page-a4">
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: side === 'left' ? 0 : -PAGE_WIDTH,
          width: PAGE_WIDTH * 2,
          height: PAGE_HEIGHT,
          ...themeToCssVars(ctx.theme)
        }}
      >
        <layout.Component slots={page.slots} theme={ctx.theme} assets={ctx.assets} shopDomain={ctx.shopDomain} />
      </div>
    </div>
  );
};

const PrintPages: React.FC<{ project: Project }> = ({ project }) => {
  const ctx: RenderCtx = { theme: project.theme, assets: project.assets, shopDomain: project.connection?.shopDomain ?? null };
  const views = computeBookViews(project.pages);

  return (
    <>
      {views.map((view, i) => {
        if (view.kind === 'cover' || view.kind === 'spread') {
          const left = view.kind === 'cover' ? view.page : view.left;
          const right = view.kind === 'cover' ? null : view.right;
          return (
            <div key={i} style={{ display: 'contents' }}>
              {left ? <SinglePageSheet page={left} ctx={ctx} /> : <BlankPageSheet />}
              {view.kind === 'spread' && (right ? <SinglePageSheet page={right} ctx={ctx} /> : <BlankPageSheet />)}
            </div>
          );
        }
        return (
          <div key={i} style={{ display: 'contents' }}>
            <SpreadHalfSheet page={view.page} ctx={ctx} side="left" />
            <SpreadHalfSheet page={view.page} ctx={ctx} side="right" />
          </div>
        );
      })}
    </>
  );
};

/**
 * Exporting used to print a hidden node inside the toolbox iframe itself, but the browser's
 * print-to-PDF "100%" scale is relative to that document's own layout/zoom - inside an
 * embedded iframe that came out scaled instead of true A4 size. Opening a plain, unscaled
 * popup window and printing *that* fixes the scale reference; it's also just a real page
 * the user can eyeball (and use Ctrl/Cmd+P on manually) before committing to Save as PDF.
 */
export const PrintExportButton: React.FC<{ project: Project }> = ({ project }) => {
  const [printWindow, setPrintWindow] = useState<Window | null>(null);

  const handleExport = () => {
    const win = window.open('', '_blank', PRINT_WINDOW_FEATURES);
    if (!win) {
      alert('Your browser blocked the export window - please allow pop-ups for this site and try again.');
      return;
    }
    win.document.title = `${project.name} - Export`;
    clonePageStylesInto(win.document);
    win.document.body.style.margin = '0';
    win.document.body.style.background = '#525659';
    setPrintWindow(win);
  };

  useEffect(() => {
    if (!printWindow) return;

    // Give the popup a beat to lay out and load remote product images before printing.
    const printTimer = window.setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);

    const closeCheck = window.setInterval(() => {
      if (printWindow.closed) {
        setPrintWindow(null);
      }
    }, 500);

    return () => {
      window.clearTimeout(printTimer);
      window.clearInterval(closeCheck);
    };
  }, [printWindow]);

  return (
    <>
      <button style={buttonPrimary} onClick={handleExport} disabled={project.pages.length === 0}>
        Export PDF
      </button>
      {printWindow && !printWindow.closed && createPortal(<PrintPages project={project} />, printWindow.document.body)}
    </>
  );
};
