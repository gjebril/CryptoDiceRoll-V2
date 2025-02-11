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
        className="relative"
      >
        <div className="absolute right-0 top-0">
          <div className={cn(
            "bg-green-500/20 rounded-lg p-4",
            won ? "bg-green-500/20" : "bg-red-500/20"
          )}>
            <span className="text-2xl font-bold">{roll.toFixed(2)}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}