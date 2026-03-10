import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Gift, Zap, Ticket, Trophy, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SEGMENTS = [
  { label: "50\nXP", color: "#14532D", colorEnd: "#16A34A", reward: { type: "xp50" }, icon: "⚡" },
  { label: "Try\nAgain", color: "#166534", colorEnd: "#22C55E", reward: { type: "none" }, icon: "🔄" },
  { label: "Surprise\nGift", color: "#86198F", colorEnd: "#C026D3", reward: { type: "surprise" }, icon: "🎁" },
  { label: "Game\nTicket", color: "#15803D", colorEnd: "#22C55E", reward: { type: "gameTicket" }, icon: "🎮" },
  { label: "15 Pts\n+50 XP", color: "#B8860B", colorEnd: "#FFD700", reward: { type: "pointsXp" }, icon: "💎" },
  { label: "100\nXP", color: "#1D4ED8", colorEnd: "#3B82F6", reward: { type: "xp100" }, icon: "⚡" },
  { label: "Tarot\nTicket", color: "#7E22CE", colorEnd: "#A855F7", reward: { type: "tarotTicket" }, icon: "🔮" },
  { label: "Game &\nTarot", color: "#B91C1C", colorEnd: "#DC2626", reward: { type: "ticketCombo" }, icon: "🎟️" },
];

const REWARD_LABELS: Record<string, string> = {
  xp50: "50 XP",
  xp100: "100 XP",
  gameTicket: "Game Ticket",
  tarotTicket: "Tarot Ticket",
  ticketCombo: "Game & Tarot Ticket",
  pointsXp: "15 Points + 50 XP",
  surprise: "Surprise Gift",
  none: "Try Again",
};

const REWARD_DISTRIBUTION = [
  { segmentIndex: 0, weight: 15 },
  { segmentIndex: 1, weight: 13 },
  { segmentIndex: 2, weight: 8 },
  { segmentIndex: 3, weight: 18 },
  { segmentIndex: 4, weight: 3 },
  { segmentIndex: 5, weight: 12 },
  { segmentIndex: 6, weight: 18 },
  { segmentIndex: 7, weight: 13 },
];

function getWeightedSegment(): number {
  const totalWeight = REWARD_DISTRIBUTION.reduce((sum, r) => sum + r.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const entry of REWARD_DISTRIBUTION) {
    rand -= entry.weight;
    if (rand <= 0) return entry.segmentIndex;
  }
  return REWARD_DISTRIBUTION[REWARD_DISTRIBUTION.length - 1].segmentIndex;
}

const SEGMENT_ANGLE = 360 / SEGMENTS.length;
const NUM_LIGHTS = 24;

export function SpinWheel() {
  const { canSpin, setLastSpinTime, addXP, addPoints, addGameTicket, addTarotTicket, addDrawEntry, checkSpinAvailability } = useGameStore();
  const lastSpinTime = useGameStore((s) => s.lastSpinTime);
  const { t, isRTL } = useTranslation();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [winReward, setWinReward] = useState<{ type: string; label: string } | null>(null);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setLightPhase((p) => (p + 1) % NUM_LIGHTS);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const handleSpin = useCallback(() => {
    if (spinning || !canSpin) return;
    setSpinning(true);
    setShowWinModal(false);
    setWinReward(null);

    const segmentIndex = getWeightedSegment();
    const extraSpins = 6 * 360;
    const targetAngle = extraSpins + (360 - segmentIndex * SEGMENT_ANGLE - SEGMENT_ANGLE / 2);
    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      const segment = SEGMENTS[segmentIndex];
      setSpinning(false);
      setLastSpinTime(Date.now());
      switch (segment.reward.type) {
        case "xp50": addXP(50); break;
        case "xp100": addXP(100); break;
        case "gameTicket": addGameTicket(1); break;
        case "tarotTicket": addTarotTicket(1); break;
        case "ticketCombo": addGameTicket(1); addTarotTicket(1); break;
        case "pointsXp": addPoints(15); addXP(50); break;
        case "surprise": addXP(50); addTarotTicket(1); break;
      }
      setWinReward({
        type: segment.reward.type,
        label: REWARD_LABELS[segment.reward.type] || segment.label.replace("\n", " "),
      });
      setShowWinModal(true);
    }, 4500);
  }, [spinning, canSpin, setLastSpinTime, addXP, addPoints, addGameTicket, addTarotTicket, addDrawEntry]);

  return (
    <div className={cn("flex flex-col items-center gap-5", isRTL && "direction-rtl")}>
      
      {/* === WHEEL === */}
      <div className="relative w-[300px] h-[300px] mx-auto">
        {/* Outer ambient glow */}
        <div className="absolute -inset-6 rounded-full" 
          style={{ 
            background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 40%, hsl(var(--accent) / 0.08) 70%, transparent 100%)",
            filter: "blur(20px)"
          }} 
        />

        {/* Light bulbs */}
        {Array.from({ length: NUM_LIGHTS }).map((_, i) => {
          const angle = (i * 360) / NUM_LIGHTS;
          const rad = (angle * Math.PI) / 180;
          const radius = 52;
          const isLit = (i + lightPhase) % 3 === 0;
          return (
            <div
              key={i}
              className="absolute z-20 rounded-full transition-all duration-150"
              style={{
                width: isLit ? "8px" : "5px",
                height: isLit ? "8px" : "5px",
                top: `${50 - radius * Math.cos(rad)}%`,
                left: `${50 + radius * Math.sin(rad)}%`,
                transform: "translate(-50%, -50%)",
                background: isLit
                  ? i % 2 === 0
                    ? "radial-gradient(circle, hsl(45 100% 70%), hsl(45 100% 50%))"
                    : "radial-gradient(circle, hsl(330 80% 65%), hsl(270 80% 55%))"
                  : "hsl(var(--muted))",
                boxShadow: isLit
                  ? i % 2 === 0
                    ? "0 0 6px hsl(45 100% 50%), 0 0 12px hsl(45 100% 50% / 0.5)"
                    : "0 0 6px hsl(270 80% 55%), 0 0 12px hsl(270 80% 55% / 0.5)"
                  : "none",
              }}
            />
          );
        })}

        {/* Gold outer ring */}
        <div className="absolute inset-0 rounded-full z-10"
          style={{
            background: "conic-gradient(from 0deg, hsl(35 100% 40%), hsl(45 100% 50%), hsl(35 80% 45%), hsl(45 100% 60%), hsl(35 100% 40%), hsl(45 100% 50%), hsl(35 80% 45%), hsl(45 100% 60%), hsl(35 100% 40%))",
            padding: "5px",
          }}
        >
          <div className="w-full h-full rounded-full bg-transparent" />
        </div>

        {/* Spinning wheel SVG */}
        <motion.div 
          className="absolute inset-[5px] z-10" 
          animate={{ rotate: rotation }} 
          transition={{ duration: 4.5, ease: [0.15, 0.6, 0.08, 1.0] }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
            <defs>
              {SEGMENTS.map((seg, i) => (
                <radialGradient key={`grad-${i}`} id={`seg-grad-${i}`} cx="50%" cy="50%" r="50%">
                  <stop offset="20%" stopColor={seg.colorEnd} />
                  <stop offset="100%" stopColor={seg.color} />
                </radialGradient>
              ))}
              <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(260 50% 18%)" />
                <stop offset="100%" stopColor="hsl(260 60% 8%)" />
              </radialGradient>
              <filter id="seg-shadow">
                <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#000" floodOpacity="0.25" />
              </filter>
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
              const iconX = 100 + 45 * Math.cos(midAngle);
              const iconY = 100 + 45 * Math.sin(midAngle);
              const textX = 100 + 72 * Math.cos(midAngle);
              const textY = 100 + 72 * Math.sin(midAngle);
              const textRotation = (startAngle + endAngle) / 2 + 90;

              return (
                <g key={i}>
                  <path
                    d={`M100,100 L${x1},${y1} A95,95 0 0,1 ${x2},${y2} Z`}
                    fill={`url(#seg-grad-${i})`}
                    stroke="hsl(45 100% 50% / 0.4)"
                    strokeWidth="0.8"
                    filter="url(#seg-shadow)"
                  />
                  <line x1="100" y1="100" x2={x1} y2={y1} stroke="hsl(45 100% 50% / 0.15)" strokeWidth="0.5" />
                  <text
                    x={iconX} y={iconY}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="13"
                    transform={`rotate(${textRotation}, ${iconX}, ${iconY})`}
                  >
                    {seg.icon}
                  </text>
                  <text
                    x={textX} y={textY}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="white" fontSize="6.5" fontWeight="700"
                    fontFamily="Inter, sans-serif"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  >
                    {seg.label.split("\n").map((line, li) => (
                      <tspan key={li} x={textX} dy={li === 0 ? "-3" : "8"}>{line}</tspan>
                    ))}
                  </text>
                </g>
              );
            })}

            {/* Center hub */}
            <circle cx="100" cy="100" r="24" fill="url(#center-grad)" stroke="hsl(45 100% 50%)" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="20" fill="none" stroke="hsl(45 100% 50% / 0.3)" strokeWidth="0.8" />
            <text x="100" y="96" textAnchor="middle" fill="hsl(45 100% 70%)" fontSize="7" fontWeight="700" fontFamily="Cinzel, serif" opacity="0.9">
              SPIN
            </text>
            <text x="100" y="106" textAnchor="middle" fill="hsl(45 100% 70%)" fontSize="5.5" fontWeight="600" fontFamily="Cinzel, serif" opacity="0.7">
              THE WHEEL
            </text>
          </svg>
        </motion.div>

        {/* Pointer */}
        <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 z-30">
          <div className="relative">
            <svg width="28" height="32" viewBox="0 0 28 32">
              <defs>
                <linearGradient id="pointer-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(45 100% 60%)" />
                  <stop offset="100%" stopColor="hsl(35 100% 40%)" />
                </linearGradient>
                <filter id="pointer-shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="hsl(45 100% 50%)" floodOpacity="0.5" />
                </filter>
              </defs>
              <polygon points="14,28 2,4 14,10 26,4" fill="url(#pointer-grad)" filter="url(#pointer-shadow)" stroke="hsl(45 100% 70%)" strokeWidth="0.5" />
              <circle cx="14" cy="10" r="3" fill="hsl(0 80% 50%)" stroke="hsl(45 100% 50%)" strokeWidth="0.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* === SPIN BUTTON === */}
      <button
        onClick={handleSpin}
        disabled={spinning || !canSpin}
        className={cn(
          "w-full max-w-xs py-3.5 rounded-2xl font-display font-bold text-base tracking-wide transition-all",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          canSpin && !spinning && "hover:brightness-110 active:scale-[0.97]"
        )}
        style={{
          background: canSpin 
            ? "linear-gradient(135deg, hsl(35 100% 40%), hsl(45 100% 50%), hsl(40 100% 45%))"
            : "linear-gradient(135deg, hsl(260 30% 20%), hsl(260 40% 25%))",
          color: canSpin ? "hsl(260 60% 8%)" : "hsl(260 20% 50%)",
          boxShadow: canSpin 
            ? "0 4px 20px hsl(45 100% 50% / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.15)"
            : "none",
        }}
      >
        {spinning ? "Spinning..." : canSpin ? "🎰  SPIN THE WHEEL" : "Come Back Tomorrow for Your Next Spin"}
      </button>

      {/* === TIMER / INFO SECTION === */}
      <div className="w-full max-w-xs rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, hsl(var(--card)), hsl(var(--background)))",
          border: "1px solid hsl(var(--primary) / 0.15)",
        }}
      >
        {/* Timer header */}
        <div className="px-4 pt-4 pb-2 text-center">
          <h3 className="font-display text-sm font-bold text-gold-gradient tracking-wider">
            {canSpin ? "DAILY SPIN REWARD" : "NEXT FREE SPIN"}
          </h3>
        </div>

        {canSpin ? (
          <div className="px-4 pb-4 text-center">
            <p className="text-sm text-foreground/80">You have one free spin available!</p>
          </div>
        ) : (
          <div className="px-4 pb-4">
            <p className="text-xs text-muted-foreground text-center mb-3">Your next free spin will be available in</p>
            <div className={cn("flex items-center justify-center gap-3", isRTL && "flex-row-reverse")}>
              {[
                { val: timeLeft.hours, label: "HOURS" },
                { val: timeLeft.minutes, label: "MINUTES" },
                { val: timeLeft.seconds, label: "SECONDS" },
              ].map((ti, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="rounded-xl px-4 py-2.5 min-w-[56px]"
                    style={{
                      background: "linear-gradient(180deg, hsl(var(--muted)), hsl(var(--background)))",
                      border: "1px solid hsl(var(--primary) / 0.15)",
                      boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.03)",
                    }}
                  >
                    <div className="text-xl font-bold text-foreground text-center font-display tabular-nums">
                      {String(ti.val).padStart(2, "0")}
                    </div>
                  </div>
                  <span className="text-[9px] text-muted-foreground mt-1.5 tracking-wider font-medium">{ti.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="h-px mx-4" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.2), transparent)" }} />

        {/* Reward types */}
        <div className={cn("grid grid-cols-4 gap-1 px-3 py-3", isRTL && "direction-rtl")}>
          {[
            { icon: <Zap className="w-4 h-4" />, label: "XP Points" },
            { icon: <Ticket className="w-4 h-4" />, label: "Game Tickets" },
            { icon: <Trophy className="w-4 h-4" />, label: "Bonus Entries" },
            { icon: <Gift className="w-4 h-4" />, label: "Surprise Rewards" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1 py-1">
              <div className="text-primary">{item.icon}</div>
              <span className="text-[9px] text-muted-foreground text-center leading-tight">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Legal */}
        <div className="px-4 pb-3">
          <p className="text-[10px] text-muted-foreground/60 text-center">
            🔒 All rewards are promotional and have{" "}
            <span className="text-destructive/80">no cash value</span>.
          </p>
        </div>
      </div>

      {/* === WIN MODAL === */}
      <AnimatePresence>
        {showWinModal && winReward && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: "hsl(0 0% 0% / 0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowWinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-sm rounded-3xl p-6 text-center"
              style={{
                background: "linear-gradient(180deg, hsl(260 50% 16%), hsl(260 60% 8%))",
                border: "2px solid hsl(var(--primary) / 0.4)",
                boxShadow: "0 0 40px hsl(var(--primary) / 0.2), 0 20px 60px hsl(0 0% 0% / 0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowWinModal(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                className="text-5xl mb-3"
              >
                {winReward.type === "none" ? "😅" : "🎉"}
              </motion.div>

              <h2 className="font-display text-xl font-bold text-gold-gradient mb-1">
                {winReward.type === "none" ? "Better Luck Next Time!" : "Congratulations!"}
              </h2>

              <p className="text-foreground/80 text-sm mb-4">
                {winReward.type === "none" 
                  ? "Come back tomorrow for another chance!" 
                  : `You won ${winReward.label}`}
              </p>

              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-lg font-bold text-gold-gradient font-display">{winReward.label}</span>
                <Sparkles className="w-4 h-4 text-primary" />
              </div>

              <button
                onClick={() => setShowWinModal(false)}
                className="w-full py-2.5 rounded-xl font-display font-semibold text-sm transition-all hover:brightness-110 active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, hsl(35 100% 40%), hsl(45 100% 50%))",
                  color: "hsl(260 60% 8%)",
                }}
              >
                Awesome!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
