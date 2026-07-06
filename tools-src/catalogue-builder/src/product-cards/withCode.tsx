import type { ProductCardProps, ProductCardVariant } from './types';
import type { CodeGraphicType } from '../domain/code';
import { resolveCodeValue } from '../domain/code';
import { CodeGraphic } from '../components/CodeGraphic';

const DEFAULT_SIZE: Record<CodeGraphicType, number> = { qr: 64, barcode: 18 };

export interface WithCodeOptions {
  /** CSS px - for QR this is the square box size, for barcode it's fed into CodeGraphic's height calc. */
  size?: number;
}

/**
 * Wraps an existing product-card variant with a small QR/barcode graphic. Adding code
 * support to a new base card is one `withCode(...)` call rather than a hand-written
 * duplicate component, so N card styles x 2 code types stays N+2 files, not N*2.
 *
 * QR codes encode the product's storefront URL and sit as a small overlay pinned to the
 * top-right corner of the product image (something worth scanning while looking at the
 * photo). Barcodes encode the first variant's Shopify barcode field (falling back to the
 * numeric product id) and render as their own inline row between the image and the title,
 * since Code-128 is meant for a checkout scanner to read cleanly, not to overlap artwork.
 */
export function withCode(base: ProductCardVariant, codeType: CodeGraphicType, options: WithCodeOptions = {}): ProductCardVariant {
  const size = options.size ?? DEFAULT_SIZE[codeType];

  const Component: React.FC<ProductCardProps> = (props) => {
    const source = codeType === 'qr' ? ({ kind: 'productUrl' } as const) : ({ kind: 'variantBarcode' } as const);
    let value = resolveCodeValue(source, props.product, props.shopDomain ?? undefined);
    if (!value && codeType === 'barcode') {
      value = resolveCodeValue({ kind: 'productId' }, props.product, props.shopDomain ?? undefined);
    }

    const graphic = <CodeGraphic type={codeType} value={value} size={size} />;

    return codeType === 'qr' ? (
      <base.Component {...props} imageOverlay={graphic} />
    ) : (
      <base.Component
        {...props}
        belowImage={
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', overflow: 'hidden' }}>{graphic}</div>
        }
      />
    );
  };

  return {
    id: `${base.id}-${codeType}`,
    name: `${base.name} + ${codeType === 'qr' ? 'QR' : 'Barcode'}`,
    Component
  };
}
