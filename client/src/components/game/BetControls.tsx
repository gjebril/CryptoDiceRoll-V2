import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface BetControlsProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  isAuto: boolean;
  setIsAuto: (auto: boolean) => void;
  onBet: () => void;
  isLoading: boolean;
  targetValue: number;
  isOver: boolean;
}

export default function BetControls({
  betAmount,
  setBetAmount,
  isAuto,
  setIsAuto,
  onBet,
  isLoading,
  targetValue,
  isOver,
}: BetControlsProps) {
  const [inputValue, setInputValue] = useState(betAmount.toString());

  useEffect(() => {
    setInputValue(betAmount.toString());
  }, [betAmount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setBetAmount(numericValue);
    }
  };

  const multiplier = (99 / (isOver ? (99 - targetValue) : targetValue)).toFixed(4);
  const profit = (betAmount * parseFloat(multiplier) - betAmount).toFixed(8);

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-2">Bet Amount</Label>
        <div className="flex gap-4 mb-4">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="text-lg h-12"
            disabled={isLoading}
            placeholder="Enter bet amount"
          />
          <div className="grid grid-cols-2 gap-2 w-32">
            <Button 
              variant="outline" 
              onClick={() => setBetAmount(betAmount * 2)}
              disabled={isLoading}
              className="h-12"
            >
              2×
            </Button>
            <Button 
              variant="outline"
              onClick={() => setBetAmount(Math.max(betAmount / 2, 0))}
              disabled={isLoading}
              className="h-12"
            >
              ½
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-[#262b31] rounded-lg p-4">
          <span className="text-sm text-gray-400">Multiplier</span>
          <div className="text-xl font-bold">{multiplier}×</div>
        </div>
        <div className="bg-[#262b31] rounded-lg p-4">
          <span className="text-sm text-gray-400">Profit on Win</span>
          <div className="text-xl font-bold">{profit} BTC</div>
        </div>
      </div>

      <Button 
        onClick={onBet}
        disabled={isLoading || betAmount <= 0}
        className="w-full h-12 text-lg font-medium"
        variant={isLoading ? "secondary" : "default"}
      >
        {isLoading ? "Rolling..." : "Roll Dice"}
      </Button>
    </div>
  );
}