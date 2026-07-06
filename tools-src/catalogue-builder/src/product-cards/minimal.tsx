import type { ProductCardProps } from './types';
import { formatMoney } from '../domain/money';
import { VariantDisplay } from '../components/VariantDisplay';

export const MinimalProductCard: React.FC<ProductCardProps> = ({ product, theme, imageOverlay, belowImage }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
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
        <div style={{ position: 'absolute', top: 4, right: 4, background: '#fff', padding: 2, borderRadius: 2 }}>
          {imageOverlay}
        </div>
      )}
    </div>
    {belowImage}
    <div style={{ fontSize: 12, fontWeight: theme.fontWeight, color: theme.colorPrimary }}>{product.title}</div>
    <div style={{ fontSize: 11, color: theme.colorSecondary }}>{formatMoney(product.priceRange.minVariantPrice)}</div>
    <VariantDisplay variants={product.variants} theme={theme} />
  </div>
);
