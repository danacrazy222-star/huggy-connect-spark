import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useGameStore } from "@/store/useGameStore";
import { cn } from "@/lib/utils";
import { playXPCollect, playXPRainStart } from "@/utils/sounds";

interface XPDrop {
  id: number;
  x: number;
  y: number;
  delay: number;
  speed: number;
  collected: boolean;
}

interface XPRainEventProps {
  onEnd: (collected: number) => void;
}

const DURATION = 10; // seconds
const SPAWN_INTERVAL = 120; // ms between new drops
const MAX_DROPS = 80;

export function XPRainEvent({ onEnd }: XPRainEventProps) {
  const [active, setActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [collected, setCollected] = useState(0);
  const [drops, setDrops] = useState<XPDrop[]>([]);
  const [showResult, setShowResult] = useState(false);
  const dropIdRef = useRef(0);
  const addXP = useGameStore((s) => s.addXP);
  const { t, isRTL } = useTranslation();

  // Timer countdown
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setActive(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [active]);

  // Spawn drops
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setDrops((prev) => {
        // Remove old collected/fallen drops
        const filtered = prev.filter((d) => !d.collected && d.y < 110);
        if (filtered.length >= MAX_DROPS) return filtered;
        const id = dropIdRef.current++;
        return [
          ...filtered,
          {
            id,
            x: 5 + Math.random() * 90, // percentage
            y: -5,
            delay: 0,
            speed: 1.5 + Math.random() * 2, // fall speed
            collected: false,
          },
        ];
      });
    }, SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [active]);

  // Animate drops falling
  useEffect(() => {
    if (!active && !showResult) {
      // Event ended, show result
      setShowResult(true);
      addXP(collected);
      setTimeout(() => onEnd(collected), 3000);
      return;
    }
    if (!active) return;

    const frame = setInterval(() => {
      setDrops((prev) =>
        prev.map((d) =>
          d.collected ? d : { ...d, y: d.y + d.speed }
        )
      );
    }, 50);
    return () => clearInterval(frame);
  }, [active, showResult]);

  const handleTap = useCallback(
    (id: number) => {
      if (!active) return;
      setDrops((prev) =>
        prev.map((d) => (d.id === id ? { ...d, collected: true } : d))
      );
      setCollected((c) => c + 1);
    },
    [active]
  );

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none" dir={isRTL ? "rtl" : "ltr"}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" />

      {/* Header banner */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary/30 to-accent/30 backdrop-blur-xl border border-primary/40">
          <span className="text-lg font-display text-primary animate-pulse">
            ⚡ {t("xpRainTitle")} ⚡
          </span>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-foreground font-bold">{t("xpRainCollected")}: {collected}</span>
            <span className="text-muted-foreground">⏱ {timeLeft}s</span>
          </div>
        </div>
      </motion.div>

      {/* Timer bar */}
      <div className="absolute top-36 left-1/2 -translate-x-1/2 w-48 h-1.5 rounded-full bg-muted/40 overflow-hidden pointer-events-none">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: DURATION, ease: "linear" }}
        />
      </div>

      {/* Falling XP drops */}
      <div className="absolute inset-0 overflow-hidden pointer-events-auto">
        <AnimatePresence>
          {drops
            .filter((d) => !d.collected && d.y < 105)
            .map((drop) => (
              <motion.button
                key={drop.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleTap(drop.id)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleTap(drop.id);
                }}
                className="absolute w-9 h-9 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer select-none active:scale-125 transition-transform"
                style={{
                  left: `${drop.x}%`,
                  top: `${drop.y}%`,
                }}
              >
                <span className="text-lg drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]">⚡</span>
              </motion.button>
            ))}
        </AnimatePresence>

        {/* Tap feedback particles */}
        {drops
          .filter((d) => d.collected)
          .slice(-10)
          .map((drop) => (
            <motion.div
              key={`fb-${drop.id}`}
              initial={{ opacity: 1, scale: 1, y: 0 }}
              animate={{ opacity: 0, scale: 0.5, y: -40 }}
              transition={{ duration: 0.5 }}
              className="absolute text-xs font-bold text-primary pointer-events-none"
              style={{ left: `${drop.x}%`, top: `${drop.y}%` }}
            >
              +1 XP
            </motion.div>
          ))}
      </div>

      {/* Result popup */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-3 px-8 py-6 rounded-3xl bg-gradient-to-b from-card/95 to-background/95 backdrop-blur-xl border border-primary/30 shadow-[0_0_40px_hsl(var(--primary)/0.3)]">
              <span className="text-4xl">🎉</span>
              <h3 className="font-display text-xl text-primary">{t("xpRainOver")}</h3>
              <p className="text-foreground text-lg font-bold">
                {t("xpRainYouGot")} <span className="text-primary">{collected} XP</span>
              </p>
              <p className="text-xs text-muted-foreground">{t("xpRainAddedToAccount")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
