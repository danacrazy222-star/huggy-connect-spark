import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Gift, Zap, Ticket, Trophy, Sparkles, X, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { playTick, playSpinStart, playWinSound, playLoseSound } from "@/utils/spinSounds";

const SEGMENT_COLORS = [
  { color: "#1a8a4a", colorEnd: "#2ecc71" },
  { color: "#7a8085", colorEnd: "#9aa0a6" },
  { color: "#7b3fa0", colorEnd: "#9b59b6" },
  { color: "#1a8a4a", colorEnd: "#2ecc71" },
  { color: "#c9950a", colorEnd: "#f1c40f" },
  { color: "#2270b8", colorEnd: "#3498db" },
  { color: "#7b3fa0", colorEnd: "#9b59b6" },
  { color: "#c0392b", colorEnd: "#e74c3c" },
];

const SEGMENT_ICONS = ["⚡", "🔄", "🎁", "🎮", "💎", "⚡", "🔮", "🎟️"];
const SEGMENT_REWARDS = [
  { type: "xp50" }, { type: "none" }, { type: "surprise" }, { type: "gameTicket" },
  { type: "pointsXp" }, { type: "xp100" }, { type: "tarotTicket" }, { type: "ticketCombo" },
];

const REWARD_ICON_MAP: Record<string, string> = {
  xp50: "⚡", xp100: "⚡⚡", gameTicket: "🎮", tarotTicket: "🔮",
  ticketCombo: "🎟️", pointsXp: "💎", surprise: "🎁", none: "🔄",
};

const REWARD_DISTRIBUTION = [
  { segmentIndex: 0, weight: 15 }, { segmentIndex: 1, weight: 13 },
  { segmentIndex: 2, weight: 8 }, { segmentIndex: 3, weight: 18 },
  { segmentIndex: 4, weight: 3 }, { segmentIndex: 5, weight: 12 },
  { segmentIndex: 6, weight: 18 }, { segmentIndex: 7, weight: 13 },
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

function getMsUntilNextBeirutReset(): number {
  const now = new Date();
  const beirutStr = now.toLocaleString('en-US', { timeZone: 'Asia/Beirut' });
  const beirutNow = new Date(beirutStr);
  const nextReset = new Date(beirutNow);
  nextReset.setHours(11, 0, 0, 0);
  if (beirutNow.getHours() >= 11) nextReset.setDate(nextReset.getDate() + 1);
  return nextReset.getTime() - beirutNow.getTime();
}

const NUM_SEGMENTS = 8;
const SEGMENT_ANGLE = 360 / NUM_SEGMENTS;
const NUM_LIGHTS = 24;

// Segment label keys for translation
const SEGMENT_LABEL_KEYS = [
  "seg_xp50", "seg_tryAgain", "seg_surprise", "seg_gameTicket",
  "seg_pointsXp", "seg_xp100", "seg_tarotTicket", "seg_ticketCombo",
];

// Reward label keys
const REWARD_LABEL_KEYS: Record<string, string> = {
  xp50: "reward_xp50", xp100: "reward_xp100", gameTicket: "reward_gameTicket",
  tarotTicket: "reward_tarotTicket", ticketCombo: "reward_ticketCombo",
  pointsXp: "reward_pointsXp", surprise: "reward_surprise", none: "reward_tryAgain",
};

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
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    checkSpinAvailability();
    const interval = setInterval(() => {
      checkSpinAvailability();
      const remaining = getMsUntilNextBeirutReset();
      setTimeLeft({
        hours: Math.floor(remaining / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000),
      });
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

    // Play spin start sound
    playSpinStart();

    // Tick sounds that slow down over time
    let tickSpeed = 60;
    const startTicking = () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = setInterval(() => {
        playTick();
        tickSpeed += 15;
        if (tickSpeed > 500) {
          if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
          return;
        }
        if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = setInterval(() => {
          playTick();
        }, tickSpeed);
      }, tickSpeed);
    };
    startTicking();

    const segmentIndex = getWeightedSegment();
    const extraSpins = 6 * 360;
    const targetAngle = extraSpins + (360 - segmentIndex * SEGMENT_ANGLE - SEGMENT_ANGLE / 2);
    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      const rewardType = SEGMENT_REWARDS[segmentIndex].type;
      setSpinning(false);
      setLastSpinTime(Date.now());
      switch (rewardType) {
        case "xp50": addXP(50); break;
        case "xp100": addXP(100); break;
        case "gameTicket": addGameTicket(1); break;
        case "tarotTicket": addTarotTicket(1); break;
        case "ticketCombo": addGameTicket(1); addTarotTicket(1); break;
        case "pointsXp": addPoints(15); addXP(50); break;
        case "surprise": addXP(50); addTarotTicket(1); break;
      }
      // Play result sound
      if (rewardType === "none") {
        playLoseSound();
      } else {
        playWinSound();
      }
      setWinReward({
        type: rewardType,
        label: t(REWARD_LABEL_KEYS[rewardType] || "tryAgain"),
      });
      setShowWinModal(true);
    }, 4500);
  }, [spinning, canSpin, setLastSpinTime, addXP, addPoints, addGameTicket, addTarotTicket, addDrawEntry, t]);

  const isDisabled = spinning || !canSpin;

  // Build translated segment labels for SVG
  const segmentLabels = SEGMENT_LABEL_KEYS.map(k => t(k));

  return (
    <div className={cn("flex flex-col items-center gap-5", isRTL && "direction-rtl")}>
      
      {/* === WHEEL === */}
      <div className={cn("relative w-[300px] h-[300px] mx-auto animate-pulse-glow", !spinning && "animate-wheel-wobble")}>
        <div className="absolute -inset-6 rounded-full" 
          style={{ 
            background: "radial-gradient(circle, rgba(255,215,0,0.12) 30%, rgba(155,89,182,0.08) 60%, transparent 100%)",
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
            <div key={i} className="absolute z-20 rounded-full transition-all duration-150"
              style={{
                width: isLit ? "8px" : "5px", height: isLit ? "8px" : "5px",
                top: `${50 - radius * Math.cos(rad)}%`,
                left: `${50 + radius * Math.sin(rad)}%`,
                transform: "translate(-50%, -50%)",
                background: isLit
                  ? i % 2 === 0
                    ? "radial-gradient(circle, #FFD700, #FFC300)"
                    : "radial-gradient(circle, #9b59b6, #7b3fa0)"
                  : "hsl(var(--muted))",
                boxShadow: isLit
                  ? i % 2 === 0
                    ? "0 0 6px #FFD700, 0 0 12px rgba(255,215,0,0.5)"
                    : "0 0 6px #9b59b6, 0 0 12px rgba(155,89,182,0.5)"
                  : "none",
              }}
            />
          );
        })}

        {/* Gold outer ring */}
        <div className="absolute inset-0 rounded-full z-10"
          style={{
            background: "conic-gradient(from 0deg, #FF9F00, #FFD700, #FFC300, #FFD700, #FF9F00, #FFD700, #FFC300, #FFD700, #FF9F00)",
            padding: "5px",
          }}
        >
          <div className="w-full h-full rounded-full bg-transparent" />
        </div>

        {/* Spinning wheel SVG */}
        <motion.div className="absolute inset-[5px] z-10" animate={{ rotate: rotation }}
          transition={{ duration: 4.5, ease: [0.15, 0.6, 0.08, 1.0] }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
            <defs>
              {SEGMENT_COLORS.map((seg, i) => (
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

            {SEGMENT_COLORS.map((seg, i) => {
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
              const label = segmentLabels[i];
              return (
                <g key={i}>
                  <path d={`M100,100 L${x1},${y1} A95,95 0 0,1 ${x2},${y2} Z`}
                    fill={`url(#seg-grad-${i})`} stroke="rgba(255,215,0,0.4)" strokeWidth="0.8" filter="url(#seg-shadow)" />
                  <line x1="100" y1="100" x2={x1} y2={y1} stroke="rgba(255,215,0,0.15)" strokeWidth="0.5" />
                  <text x={iconX} y={iconY} textAnchor="middle" dominantBaseline="middle" fontSize="13"
                    transform={`rotate(${textRotation}, ${iconX}, ${iconY})`}>{SEGMENT_ICONS[i]}</text>
                  <text x={textX} y={textY} textAnchor="middle" dominantBaseline="middle"
                    fill="white" fontSize="6.5" fontWeight="700" fontFamily="Inter, sans-serif"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}>
                    {label.split("\n").map((line, li) => (
                      <tspan key={li} x={textX} dy={li === 0 ? "-3" : "8"}>{line}</tspan>
                    ))}
                  </text>
                </g>
              );
            })}

            <circle cx="100" cy="100" r="24" fill="url(#center-grad)" stroke="#FFD700" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="20" fill="none" stroke="rgba(255,215,0,0.3)" strokeWidth="0.8" />
            <text x="100" y="96" textAnchor="middle" fill="#FFD700" fontSize="7" fontWeight="700" fontFamily="Cinzel, serif" opacity="0.9">SPIN</text>
            <text x="100" y="106" textAnchor="middle" fill="#FFD700" fontSize="5.5" fontWeight="600" fontFamily="Cinzel, serif" opacity="0.7">THE WHEEL</text>
          </svg>
        </motion.div>

        {/* Pointer */}
        <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 z-30">
          <svg width="28" height="32" viewBox="0 0 28 32">
            <defs>
              <linearGradient id="pointer-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FF9F00" />
              </linearGradient>
              <filter id="pointer-shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FFD700" floodOpacity="0.5" />
              </filter>
            </defs>
            <polygon points="14,28 2,4 14,10 26,4" fill="url(#pointer-grad)" filter="url(#pointer-shadow)" stroke="#FFD700" strokeWidth="0.5" />
            <circle cx="14" cy="10" r="3" fill="#e74c3c" stroke="#FFD700" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      {/* === SPIN BUTTON === */}
      <button
        onClick={handleSpin}
        disabled={isDisabled}
        className={cn(
          "w-full max-w-xs py-3.5 rounded-2xl font-display font-bold text-base tracking-wide transition-all relative overflow-hidden",
          "disabled:cursor-not-allowed",
          canSpin && !spinning && "hover:brightness-110 active:scale-[0.97]"
        )}
        style={{
          background: canSpin && !spinning
            ? "linear-gradient(180deg, #FFD700, #FFB000)"
            : "rgba(120, 80, 160, 0.35)",
          color: canSpin && !spinning ? "#0b0220" : "rgba(255,255,255,0.6)",
          boxShadow: canSpin && !spinning
            ? "0 0 20px rgba(255,200,0,0.5), 0 0 40px rgba(255,170,0,0.3)"
            : "none",
          opacity: isDisabled && !spinning ? 0.85 : 1,
          border: canSpin && !spinning ? "none" : "1px solid rgba(255,200,0,0.3)",
        }}
      >
        <span className="flex items-center justify-center gap-2">
          {spinning ? (
            t("spinning")
          ) : canSpin ? (
            <>{t("spinTheWheelBtn")}</>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              {t("comeBackSpin")}
            </>
          )}
        </span>
      </button>

      {/* === TIMER / INFO SECTION === */}
      <div className="w-full max-w-xs rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, hsl(var(--card)), hsl(var(--background)))",
          border: "1px solid hsl(var(--primary) / 0.15)",
        }}
      >
        <div className="px-4 pt-4 pb-2 text-center">
          <h3 className="font-display text-sm font-bold text-gold-gradient tracking-wider">
            {canSpin ? t("dailySpinReward") : t("nextFreeSpin")}
          </h3>
        </div>

        {canSpin ? (
          <div className="px-4 pb-4 text-center">
            <p className="text-sm text-foreground/80">{t("freeSpinAvailable")}</p>
          </div>
        ) : (
          <div className="px-4 pb-4">
            <p className="text-xs text-muted-foreground text-center mb-3">{t("nextSpinIn")}</p>
            <div className={cn("flex items-center justify-center gap-3", isRTL && "flex-row-reverse")}>
              {[
                { val: timeLeft.hours, label: t("hours") },
                { val: timeLeft.minutes, label: t("minutes") },
                { val: timeLeft.seconds, label: t("seconds") },
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

        <div className="h-px mx-4" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.2), transparent)" }} />

        <div className={cn("grid grid-cols-4 gap-1 px-3 py-3", isRTL && "direction-rtl")}>
          {[
            { icon: <Zap className="w-4 h-4" />, label: t("xpPoints") },
            { icon: <Ticket className="w-4 h-4" />, label: t("gameTickets") },
            { icon: <Trophy className="w-4 h-4" />, label: t("bonusEntriesLabel") },
            { icon: <Gift className="w-4 h-4" />, label: t("surpriseRewards") },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1 py-1">
              <div className="text-primary">{item.icon}</div>
              <span className="text-[9px] text-muted-foreground text-center leading-tight">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="px-4 pb-3">
          <p className="text-[10px] text-muted-foreground/60 text-center">
            🔒 {t("allRewardsPromotional")} — <span className="text-destructive/80">{t("noCashValue")}</span>
          </p>
        </div>
      </div>

      {/* === ENHANCED WIN MODAL === */}
      <AnimatePresence>
        {showWinModal && winReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: "hsl(0 0% 0% / 0.75)", backdropFilter: "blur(12px)" }}
            onClick={() => setShowWinModal(false)}
          >
            {winReward.type !== "none" && (
              <>
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute rounded-full"
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0], scale: [0, 1.5, 0],
                      x: (Math.random() - 0.5) * 300, y: (Math.random() - 0.5) * 400,
                    }}
                    transition={{ duration: 2, delay: Math.random() * 0.5, ease: "easeOut" }}
                    style={{
                      width: Math.random() * 8 + 4, height: Math.random() * 8 + 4,
                      background: i % 3 === 0 ? "hsl(45 100% 60%)" : i % 3 === 1 ? "hsl(270 80% 65%)" : "hsl(330 80% 65%)",
                      left: "50%", top: "50%",
                    }}
                  />
                ))}
              </>
            )}

            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 18, stiffness: 250 }}
              className="relative w-full max-w-sm rounded-3xl p-7 text-center overflow-hidden"
              style={{
                background: winReward.type === "none"
                  ? "linear-gradient(180deg, hsl(260 40% 16%), hsl(260 50% 10%))"
                  : "linear-gradient(180deg, hsl(260 50% 18%), hsl(260 60% 8%))",
                border: winReward.type === "none"
                  ? "2px solid hsl(var(--muted) / 0.5)"
                  : "2px solid hsl(45 100% 50% / 0.5)",
                boxShadow: winReward.type === "none"
                  ? "0 0 30px hsl(var(--muted) / 0.15), 0 20px 60px hsl(0 0% 0% / 0.5)"
                  : "0 0 60px hsl(45 100% 50% / 0.25), 0 0 120px hsl(var(--primary) / 0.15), 0 20px 60px hsl(0 0% 0% / 0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {winReward.type !== "none" && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0.3] }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ background: "radial-gradient(circle at 50% 30%, hsl(45 100% 50% / 0.15), transparent 70%)" }}
                />
              )}

              <button onClick={() => setShowWinModal(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors z-10">
                <X className="w-5 h-5" />
              </button>

              <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", damping: 12, stiffness: 200 }}
                className="text-5xl mb-2 relative z-10">
                {winReward.type === "none" ? "😅" : REWARD_ICON_MAP[winReward.type] || "🎉"}
              </motion.div>

              <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="font-display text-xl font-bold mb-1 relative z-10"
                style={{ color: winReward.type === "none" ? "hsl(var(--foreground) / 0.8)" : undefined }}>
                {winReward.type === "none" ? (
                  <span className="text-foreground/80">{t("betterLuckNextTime")}</span>
                ) : (
                  <span className="text-gold-gradient">🎉 {t("congratulations")}!</span>
                )}
              </motion.h2>

              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-foreground/70 text-sm mb-4 relative z-10">
                {winReward.type === "none" ? t("comeBackTomorrowChance") : t("wonAmazingReward")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", damping: 15 }}
                className="relative z-10 rounded-2xl px-5 py-4 mb-5"
                style={{
                  background: winReward.type === "none"
                    ? "hsl(var(--muted) / 0.3)"
                    : "linear-gradient(135deg, hsl(45 100% 50% / 0.1), hsl(270 80% 55% / 0.1))",
                  border: winReward.type === "none"
                    ? "1px solid hsl(var(--muted) / 0.3)"
                    : "1px solid hsl(45 100% 50% / 0.25)",
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold text-gold-gradient font-display">{winReward.label}</span>
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                {winReward.type !== "none" && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    className="text-xs text-muted-foreground mt-1.5">
                    {t("addedToAccount")}
                  </motion.p>
                )}
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                onClick={() => setShowWinModal(false)}
                className="w-full py-3 rounded-xl font-display font-semibold text-sm transition-all hover:brightness-110 active:scale-[0.97] relative z-10"
                style={{
                  background: winReward.type === "none"
                    ? "linear-gradient(135deg, hsl(260 30% 25%), hsl(260 40% 30%))"
                    : "linear-gradient(135deg, hsl(35 100% 40%), hsl(45 100% 50%))",
                  color: winReward.type === "none" ? "hsl(var(--foreground) / 0.8)" : "hsl(260 60% 8%)",
                  border: winReward.type === "none" ? "1px solid hsl(var(--muted) / 0.3)" : "none",
                }}
              >
                {winReward.type === "none" ? t("tryAgainTomorrow") : t("awesomeBtn")}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
