import { useState } from "react";
import { Card } from "@/components/ui/card";
import BetControls from "@/components/game/BetControls";
import GameSlider from "@/components/game/GameSlider";
import ResultDisplay from "@/components/game/ResultDisplay";
import GameHistory from "@/components/game/GameHistory";
import ProvablyFair from "@/components/game/ProvablyFair";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { generateClientSeed } from "@/lib/provablyFair";

export default function Game() {
  const [balance, setBalance] = useState("1000");
  const [betAmount, setBetAmount] = useState(0);
  const [targetValue, setTargetValue] = useState(50);
  const [isOver, setIsOver] = useState(true);
  const [isAuto, setIsAuto] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [lastWon, setLastWon] = useState<boolean | null>(null);
  const [currentClientSeed, setCurrentClientSeed] = useState(generateClientSeed());
  const [lastServerSeed, setLastServerSeed] = useState<string | null>(null);
  const [currentServerSeedHash, setCurrentServerSeedHash] = useState<string | null>(null);

  const { toast } = useToast();

  const placeBet = useMutation({
    mutationFn: async () => {
      if (betAmount <= 0) {
        throw new Error("Bet amount must be greater than 0");
      }

      const res = await apiRequest("POST", "/api/bet", {
        betAmount,
        targetValue,
        isOver,
        clientSeed: currentClientSeed,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setBalance(data.newBalance);
      setLastRoll(parseFloat(data.game.roll));
      setLastWon(data.game.won);
      setLastServerSeed(data.serverSeed);
      setCurrentServerSeedHash(data.serverSeedHash);
      setCurrentClientSeed(generateClientSeed()); // Generate new client seed for next bet

      // Invalidate games query to refresh history
      queryClient.invalidateQueries({ queryKey: ['/api/games/1'] });

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
    }
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Balance: ${parseFloat(balance).toFixed(2)}</h2>
        </div>

        <ResultDisplay
          roll={lastRoll}
          targetValue={targetValue}
          isOver={isOver}
          won={lastWon}
        />

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

        <ProvablyFair
          clientSeed={currentClientSeed}
          serverSeedHash={currentServerSeedHash}
          lastServerSeed={lastServerSeed}
          targetValue={targetValue}
          isOver={isOver}
        />

        <GameHistory userId={1} />
      </Card>
    </div>
  );
}