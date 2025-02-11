import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  return (
    <div className="space-y-6">
      <div className="relative pt-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className="h-2 w-full bg-gradient-to-r from-red-500/20 via-red-500/20 to-green-500/20"
              style={{
                clipPath: isOver
                  ? `inset(0 ${100 - value}% 0 0)`
                  : `inset(0 0 0 ${value}%)`,
              }}
            />
          </div>
          {/* Red line underneath */}
          <div className="absolute inset-0 -z-10">
            <div className="h-2 w-full bg-red-500 rounded-full opacity-50" />
          </div>
          <Slider
            value={[value]}
            onValueChange={(values) => onChange(values[0])}
            min={1}
            max={98}
            step={0.5}
            className="w-full"
          />

          {/* Roll result display */}
          <AnimatePresence>
            {roll !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute w-full"
                style={{
                  left: `${((roll - 1) / 97) * 100}%`,
                  bottom: "100%",
                  transform: "translateX(-50%)",
                }}
              >
                <div 
                  className={cn(
                    "rounded-lg px-2 py-1 text-center",
                    won ? "bg-green-500/20" : "bg-red-500/20"
                  )}
                >
                  <span className="text-sm font-bold">{roll.toFixed(2)}</span>
                </div>
                <div 
                  className={cn(
                    "w-0.5 h-2 mx-auto",
                    won ? "bg-green-500" : "bg-red-500"
                  )} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="absolute w-full flex justify-between text-sm text-muted-foreground -bottom-6">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>

        <div className="absolute right-0 top-0">
          <div className={cn(
            "bg-green-500/20 rounded-lg p-4",
            isOver ? "bg-green-500/20" : "bg-red-500/20"
          )}>
            <span className="text-2xl font-bold">{value.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <button
          onClick={() => setIsOver(false)}
          className={`flex-1 h-12 text-lg font-medium rounded-lg transition-colors ${
            !isOver
              ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
              : "bg-[#262b31] hover:bg-[#2d3339]"
          }`}
        >
          Roll Under
        </button>
        <button
          onClick={() => setIsOver(true)}
          className={`flex-1 h-12 text-lg font-medium rounded-lg transition-colors ${
            isOver
              ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
              : "bg-[#262b31] hover:bg-[#2d3339]"
          }`}
        >
          Roll Over
        </button>
      </div>
    </div>
  );
}