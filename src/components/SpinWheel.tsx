import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Gift, Gamepad2, Zap, RotateCcw, Ticket, Percent, Star, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SEGMENTS = [
  { labelKey: "xpPoints", label: "XP\n+50", color: "#B91C1C", colorEnd: "#DC2626", reward: { type: "xp", amount: 50 }, icon: "⚡" },
  { labelKey: "xpPoints", label: "XP\n+10", color: "#15803D", colorEnd: "#22C55E", reward: { type: "xp", amount: 10 }, icon: "✨" },
  { labelKey: "gameTicket", label: "Game\nTicket", color: "#7E22CE", colorEnd: "#A855F7", reward: { type: "gameTicket", amount: 1 }, icon: "🎮" },
  { labelKey: "drawEntry", label: "Draw\nEntry", color: "#1D4ED8", colorEnd: "#3B82F6", reward: { type: "drawEntry", amount: 1 }, icon: "🎟️" },
  { labelKey: "tryAgain", label: "Try\nAgain", color: "#166534", colorEnd: "#16A34A", reward: { type: "none", amount: 0 }, icon: "🔄" },
  { labelKey: "surpriseReward", label: "Surprise\nReward", color: "#86198F", colorEnd: "#C026D3", reward: { type: "surprise", amount: 0 }, icon: "🎁" },
  { labelKey: "xpPoints", label: "XP\n+50", color: "#14532D", colorEnd: "#15803D", reward: { type: "xp", amount: 50 }, icon: "🧪" },
  { labelKey: "xpPoints", label: "Points\n+50", color: "#991B1B", colorEnd: "#EF4444", reward: { type: "combo", amount: 50 }, icon: "💎" },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;
const NUM_LIGHTS = 20;

export function SpinWheel() {
  const { canSpin, setLastSpinTime, addXP, addPoints, addGameTicket, addTarotTicket, addDrawEntry, checkSpinAvailability } = useGameStore();
  const lastSpinTime = useGameStore((s) => s.lastSpinTime);
  const { t, isRTL } = useTranslation();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [lightPhase, setLightPhase] = useState(0);

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

  // Animate lights
  useEffect(() => {
    const interval = setInterval(() => {
      setLightPhase((p) => (p + 1) % NUM_LIGHTS);
    }, 150);
    return () => clearInterval(interval);
  }, []);

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
      {/* Wheel Container */}
      <div className="relative w-80 h-80">
        {/* Outer glow ring */}
        <div className="absolute -inset-4 rounded-full opacity-60" 
          style={{ 
            background: "radial-gradient(circle, hsl(45 100% 50% / 0.3) 60%, hsl(270 80% 55% / 0.2) 80%, transparent 100%)",
            filter: "blur(15px)"
          }} 
        />

        {/* Animated light bulbs around the wheel */}
        {Array.from({ length: NUM_LIGHTS }).map((_, i) => {
          const angle = (i * 360) / NUM_LIGHTS;
          const rad = (angle * Math.PI) / 180;
          const radius = 51;
          const isLit = (i + lightPhase) % 3 === 0;
          return (
            <div
              key={i}
              className="absolute z-20 rounded-full transition-all duration-200"
              style={{
                width: isLit ? "10px" : "7px",
                height: isLit ? "10px" : "7px",
                top: `${50 - radius * Math.cos(rad)}%`,
                left: `${50 + radius * Math.sin(rad)}%`,
                transform: "translate(-50%, -50%)",
                background: isLit
                  ? i % 2 === 0
                    ? "radial-gradient(circle, #FFD700, #FFA500)"
                    : "radial-gradient(circle, #FF6B9D, #C026D3)"
                  : i % 2 === 0
                    ? "radial-gradient(circle, #B8860B, #8B6914)"
                    : "radial-gradient(circle, #8B008B, #5B005B)",
                boxShadow: isLit
                  ? i % 2 === 0
                    ? "0 0 8px #FFD700, 0 0 15px #FFD70088"
                    : "0 0 8px #FF6B9D, 0 0 15px #C026D388"
                  : "none",
              }}
            />
          );
        })}

        {/* Golden outer ring */}
        <div className="absolute inset-1 rounded-full z-10"
          style={{
            background: "conic-gradient(from 0deg, #B8860B, #FFD700, #FFA500, #FFD700, #B8860B, #FFD700, #FFA500, #FFD700, #B8860B)",
            padding: "4px",
          }}
        >
          <div className="w-full h-full rounded-full" style={{ background: "transparent" }} />
        </div>

        {/* Inner golden ring */}
        <div className="absolute inset-3 rounded-full z-10 pointer-events-none"
          style={{
            border: "3px solid #FFD700",
            boxShadow: "inset 0 0 15px rgba(255, 215, 0, 0.3), 0 0 15px rgba(255, 215, 0, 0.3)",
          }}
        />

        {/* Spinning wheel */}
        <motion.div 
          className="absolute inset-3 z-10" 
          animate={{ rotate: rotation }} 
          transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              {SEGMENTS.map((seg, i) => (
                <radialGradient key={`grad-${i}`} id={`seg-grad-${i}`} cx="50%" cy="50%" r="50%">
                  <stop offset="30%" stopColor={seg.colorEnd} />
                  <stop offset="100%" stopColor={seg.color} />
                </radialGradient>
              ))}
              <filter id="inner-shadow">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
              </filter>
              <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2A1A0A" />
                <stop offset="70%" stopColor="#1A0A00" />
                <stop offset="100%" stopColor="#0D0500" />
              </radialGradient>
            </defs>

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
              const iconX = 100 + 48 * Math.cos(midAngle);
              const iconY = 100 + 48 * Math.sin(midAngle);
              const textX = 100 + 70 * Math.cos(midAngle);
              const textY = 100 + 70 * Math.sin(midAngle);
              const textRotation = (startAngle + endAngle) / 2 + 90;

              return (
                <g key={i}>
                  {/* Segment */}
                  <path
                    d={`M100,100 L${x1},${y1} A95,95 0 0,1 ${x2},${y2} Z`}
                    fill={`url(#seg-grad-${i})`}
                    stroke="#FFD700"
                    strokeWidth="1"
                    filter="url(#inner-shadow)"
                  />
                  {/* Divider line */}
                  <line
                    x1="100" y1="100" x2={x1} y2={y1}
                    stroke="#FFD70088"
                    strokeWidth="0.5"
                  />
                  {/* Icon */}
                  <text
                    x={iconX} y={iconY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="14"
                    transform={`rotate(${textRotation}, ${iconX}, ${iconY})`}
                  >
                    {seg.icon}
                  </text>
                  {/* Label */}
                  <text
                    x={textX} y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="7"
                    fontWeight="bold"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                  >
                    {seg.label.split("\n").map((line, li) => (
                      <tspan key={li} x={textX} dy={li === 0 ? "-3" : "9"}>{line}</tspan>
                    ))}
                  </text>
                </g>
              );
            })}

            {/* Center circle - luxurious */}
            <circle cx="100" cy="100" r="26" fill="url(#center-grad)" stroke="#FFD700" strokeWidth="3" />
            <circle cx="100" cy="100" r="22" fill="none" stroke="#B8860B" strokeWidth="1" />
            
            {/* Center gem */}
            <polygon points="100,82 104,90 100,88 96,90" fill="#FF4444" stroke="#FFD700" strokeWidth="0.5" />
            
            {/* SPIN NOW text */}
            <text x="100" y="99" textAnchor="middle" fill="#FFD700" fontSize="10" fontWeight="bold" fontFamily="Cinzel, serif"
              style={{ textShadow: "0 0 10px #FFD700" }}>
              SPIN
            </text>
            <text x="100" y="112" textAnchor="middle" fill="#FFD700" fontSize="10" fontWeight="bold" fontFamily="Cinzel, serif"
              style={{ textShadow: "0 0 10px #FFD700" }}>
              NOW
            </text>
            
            {/* Bottom gem */}
            <polygon points="100,118 104,126 100,124 96,126" fill="#4488FF" stroke="#FFD700" strokeWidth="0.5" />
          </svg>
        </motion.div>

        {/* Pointer / Arrow at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-30">
          <div className="relative">
            <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent"
              style={{ 
                borderTopColor: "#FFD700",
                filter: "drop-shadow(0 2px 6px rgba(255, 215, 0, 0.6))"
              }} 
            />
            {/* Red gem on pointer */}
            <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
              style={{ background: "radial-gradient(circle, #FF4444, #CC0000)" }}
            />
          </div>
        </div>

        {/* Corner decorative diamonds */}
        {[
          { top: "8%", left: "8%" },
          { top: "8%", right: "8%" },
          { bottom: "8%", left: "8%" },
          { bottom: "8%", right: "8%" },
        ].map((pos, i) => (
          <div key={i} className="absolute z-20 w-4 h-4" style={pos as any}>
            <div className="w-full h-full rotate-45"
              style={{
                background: "linear-gradient(135deg, #4488FF, #2255CC)",
                border: "1px solid #FFD700",
                boxShadow: "0 0 6px #4488FF88",
              }}
            />
          </div>
        ))}
      </div>

      {/* Result popup */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="rounded-xl px-6 py-3 text-center"
            style={{
              background: "linear-gradient(135deg, hsl(260 50% 12%), hsl(260 60% 8%))",
              border: "2px solid #FFD700",
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.05)",
            }}
          >
            <p className="text-sm text-muted-foreground">{t("youWon")}</p>
            <p className="text-lg font-bold text-gold-gradient flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              {result}
              <Sparkles className="w-4 h-4 text-primary" />
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Card */}
      <div className="w-full max-w-sm rounded-2xl p-4 text-center"
        style={{
          background: "linear-gradient(180deg, hsl(260 50% 12%) 0%, hsl(260 60% 8%) 100%)",
          border: "1px solid hsl(45 100% 50% / 0.3)",
          boxShadow: "0 0 30px hsl(45 100% 50% / 0.1)",
        }}
      >
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
                <div key={i} className="rounded-lg px-3 py-2 min-w-[50px]"
                  style={{
                    background: "linear-gradient(180deg, hsl(260 40% 18%), hsl(260 50% 12%))",
                    border: "1px solid hsl(45 100% 50% / 0.2)",
                  }}
                >
                  <div className="text-lg font-bold text-foreground">{String(ti.val).padStart(2, "0")}</div>
                  <div className="text-[8px] text-muted-foreground">{ti.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="h-px my-3" style={{ background: "linear-gradient(90deg, transparent, hsl(45 100% 50% / 0.3), transparent)" }} />

        <div className={cn("flex items-center justify-around", isRTL && "flex-row-reverse")}>
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
          🔒 {t("allRewardsPromotional")} • <span className="text-destructive">{t("noCashValue")}</span>
        </p>
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={spinning || !canSpin}
        className="w-full max-w-sm py-3.5 rounded-xl font-display font-bold text-lg text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
        style={{
          background: "linear-gradient(90deg, #B8860B, #FFD700, #FFA500, #FFD700, #B8860B)",
          boxShadow: "0 4px 20px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        {spinning ? t("spinning") : canSpin ? `🎰 ${t("spinNow")}` : t("comeBackTomorrow")}
      </button>
    </div>
  );
}
