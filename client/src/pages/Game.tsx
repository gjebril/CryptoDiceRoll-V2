import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Decimal } from "decimal.js";
import BetControls from "@/components/game/BetControls";
import GameSlider from "@/components/game/GameSlider";
import ResultDisplay from "@/components/game/ResultDisplay";
import GameHistory from "@/components/game/GameHistory";
import ProvablyFair from "@/components/game/ProvablyFair";

export default function Game() {
  const [betAmount, setBetAmount] = useState(0.00000100);
  const [targetValue, setTargetValue] = useState(50);
  const [isOver, setIsOver] = useState(true);
  const [currentClientSeed, setCurrentClientSeed] = useState("your_client_seed");
  const [currentServerSeedHash, setCurrentServerSeedHash] = useState("");
  const [lastServerSeed, setLastServerSeed] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const balanceQuery = useQuery({
    queryKey: ['/api/games/1'],
    queryFn: () => apiRequest("GET", "/api/games/1"),
  });

  const balance = balanceQuery.data?.balance || "0";

  const placeBet = useMutation({
    mutationFn: async () => {
      try {
        if (betAmount <= 0) {
          throw new Error("Bet amount must be greater than 0");
        }

        if (new Decimal(betAmount).gt(new Decimal(balance))) {
          throw new Error("Insufficient balance");
        }

        const res = await apiRequest("POST", "/api/bet", {
          betAmount,
          targetValue,
          isOver,
          clientSeed: currentClientSeed,
        });

        if (res.serverSeedHash !== currentServerSeedHash) {
          setLastServerSeed(res.lastServerSeed);
          setCurrentServerSeedHash(res.serverSeedHash);
        }

        return res;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games/1'] });
    },
  });

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      <div className="p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-green-500">
              ${parseFloat(balance).toFixed(2)}
            </h2>
          </div>
          <ProvablyFair
            clientSeed={currentClientSeed}
            serverSeedHash={currentServerSeedHash}
            lastServerSeed={lastServerSeed}
            targetValue={targetValue}
            isOver={isOver}
          />
        </div>

        <div className="flex gap-6">
          <div className="w-[320px] bg-[#1a1f24] rounded-lg p-4">
            <BetControls
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              onBet={() => placeBet.mutate()}
              isLoading={placeBet.isPending}
              targetValue={targetValue}
              isOver={isOver}
            />
          </div>

          <div className="flex-1 space-y-6">
            <div className="bg-[#1a1f24] p-4 rounded-lg">
              <GameSlider
                value={targetValue}
                isOver={isOver}
                onChange={setTargetValue}
                onModeChange={setIsOver}
              />
            </div>

            <div className="bg-[#1a1f24] p-4 rounded-lg">
              <GameHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}