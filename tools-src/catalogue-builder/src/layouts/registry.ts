import type { LayoutDefinition } from './types';
import { coverLayout } from './cover';
import { coverSplitLayout } from './cover-split';
import { coverMinimalLayout } from './cover-minimal';
import { productGridLayout } from './product-grid';
import { productGridMediumLayout } from './product-grid-medium';
import { productGridLargeLayout } from './product-grid-large';
import { productGridDenseLayout } from './product-grid-dense';
import { productListLayout } from './product-list';
import { heroProductLayout } from './hero-product';
import { heroDuoLayout } from './hero-duo';
import { heroTriptychLayout } from './hero-triptych';
import { heroLifestyleLayout } from './hero-lifestyle';
import { fullBleedImageLayout } from './full-bleed-image';
import { imageCaptionLayout } from './image-caption';
import { imageGridQuadLayout } from './image-grid-quad';
import { lookbookSpreadLayout } from './lookbook-spread';
import { adPageLayout } from './ad-page';
import { editorialLayout } from './editorial';
import { editorialDuoLayout } from './editorial-duo';
import { quotePageLayout } from './quote-page';
import { sectionDividerLayout } from './section-divider';
import { editorialSpreadLayout } from './editorial-spread';
import { panoramaSpreadLayout } from './panorama-spread';
import { backCoverLayout } from './back-cover';
import { tocLayout } from './toc';
import { orderFormLayout } from './order-form';
import { priceSheetLayout } from './price-sheet';

const registry = new Map<string, LayoutDefinition>();

/** Called once per layout module below; new layouts just call this from their own file. */
export function registerLayout(layout: LayoutDefinition): void {
  if (registry.has(layout.id)) {
    throw new Error(`Layout "${layout.id}" is already registered.`);
  }
  registry.set(layout.id, layout);
}

export function getLayout(id: string): LayoutDefinition {
  const layout = registry.get(id);
  if (!layout) {
    throw new Error(`Unknown layout "${id}". Registered: ${[...registry.keys()].join(', ')}`);
  }
  return layout;
}

export function listLayouts(): LayoutDefinition[] {
  return [...registry.values()];
}

export interface LayoutGroup {
  familyId: string | null;
  familyName: string | null;
  layouts: LayoutDefinition[];
}

/** Groups registered layouts by familyId (preserving registration order), ungrouped ones each get their own single-item group. */
export function listLayoutsGrouped(): LayoutGroup[] {
  const groups: LayoutGroup[] = [];
  const groupByFamilyId = new Map<string, LayoutGroup>();

  for (const layout of registry.values()) {
    if (!layout.familyId) {
      groups.push({ familyId: null, familyName: null, layouts: [layout] });
      continue;
    }
    let group = groupByFamilyId.get(layout.familyId);
    if (!group) {
      group = { familyId: layout.familyId, familyName: layout.familyName ?? layout.familyId, layouts: [] };
      groupByFamilyId.set(layout.familyId, group);
      groups.push(group);
    }
    group.layouts.push(layout);
  }

  return groups;
}

registerLayout(coverLayout);
registerLayout(coverSplitLayout);
registerLayout(coverMinimalLayout);
registerLayout(productGridLayout);
registerLayout(productGridMediumLayout);
registerLayout(productGridLargeLayout);
registerLayout(productGridDenseLayout);
registerLayout(productListLayout);
registerLayout(heroProductLayout);
registerLayout(heroDuoLayout);
registerLayout(heroTriptychLayout);
registerLayout(heroLifestyleLayout);
registerLayout(fullBleedImageLayout);
registerLayout(imageCaptionLayout);
registerLayout(imageGridQuadLayout);
registerLayout(lookbookSpreadLayout);
registerLayout(adPageLayout);
registerLayout(editorialLayout);
registerLayout(editorialDuoLayout);
registerLayout(quotePageLayout);
registerLayout(sectionDividerLayout);
registerLayout(editorialSpreadLayout);
registerLayout(panoramaSpreadLayout);
registerLayout(backCoverLayout);
registerLayout(tocLayout);
registerLayout(orderFormLayout);
registerLayout(priceSheetLayout);
