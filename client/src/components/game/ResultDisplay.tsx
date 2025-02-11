import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ResultDisplayProps {
  roll: number | null;
  targetValue: number;
  isOver: boolean;
  won: boolean | null;
}

export default function ResultDisplay({
  roll,
  targetValue,
  isOver,
  won,
}: ResultDisplayProps) {
  if (!roll) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={cn(
          "text-center p-6 rounded-lg mb-6",
          won ? "bg-green-500/20" : "bg-red-500/20"
        )}
      >
        <div className="text-4xl font-bold mb-2">
          {roll.toFixed(2)}
        </div>
        <div className="text-sm text-muted-foreground">
          Target: {isOver ? ">" : "<"} {targetValue}
        </div>
        <div className={cn(
          "text-lg font-semibold mt-2",
          won ? "text-green-500" : "text-red-500"
        )}>
          {won ? "Winner!" : "Better luck next time!"}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
