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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="mb-2">
            <Label className="text-sm text-gray-400">Bet Amount</Label>
            <div className="text-xs text-gray-500">${(betAmount * 1000).toFixed(2)}</div>
          </div>
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="text-base h-10 bg-[#1A1F24] border-[#2A2F34]"
            disabled={isLoading}
            placeholder="0.00000000"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setBetAmount(betAmount / 2)}
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
          value={profit}
          readOnly
          className="text-base h-10 bg-[#1A1F24] border-[#2A2F34]"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 bg-[#1A1F24] rounded-lg">
        <div>
          <div className="text-sm text-gray-400">Multiplier</div>
          <div className="text-base font-medium">{multiplier}×</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Roll {isOver ? "Over" : "Under"}</div>
          <div className="text-base font-medium">{targetValue.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Win Chance</div>
          <div className="text-base font-medium">
            {(isOver ? (99 - targetValue) : targetValue).toFixed(4)}%
          </div>
        </div>
      </div>

      <Button 
        onClick={onBet}
        disabled={isLoading || betAmount <= 0}
        className="w-full h-12 text-lg font-medium bg-[#4CAF50] hover:bg-[#45a049]"
      >
        {isLoading ? "Rolling..." : "Bet"}
      </Button>
    </div>
  );
}