import { useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useDrawStore } from "@/store/useDrawStore";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Gift, ChevronRight, PartyPopper, X, Clock, Activity, ShoppingBag, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Simulated live activity messages
const ACTIVITY_MESSAGES = [
  "Alex bought Premium Pack 🔥",
  "Sarah entered the draw 🎫",
  "Mike gained 2 entries ⚡",
  "John bought Basic Pack 📚",
  "Luna bought Plus Pack 🌟",
  "Nora_VIP entered the draw 🎫",
  "GoldRush bought Premium Pack 🔥",
  "DiamondQ gained 2 entries ⚡",
  "Player_X bought Basic Pack 📚",
  "CryptoKing bought Premium Pack 🔥",
];

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1.5,
    color: ["#FFD700", "#FF6B6B", "#4ECDC4", "#A855F7", "#3B82F6"][Math.floor(Math.random() * 5)],
    size: 4 + Math.random() * 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.left}%`, opacity: 1, rotate: 0 }}
          animate={{ y: "120%", opacity: 0, rotate: 360 + Math.random() * 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

export default function Draw() {
  const { t, isRTL } = useTranslation();
  const navigate = useNavigate();
  const {
    prizeAmount, entries, currentWinner, winningEntryId,
    drawHistory, isDrawActive, getProgressPercent, resetDraw,
    drawStartedAt, drawDurationMs, checkTimerExpired, handleTimerEnd, wasExtended
  } = useDrawStore();

  const [showWinnerPopup, setShowWinnerPopup] = useState(!!currentWinner);
  const percent = getProgressPercent();

  // User's entries (demo)
  const userEntries = entries.filter(e => e.username === "You").length;

  // Countdown timer to draw end
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    const updateCountdown = () => {
      const endTime = drawStartedAt + drawDurationMs;
      const diff = Math.max(0, endTime - Date.now());

      if (diff <= 0 && isDrawActive) {
        // Timer expired → handleTimerEnd checks minimum entries
        if (entries.length > 0) {
          handleTimerEnd();
        }
        setCountdown("00:00:00");
        return;
      }

      const h = Math.floor(diff / 3600000).toString().padStart(2, "0");
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
      setCountdown(`${h}:${m}:${s}`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [drawStartedAt, drawDurationMs, isDrawActive, entries.length, handleTimerEnd]);

  // Live activity feed
  const [activityIndex, setActivityIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % ACTIVITY_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title={t("promotionalDraw")} />

      {/* Winner Popup */}
      <AnimatePresence>
        {showWinnerPopup && currentWinner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-card border-2 border-primary rounded-2xl p-6 text-center max-w-sm w-full relative overflow-hidden"
              style={{ boxShadow: "0 0 60px rgba(255,215,0,0.3), 0 0 120px rgba(255,215,0,0.1)" }}
            >
              <Confetti />
              <button onClick={() => setShowWinnerPopup(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground z-10">
                <X className="w-5 h-5" />
              </button>
              <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.6, delay: 0.3 }}>
                <Trophy className="w-16 h-16 text-primary mx-auto mb-3" style={{ filter: "drop-shadow(0 0 20px rgba(255,215,0,0.5))" }} />
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-gold-gradient mb-2">🎉 {t("winnerAnnounced")}</h2>
              <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 mb-3">
                <p className="text-xl font-bold text-foreground">{currentWinner}</p>
                {winningEntryId && (
                  <p className="text-xs text-primary mt-1">Entry #{winningEntryId}</p>
                )}
              </div>
              <p className="text-sm text-foreground mb-1">{t("won")}</p>
              <p className="text-2xl font-display font-bold text-gold-gradient">${prizeAmount} Gift Card</p>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
                <PartyPopper className="w-4 h-4 text-primary" />
                <span>{t("congratulations")}!</span>
              </div>
              {!isDrawActive && (
                <button onClick={() => { resetDraw(); setShowWinnerPopup(false); }}
                  className="mt-4 w-full py-2.5 rounded-xl font-display font-bold bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold">
                  {t("newDraw")}
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 space-y-5">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-full px-4 py-1.5 mb-3">
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary">{t("giftCardDraw")}</span>
          </div>
          <h2 className="font-display text-xl font-bold text-gold-gradient mb-1">{t("promotionalDraw")}</h2>
          <p className="text-xs text-muted-foreground mb-3">{t("drawDescription")}</p>
        </div>

        {/* Gift Card Brands */}
        <div className={cn("flex items-center justify-center gap-3", isRTL && "flex-row-reverse")}>
          {[
            { name: "Amazon", color: "border-blue-accent/60" },
            { name: "Google Play", color: "border-green-accent/60" },
            { name: "SHEIN", color: "border-red-accent/60" },
          ].map((brand) => (
            <motion.div key={brand.name} whileHover={{ scale: 1.05 }}
              className={`bg-card/80 border ${brand.color} rounded-xl px-4 py-3 text-center min-w-[90px]`}>
              <p className="text-xs font-bold text-foreground">{brand.name}</p>
              <p className="text-lg font-bold text-primary">${prizeAmount}</p>
            </motion.div>
          ))}
        </div>

        {/* Live Activity Feed */}
        <div className="bg-card/60 border border-border rounded-xl px-4 py-2.5 overflow-hidden">
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Activity className="w-3.5 h-3.5 text-green-accent flex-shrink-0" />
            <span className="text-[10px] text-green-accent font-bold uppercase tracking-wide">Live</span>
            <AnimatePresence mode="wait">
              <motion.p
                key={activityIndex}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-muted-foreground flex-1"
              >
                {ACTIVITY_MESSAGES[activityIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress + Countdown Section */}
        <div className="bg-card/80 border border-border rounded-2xl p-5 space-y-4">
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <h3 className="font-display text-sm font-bold text-foreground">{t("drawProgress")}</h3>
            <span className={cn("flex items-center gap-1 text-xs", isDrawActive ? "text-green-accent" : "text-red-accent")}>
              <span className={`w-2 h-2 rounded-full ${isDrawActive ? "bg-green-accent" : "bg-red-accent"} animate-pulse`} />
              {isDrawActive ? t("drawActive") : t("drawComplete")}
            </span>
          </div>

          {/* Big Progress % */}
          <div className="text-center">
            <motion.p
              key={percent}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-display font-bold text-gold-gradient"
            >
              {percent}%
            </motion.p>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-5 bg-muted rounded-full overflow-hidden border border-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full relative",
                  percent < 50 ? "bg-gradient-to-r from-blue-accent to-accent" :
                  percent < 80 ? "bg-gradient-to-r from-accent to-primary" :
                  "bg-gradient-to-r from-primary via-gold-light to-primary animate-pulse-glow"
                )}
              >
                {percent > 15 && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                    {percent}%
                  </span>
                )}
              </motion.div>
            </div>
            <div className="flex justify-between mt-1.5">
              {[0, 25, 50, 75, 100].map((m) => (
                <div key={m} className="flex flex-col items-center">
                  <div className={`w-1.5 h-1.5 rounded-full ${percent >= m ? "bg-primary" : "bg-muted-foreground/30"}`} />
                  <span className="text-[8px] text-muted-foreground mt-0.5">{m}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Countdown Timer */}
          {isDrawActive && (
            <div className="flex items-center justify-center gap-3 bg-muted/40 rounded-xl py-3 px-4">
              <Clock className="w-5 h-5 text-primary" />
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground">{t("nextDrawIn")}</p>
                <p className="text-2xl font-display font-bold text-primary tracking-wider">{countdown}</p>
              </div>
            </div>
          )}

          {/* Extension notice */}
          {wasExtended && isDrawActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent/10 border border-accent/30 rounded-xl p-3 text-center"
            >
              <p className="text-xs text-accent font-bold mb-0.5">🔄 {t("drawExtended")}</p>
              <p className="text-[10px] text-muted-foreground">{t("drawExtendedMessage")}</p>
            </motion.div>
          )}

          {/* Closing info text */}
          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            {t("drawCloseInfo")}
          </p>

          {/* Your Entries - only if user has entries */}
          {userEntries > 0 && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground">Your Entries</p>
              <p className="text-2xl font-display font-bold text-primary">{userEntries}</p>
            </div>
          )}

          {/* Prize */}
          <div className="bg-muted/40 rounded-xl p-3 text-center">
            <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold text-primary">${prizeAmount}</p>
            <p className="text-[9px] text-muted-foreground">{t("prize")}</p>
          </div>
        </div>

        {/* Fair Draw System */}
        <div className="bg-card/60 border border-primary/20 rounded-2xl p-4 space-y-3">
          <h3 className="font-display text-sm font-bold text-gold-gradient flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Fair Draw System
          </h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Winner is selected randomly from all entries using a secure random generator. Every entry has an equal chance to win.
          </p>
          <div className="bg-muted/30 rounded-xl p-3 space-y-1.5">
            <p className="text-[10px] text-muted-foreground font-mono">Entry #1 — Sarah_M</p>
            <p className="text-[10px] text-muted-foreground font-mono">Entry #2 — Ahmed_K</p>
            <p className="text-[10px] text-muted-foreground font-mono">Entry #3 — Luna_Star</p>
            <p className="text-[10px] text-primary font-mono font-bold">🎲 Random = #2 → Winner: Ahmed_K</p>
          </div>
        </div>

        {/* How to Enter */}
        <div className="bg-card/60 border border-border rounded-2xl p-4 space-y-3">
          <h3 className="font-display text-sm font-bold text-gold-gradient">{t("howToEnter")}</h3>
          <div className="space-y-2">
            {[
              { step: "1", text: t("buyBook"), icon: "📚" },
              { step: "2", text: "Get a unique Entry #ID", icon: "🎫" },
              { step: "3", text: "Premium Pack = 2 Entries!", icon: "🔥" },
              { step: "4", text: "Random number picks the winner!", icon: "🏆" },
            ].map((item) => (
              <div key={item.step} className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{item.step}</span>
                </div>
                <span className="text-[10px]">{item.icon}</span>
                <p className="text-xs text-foreground flex-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Past Winners */}
        {drawHistory.length > 0 && (
          <div className="bg-card/60 border border-primary/20 rounded-2xl p-4">
            <h3 className="font-display text-sm font-bold text-gold-gradient mb-3">{t("pastWinners")}</h3>
            <div className="space-y-2">
              {drawHistory.map((w, i) => (
                <div key={i} className={cn("flex items-center justify-between bg-primary/5 border border-primary/10 rounded-lg px-3 py-2", isRTL && "flex-row-reverse")}>
                  <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                    <Trophy className="w-4 h-4 text-primary" />
                    <div>
                      <span className="text-xs font-bold text-foreground">{w.winner}</span>
                      <p className="text-[9px] text-primary">Entry #{w.entryId}</p>
                    </div>
                  </div>
                  <div className={cn("flex flex-col items-end gap-0.5", isRTL && "items-start")}>
                    <span className="text-[10px] text-primary">{w.prize}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(w.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        {isDrawActive && (
          <button
            onClick={() => navigate("/shop")}
            className="w-full py-3.5 rounded-xl font-display font-bold text-lg text-primary-foreground shadow-gold hover:brightness-110 transition-all flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(180deg, hsl(45 100% 50%), hsl(40 100% 40%))",
              boxShadow: "0 0 25px rgba(255,215,0,0.25)",
            }}
          >
            <ShoppingBag className="w-5 h-5" />
            Enter the ${prizeAmount} Draw
          </button>
        )}

        {/* Winner banner */}
        {currentWinner && !showWinnerPopup && (
          <motion.button
            onClick={() => setShowWinnerPopup(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("w-full flex items-center justify-between bg-primary/20 border border-primary/40 rounded-xl px-4 py-3", isRTL && "flex-row-reverse")}
          >
            <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Trophy className="w-5 h-5 text-primary" />
              <div className={isRTL ? "text-right" : ""}>
                <p className="text-xs text-muted-foreground">{t("drawWinner")}</p>
                <p className="text-sm font-bold text-foreground">{currentWinner}</p>
                {winningEntryId && <p className="text-[9px] text-primary">Entry #{winningEntryId}</p>}
              </div>
            </div>
            <ChevronRight className={cn("w-4 h-4 text-primary", isRTL && "rotate-180")} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
