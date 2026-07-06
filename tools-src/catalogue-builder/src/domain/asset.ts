/**
 * An uploaded image lives once in the asset table, keyed by content hash, and is
 * referenced by id from any slot. Two derived resolutions are cached so the editor
 * stays fast while export still gets print-quality pixels.
 */
export interface ImageAsset {
  id: string;
  name: string;
  previewDataUrl: string; // small, for on-screen editing
  printDataUrl: string; // full-res, capped to print DPI, used at export time
  width: number;
  height: number;
}

export type AssetLibrary = Record<string, ImageAsset>;
