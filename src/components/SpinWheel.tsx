import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Gift, Gamepad2, Zap, RotateCcw, Ticket, Percent, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const SEGMENTS = [
  { labelKey: "xpPoints", label: "10 XP\nPoints", color: "hsl(0, 85%, 45%)", reward: { type: "xp", amount: 10 } },
  { labelKey: "extraChance", label: "+5%\nExtra Chance", color: "hsl(140, 70%, 35%)", reward: { type: "xp", amount: 5 } },
  { labelKey: "drawEntry", label: "Draw\nEntry", color: "hsl(210, 80%, 40%)", reward: { type: "drawEntry", amount: 1 } },
  { labelKey: "tryAgain", label: "Try\nAgain", color: "hsl(140, 60%, 30%)", reward: { type: "none", amount: 0 } },
  { labelKey: "xpPoints", label: "50 XP\nPoints", color: "hsl(140, 70%, 25%)", reward: { type: "xp", amount: 50 } },
  { labelKey: "gameTicket", label: "Game\nTicket", color: "hsl(270, 60%, 40%)", reward: { type: "gameTicket", amount: 1 } },
  { labelKey: "surpriseReward", label: "Surprise\nReward", color: "hsl(280, 70%, 45%)", reward: { type: "surprise", amount: 0 } },
  { labelKey: "xpPoints", label: "50 XP\n+50 Pts", color: "hsl(0, 80%, 40%)", reward: { type: "combo", amount: 50 } },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;

export function SpinWheel() {
  const { canSpin, setLastSpinTime, addXP, addPoints, addGameTicket, addTarotTicket, addDrawEntry, checkSpinAvailability } = useGameStore();
  const lastSpinTime = useGameStore((s) => s.lastSpinTime);
  const { t, isRTL } = useTranslation();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    checkSpinAvailability();
    const interval = setInterval(() => {
      if (lastSpinTime) {
        const elapsed = Date.now() - lastSpinTime;
        const remaining = Math.max(0, 24 * 60 * 60 * 1000 - elapsed);
        setTimeLeft({
          hours: Math.floor(remaining / 3600000),
          minutes: Math.floor((remaining % 3600000) / 60000),
          seconds: Math.floor((remaining % 60000) / 1000),
        });
        if (remaining === 0) checkSpinAvailability();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastSpinTime, checkSpinAvailability]);

  const handleSpin = useCallback(() => {
    if (spinning || !canSpin) return;
    setSpinning(true);
    setResult(null);

    const segmentIndex = Math.floor(Math.random() * SEGMENTS.length);
    const extraSpins = 5 * 360;
    const targetAngle = extraSpins + (360 - segmentIndex * SEGMENT_ANGLE - SEGMENT_ANGLE / 2);
    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      const segment = SEGMENTS[segmentIndex];
      setSpinning(false);
      setLastSpinTime(Date.now());
      switch (segment.reward.type) {
        case "xp": addXP(segment.reward.amount); break;
        case "gameTicket": addGameTicket(segment.reward.amount); break;
        case "drawEntry": addDrawEntry(segment.reward.amount); break;
        case "combo": addXP(50); addPoints(50); break;
        case "surprise": addXP(50); addTarotTicket(1); break;
      }
      setResult(segment.label.replace("\n", " "));
    }, 4000);
  }, [spinning, canSpin, setLastSpinTime, addXP, addPoints, addGameTicket, addTarotTicket, addDrawEntry]);

  return (
    <div className={cn("flex flex-col items-center gap-4", isRTL && "direction-rtl")}>
      {/* Wheel */}
      <div className="relative w-72 h-72">
        <div className="absolute inset-0 rounded-full shadow-gold animate-pulse-glow" />
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="absolute w-2 h-2 rounded-full bg-primary"
            style={{ top: `${50 - 49 * Math.cos((i * 15 * Math.PI) / 180)}%`, left: `${50 + 49 * Math.sin((i * 15 * Math.PI) / 180)}%` }} />
        ))}
        <motion.div className="w-full h-full" animate={{ rotate: rotation }} transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
            {SEGMENTS.map((seg, i) => {
              const startAngle = i * SEGMENT_ANGLE - 90;
              const endAngle = startAngle + SEGMENT_ANGLE;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const x1 = 100 + 95 * Math.cos(startRad);
              const y1 = 100 + 95 * Math.sin(startRad);
              const x2 = 100 + 95 * Math.cos(endRad);
              const y2 = 100 + 95 * Math.sin(endRad);
              const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
              const textX = 100 + 60 * Math.cos(midAngle);
              const textY = 100 + 60 * Math.sin(midAngle);
              const textRotation = (startAngle + endAngle) / 2 + 90;
              return (
                <g key={i}>
                  <path d={`M100,100 L${x1},${y1} A95,95 0 0,1 ${x2},${y2} Z`} fill={seg.color} stroke="hsl(45, 100%, 50%)" strokeWidth="1.5" />
                  <text x={textX} y={textY} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="7" fontWeight="bold" transform={`rotate(${textRotation}, ${textX}, ${textY})`}>
                    {seg.label.split("\n").map((line, li) => (
                      <tspan key={li} x={textX} dy={li === 0 ? "-3" : "9"}>{line}</tspan>
                    ))}
                  </text>
                </g>
              );
            })}
            <circle cx="100" cy="100" r="22" fill="hsl(20, 10%, 15%)" stroke="hsl(45, 100%, 50%)" strokeWidth="3" />
            <text x="100" y="95" textAnchor="middle" fill="hsl(45, 100%, 50%)" fontSize="8" fontWeight="bold">SPIN</text>
            <text x="100" y="108" textAnchor="middle" fill="hsl(45, 100%, 50%)" fontSize="8" fontWeight="bold">NOW</text>
          </svg>
        </motion.div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
        </div>
      </div>

      {result && (
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-card border border-primary/50 rounded-xl px-6 py-3 text-center shadow-gold">
          <p className="text-sm text-muted-foreground">{t("youWon")}</p>
          <p className="text-lg font-bold text-gold-gradient">{result}</p>
        </motion.div>
      )}

      <div className="w-full max-w-sm bg-card/80 backdrop-blur rounded-2xl border border-border p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg font-bold text-gold-gradient">{t("dailySpin")}</h3>
        </div>
        {canSpin ? (
          <p className="text-sm text-foreground mb-3">{t("oneFreeAttempt")}</p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-2">{t("nextSpinIn")}</p>
            <div className={cn("flex items-center justify-center gap-2", isRTL && "flex-row-reverse")}>
              {[
                { val: timeLeft.hours, label: t("hours") },
                { val: timeLeft.minutes, label: t("minutes") },
                { val: timeLeft.seconds, label: t("seconds") },
              ].map((ti, i) => (
                <div key={i} className="bg-muted rounded-lg px-3 py-2 min-w-[50px]">
                  <div className="text-lg font-bold text-foreground">{String(ti.val).padStart(2, "0")}</div>
                  <div className="text-[8px] text-muted-foreground">{ti.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
        <div className={cn("flex items-center justify-around mt-4 pt-3 border-t border-border", isRTL && "flex-row-reverse")}>
          {[
            { icon: <Zap className="w-4 h-4" />, label: t("xpPoints") },
            { icon: <Ticket className="w-4 h-4" />, label: t("gameTickets") },
            { icon: <Trophy className="w-4 h-4" />, label: t("extraEntries") },
            { icon: <Gift className="w-4 h-4" />, label: t("surpriseRewards") },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="text-primary">{item.icon}</div>
              <span className="text-[9px] text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-3">
          🔒 {t("allRewardsPromotional")} • <span className="text-red-accent">{t("noCashValue")}</span>
        </p>
      </div>

      <button onClick={handleSpin} disabled={spinning || !canSpin}
        className="w-full max-w-sm py-3.5 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        {spinning ? t("spinning") : canSpin ? t("spinNow") : t("comeBackTomorrow")}
      </button>
    </div>
  );
}
