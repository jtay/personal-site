export type VariantDisplayStyle = 'none' | 'count' | 'list' | 'swatches';

/** How heading text is cased across every layout - a single brand-wide typographic choice. */
export type HeadingCaseStyle = 'normal' | 'uppercase';

export interface ThemeConfig {
  fontFamily: string;
  fontWeight: number;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  borderRadius: number;
  productCardVariant: string;
  iconSet: 'outline' | 'solid';
  /** How product variants (size/flavor/etc) are surfaced on cards and the hero-product layout. */
  variantDisplay: VariantDisplayStyle;
  /** Brand mark, referenced by asset id. Used by cover/back-cover/section-divider layouts that show a logo. */
  logoAssetId: string | null;
  headingCase: HeadingCaseStyle;
}

export const DEFAULT_THEME: ThemeConfig = {
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  fontWeight: 400,
  colorPrimary: '#111111',
  colorSecondary: '#666666',
  colorAccent: '#2563eb',
  borderRadius: 4,
  productCardVariant: 'minimal',
  iconSet: 'outline',
  variantDisplay: 'none',
  logoAssetId: null,
  headingCase: 'normal'
};

/** Shared by every layout's heading elements so the uppercase/letter-spacing choice is applied consistently brand-wide. */
export function headingStyle(theme: ThemeConfig): React.CSSProperties {
  return theme.headingCase === 'uppercase' ? { textTransform: 'uppercase', letterSpacing: 1 } : {};
}

/** Maps a ThemeConfig onto the CSS custom properties consumed by global.css / layouts. */
export function themeToCssVars(theme: ThemeConfig): React.CSSProperties {
  return {
    ['--theme-font-family' as string]: theme.fontFamily,
    ['--theme-font-weight' as string]: theme.fontWeight,
    ['--theme-color-primary' as string]: theme.colorPrimary,
    ['--theme-color-secondary' as string]: theme.colorSecondary,
    ['--theme-color-accent' as string]: theme.colorAccent,
    ['--theme-border-radius' as string]: `${theme.borderRadius}px`
  };
}
