import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookPackage } from "@/pages/Shop";

interface ShopBookCardProps {
  pkg: BookPackage;
  index: number;
  image: string;
  isSelected: boolean;
  onSelect: () => void;
  isRTL: boolean;
}

export function ShopBookCard({ pkg, index, image, isSelected, onSelect, isRTL }: ShopBookCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      className={cn(
        "relative bg-gradient-to-b rounded-xl p-2.5 text-center transition-all hover:brightness-110 active:scale-95",
        pkg.color,
        `border ${pkg.borderColor}`,
        pkg.glowColor,
        isSelected && "ring-2 ring-primary shadow-gold scale-[1.02]"
      )}
    >
      {/* Tag */}
      {pkg.tag && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-500 rounded-full px-2 py-0.5 flex items-center gap-1 z-10">
          <Flame className="w-3 h-3 text-yellow-300" />
          <span className="text-[7px] font-bold text-white whitespace-nowrap">{pkg.tag}</span>
        </div>
      )}

      {/* Number badge */}
      <div className="flex justify-center mb-1 mt-1">
        <div className={cn("w-7 h-7 rounded-full border-2 flex items-center justify-center", pkg.borderColor)}>
          <span className="text-sm font-bold text-foreground">{pkg.number}</span>
        </div>
      </div>

      {/* Name */}
      <h4 className="font-display text-xs font-bold text-foreground mb-2">{pkg.name}</h4>

      {/* Book Image - Large and clear */}
      <div className="w-20 h-28 mx-auto mb-2 flex items-center justify-center">
        <img
          src={image}
          alt={pkg.name}
          className="max-w-full max-h-full object-contain drop-shadow-[0_0_12px_rgba(255,215,0,0.4)]"
        />
      </div>

      {/* Rewards */}
      <div className="space-y-1 mb-2">
        {pkg.rewards.map((r, ri) => (
          <div key={ri} className={cn("flex items-center gap-1 justify-center", isRTL && "flex-row-reverse")}>
            {r.icon}
            <span className="text-[9px] text-foreground/90">{r.label}</span>
          </div>
        ))}
      </div>

      {/* Entry price */}
      <div className="bg-primary/20 border border-primary/30 rounded-lg py-1.5">
        <span className="text-[10px] font-bold text-primary">{pkg.entry}</span>
      </div>
    </motion.button>
  );
}
