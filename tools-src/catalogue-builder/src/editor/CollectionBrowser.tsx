import { useEffect, useMemo, useState } from 'react';
import { useCatalogueStore } from '../state/store';
import { getProductsForCollectionCached } from '../shopify/cache';
import type { ShopifyProduct } from '../domain/product';
import type { Page } from '../domain/project';
import { getLayout } from '../layouts/registry';
import { sectionTitle, button } from './panelStyles';

/** Which page numbers (1-indexed) each product already appears on, across every product/productGrid slot. */
function computeProductPageUsage(pages: Page[]): Map<string, number[]> {
  const usage = new Map<string, number[]>();
  pages.forEach((page, index) => {
    const pageNumber = index + 1;
    for (const slot of Object.values(page.slots)) {
      const productsInSlot: ShopifyProduct[] =
        slot.type === 'product' ? (slot.product ? [slot.product] : []) : slot.type === 'productGrid' ? slot.products : [];
      for (const product of productsInSlot) {
        const pageNumbers = usage.get(product.id) ?? [];
        if (!pageNumbers.includes(pageNumber)) pageNumbers.push(pageNumber);
        usage.set(product.id, pageNumbers);
      }
    }
  });
  return usage;
}

export const CollectionBrowser: React.FC = () => {
  const connection = useCatalogueStore((s) => s.project.connection);
  const collections = useCatalogueStore((s) => s.collections);
  const activeCollectionId = useCatalogueStore((s) => s.activeCollectionId);
  const setActiveCollection = useCatalogueStore((s) => s.setActiveCollection);

  const project = useCatalogueStore((s) => s.project);
  const selectedPageId = useCatalogueStore((s) => s.selectedPageId);
  const selectedSlotId = useCatalogueStore((s) => s.selectedSlotId);
  const setSlotValue = useCatalogueStore((s) => s.setSlotValue);

  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connection || !activeCollectionId) {
      setProducts([]);
      return;
    }
    setLoading(true);
    getProductsForCollectionCached(connection, activeCollectionId)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [connection, activeCollectionId]);

  const activePage = project.pages.find((p) => p.id === selectedPageId);
  const activeSlotSchema = activePage
    ? getLayout(activePage.layoutId).slots.find((s) => s.id === selectedSlotId)
    : undefined;

  const canAcceptProduct = activeSlotSchema?.type === 'product';
  const canAcceptGrid = activeSlotSchema?.type === 'productGrid';

  const addProduct = (product: ShopifyProduct) => {
    if (!activePage || !selectedSlotId) return;
    const current = activePage.slots[selectedSlotId];
    if (canAcceptProduct) {
      const cardCode = current?.type === 'product' ? current.cardCode : null;
      setSlotValue(activePage.id, selectedSlotId, { type: 'product', product, cardCode });
    } else if (canAcceptGrid) {
      const existing = current?.type === 'productGrid' ? current.products : [];
      const cardCode = current?.type === 'productGrid' ? current.cardCode : null;
      const max = activeSlotSchema?.maxItems ?? Infinity;
      if (existing.some((p) => p.id === product.id) || existing.length >= max) return;
      setSlotValue(activePage.id, selectedSlotId, { type: 'productGrid', products: [...existing, product], cardCode });
    }
  };

  const productPageUsage = useMemo(() => computeProductPageUsage(project.pages), [project.pages]);

  if (!connection) {
    return <div style={{ fontSize: 12, color: 'var(--cb-color-muted)' }}>Connect a store to browse its catalog.</div>;
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
        {collections.map((collection) => (
          <button
            key={collection.id}
            style={{
              ...button,
              textAlign: 'left',
              background: collection.id === activeCollectionId ? 'var(--cb-color-accent)' : '#fff',
              color: collection.id === activeCollectionId ? '#fff' : 'inherit'
            }}
            onClick={() => setActiveCollection(collection.id)}
          >
            {collection.title}
            {collection.id === activeCollectionId && (
              <span style={{ opacity: 0.6 }}> ({loading ? '…' : products.length})</span>
            )}
          </button>
        ))}
      </div>

      {activeCollectionId && (
        <>
          <div style={{ ...sectionTitle, marginTop: 12 }}>Products</div>
          {!canAcceptProduct && !canAcceptGrid && (
            <div style={{ fontSize: 11, color: 'var(--cb-color-muted)', marginBottom: 6 }}>
              Select a product or product-grid slot on the canvas to enable adding.
            </div>
          )}
          {loading && <div style={{ fontSize: 12 }}>Loading…</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto' }}>
            {products.map((product) => {
              const pageNumbers = productPageUsage.get(product.id);
              return (
                <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {product.featuredImage && (
                    <img
                      src={product.featuredImage.url}
                      alt=""
                      style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: 3 }}
                    />
                  )}
                  <span style={{ fontSize: 12, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.title}
                  </span>
                  {pageNumbers && (
                    <span
                      title={`Already on page ${pageNumbers.join(', ')}`}
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#fff',
                        background: 'var(--cb-color-accent)',
                        borderRadius: 999,
                        padding: '2px 6px',
                        flexShrink: 0
                      }}
                    >
                      P{pageNumbers.join(',')}
                    </span>
                  )}
                  <button
                    style={{ ...button, padding: '3px 8px', fontSize: 11 }}
                    disabled={!canAcceptProduct && !canAcceptGrid}
                    onClick={() => addProduct(product)}
                  >
                    Add
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};
