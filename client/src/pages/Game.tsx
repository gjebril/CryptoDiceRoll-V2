import { useState } from "react";
import { Card } from "@/components/ui/card";
import BetControls from "@/components/game/BetControls";
import GameSlider from "@/components/game/GameSlider";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { generateClientSeed } from "@/lib/provablyFair";

export default function Game() {
  const [balance, setBalance] = useState("1000");
  const [betAmount, setBetAmount] = useState(0);
  const [targetValue, setTargetValue] = useState(50);
  const [isOver, setIsOver] = useState(true);
  const [isAuto, setIsAuto] = useState(false);
  const { toast } = useToast();

  const placeBet = useMutation({
    mutationFn: async () => {
      const clientSeed = generateClientSeed();
      const res = await apiRequest("POST", "/api/bet", {
        betAmount,
        targetValue,
        isOver,
        clientSeed,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setBalance(data.newBalance);
      toast({
        title: data.game.won ? "You Won!" : "You Lost",
        description: `Roll: ${parseFloat(data.game.roll).toFixed(2)}`,
        variant: data.game.won ? "default" : "destructive",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Balance: ${parseFloat(balance).toFixed(2)}</h2>
        </div>

        <GameSlider 
          value={targetValue} 
          onChange={setTargetValue}
          isOver={isOver}
          setIsOver={setIsOver}
        />

        <BetControls
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          isAuto={isAuto}
          setIsAuto={setIsAuto}
          onBet={() => placeBet.mutate()}
          isLoading={placeBet.isPending}
          targetValue={targetValue}
          isOver={isOver}
        />
      </Card>
    </div>
  );
}