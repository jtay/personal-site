import { useCatalogueStore } from '../state/store';
import { getLayout } from '../layouts/registry';
import { button } from './panelStyles';

export const PageList: React.FC = () => {
  const pages = useCatalogueStore((s) => s.project.pages);
  const selectedPageId = useCatalogueStore((s) => s.selectedPageId);
  const selectPage = useCatalogueStore((s) => s.selectPage);
  const removePage = useCatalogueStore((s) => s.removePage);
  const reorderPages = useCatalogueStore((s) => s.reorderPages);

  return (
    <>
      <div style={{ fontSize: 11, color: 'var(--cb-color-muted)', marginBottom: 6 }}>{pages.length} page(s)</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {pages.map((page, index) => (
          <div
            key={page.id}
            onClick={() => selectPage(page.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 8px',
              borderRadius: 4,
              cursor: 'pointer',
              background: page.id === selectedPageId ? 'var(--cb-color-accent)' : 'transparent',
              color: page.id === selectedPageId ? '#fff' : 'inherit'
            }}
          >
            <span style={{ fontSize: 11, opacity: 0.6, width: 16 }}>{index + 1}</span>
            <span style={{ fontSize: 13, flex: 1 }}>
              {getLayout(page.layoutId).name}
              {index === 0 && pages.length > 1 && (
                <span style={{ fontSize: 10, opacity: 0.7 }}> · Front Cover</span>
              )}
              {index === pages.length - 1 && pages.length > 1 && (
                <span style={{ fontSize: 10, opacity: 0.7 }}> · Back Cover</span>
              )}
            </span>
            <button
              style={{ ...button, padding: '2px 6px', fontSize: 11 }}
              disabled={index === 0}
              onClick={(e) => {
                e.stopPropagation();
                reorderPages(index, index - 1);
              }}
            >
              ↑
            </button>
            <button
              style={{ ...button, padding: '2px 6px', fontSize: 11 }}
              disabled={index === pages.length - 1}
              onClick={(e) => {
                e.stopPropagation();
                reorderPages(index, index + 1);
              }}
            >
              ↓
            </button>
            <button
              style={{ ...button, padding: '2px 6px', fontSize: 11 }}
              onClick={(e) => {
                e.stopPropagation();
                removePage(page.id);
              }}
            >
              ✕
            </button>
          </div>
        ))}
        {pages.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--cb-color-muted)' }}>No pages yet — add one below.</div>
        )}
      </div>
    </>
  );
};
