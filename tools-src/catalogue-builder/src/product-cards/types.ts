import type { ShopifyProduct } from '../domain/product';
import type { ThemeConfig } from '../domain/theme';

export interface ProductCardProps {
  product: ShopifyProduct;
  theme: ThemeConfig;
  /** Needed by code-augmented variants (see withCode) to build a product-page QR target. */
  shopDomain: string | null;
  /** Rendered inside the image box, pinned to its top-right corner (e.g. a QR code). */
  imageOverlay?: React.ReactNode;
  /** Rendered as its own row directly below the image, before the title (e.g. a barcode). */
  belowImage?: React.ReactNode;
}

export interface ProductCardVariant {
  id: string;
  name: string;
  Component: React.FC<ProductCardProps>;
}
