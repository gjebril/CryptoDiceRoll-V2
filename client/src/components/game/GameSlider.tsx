import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface GameSliderProps {
  value: number;
  onChange: (value: number) => void;
  isOver: boolean;
  setIsOver: (over: boolean) => void;
}

export default function GameSlider({
  value,
  onChange,
  isOver,
  setIsOver,
}: GameSliderProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4">
        <Button
          variant={isOver ? "default" : "secondary"}
          className="flex-1 h-12 text-lg font-medium"
          onClick={() => setIsOver(true)}
        >
          Roll Over
        </Button>
        <Button
          variant={!isOver ? "default" : "secondary"}
          className="flex-1 h-12 text-lg font-medium"
          onClick={() => setIsOver(false)}
        >
          Roll Under
        </Button>
      </div>

      <div className="relative pt-6">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={1}
          max={98}
          step={0.5}
          className="w-full"
        />
        <div className="absolute w-full flex justify-between text-sm text-muted-foreground -bottom-6">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}