export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: ShopifySelectedOption[];
  price: ShopifyMoney;
  /** Shopify's own barcode field (UPC/EAN/etc), if the merchant set one. Often absent. */
  barcode: string | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  featuredImage: ShopifyProductImage | null;
  images: ShopifyProductImage[];
  variants: ShopifyVariant[];
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
}
