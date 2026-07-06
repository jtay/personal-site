import { useState } from 'react';
import { listLayoutsGrouped } from '../layouts/registry';
import { useCatalogueStore } from '../state/store';
import { LayoutThumbnail } from '../components/LayoutThumbnail';

interface FlatLayoutEntry {
  key: string;
  familyName: string | null;
  name: string;
  layoutId: string;
  slots: import('../domain/slot').SlotSchema[];
  spansSpread?: boolean;
}

function flattenGroups(): FlatLayoutEntry[] {
  return listLayoutsGrouped().flatMap((group) =>
    group.layouts.map((layout) => ({
      key: layout.id,
      familyName: group.familyName,
      name: layout.name,
      layoutId: layout.id,
      slots: layout.slots,
      spansSpread: layout.spansSpread
    }))
  );
}

/** Visual gallery of every registered layout, filterable by family, each with a generated schematic preview. */
export const LayoutPicker: React.FC = () => {
  const addPage = useCatalogueStore((s) => s.addPage);
  const entries = flattenGroups();
  const families = ['All', ...Array.from(new Set(entries.map((e) => e.familyName ?? e.name)))];
  const [filter, setFilter] = useState('All');

  const visible = filter === 'All' ? entries : entries.filter((e) => (e.familyName ?? e.name) === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {families.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontSize: 11,
              padding: '3px 9px',
              borderRadius: 20,
              border: '1px solid var(--cb-color-border)',
              background: filter === f ? 'var(--cb-color-accent)' : '#fff',
              color: filter === f ? '#fff' : 'inherit',
              cursor: 'pointer'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {visible.map((entry) => (
          <button
            key={entry.key}
            onClick={() => addPage(entry.layoutId)}
            title={`Add ${entry.name}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: 8,
              border: '1px solid var(--cb-color-border)',
              borderRadius: 6,
              background: '#fff',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <LayoutThumbnail slots={entry.slots} wide={entry.spansSpread} />
            <span style={{ fontSize: 11, lineHeight: 1.3 }}>{entry.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
