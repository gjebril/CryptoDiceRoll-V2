
export const HOUSE_EDGE_PERCENT = 1;
export const HOUSE_EDGE_MULTIPLIER = (100 - HOUSE_EDGE_PERCENT) / 100; // 0.99 for 1% edge
export const MAX_ROLL = 100;

export function calculateMultiplier(targetValue: number, isOver: boolean): number {
  const fairMultiplier = MAX_ROLL / (isOver ? (MAX_ROLL - targetValue) : targetValue);
  return fairMultiplier * HOUSE_EDGE_MULTIPLIER;
}

export function calculatePayout(betAmount: number, multiplier: number): string {
  return (betAmount * multiplier).toFixed(8);
}
