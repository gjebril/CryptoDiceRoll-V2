import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { AutoBetSettings, AutoBetStrategy } from "@shared/schema";

interface AutoBetSettingsProps {
  settings: AutoBetSettings;
  onSettingsChange: (settings: AutoBetSettings) => void;
  isRunning: boolean;
  onStartStop: () => void;
}

export default function AutoBetSettings({
  settings,
  onSettingsChange,
  isRunning,
  onStartStop,
}: AutoBetSettingsProps) {
  const updateSettings = (updates: Partial<AutoBetSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Strategy</Label>
        <Select
          value={settings.strategy}
          onValueChange={(value: AutoBetStrategy) =>
            updateSettings({ strategy: value })
          }
          disabled={isRunning}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select strategy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="martingale">Martingale</SelectItem>
            <SelectItem value="reverseMartingale">Reverse Martingale</SelectItem>
            <SelectItem value="dAlembert">D'Alembert</SelectItem>
            <SelectItem value="custom">Custom Multiplier</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Base Bet</Label>
          <Input
            type="number"
            value={settings.baseBet}
            onChange={(e) =>
              updateSettings({ baseBet: parseFloat(e.target.value) || 0 })
            }
            min={0}
            step={0.00000001}
            disabled={isRunning}
          />
        </div>

        <div>
          <Label>Max Bet</Label>
          <Input
            type="number"
            value={settings.maxBet}
            onChange={(e) =>
              updateSettings({ maxBet: parseFloat(e.target.value) || 0 })
            }
            min={0}
            step={0.00000001}
            disabled={isRunning}
          />
        </div>

        {settings.strategy === "custom" && (
          <div>
            <Label>Custom Multiplier</Label>
            <Input
              type="number"
              value={settings.multiplier || 2}
              onChange={(e) =>
                updateSettings({ multiplier: parseFloat(e.target.value) || 2 })
              }
              min={1}
              step={0.1}
              disabled={isRunning}
            />
          </div>
        )}

        <div>
          <Label>Stop on Profit</Label>
          <Input
            type="number"
            value={settings.stopOnProfit || ""}
            onChange={(e) =>
              updateSettings({
                stopOnProfit: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            min={0}
            step={0.00000001}
            placeholder="Optional"
            disabled={isRunning}
          />
        </div>

        <div>
          <Label>Stop on Loss</Label>
          <Input
            type="number"
            value={settings.stopOnLoss || ""}
            onChange={(e) =>
              updateSettings({
                stopOnLoss: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            min={0}
            step={0.00000001}
            placeholder="Optional"
            disabled={isRunning}
          />
        </div>

        <div>
          <Label>Number of Bets</Label>
          <Input
            type="number"
            value={settings.numberOfBets || ""}
            onChange={(e) =>
              updateSettings({
                numberOfBets: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            min={1}
            placeholder="Optional"
            disabled={isRunning}
          />
        </div>

        <div>
          <Label>Delay Between Bets (ms)</Label>
          <Input
            type="number"
            value={settings.delayBetweenBets}
            onChange={(e) =>
              updateSettings({
                delayBetweenBets: parseInt(e.target.value) || 500,
              })
            }
            min={500}
            max={10000}
            step={100}
            disabled={isRunning}
          />
        </div>
      </div>

      <Button 
        onClick={onStartStop}
        variant={isRunning ? "destructive" : "default"}
        className="w-full h-12 text-lg font-medium bg-[#4CAF50] hover:bg-[#45a049] disabled:opacity-50"
        disabled={!settings.baseBet || settings.baseBet <= 0}
      >
        {isRunning ? "Stop Auto Bet" : "Start Auto Bet"}
      </Button>
    </div>
  );
}