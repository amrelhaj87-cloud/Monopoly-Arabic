/**
 * Game Currency Constants
 * Using $ as the universal currency symbol for this game
 */
export const CURRENCY = {
  symbol: '$',
  name: 'دولار',
  icon: '💵',
  format: (amount: number | string) => `$${Number(amount).toLocaleString()}`
};

export const formatCash = (amount: number): string => {
  return `$${amount.toLocaleString()}`;
};
