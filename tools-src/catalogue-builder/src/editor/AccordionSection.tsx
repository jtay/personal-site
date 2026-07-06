import { useEffect, useState } from 'react';
import { loadPanelOpenState, savePanelOpenState } from '../persistence/panelStateStorage';
import { panel, sectionTitle } from './panelStyles';

export interface AccordionSectionProps {
  /** Stable identity used as the localStorage key - keep it constant across renames. */
  id: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/** Shared collapsible wrapper for every sidebar panel, with its open/closed state cached per-section. */
export const AccordionSection: React.FC<AccordionSectionProps> = ({ id, title, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(() => loadPanelOpenState(id, defaultOpen));

  useEffect(() => {
    savePanelOpenState(id, open);
  }, [id, open]);

  return (
    <div style={panel}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          marginBottom: open ? 8 : 0
        }}
      >
        <span style={{ ...sectionTitle, marginBottom: 0 }}>{title}</span>
        <span style={{ fontSize: 10, color: 'var(--cb-color-muted)' }}>{open ? '▾' : '▸'}</span>
      </button>
      {open && children}
    </div>
  );
};
