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
              left: `calc(${roll}% - 32px)`, // Center the 16px wide element
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
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div
            className="h-2 w-full"
            style={{
              background: "linear-gradient(to right, #ef4444, #22c55e)",
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

      <div className="flex gap-2">
        <button
          onClick={() => setIsOver(false)}
          className={cn(
            "flex-1 h-12 text-lg font-medium rounded-lg transition-colors",
            !isOver
              ? "bg-red-500/20 text-red-500"
              : "bg-[#1A1F24] hover:bg-[#2A2F34]"
          )}
        >
          Roll Under
        </button>
        <button
          onClick={() => setIsOver(true)}
          className={cn(
            "flex-1 h-12 text-lg font-medium rounded-lg transition-colors",
            isOver
              ? "bg-green-500/20 text-green-500"
              : "bg-[#1A1F24] hover:bg-[#2A2F34]"
          )}
        >
          Roll Over
        </button>
      </div>
    </div>
  );
}