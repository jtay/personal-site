import { useEffect, useState } from 'react';
import { useCatalogueStore } from '../state/store';
import { getLayout, listLayouts } from '../layouts/registry';
import { downloadProject } from '../persistence/save';
import { IconSearch } from '../components/icons';
import type { FlyoutId } from './IconRail';

interface Command {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onOpenFlyout: (id: FlyoutId) => void;
}

/** Cmd/Ctrl+K quick-action palette, for jumping around a large catalogue without hunting through panels. */
export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose, onOpenFlyout }) => {
  const pages = useCatalogueStore((s) => s.project.pages);
  const project = useCatalogueStore((s) => s.project);
  const addPage = useCatalogueStore((s) => s.addPage);
  const selectPage = useCatalogueStore((s) => s.selectPage);

  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);

  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlighted(0);
    }
  }, [open]);

  if (!open) return null;

  const commands: Command[] = [
    ...pages.map((p, i) => ({
      id: `goto-${p.id}`,
      label: `Go to page ${i + 1}`,
      hint: getLayout(p.layoutId).name,
      run: () => selectPage(p.id)
    })),
    ...listLayouts().map((l) => ({
      id: `add-${l.id}`,
      label: `Add page: ${l.name}`,
      run: () => addPage(l.id)
    })),
    { id: 'open-products', label: 'Browse products', run: () => onOpenFlyout('products') },
    { id: 'open-design', label: 'Open design settings', run: () => onOpenFlyout('design') },
    { id: 'open-connection', label: 'Store connection', run: () => onOpenFlyout('connection') },
    { id: 'save', label: 'Save project file', run: () => downloadProject(project) }
  ];

  const filtered = query.trim()
    ? commands.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase()))
    : commands;
  const clampedHighlight = Math.min(highlighted, Math.max(filtered.length - 1, 0));

  const runAt = (index: number) => {
    const cmd = filtered[index];
    if (!cmd) return;
    cmd.run();
    onClose();
  };

  return (
    <div className="cb-palette-overlay" onClick={onClose}>
      <div className="cb-palette" onClick={(e) => e.stopPropagation()}>
        <div className="cb-palette-search">
          <IconSearch size={15} />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlighted(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlighted((h) => Math.max(h - 1, 0));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                runAt(clampedHighlight);
              } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
              }
            }}
            placeholder="Jump to a page, add a layout, open a panel..."
          />
        </div>
        <div className="cb-palette-list">
          {filtered.length === 0 && <div className="cb-palette-empty">No matches</div>}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              className={`cb-palette-item${i === clampedHighlight ? ' cb-palette-item--active' : ''}`}
              onMouseEnter={() => setHighlighted(i)}
              onClick={() => runAt(i)}
            >
              <span>{cmd.label}</span>
              {cmd.hint && <span className="cb-palette-hint">{cmd.hint}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
