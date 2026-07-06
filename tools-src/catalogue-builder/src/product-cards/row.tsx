import type { ProductCardProps } from './types';
import { formatMoney } from '../domain/money';
import { VariantDisplay } from '../components/VariantDisplay';

/** A compact horizontal row rather than a card - built for wholesale price lists and order forms, where density matters more than imagery. */
export const RowProductCard: React.FC<ProductCardProps> = ({ product, theme, imageOverlay, belowImage }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 0',
      borderBottom: `1px solid ${theme.colorSecondary}33`
    }}
  >
    <div
      style={{
        position: 'relative',
        width: 44,
        height: 44,
        flexShrink: 0,
        overflow: 'hidden',
        borderRadius: theme.borderRadius,
        background: '#f2f2f2'
      }}
    >
      {product.featuredImage && (
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText ?? product.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {imageOverlay && (
        <div style={{ position: 'absolute', top: 2, right: 2, background: '#fff', padding: 1, borderRadius: 2 }}>
          {imageOverlay}
        </div>
      )}
    </div>
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: theme.fontWeight,
          color: theme.colorPrimary,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {product.title}
      </div>
      <VariantDisplay variants={product.variants} theme={theme} />
      {belowImage}
    </div>
    <div style={{ fontSize: 12, fontWeight: 600, color: theme.colorAccent, flexShrink: 0 }}>
      {formatMoney(product.priceRange.minVariantPrice)}
    </div>
  </div>
);
