import type { Page } from './project';
import { getLayout } from '../layouts/registry';

/**
 * The editor previews the project like a physical book: the first page is always the
 * front cover (shown alone), the last page is always the back cover (shown alone), and
 * everything between pairs up into two-page spreads - purely an editing convenience.
 * Export (PrintExportButton) stays sequential, one A4 sheet per printed page; this pairing
 * (and fullSpread splitting) never changes the physical page count or order.
 */
export type BookView =
  | { kind: 'cover'; side: 'front' | 'back'; page: Page }
  | { kind: 'spread'; left: Page | null; right: Page | null }
  | { kind: 'fullSpread'; page: Page };

export function computeBookViews(pages: Page[]): BookView[] {
  if (pages.length === 0) return [];
  if (pages.length === 1) return [{ kind: 'cover', side: 'front', page: pages[0] }];

  const front = pages[0];
  const back = pages[pages.length - 1];
  const interior = pages.slice(1, pages.length - 1);

  const views: BookView[] = [{ kind: 'cover', side: 'front', page: front }];

  let i = 0;
  while (i < interior.length) {
    const page = interior[i];
    if (getLayout(page.layoutId).spansSpread) {
      views.push({ kind: 'fullSpread', page });
      i += 1;
      continue;
    }
    const next = interior[i + 1];
    const nextSpansSpread = next ? getLayout(next.layoutId).spansSpread : false;
    if (next && !nextSpansSpread) {
      views.push({ kind: 'spread', left: page, right: next });
      i += 2;
    } else {
      views.push({ kind: 'spread', left: page, right: null });
      i += 1;
    }
  }

  views.push({ kind: 'cover', side: 'back', page: back });
  return views;
}

function primaryPageId(view: BookView): string | null {
  if (view.kind === 'cover' || view.kind === 'fullSpread') return view.page.id;
  return view.left?.id ?? view.right?.id ?? null;
}

export function findViewIndexForPage(views: BookView[], pageId: string | null): number {
  if (!pageId) return 0;
  const index = views.findIndex((view) => {
    if (view.kind === 'cover' || view.kind === 'fullSpread') return view.page.id === pageId;
    return view.left?.id === pageId || view.right?.id === pageId;
  });
  return index === -1 ? 0 : index;
}

/** The page id to focus when navigating to a given view (used by prev/next spread controls). */
export function primaryPageIdForView(views: BookView[], index: number): string | null {
  const view = views[index];
  return view ? primaryPageId(view) : null;
}
