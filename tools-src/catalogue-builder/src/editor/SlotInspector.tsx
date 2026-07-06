import { useCatalogueStore, generateAssetId } from '../state/store';
import { getLayout } from '../layouts/registry';
import { processUploadedImage } from '../export/imageDownscale';
import {
  CODE_DATA_SOURCE_LABELS,
  resolveBoundProduct,
  resolveCodeValue,
  type CardCodeConfig,
  type CodeDataSource,
  type CodeGraphicType
} from '../domain/code';
import { CodeGraphic } from '../components/CodeGraphic';
import { sectionTitle, input, button } from './panelStyles';

export const SlotInspector: React.FC = () => {
  const project = useCatalogueStore((s) => s.project);
  const selectedPageId = useCatalogueStore((s) => s.selectedPageId);
  const selectedSlotId = useCatalogueStore((s) => s.selectedSlotId);
  const setSlotValue = useCatalogueStore((s) => s.setSlotValue);
  const addAsset = useCatalogueStore((s) => s.addAsset);

  const page = project.pages.find((p) => p.id === selectedPageId);
  const slotSchema = page ? getLayout(page.layoutId).slots.find((s) => s.id === selectedSlotId) : undefined;
  const slotValue = page && selectedSlotId ? page.slots[selectedSlotId] : undefined;

  if (!page || !slotSchema || !slotValue) {
    return <div style={{ fontSize: 12, color: 'var(--cb-color-muted)' }}>Select a slot on the canvas to edit it.</div>;
  }

  const handleImageUpload = async (file: File) => {
    const processed = await processUploadedImage(file);
    const id = generateAssetId();
    addAsset({ id, name: file.name, ...processed });
    setSlotValue(page.id, slotSchema.id, { type: 'image', assetId: id });
  };

  return (
    <div>
      <div style={{ ...sectionTitle, marginBottom: 8 }}>{slotSchema.label}</div>

      {slotValue.type === 'text' && (
        <textarea
          style={{ ...input, minHeight: 70, resize: 'vertical' }}
          placeholder={slotSchema.placeholder}
          value={slotValue.value}
          onChange={(e) => setSlotValue(page.id, slotSchema.id, { type: 'text', value: e.target.value })}
        />
      )}

      {slotValue.type === 'image' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {slotValue.assetId && project.assets[slotValue.assetId] && (
            <img
              src={project.assets[slotValue.assetId].previewDataUrl}
              alt=""
              style={{ width: '100%', borderRadius: 4 }}
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />
        </div>
      )}

      {slotValue.type === 'product' && (
        <div style={{ fontSize: 12 }}>
          {slotValue.product ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span>{slotValue.product.title}</span>
              <button
                style={button}
                onClick={() => setSlotValue(page.id, slotSchema.id, { ...slotValue, product: null })}
              >
                Remove
              </button>
            </div>
          ) : (
            <span style={{ color: 'var(--cb-color-muted)' }}>Add a product from the Catalog panel.</span>
          )}
          <CardCodeFields cardCode={slotValue.cardCode} onChange={(cardCode) => setSlotValue(page.id, slotSchema.id, { ...slotValue, cardCode })} />
        </div>
      )}

      {slotValue.type === 'productGrid' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
          {slotValue.products.length === 0 && (
            <span style={{ color: 'var(--cb-color-muted)' }}>
              Add up to {slotSchema.maxItems ?? '∞'} products from the Catalog panel.
            </span>
          )}
          {slotValue.products.map((product, index) => (
            <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.title}</span>
              <button
                style={{ ...button, padding: '2px 6px' }}
                disabled={index === 0}
                onClick={() => {
                  const products = [...slotValue.products];
                  [products[index - 1], products[index]] = [products[index], products[index - 1]];
                  setSlotValue(page.id, slotSchema.id, { ...slotValue, products });
                }}
              >
                ↑
              </button>
              <button
                style={{ ...button, padding: '2px 6px' }}
                disabled={index === slotValue.products.length - 1}
                onClick={() => {
                  const products = [...slotValue.products];
                  [products[index], products[index + 1]] = [products[index + 1], products[index]];
                  setSlotValue(page.id, slotSchema.id, { ...slotValue, products });
                }}
              >
                ↓
              </button>
              <button
                style={{ ...button, padding: '2px 6px' }}
                onClick={() =>
                  setSlotValue(page.id, slotSchema.id, {
                    ...slotValue,
                    products: slotValue.products.filter((p) => p.id !== product.id)
                  })
                }
              >
                ✕
              </button>
            </div>
          ))}
          <CardCodeFields cardCode={slotValue.cardCode} onChange={(cardCode) => setSlotValue(page.id, slotSchema.id, { ...slotValue, cardCode })} />
        </div>
      )}

      {slotValue.type === 'code' && (
        <CodeSlotFields
          value={slotValue}
          page={page}
          onChange={(next) => setSlotValue(page.id, slotSchema.id, next)}
          shopDomain={project.connection?.shopDomain ?? null}
        />
      )}
    </div>
  );
};

const CardCodeFields: React.FC<{
  cardCode: CardCodeConfig | null;
  onChange: (next: CardCodeConfig | null) => void;
}> = ({ cardCode, onChange }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      marginTop: 8,
      paddingTop: 8,
      borderTop: '1px solid var(--cb-color-border)'
    }}
  >
    <label>
      Card Code
      <select
        style={input}
        value={cardCode?.codeType ?? 'none'}
        onChange={(e) => {
          const kind = e.target.value;
          onChange(kind === 'none' ? null : { codeType: kind as CodeGraphicType, size: cardCode?.size });
        }}
      >
        <option value="none">None</option>
        <option value="qr">QR Code</option>
        <option value="barcode">Barcode</option>
      </select>
    </label>
    {cardCode && (
      <label>
        Size (px, optional)
        <input
          type="number"
          style={input}
          value={cardCode.size ?? ''}
          placeholder="Default"
          onChange={(e) => onChange({ ...cardCode, size: e.target.value ? Number(e.target.value) : undefined })}
        />
      </label>
    )}
  </div>
);

const CodeSlotFields: React.FC<{
  value: Extract<import('../domain/slot').SlotValue, { type: 'code' }>;
  page: import('../domain/project').Page;
  onChange: (next: Extract<import('../domain/slot').SlotValue, { type: 'code' }>) => void;
  shopDomain: string | null;
}> = ({ value, page, onChange, shopDomain }) => {
  const layout = getLayout(page.layoutId);
  const boundableSlots = layout.slots.filter((s) => s.type === 'product' || s.type === 'productGrid');
  const needsProduct = value.dataSource.kind !== 'custom';
  const product = resolveBoundProduct(page.slots, value.boundProductSlotId);
  const resolved = resolveCodeValue(value.dataSource, product, shopDomain ?? undefined);

  const setDataSource = (dataSource: CodeDataSource) => onChange({ ...value, dataSource });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
      <label>
        Type
        <select style={input} value={value.codeType} onChange={(e) => onChange({ ...value, codeType: e.target.value as 'qr' | 'barcode' })}>
          <option value="qr">QR Code</option>
          <option value="barcode">Barcode (Code-128)</option>
        </select>
      </label>

      <label>
        Data source
        <select
          style={input}
          value={value.dataSource.kind}
          onChange={(e) => {
            const kind = e.target.value as CodeDataSource['kind'];
            setDataSource(kind === 'custom' ? { kind: 'custom', value: '' } : { kind });
          }}
        >
          {Object.entries(CODE_DATA_SOURCE_LABELS).map(([kind, label]) => (
            <option key={kind} value={kind}>
              {label}
            </option>
          ))}
        </select>
      </label>

      {value.dataSource.kind === 'custom' && (
        <input
          style={input}
          placeholder="Text or URL to encode"
          value={value.dataSource.value}
          onChange={(e) => setDataSource({ kind: 'custom', value: e.target.value })}
        />
      )}

      {needsProduct && (
        <label>
          Bound product slot
          <select
            style={input}
            value={value.boundProductSlotId ?? ''}
            onChange={(e) => onChange({ ...value, boundProductSlotId: e.target.value || null })}
          >
            <option value="">— none —</option>
            {boundableSlots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
        <CodeGraphic type={value.codeType} value={resolved} />
      </div>
    </div>
  );
};
