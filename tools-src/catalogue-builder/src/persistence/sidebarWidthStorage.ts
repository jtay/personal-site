const STORAGE_KEY = 'catalogue-builder:sidebar-widths';
const VIEWPORT_BUCKET_SIZE = 100;

export interface SidebarWidths {
  left: number;
  right: number;
}

/** Groups nearby viewport widths together so a few px of window resize doesn't fragment storage. */
function bucketForViewport(viewportWidth: number): string {
  return String(Math.round(viewportWidth / VIEWPORT_BUCKET_SIZE) * VIEWPORT_BUCKET_SIZE);
}

function readAll(): Record<string, SidebarWidths> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Falls back to `defaults` when this viewport-width bucket has never been saved before. */
export function loadSidebarWidths(viewportWidth: number, defaults: SidebarWidths): SidebarWidths {
  const all = readAll();
  const saved = all[bucketForViewport(viewportWidth)];
  return saved ?? defaults;
}

export function saveSidebarWidths(viewportWidth: number, widths: SidebarWidths): void {
  try {
    const all = readAll();
    all[bucketForViewport(viewportWidth)] = widths;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Storage can fail in private-browsing contexts; this is a UX convenience, not critical.
  }
}
