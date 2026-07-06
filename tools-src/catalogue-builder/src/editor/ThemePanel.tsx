import { useCatalogueStore, generateAssetId } from '../state/store';
import { listProductCards } from '../product-cards/registry';
import { processUploadedImage } from '../export/imageDownscale';
import { input, button } from './panelStyles';

const FONT_OPTIONS = [
  { label: 'Helvetica', value: "'Helvetica Neue', Arial, sans-serif" },
  { label: 'Georgia (serif)', value: "Georgia, 'Times New Roman', serif" },
  { label: 'Courier (mono)', value: "'Courier New', monospace" }
];

export const ThemePanel: React.FC = () => {
  const project = useCatalogueStore((s) => s.project);
  const theme = project.theme;
  const updateTheme = useCatalogueStore((s) => s.updateTheme);
  const addAsset = useCatalogueStore((s) => s.addAsset);

  const logo = theme.logoAssetId ? project.assets[theme.logoAssetId] : undefined;

  const handleLogoUpload = async (file: File) => {
    const processed = await processUploadedImage(file);
    const id = generateAssetId();
    addAsset({ id, name: file.name, ...processed });
    updateTheme({ logoAssetId: id });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 12 }}>
          Brand Logo
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            {logo && (
              <img
                src={logo.previewDataUrl}
                alt=""
                style={{ width: 36, height: 36, objectFit: 'contain', border: '1px solid var(--cb-color-border)', borderRadius: 4, background: '#fff' }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleLogoUpload(file);
              }}
            />
            {logo && (
              <button style={{ ...button, padding: '4px 8px' }} onClick={() => updateTheme({ logoAssetId: null })}>
                Remove
              </button>
            )}
          </div>
          <span style={{ fontSize: 10, color: 'var(--cb-color-muted)' }}>
            Used by cover, back cover and section divider layouts that include a logo slot.
          </span>
        </div>

        <label style={{ fontSize: 12 }}>
          Heading Case
          <select
            style={input}
            value={theme.headingCase}
            onChange={(e) => updateTheme({ headingCase: e.target.value as typeof theme.headingCase })}
          >
            <option value="normal">Normal</option>
            <option value="uppercase">Uppercase</option>
          </select>
        </label>
        <label style={{ fontSize: 12 }}>
          Font
          <select style={input} value={theme.fontFamily} onChange={(e) => updateTheme({ fontFamily: e.target.value })}>
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ fontSize: 12 }}>
          Weight
          <select
            style={input}
            value={theme.fontWeight}
            onChange={(e) => updateTheme({ fontWeight: Number(e.target.value) })}
          >
            {[300, 400, 500, 600, 700].map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </label>

        <div style={{ display: 'flex', gap: 8 }}>
          <label style={{ fontSize: 12, flex: 1 }}>
            Primary
            <input
              type="color"
              style={{ ...input, padding: 2, height: 30 }}
              value={theme.colorPrimary}
              onChange={(e) => updateTheme({ colorPrimary: e.target.value })}
            />
          </label>
          <label style={{ fontSize: 12, flex: 1 }}>
            Secondary
            <input
              type="color"
              style={{ ...input, padding: 2, height: 30 }}
              value={theme.colorSecondary}
              onChange={(e) => updateTheme({ colorSecondary: e.target.value })}
            />
          </label>
          <label style={{ fontSize: 12, flex: 1 }}>
            Accent
            <input
              type="color"
              style={{ ...input, padding: 2, height: 30 }}
              value={theme.colorAccent}
              onChange={(e) => updateTheme({ colorAccent: e.target.value })}
            />
          </label>
        </div>

        <label style={{ fontSize: 12 }}>
          Border radius ({theme.borderRadius}px)
          <input
            type="range"
            min={0}
            max={24}
            value={theme.borderRadius}
            onChange={(e) => updateTheme({ borderRadius: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
        </label>

        <label style={{ fontSize: 12 }}>
          Variant Display
          <select
            style={input}
            value={theme.variantDisplay}
            onChange={(e) => updateTheme({ variantDisplay: e.target.value as typeof theme.variantDisplay })}
          >
            <option value="none">None</option>
            <option value="count">Count badge</option>
            <option value="list">Text list</option>
            <option value="swatches">Swatches</option>
          </select>
        </label>

        <label style={{ fontSize: 12 }}>
          Product Card
          <select
            style={input}
            value={theme.productCardVariant}
            onChange={(e) => updateTheme({ productCardVariant: e.target.value })}
          >
            {listProductCards().map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.name}
              </option>
            ))}
          </select>
        </label>
    </div>
  );
};
