import { Diamond, Coins } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";

export function TopBar({ title = "WINLINE" }: { title?: string }) {
  const { points, xp } = useGameStore();

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
        <Diamond className="w-4 h-4 text-accent" />
        <span className="text-sm font-bold text-foreground">{Math.floor(xp)}</span>
        <span className="text-primary text-xs">+</span>
      </div>
      
      <h1 className="font-display text-lg font-bold text-gold-gradient">{title}</h1>
      
      <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
        <Coins className="w-4 h-4 text-primary" />
        <span className="text-sm font-bold text-foreground">{points.toLocaleString()}</span>
        <span className="text-primary text-xs">+</span>
      </div>
    </div>
  );
}
