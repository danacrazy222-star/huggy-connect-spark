import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Gem } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

type GameChoice = "duel" | "treasure" | null;

interface Props {
  onSelect: (game: GameChoice) => void;
  isRTL?: boolean;
}

export function ChatGameSelector({ onSelect, isRTL }: Props) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto my-3 w-full max-w-xs"
    >
      <div className="grid grid-cols-2 gap-2">
        {/* Duel (RPS) */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect("duel")}
          className={cn(
            "flex flex-col items-center gap-2 py-3.5 px-3 rounded-2xl",
            "bg-gradient-to-b from-accent/20 to-accent/5 border border-accent/30",
            "hover:border-accent/60 hover:shadow-purple transition-all"
          )}
        >
          <span className="text-3xl">✊</span>
          <span className="text-xs font-bold text-foreground">{t("duelRPS")}</span>
          <span className="text-[10px] text-muted-foreground">⚔️ 1v1</span>
        </motion.button>

        {/* Treasure Rush */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect("treasure")}
          className={cn(
            "flex flex-col items-center gap-2 py-3.5 px-3 rounded-2xl",
            "bg-gradient-to-b from-primary/20 to-primary/5 border border-primary/30",
            "hover:border-primary/60 hover:shadow-gold transition-all"
          )}
        >
          <span className="text-3xl">🏴‍☠️</span>
          <span className="text-xs font-bold text-foreground">{t("treasureRush")}</span>
          <span className="text-[10px] text-muted-foreground">💰 1v1</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
