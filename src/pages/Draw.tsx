import { useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useDrawStore } from "@/store/useDrawStore";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Gift, ChevronRight, PartyPopper, X, Activity, ShoppingBag, Shield, Info, ChevronDown, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
  } = useDrawStore();

  const [showWinnerPopup, setShowWinnerPopup] = useState(!!currentWinner);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const percent = getProgressPercent();

  // User's entries (demo)
  const userEntries = entries.filter(e => e.username === "You").length;

  // Last winner from DB
  const [lastWinner, setLastWinner] = useState<{ winner_name: string; prize_type: string; prize_amount: number; created_at: string } | null>(null);
  useEffect(() => {
    supabase
      .from("draw_winners")
      .select("winner_name, prize_type, prize_amount, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => { if (data) setLastWinner(data as any); });
  }, []);

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
      <TopBar title={t("draw")} />

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

        {/* Hero Section - Main Title */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-full px-4 py-1.5 mb-4">
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary">{t("promotionalGiveaway")}</span>
          </div>
          <h1 className="font-display text-xl font-bold text-gold-gradient mb-3 leading-snug px-2">
            {t("drawMainTitle")}
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed px-4">
            {t("drawSubtitle")}
          </p>
          <p className="text-[10px] text-muted-foreground mt-2 px-4 italic">
            {t("drawGiveawayNote")}
          </p>
        </div>

        {/* Prize Display */}
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

        {/* 🏆 Last Winner - Always visible */}
        {lastWinner && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 border-2 border-primary/40 rounded-2xl p-4"
            style={{ boxShadow: "0 0 30px rgba(255,215,0,0.1)" }}
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)),transparent_70%)]" />
            </div>
            <div className="relative flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-primary" style={{ filter: "drop-shadow(0 0 8px rgba(255,215,0,0.5))" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-0.5">🏆 {isRTL ? "آخر رابح" : "Last Winner"}</p>
                <p className="text-lg font-display font-bold text-foreground truncate">{lastWinner.winner_name}</p>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? `ربح ${lastWinner.prize_type} بقيمة $${lastWinner.prize_amount}` : `Won the $${lastWinner.prize_amount} ${lastWinner.prize_type}`}
                </p>
              </div>
              <Crown className="w-8 h-8 text-primary/40 flex-shrink-0" />
            </div>
          </motion.div>
        )}
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

          {/* Closing condition text */}
          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            {t("drawClosingCondition")}
          </p>

          {/* User's Entries */}
          {userEntries > 0 && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground">{t("yourCurrentEntries")}</p>
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
            {t("buyAndEnter")}
          </button>
        )}

        {/* How It Works */}
        <div className="bg-card/60 border border-border rounded-2xl p-4 space-y-3">
          <h3 className="font-display text-sm font-bold text-gold-gradient">{t("howItWorks")}</h3>
          <div className="space-y-2">
            {[
              { step: "1", text: t("howStep1"), icon: "📚" },
              { step: "2", text: t("howStep2"), icon: "🎫" },
              { step: "3", text: t("howStep3"), icon: "🔥" },
              { step: "4", text: t("howStep4"), icon: "🏆" },
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

        {/* More Information - Collapsible */}
        <div className="bg-card/60 border border-primary/20 rounded-2xl p-4 space-y-3">
          <button
            onClick={() => setShowMoreInfo(!showMoreInfo)}
            className={cn("w-full flex items-center justify-between", isRTL && "flex-row-reverse")}
          >
            <h3 className="font-display text-sm font-bold text-gold-gradient flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              {t("moreInfo")}
            </h3>
            <ChevronDown className={cn("w-4 h-4 text-primary transition-transform", showMoreInfo && "rotate-180")} />
          </button>
          <AnimatePresence>
            {showMoreInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-2"
              >
                {[
                  t("moreInfo1"),
                  t("moreInfo2"),
                  t("moreInfo3"),
                  t("moreInfo4"),
                ].map((text, i) => (
                  <div key={i} className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                    <span className="text-primary text-xs mt-0.5">•</span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fair Draw System */}
        <div className="bg-card/60 border border-primary/20 rounded-2xl p-4 space-y-3">
          <h3 className="font-display text-sm font-bold text-gold-gradient flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            {t("fairDrawSystem")}
          </h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {t("fairDrawDescription")}
          </p>
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
