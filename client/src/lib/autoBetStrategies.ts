import type { AutoBetStrategy } from "@shared/schema";
import { Decimal } from "decimal.js";

// Helper function to calculate Fibonacci sequence
function getFibonacciNumber(sequence: number[]): number {
  const length = sequence.length;
  if (length < 2) return 1;
  return sequence[length - 1] + sequence[length - 2];
}

interface StrategyState {
  sequence?: number[];
  stage?: number;
  winStreak?: number;
  lossStreak?: number;
}

export function calculateNextBet(
  strategy: AutoBetStrategy,
  baseBet: number,
  currentBet: number,
  maxBet: number,
  won: boolean,
  customMultiplier?: number,
  state?: StrategyState
): { nextBet: number; newState: StrategyState } {
  const current = new Decimal(currentBet);
  const max = new Decimal(maxBet);
  const base = new Decimal(baseBet);
  const newState: StrategyState = state ? { ...state } : {};

  switch (strategy) {
    case "martingale":
      // Double bet on loss, reset on win
      if (won) return { nextBet: baseBet, newState };
      const doubled = current.times(2);
      return {
        nextBet: doubled.gt(max) ? max.toNumber() : doubled.toNumber(),
        newState
      };

    case "reverseMartingale":
      // Double bet on win, reset on loss
      if (!won) return { nextBet: baseBet, newState };
      const doubledReverse = current.times(2);
      return {
        nextBet: doubledReverse.gt(max) ? max.toNumber() : doubledReverse.toNumber(),
        newState
      };

    case "dAlembert":
      // Increase by base bet on loss, decrease by base bet on win
      if (won) {
        const decreased = current.minus(base);
        return {
          nextBet: decreased.lt(base) ? base.toNumber() : decreased.toNumber(),
          newState
        };
      } else {
        const increased = current.plus(base);
        return {
          nextBet: increased.gt(max) ? max.toNumber() : increased.toNumber(),
          newState
        };
      }

    case "fibonacci":
      // Initialize or update sequence
      if (!newState.sequence) {
        newState.sequence = [1];
      }

      if (won) {
        // On win, remove last two numbers from sequence
        if (newState.sequence.length > 2) {
          newState.sequence = newState.sequence.slice(0, -2);
        } else {
          newState.sequence = [1];
        }
      } else {
        // On loss, add next Fibonacci number
        newState.sequence.push(getFibonacciNumber(newState.sequence));
      }

      const fibBet = base.times(newState.sequence[newState.sequence.length - 1]);
      return {
        nextBet: fibBet.gt(max) ? max.toNumber() : fibBet.toNumber(),
        newState
      };

    case "oscarsGrind":
      // Initialize state if not exists
      if (!newState.stage || !newState.winStreak) {
        newState.stage = 0;
        newState.winStreak = 0;
      }

      const currentStage = newState.stage;
      const currentWinStreak = newState.winStreak;

      if (won) {
        newState.winStreak = currentWinStreak + 1;
        if (newState.winStreak >= 3) {
          // Reset after winning streak
          newState.stage = 0;
          newState.winStreak = 0;
          return { nextBet: baseBet, newState };
        }
        // Increase bet by one unit
        const increased = current.plus(base);
        return {
          nextBet: increased.gt(max) ? max.toNumber() : increased.toNumber(),
          newState
        };
      } else {
        newState.winStreak = 0;
        if (currentStage < 3) {
          newState.stage = currentStage + 1;
          // Keep same bet for first three losses
          return { nextBet: currentBet, newState };
        }
        // After three losses, revert to base bet
        newState.stage = 0;
        return { nextBet: baseBet, newState };
      }

    case "custom":
      // Use custom multiplier on loss
      if (won) return { nextBet: baseBet, newState };
      const multiplied = current.times(customMultiplier || 2);
      return {
        nextBet: multiplied.gt(max) ? max.toNumber() : multiplied.toNumber(),
        newState
      };

    default:
      return { nextBet: baseBet, newState };
  }
}