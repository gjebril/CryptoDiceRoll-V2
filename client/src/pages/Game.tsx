import { useState, useCallback, useRef } from "react";
import BetControls from "@/components/game/BetControls";
import GameSlider from "@/components/game/GameSlider";
import GameHistory from "@/components/game/GameHistory";
import ProvablyFair from "@/components/game/ProvablyFair";
import AutoBetSettings from "@/components/game/AutoBetSettings";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { generateClientSeed } from "@/lib/provablyFair";
import { calculateNextBet } from "@/lib/autoBetStrategies";
import type { AutoBetSettings as AutoBetSettingsType } from "@shared/schema";
import { Decimal } from "decimal.js";

export default function Game() {
  const [balance, setBalance] = useState("1000");
  const [betAmount, setBetAmount] = useState(0);
  const [targetValue, setTargetValue] = useState(50);
  const [isOver, setIsOver] = useState(true);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [lastWon, setLastWon] = useState<boolean | null>(null);
  const [currentClientSeed, setCurrentClientSeed] = useState(generateClientSeed());
  const [lastServerSeed, setLastServerSeed] = useState<string | null>(null);
  const [currentServerSeedHash, setCurrentServerSeedHash] = useState<string | null>(null);

  // Auto betting state
  const [isAutoBetting, setIsAutoBetting] = useState(false);
  const [autoBetSettings, setAutoBetSettings] = useState<AutoBetSettingsType>({
    enabled: false,
    strategy: "martingale",
    baseBet: 0.00000100,
    maxBet: 0.00100000,
    delayBetweenBets: 1000,
    multiplier: 2,
    stopOnProfit: undefined,
    stopOnLoss: undefined,
    numberOfBets: undefined
  });

  const autoBetStateRef = useRef({
    betsPlaced: 0,
    startingBalance: "0",
    currentProfit: "0",
  });

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
      const oldBalance = new Decimal(balance);
      const newBalance = new Decimal(data.newBalance);
      const won = data.game.won;

      setBalance(newBalance.toString());
      setLastRoll(parseFloat(data.game.roll));
      setLastWon(won);
      setLastServerSeed(data.serverSeed);
      setCurrentServerSeedHash(data.serverSeedHash);
      setCurrentClientSeed(generateClientSeed());

      // Update auto betting state if active
      if (isAutoBetting) {
        const state = autoBetStateRef.current;
        state.betsPlaced += 1;
        state.currentProfit = newBalance.minus(state.startingBalance).toString();

        const nextBet = calculateNextBet(
          autoBetSettings.strategy,
          autoBetSettings.baseBet,
          betAmount,
          autoBetSettings.maxBet,
          won,
          autoBetSettings.multiplier
        );

        // Check stop conditions
        const shouldStop =
          (autoBetSettings.stopOnProfit && new Decimal(state.currentProfit).gte(autoBetSettings.stopOnProfit)) ||
          (autoBetSettings.stopOnLoss && new Decimal(state.currentProfit).lte(-autoBetSettings.stopOnLoss)) ||
          (autoBetSettings.numberOfBets && state.betsPlaced >= autoBetSettings.numberOfBets) ||
          new Decimal(nextBet).gt(autoBetSettings.maxBet);

        if (shouldStop) {
          setIsAutoBetting(false);
          toast({
            title: "Auto Betting Stopped",
            description: `Final profit: ${state.currentProfit}`,
          });
        } else {
          setBetAmount(nextBet);
          setTimeout(() => {
            if (isAutoBetting) {
              placeBet.mutate();
            }
          }, autoBetSettings.delayBetweenBets);
        }
      }

      // Invalidate games query to refresh history
      queryClient.invalidateQueries({ queryKey: ['/api/games/1'] });

      toast({
        title: won ? "You Won!" : "You Lost",
        description: `Roll: ${parseFloat(data.game.roll).toFixed(2)}`,
        variant: won ? "default" : "destructive",
      });
    },
    onError: (error: Error) => {
      setIsAutoBetting(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleStartStopAutoBet = useCallback(() => {
    if (isAutoBetting) {
      setIsAutoBetting(false);
      if (placeBet.isPending) {
        placeBet.reset();
      }
    } else {
      if (autoBetSettings.baseBet <= 0) {
        toast({
          title: "Error",
          description: "Base bet amount must be greater than 0",
          variant: "destructive",
        });
        return;
      }

      autoBetStateRef.current = {
        betsPlaced: 0,
        startingBalance: balance,
        currentProfit: "0",
      };

      setBetAmount(autoBetSettings.baseBet);
      setIsAutoBetting(true);
      placeBet.mutate();
    }
  }, [isAutoBetting, balance, autoBetSettings.baseBet, placeBet]);

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      <div className="p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-green-500">${parseFloat(balance).toFixed(2)}</h2>
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
          {/* Left Panel */}
          <div className="w-[320px] bg-[#1a1f24] rounded-lg">
            <div className="flex items-center gap-2 p-3 border-b border-[#2A2F34]">
              <button
                onClick={() => {
                  setIsAutoBetting(false);
                  if (placeBet.isPending) {
                    placeBet.reset();
                  }
                }}
                className={`px-4 py-2 rounded-md text-sm ${
                  !isAutoBetting
                    ? "bg-[#2A2F34] text-white"
                    : "text-gray-400 hover:bg-[#2A2F34]/50"
                }`}
              >
                Manual
              </button>
              <button
                onClick={() => {
                  setIsAutoBetting(true);
                }}
                className={`px-4 py-2 rounded-md text-sm ${
                  isAutoBetting
                    ? "bg-[#2A2F34] text-white"
                    : "text-gray-400 hover:bg-[#2A2F34]/50"
                }`}
              >
                Auto
              </button>
            </div>

            <div className="p-4">
              {!isAutoBetting ? (
                <BetControls
                  betAmount={betAmount}
                  setBetAmount={setBetAmount}
                  isAuto={false}
                  setIsAuto={setIsAutoBetting}
                  onBet={() => placeBet.mutate()}
                  isLoading={placeBet.isPending}
                  targetValue={targetValue}
                  isOver={isOver}
                />
              ) : (
                <AutoBetSettings
                  settings={autoBetSettings}
                  onSettingsChange={setAutoBetSettings}
                  isRunning={isAutoBetting}
                  onStartStop={handleStartStopAutoBet}
                />
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="bg-[#1a1f24] rounded-lg p-6">
              <GameSlider
                value={targetValue}
                onChange={setTargetValue}
                isOver={isOver}
                setIsOver={setIsOver}
                roll={lastRoll}
                won={lastWon}
              />
            </div>

            <div className="bg-[#1a1f24] rounded-lg p-6">
              <GameHistory userId={1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}