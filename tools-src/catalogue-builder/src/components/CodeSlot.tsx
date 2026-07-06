import type { SlotValue } from '../domain/slot';
import { resolveBoundProduct, resolveCodeValue } from '../domain/code';
import { CodeGraphic } from './CodeGraphic';

export interface CodeSlotProps {
  /** The 'code' slot's own value. */
  value: Extract<SlotValue, { type: 'code' }>;
  /** All slots on the page, so a bound product/productGrid slot can be looked up. */
  slots: Record<string, SlotValue>;
  shopDomain: string | null;
}

/** Renders a page-level 'code' slot - any layout that declares a 'code' slot type drops this in. */
export const CodeSlot: React.FC<CodeSlotProps> = ({ value, slots, shopDomain }) => {
  const product = resolveBoundProduct(slots, value.boundProductSlotId);
  const resolved = resolveCodeValue(value.dataSource, product, shopDomain ?? undefined);
  return <CodeGraphic type={value.codeType} value={resolved} />;
};
