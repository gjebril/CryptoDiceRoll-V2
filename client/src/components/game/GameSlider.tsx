import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { RotateCw } from "lucide-react";

interface GameSliderProps {
  value: number;
  onChange: (value: number) => void;
  isOver: boolean;
  setIsOver: (over: boolean) => void;
  roll: number | null;
  won: boolean | null;
}

export default function GameSlider({
  value,
  onChange,
  isOver,
  setIsOver,
  roll,
  won,
}: GameSliderProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [multiplierValue, setMultiplierValue] = useState("2.0000");

  useEffect(() => {
    setInputValue(value.toFixed(2));
  }, [value]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    const parsed = parseFloat(newValue);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 98) {
      onChange(parsed);
    }
  };

  const calculateMultiplier = (targetValue: number, isOverMode: boolean) => {
    return (99 / (isOverMode ? (99 - targetValue) : targetValue)).toFixed(4);
  };

  const calculateWinChance = (targetValue: number, isOverMode: boolean) => {
    return (isOverMode ? (99 - targetValue) : targetValue).toFixed(4);
  };

  const handleMultiplierChange = (newValue: string) => {
    setMultiplierValue(newValue);
    const multiplier = parseFloat(newValue);
    if (!isNaN(multiplier) && multiplier > 1) {
      // Calculate new target value based on multiplier
      const newTarget = isOver
        ? 99 - (99 / multiplier)
        : 99 / multiplier;
      if (newTarget >= 1 && newTarget <= 98) {
        onChange(newTarget);
      }
    }
  };

  useEffect(() => {
    setMultiplierValue(calculateMultiplier(value, isOver));
  }, [value, isOver]);

  return (
    <div>
      {/* Roll result display */}
      <AnimatePresence>
        {roll !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute w-16"
            style={{
              left: `calc(${roll}% - 32px)`,
              top: "20px",
            }}
          >
            <div className="bg-[#1f2937] rounded-md px-3 py-2 text-center">
              <span className="text-2xl font-bold">{roll.toFixed(2)}</span>
            </div>
            <div className="w-0.5 h-6 bg-red-500 mx-auto mt-1" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative h-2 mt-20 mb-10">
        {/* Color lines */}
        <div className="absolute inset-0 -top-1 h-4">
          <div className="h-0.5 w-full bg-red-500" style={{ opacity: isOver ? 1 : 0.2 }} />
          <div className="h-3" />
          <div className="h-0.5 w-full bg-green-500" style={{ opacity: isOver ? 0.2 : 1 }} />
        </div>

        {/* Slider background with gradient */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div
            className="h-2 w-full"
            style={{
              background: "linear-gradient(to right, #22c55e, #ef4444)",
              clipPath: isOver
                ? `inset(0 ${100 - value}% 0 0)`
                : `inset(0 0 0 ${value}%)`,
            }}
          />
        </div>
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={1}
          max={98}
          step={0.5}
          className="w-full"
        />
      </div>

      <div className="flex justify-between text-sm text-muted-foreground mb-4">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>

      {/* Stats Display */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div>
          <div className="text-sm text-gray-400 mb-1">Multiplier</div>
          <Input
            type="text"
            value={multiplierValue}
            onChange={(e) => handleMultiplierChange(e.target.value)}
            className="bg-[#1A1F24] border-[#2A2F34]"
          />
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-gray-400 mb-1">
            <select
              value={isOver ? "over" : "under"}
              onChange={(e) => setIsOver(e.target.value === "over")}
              className="bg-transparent border-none focus:outline-none"
            >
              <option value="under">Roll Under</option>
              <option value="over">Roll Over</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="bg-[#1A1F24] border-[#2A2F34]"
            />
            <button 
              className="p-2 bg-[#1A1F24] border border-[#2A2F34] rounded-md hover:bg-[#2A2F34]"
              onClick={() => onChange(parseFloat(inputValue))}
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Chance</div>
          <div className="flex items-center h-10">
            <span className="text-base font-medium">
              {calculateWinChance(value, isOver)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}