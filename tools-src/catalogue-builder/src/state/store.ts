import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Project, ShopConnection, Page } from '../domain/project';
import type { ShopifyCollection } from '../domain/product';
import type { ThemeConfig } from '../domain/theme';
import type { SlotValue } from '../domain/slot';
import type { ImageAsset } from '../domain/asset';
import { createNewProject, createPage } from '../domain/factory';

export interface Toast {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface CatalogueBuilderState {
  project: Project;
  selectedPageId: string | null;
  selectedSlotId: string | null;
  collections: ShopifyCollection[];
  activeCollectionId: string | null;
  isConnecting: boolean;
  connectionError: string | null;
  toasts: Toast[];
  lastRemovedPage: { page: Page; index: number } | null;

  setProject: (project: Project) => void;
  renameProject: (name: string) => void;

  setConnection: (connection: ShopConnection) => void;
  setConnectionStatus: (isConnecting: boolean, error: string | null) => void;
  setCollections: (collections: ShopifyCollection[]) => void;
  setActiveCollection: (id: string | null) => void;

  addPage: (layoutId: string) => void;
  removePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => void;
  restoreLastRemovedPage: () => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  selectPage: (pageId: string | null) => void;
  selectSlot: (slotId: string | null) => void;

  setSlotValue: (pageId: string, slotId: string, value: SlotValue) => void;
  updateTheme: (patch: Partial<ThemeConfig>) => void;

  addAsset: (asset: ImageAsset) => void;

  pushToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

function touch(project: Project): Project {
  return { ...project, updatedAt: new Date().toISOString() };
}

export const useCatalogueStore = create<CatalogueBuilderState>((set, get) => ({
  project: createNewProject(),
  selectedPageId: null,
  selectedSlotId: null,
  collections: [],
  activeCollectionId: null,
  isConnecting: false,
  connectionError: null,
  toasts: [],
  lastRemovedPage: null,

  setProject: (project) => set({ project, selectedPageId: project.pages[0]?.id ?? null }),

  renameProject: (name) => set((s) => ({ project: touch({ ...s.project, name }) })),

  setConnection: (connection) => set((s) => ({ project: touch({ ...s.project, connection }) })),

  setConnectionStatus: (isConnecting, error) => set({ isConnecting, connectionError: error }),

  setCollections: (collections) => set({ collections }),
  setActiveCollection: (id) => set({ activeCollectionId: id }),

  addPage: (layoutId) =>
    set((s) => {
      const page = createPage(layoutId);
      // Once a front/back cover exists (2+ pages), new pages land as interior content just
      // before the back cover, so the last page stays the back cover instead of being bumped.
      const insertAt = s.project.pages.length <= 1 ? s.project.pages.length : s.project.pages.length - 1;
      const pages = [...s.project.pages];
      pages.splice(insertAt, 0, page);
      return {
        project: touch({ ...s.project, pages }),
        selectedPageId: page.id,
        selectedSlotId: null
      };
    }),

  removePage: (pageId) => {
    const s = get();
    const index = s.project.pages.findIndex((p) => p.id === pageId);
    if (index === -1) return;
    const removed = s.project.pages[index];
    const pages = s.project.pages.filter((p) => p.id !== pageId);
    set({
      project: touch({ ...s.project, pages }),
      selectedPageId: s.selectedPageId === pageId ? (pages[0]?.id ?? null) : s.selectedPageId,
      lastRemovedPage: { page: removed, index }
    });
    get().pushToast({ message: 'Page removed', actionLabel: 'Undo', onAction: () => get().restoreLastRemovedPage() });
  },

  duplicatePage: (pageId) =>
    set((s) => {
      const index = s.project.pages.findIndex((p) => p.id === pageId);
      if (index === -1) return s;
      const source = s.project.pages[index];
      const copy: Page = { ...source, id: nanoid(), slots: { ...source.slots } };
      const pages = [...s.project.pages];
      pages.splice(index + 1, 0, copy);
      return { project: touch({ ...s.project, pages }), selectedPageId: copy.id, selectedSlotId: null };
    }),

  restoreLastRemovedPage: () =>
    set((s) => {
      if (!s.lastRemovedPage) return s;
      const { page, index } = s.lastRemovedPage;
      const pages = [...s.project.pages];
      pages.splice(Math.min(index, pages.length), 0, page);
      return { project: touch({ ...s.project, pages }), selectedPageId: page.id, lastRemovedPage: null };
    }),

  reorderPages: (fromIndex, toIndex) =>
    set((s) => {
      const pages = [...s.project.pages];
      const [moved] = pages.splice(fromIndex, 1);
      pages.splice(toIndex, 0, moved);
      return { project: touch({ ...s.project, pages }) };
    }),

  selectPage: (pageId) => set({ selectedPageId: pageId, selectedSlotId: null }),
  selectSlot: (slotId) => set({ selectedSlotId: slotId }),

  setSlotValue: (pageId, slotId, value) =>
    set((s) => ({
      project: touch({
        ...s.project,
        pages: s.project.pages.map((p) =>
          p.id === pageId ? { ...p, slots: { ...p.slots, [slotId]: value } } : p
        )
      })
    })),

  updateTheme: (patch) => set((s) => ({ project: touch({ ...s.project, theme: { ...s.project.theme, ...patch } }) })),

  addAsset: (asset) =>
    set((s) => ({ project: touch({ ...s.project, assets: { ...s.project.assets, [asset.id]: asset } }) })),

  pushToast: (toast) => {
    const id = nanoid();
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    window.setTimeout(() => get().dismissToast(id), 6000);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
}));

export function generateAssetId(): string {
  return nanoid();
}
