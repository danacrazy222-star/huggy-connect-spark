import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useDrawStore } from "@/store/useDrawStore";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Gift, Users, Clock, ChevronRight, Sparkles, Star, PartyPopper, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Draw() {
  const { t, isRTL } = useTranslation();
  const { poolAmount, targetAmount, prizeAmount, entries, currentWinner, winnerAnnouncedAt, drawHistory, isDrawActive, getProgressPercent, addPurchase, resetDraw } = useDrawStore();
  const [showWinnerPopup, setShowWinnerPopup] = useState(!!currentWinner);
  const percent = getProgressPercent();
  const remaining = Math.max(targetAmount - poolAmount, 0);

  const recentEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  const totalParticipants = new Set(entries.map(e => e.username)).size;

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
              className="bg-card border-2 border-primary rounded-2xl p-6 text-center max-w-sm w-full shadow-gold relative"
            >
              <button onClick={() => setShowWinnerPopup(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
              <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.6, delay: 0.3 }}>
                <Trophy className="w-16 h-16 text-primary mx-auto mb-3 glow-gold" />
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-gold-gradient mb-2">🎉 {t("drawWinner")}!</h2>
              <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 mb-3">
                <p className="text-xl font-bold text-foreground">{currentWinner}</p>
              </div>
              <p className="text-sm text-foreground mb-1">{t("wonPrize")}</p>
              <p className="text-2xl font-display font-bold text-gold-gradient">${prizeAmount} {t("giftCard")}</p>
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
        {/* Gift Card Banner */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-full px-4 py-1.5 mb-3">
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary">{t("giftCard")}</span>
          </div>
          <h2 className="font-display text-xl font-bold text-gold-gradient mb-1">{t("promotionalDraw")}</h2>
          <p className="text-xs text-muted-foreground">{t("drawDescription")}</p>
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

        {/* Progress Section */}
        <div className="bg-card/80 border border-border rounded-2xl p-5 space-y-4">
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <h3 className="font-display text-sm font-bold text-foreground">{t("drawProgress")}</h3>
            <span className={cn("flex items-center gap-1 text-xs", isDrawActive ? "text-green-accent" : "text-red-accent")}>
              <span className={`w-2 h-2 rounded-full ${isDrawActive ? "bg-green-accent" : "bg-red-accent"} animate-pulse`} />
              {isDrawActive ? t("drawActive") : t("drawComplete")}
            </span>
          </div>

          {/* Sales Progress Display */}
          <div className="text-center space-y-1">
            <motion.p
              key={poolAmount}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-display font-bold text-gold-gradient"
            >
              ${poolAmount}
            </motion.p>
            <p className="text-sm text-muted-foreground">/ ${targetAmount}</p>
            <p className="text-xs text-muted-foreground">{percent}% — {remaining > 0 ? `$${remaining} ${t("remaining")}` : t("drawComplete")}</p>
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
            {/* Milestones */}
            <div className="flex justify-between mt-1.5">
              {[0, 25, 50, 75, 100].map((m) => (
                <div key={m} className="flex flex-col items-center">
                  <div className={`w-1.5 h-1.5 rounded-full ${percent >= m ? "bg-primary" : "bg-muted-foreground/30"}`} />
                  <span className="text-[8px] text-muted-foreground mt-0.5">{m}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className={cn("grid grid-cols-3 gap-2", isRTL && "direction-rtl")}>
            <div className="bg-muted/40 rounded-xl p-2.5 text-center">
              <Users className="w-4 h-4 text-accent mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{totalParticipants}</p>
              <p className="text-[9px] text-muted-foreground">{t("participants")}</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-2.5 text-center">
              <Gift className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{entries.length}</p>
              <p className="text-[9px] text-muted-foreground">{t("totalEntries")}</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-2.5 text-center">
              <Trophy className="w-4 h-4 text-gold mx-auto mb-1" />
              <p className="text-lg font-bold text-primary">${prizeAmount}</p>
              <p className="text-[9px] text-muted-foreground">{t("prize")}</p>
            </div>
          </div>
        </div>

        {/* How to Enter */}
        <div className="bg-card/60 border border-border rounded-2xl p-4 space-y-3">
          <h3 className="font-display text-sm font-bold text-gold-gradient">{t("howToEnter")}</h3>
          <div className="space-y-2">
            {[
              { step: "1", text: t("buyBook"), icon: "📚" },
              { step: "2", text: t("autoEntered"), icon: "🎫" },
              { step: "3", text: t("moreBooks"), icon: "🔥" },
              { step: "4", text: t("winnerSelected"), icon: "🏆" },
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

        {/* Recent Entries */}
        <div className="bg-card/60 border border-border rounded-2xl p-4">
          <h3 className="font-display text-sm font-bold text-gold-gradient mb-3">{t("recentEntries")}</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recentEntries.map((entry, i) => (
              <motion.div
                key={`${entry.userId}-${entry.timestamp}`}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn("flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2", isRTL && "flex-row-reverse")}
              >
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                    {entry.username.charAt(0)}
                  </div>
                  <span className="text-xs text-foreground">{entry.username}</span>
                </div>
                <div className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
                  <span className="text-[10px] text-primary font-bold">${entry.amount}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
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
                    <span className="text-xs font-bold text-foreground">{w.winner}</span>
                  </div>
                  <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
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

        {/* Demo Button - simulate purchase */}
        {isDrawActive && (
          <button
            onClick={() => addPurchase("You", [1, 2, 3][Math.floor(Math.random() * 3)])}
            className="w-full py-3.5 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold hover:brightness-110 transition-all"
          >
            {t("enterDraw")}
          </button>
        )}

        {/* Winner announcement banner */}
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
              </div>
            </div>
            <ChevronRight className={cn("w-4 h-4 text-primary", isRTL && "rotate-180")} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
