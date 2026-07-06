import { useCatalogueStore } from '../state/store';
import { computeBookViews, findViewIndexForPage, primaryPageIdForView, type BookView } from '../domain/book';

export interface BookNavigation {
  views: BookView[];
  viewIndex: number;
  view: BookView | undefined;
  goToView: (nextIndex: number) => void;
  goToPrevView: () => void;
  goToNextView: () => void;
}

/** Shared by PageCanvas (prev/next buttons) and the global keyboard shortcuts (arrow keys). */
export function useBookNavigation(): BookNavigation {
  const pages = useCatalogueStore((s) => s.project.pages);
  const selectedPageId = useCatalogueStore((s) => s.selectedPageId);
  const selectPage = useCatalogueStore((s) => s.selectPage);

  const views = computeBookViews(pages);
  const viewIndex = findViewIndexForPage(views, selectedPageId);
  const view = views[viewIndex];

  const goToView = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= views.length) return;
    const pageId = primaryPageIdForView(views, nextIndex);
    if (pageId) selectPage(pageId);
  };

  return {
    views,
    viewIndex,
    view,
    goToView,
    goToPrevView: () => goToView(viewIndex - 1),
    goToNextView: () => goToView(viewIndex + 1)
  };
}
