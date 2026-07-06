const STORAGE_KEY = 'catalogue-builder:panel-open-state';

type PanelOpenState = Record<string, boolean>;

function readAll(): PanelOpenState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function loadPanelOpenState(id: string, fallback: boolean): boolean {
  const all = readAll();
  return typeof all[id] === 'boolean' ? all[id] : fallback;
}

export function savePanelOpenState(id: string, open: boolean): void {
  try {
    const all = readAll();
    all[id] = open;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Storage can fail in private-browsing contexts; this is a UX convenience, not critical.
  }
}
