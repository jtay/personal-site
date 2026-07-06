import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Project, ShopConnection } from '../domain/project';
import type { ShopifyCollection } from '../domain/product';
import type { ThemeConfig } from '../domain/theme';
import type { SlotValue } from '../domain/slot';
import type { ImageAsset } from '../domain/asset';
import { createNewProject, createPage } from '../domain/factory';

interface CatalogueBuilderState {
  project: Project;
  selectedPageId: string | null;
  selectedSlotId: string | null;
  collections: ShopifyCollection[];
  activeCollectionId: string | null;
  isConnecting: boolean;
  connectionError: string | null;

  setProject: (project: Project) => void;
  renameProject: (name: string) => void;

  setConnection: (connection: ShopConnection) => void;
  setConnectionStatus: (isConnecting: boolean, error: string | null) => void;
  setCollections: (collections: ShopifyCollection[]) => void;
  setActiveCollection: (id: string | null) => void;

  addPage: (layoutId: string) => void;
  removePage: (pageId: string) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  selectPage: (pageId: string | null) => void;
  selectSlot: (slotId: string | null) => void;

  setSlotValue: (pageId: string, slotId: string, value: SlotValue) => void;
  updateTheme: (patch: Partial<ThemeConfig>) => void;

  addAsset: (asset: ImageAsset) => void;
}

function touch(project: Project): Project {
  return { ...project, updatedAt: new Date().toISOString() };
}

export const useCatalogueStore = create<CatalogueBuilderState>((set) => ({
  project: createNewProject(),
  selectedPageId: null,
  selectedSlotId: null,
  collections: [],
  activeCollectionId: null,
  isConnecting: false,
  connectionError: null,

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

  removePage: (pageId) =>
    set((s) => {
      const pages = s.project.pages.filter((p) => p.id !== pageId);
      return {
        project: touch({ ...s.project, pages }),
        selectedPageId: s.selectedPageId === pageId ? (pages[0]?.id ?? null) : s.selectedPageId
      };
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
    set((s) => ({ project: touch({ ...s.project, assets: { ...s.project.assets, [asset.id]: asset } }) }))
}));

export function generateAssetId(): string {
  return nanoid();
}
