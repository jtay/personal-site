import { useRef } from 'react';
import { useCatalogueStore } from '../state/store';
import { downloadProject } from '../persistence/save';
import { loadProjectFromFile } from '../persistence/load';
import { PrintExportButton } from '../export/PrintExportButton';
import { button, input } from './panelStyles';

export const TopBar: React.FC = () => {
  const project = useCatalogueStore((s) => s.project);
  const renameProject = useCatalogueStore((s) => s.renameProject);
  const setProject = useCatalogueStore((s) => s.setProject);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoad = async (file: File) => {
    try {
      const loaded = await loadProjectFromFile(file);
      setProject(loaded);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not load project file.');
    }
  };

  return (
    <div
      style={{
        height: 48,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        borderBottom: '1px solid var(--cb-color-border)',
        background: 'var(--cb-color-panel)'
      }}
    >
      <strong style={{ fontSize: 13 }}>Catalogue Builder</strong>
      <input
        style={{ ...input, width: 220 }}
        value={project.name}
        onChange={(e) => renameProject(e.target.value)}
      />
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button style={button} onClick={() => fileInputRef.current?.click()}>
          Load
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,application/zip"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleLoad(file);
            e.target.value = '';
          }}
        />
        <button style={button} onClick={() => downloadProject(project)}>
          Save
        </button>
        <PrintExportButton project={project} />
      </div>
    </div>
  );
};
