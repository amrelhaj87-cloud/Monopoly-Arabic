/**
 * Unified Pan-Arab Currency Constants
 * Fits all represented Arab nations (Egypt, Saudi Arabia, Morocco, Algeria, UAE, Jordan, etc.)
 */
export const CURRENCY = {
  symbol: 'د.ع', // دينار عربي
  name: 'دينار عربي',
  icon: '🪙',
  format: (amount: number | string) => `${Number(amount).toLocaleString()} د.ع`
};

export const formatCash = (amount: number): string => {
  return `${amount.toLocaleString()} ${CURRENCY.symbol}`;
};
