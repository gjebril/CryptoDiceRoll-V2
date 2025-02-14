
import { AutoBetStrategy } from "@shared/schema";
import { Decimal } from "decimal.js";

export interface StrategyState {
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
  multiplier: number = 2,
  state: StrategyState = {}
): { nextBet: number; state: StrategyState } {
  let nextBet = baseBet;
  const newState = { ...state };

  switch (strategy) {
    case "martingale":
      nextBet = won ? baseBet : currentBet * 2;
      break;

    case "reverseMartingale":
      nextBet = won ? currentBet * 2 : baseBet;
      break;

    case "dAlembert":
      if (won) {
        nextBet = Math.max(baseBet, currentBet - baseBet);
      } else {
        nextBet = currentBet + baseBet;
      }
      break;

    case "fibonacci": {
      const sequence = state.sequence || [1];
      if (won) {
        sequence.splice(-2);
        if (sequence.length === 0) sequence.push(1);
      } else {
        const next = (sequence[sequence.length - 1] || 0) + (sequence[sequence.length - 2] || 0);
        sequence.push(next);
      }
      nextBet = baseBet * sequence[sequence.length - 1];
      newState.sequence = sequence;
      break;
    }

    case "oscarsGrind": {
      let { stage = 0, winStreak = 0 } = state;
      
      if (won) {
        winStreak++;
        if (new Decimal(currentBet).plus(baseBet).times(stage + 1).equals(baseBet)) {
          stage = 0;
          winStreak = 0;
          nextBet = baseBet;
        } else {
          nextBet = currentBet + baseBet;
        }
      } else {
        winStreak = 0;
        if (!stage) {
          stage++;
          nextBet = baseBet * stage;
        } else {
          nextBet = currentBet;
        }
      }
      
      newState.stage = stage;
      newState.winStreak = winStreak;
      break;
    }

    case "custom":
      nextBet = won ? baseBet : currentBet * multiplier;
      break;
  }

  return {
    nextBet: Math.min(maxBet, nextBet),
    state: newState
  };
}
