import type { ShopifyMoney } from './product';

export function formatMoney(money: ShopifyMoney): string {
  const amount = Number(money.amount);
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: money.currencyCode }).format(amount);
  } catch {
    return `${money.currencyCode} ${amount.toFixed(2)}`;
  }
}
