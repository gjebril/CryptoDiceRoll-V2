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
    if (!isNaN(numericValue) && numericValue >= 0) {
      setBetAmount(numericValue);
    }
  };

  const calculateProfit = () => {
    const multiplier = 99 / (isOver ? (99 - targetValue) : targetValue);
    return (betAmount * multiplier).toFixed(8);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm text-gray-400">Bet Amount</Label>
        <div className="flex gap-2 mt-1">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="flex-1 h-10 bg-[#1A1F24] border-[#2A2F34] text-sm"
            disabled={isLoading}
            placeholder="0.00000000"
          />
          <Button 
            variant="outline" 
            onClick={() => setBetAmount(Math.max(0, betAmount / 2))}
            disabled={isLoading}
            className="h-10 px-3 bg-[#1A1F24] border-[#2A2F34] hover:bg-[#2A2F34]"
          >
            ½
          </Button>
          <Button 
            variant="outline"
            onClick={() => setBetAmount(betAmount * 2)}
            disabled={isLoading}
            className="h-10 px-3 bg-[#1A1F24] border-[#2A2F34] hover:bg-[#2A2F34]"
          >
            2×
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-sm text-gray-400">Profit on Win</Label>
        <Input
          type="text"
          value={calculateProfit()}
          readOnly
          className="h-10 bg-[#1A1F24] border-[#2A2F34] text-sm mt-1"
        />
      </div>

      <Button 
        onClick={onBet}
        disabled={isLoading || betAmount <= 0}
        className="w-full h-12 text-lg font-medium bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-50"
      >
        {isLoading ? "Rolling..." : "Bet"}
      </Button>
    </div>
  );
}