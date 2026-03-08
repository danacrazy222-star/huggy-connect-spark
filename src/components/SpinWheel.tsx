import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { Gift, Gamepad2, Zap, RotateCcw, Ticket, Percent, Star, Trophy } from "lucide-react";

const SEGMENTS = [
  { label: "10 XP", color: "hsl(0, 85%, 45%)", icon: "xp", reward: { type: "xp", amount: 10 } },
  { label: "+5%\nExtra Chance", color: "hsl(140, 70%, 35%)", icon: "percent", reward: { type: "xp", amount: 5 } },
  { label: "Draw\nEntry", color: "hsl(210, 80%, 40%)", icon: "entry", reward: { type: "drawEntry", amount: 1 } },
  { label: "Try\nAgain", color: "hsl(140, 60%, 30%)", icon: "retry", reward: { type: "none", amount: 0 } },
  { label: "50 XP\nPoints", color: "hsl(140, 70%, 25%)", icon: "xp2", reward: { type: "xp", amount: 50 } },
  { label: "Game\nTicket", color: "hsl(270, 60%, 40%)", icon: "game", reward: { type: "gameTicket", amount: 1 } },
  { label: "Surprise\nReward", color: "hsl(280, 70%, 45%)", icon: "surprise", reward: { type: "surprise", amount: 0 } },
  { label: "50 XP\n+50 Pts", color: "hsl(0, 80%, 40%)", icon: "combo", reward: { type: "combo", amount: 50 } },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;

function getIcon(icon: string) {
  const cls = "w-5 h-5";
  switch (icon) {
    case "xp": case "xp2": case "combo": return <Zap className={cls} />;
    case "percent": return <Percent className={cls} />;
    case "entry": return <Ticket className={cls} />;
    case "retry": return <RotateCcw className={cls} />;
    case "game": return <Gamepad2 className={cls} />;
    case "surprise": return <Gift className={cls} />;
    default: return <Star className={cls} />;
  }
}

export function SpinWheel() {
  const { canSpin, setLastSpinTime, addXP, addPoints, addGameTicket, addTarotTicket, addDrawEntry, checkSpinAvailability } = useGameStore();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const lastSpinTime = useGameStore((s) => s.lastSpinTime);

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
    <div className="flex flex-col items-center gap-4">
      {/* Wheel */}
      <div className="relative w-72 h-72">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full shadow-gold animate-pulse-glow" />
        
        {/* Decorative dots around wheel */}
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{
              top: `${50 - 49 * Math.cos((i * 15 * Math.PI) / 180)}%`,
              left: `${50 + 49 * Math.sin((i * 15 * Math.PI) / 180)}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}

        {/* SVG Wheel */}
        <motion.div
          className="w-full h-full"
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}
        >
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
                  <path
                    d={`M100,100 L${x1},${y1} A95,95 0 0,1 ${x2},${y2} Z`}
                    fill={seg.color}
                    stroke="hsl(45, 100%, 50%)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="7"
                    fontWeight="bold"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  >
                    {seg.label.split("\n").map((line, li) => (
                      <tspan key={li} x={textX} dy={li === 0 ? "-3" : "9"}>{line}</tspan>
                    ))}
                  </text>
                </g>
              );
            })}
            {/* Center circle */}
            <circle cx="100" cy="100" r="22" fill="hsl(20, 10%, 15%)" stroke="hsl(45, 100%, 50%)" strokeWidth="3" />
            <text x="100" y="95" textAnchor="middle" fill="hsl(45, 100%, 50%)" fontSize="8" fontWeight="bold">SPIN</text>
            <text x="100" y="108" textAnchor="middle" fill="hsl(45, 100%, 50%)" fontSize="8" fontWeight="bold">NOW</text>
          </svg>
        </motion.div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
        </div>
      </div>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card border border-primary/50 rounded-xl px-6 py-3 text-center shadow-gold"
        >
          <p className="text-sm text-muted-foreground">You won!</p>
          <p className="text-lg font-bold text-gold-gradient">{result}</p>
        </motion.div>
      )}

      {/* Daily Spin Info */}
      <div className="w-full max-w-sm bg-card/80 backdrop-blur rounded-2xl border border-border p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg font-bold text-gold-gradient">DAILY SPIN</h3>
        </div>
        
        {canSpin ? (
          <p className="text-sm text-foreground mb-3">
            You Have <span className="font-bold text-primary">ONE FREE ATTEMPT</span> Today!
          </p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-2">Your Next Free Spin Will Be Available In:</p>
            <div className="flex items-center justify-center gap-2">
              {[
                { val: timeLeft.hours, label: "HOURS" },
                { val: timeLeft.minutes, label: "MINUTES" },
                { val: timeLeft.seconds, label: "SECONDS" },
              ].map((t, i) => (
                <div key={i} className="bg-muted rounded-lg px-3 py-2 min-w-[50px]">
                  <div className="text-lg font-bold text-foreground">{String(t.val).padStart(2, "0")}</div>
                  <div className="text-[8px] text-muted-foreground">{t.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Reward icons */}
        <div className="flex items-center justify-around mt-4 pt-3 border-t border-border">
          {[
            { icon: <Zap className="w-4 h-4" />, label: "XP Points" },
            { icon: <Ticket className="w-4 h-4" />, label: "Game Tickets" },
            { icon: <Trophy className="w-4 h-4" />, label: "Extra Entries" },
            { icon: <Gift className="w-4 h-4" />, label: "Surprise" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="text-primary">{item.icon}</div>
              <span className="text-[9px] text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground mt-3">
          🔒 All Rewards Are Promotional • <span className="text-red-accent">No Cash Value</span>
        </p>
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={spinning || !canSpin}
        className="w-full max-w-sm py-3.5 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {spinning ? "SPINNING..." : canSpin ? "SPIN NOW" : "COME BACK TOMORROW"}
      </button>
    </div>
  );
}
