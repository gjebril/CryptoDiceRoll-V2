import type { AutoBetStrategy } from "@shared/schema";
import { Decimal } from "decimal.js";

export function calculateNextBet(
  strategy: AutoBetStrategy,
  baseBet: number,
  currentBet: number,
  maxBet: number,
  won: boolean,
  customMultiplier?: number
): number {
  const current = new Decimal(currentBet);
  const max = new Decimal(maxBet);
  const base = new Decimal(baseBet);

  switch (strategy) {
    case "martingale":
      // Double bet on loss, reset on win
      if (won) return baseBet;
      const doubled = current.times(2);
      return doubled.gt(max) ? max.toNumber() : doubled.toNumber();

    case "reverseMartingale":
      // Double bet on win, reset on loss
      if (!won) return baseBet;
      const doubledReverse = current.times(2);
      return doubledReverse.gt(max) ? max.toNumber() : doubledReverse.toNumber();

    case "dAlembert":
      // Increase by base bet on loss, decrease by base bet on win
      if (won) {
        const decreased = current.minus(base);
        return decreased.lt(base) ? base.toNumber() : decreased.toNumber();
      } else {
        const increased = current.plus(base);
        return increased.gt(max) ? max.toNumber() : increased.toNumber();
      }

    case "custom":
      // Use custom multiplier on loss
      if (won) return baseBet;
      const multiplied = current.times(customMultiplier || 2);
      return multiplied.gt(max) ? max.toNumber() : multiplied.toNumber();

    default:
      return baseBet;
  }
}
