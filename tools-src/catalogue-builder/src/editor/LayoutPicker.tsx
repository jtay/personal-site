import { useState } from 'react';
import { listLayoutsGrouped } from '../layouts/registry';
import { useCatalogueStore } from '../state/store';
import { button } from './panelStyles';

export const LayoutPicker: React.FC = () => {
  const addPage = useCatalogueStore((s) => s.addPage);
  const [expandedFamilyId, setExpandedFamilyId] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {listLayoutsGrouped().map((group) => {
          if (!group.familyId) {
            const layout = group.layouts[0];
            return (
              <button key={layout.id} style={{ ...button, textAlign: 'left' }} onClick={() => addPage(layout.id)}>
                + {layout.name}
              </button>
            );
          }

          const isExpanded = expandedFamilyId === group.familyId;
          return (
            <div key={group.familyId}>
              <button
                style={{ ...button, textAlign: 'left', width: '100%' }}
                onClick={() => setExpandedFamilyId(isExpanded ? null : group.familyId)}
              >
                + {group.familyName} ({group.layouts.length}) {isExpanded ? '▾' : '▸'}
              </button>
              {isExpanded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4, paddingLeft: 12 }}>
                  {group.layouts.map((layout) => (
                    <button
                      key={layout.id}
                      style={{ ...button, textAlign: 'left', fontSize: 12 }}
                      onClick={() => addPage(layout.id)}
                    >
                      {layout.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
