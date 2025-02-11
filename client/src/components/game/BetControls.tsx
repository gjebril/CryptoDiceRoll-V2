import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const multiplier = (99 / (isOver ? (99 - targetValue) : targetValue)).toFixed(4);
  const profit = (betAmount * parseFloat(multiplier) - betAmount).toFixed(2);

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Bet Amount</Label>
            <Input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
              min={0}
              step={0.01}
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Auto Bet</Label>
            <Switch
              checked={isAuto}
              onCheckedChange={setIsAuto}
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={onBet}
            disabled={isLoading || betAmount <= 0}
            className="w-full"
            variant={isLoading ? "outline" : "default"}
          >
            {isLoading ? "Rolling..." : "Roll Dice"}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-secondary rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Multiplier</span>
              <span className="font-bold">{multiplier}x</span>
            </div>
            <div className="flex justify-between">
              <span>Profit on Win</span>
              <span className="font-bold">${profit}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={() => setBetAmount(betAmount * 2)}
              disabled={isLoading}
            >
              2x
            </Button>
            <Button 
              variant="outline"
              onClick={() => setBetAmount(betAmount / 2)}
              disabled={isLoading}
            >
              ½
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}