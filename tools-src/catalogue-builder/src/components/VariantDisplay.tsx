import type { ShopifyVariant } from '../domain/product';
import type { ThemeConfig } from '../domain/theme';

export interface VariantDisplayProps {
  variants: ShopifyVariant[];
  theme: ThemeConfig;
}

/** Renders a product's variants per the user's chosen theme.variantDisplay style - shared by every product card and hero-product so the logic lives in one place. */
export const VariantDisplay: React.FC<VariantDisplayProps> = ({ variants, theme }) => {
  // A single "Default Title" variant means the product has no real options - nothing to show.
  if (theme.variantDisplay === 'none' || variants.length <= 1) return null;

  if (theme.variantDisplay === 'count') {
    return <span style={{ fontSize: 10, color: theme.colorSecondary }}>{variants.length} options</span>;
  }

  const labels = variants.map((v) => v.selectedOptions.map((o) => o.value).join(' / ') || v.title);

  if (theme.variantDisplay === 'list') {
    return <span style={{ fontSize: 10, color: theme.colorSecondary }}>{labels.join(', ')}</span>;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {labels.map((label, i) => (
        <span
          key={variants[i].id}
          style={{
            fontSize: 9,
            padding: '2px 6px',
            borderRadius: 999,
            border: `1px solid ${theme.colorSecondary}55`,
            color: theme.colorSecondary
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
};
