import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useGameStore, XP_FOR_LEVEL } from "@/store/useGameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Diamond, Flame, TrendingUp, Lock, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type ChestTier = "bronze" | "silver" | "gold" | "elite" | "legend";

const CHEST_CONFIG: Record<ChestTier, { minLvl: number; minXP: number; maxXP: number; emoji: string }> = {
  bronze:  { minLvl: 1,  minXP: 20,  maxXP: 60,  emoji: "🎁" },
  silver:  { minLvl: 9,  minXP: 60,  maxXP: 120, emoji: "🎁" },
  gold:    { minLvl: 17, minXP: 120, maxXP: 250, emoji: "🎁" },
  elite:   { minLvl: 25, minXP: 250, maxXP: 450, emoji: "💎" },
  legend:  { minLvl: 33, minXP: 450, maxXP: 800, emoji: "👑" },
};

function getPlayerChestTier(level: number): ChestTier {
  if (level >= 33) return "legend";
  if (level >= 25) return "elite";
  if (level >= 17) return "gold";
  if (level >= 9) return "silver";
  return "bronze";
}

export default function VIP() {
  const { xp, level, canOpenChest, openDailyChest, lastChestReward } = useGameStore();
  const { t, isRTL } = useTranslation();
  const { toast } = useToast();
  const [rewardAnim, setRewardAnim] = useState<number | null>(null);

  const currentThreshold = XP_FOR_LEVEL[level] || 0;
  const nextThreshold = XP_FOR_LEVEL[level + 1] || currentThreshold;
  const xpInLevel = xp - currentThreshold;
  const xpNeededForLevel = nextThreshold - currentThreshold;
  const progress = level >= 40 ? 100 : xpNeededForLevel > 0 ? Math.min((xpInLevel / xpNeededForLevel) * 100, 100) : 100;
  const xpRemaining = Math.max(nextThreshold - xp, 0);

  const playerTier = getPlayerChestTier(level);
  const chestAvailable = canOpenChest();

  const milestones: { name: string; lvl: number; stars?: number; icon?: "diamond" | "flame" }[] = [
    { name: "Bronze", lvl: 1, stars: 1 },
    { name: "Silver", lvl: 9, stars: 2 },
    { name: "Gold", lvl: 17, stars: 3 },
    { name: t("elite"), lvl: 25, icon: "diamond" },
    { name: t("legend"), lvl: 33, icon: "flame" },
  ];

  const chestTiers: { key: ChestTier; nameKey: string; color: string; border: string; glow: string }[] = [
    { key: "bronze", nameKey: "bronzeChest", color: "from-amber-700/40 to-amber-900/20", border: "border-amber-600/40", glow: "shadow-[0_0_12px_hsl(25_70%_45%/0.3)]" },
    { key: "silver", nameKey: "silverChest", color: "from-slate-400/30 to-slate-600/20", border: "border-slate-400/40", glow: "shadow-[0_0_12px_hsl(210_10%_70%/0.3)]" },
    { key: "gold", nameKey: "goldChest", color: "from-primary/30 to-gold-dark/20", border: "border-primary/40", glow: "shadow-[0_0_12px_hsl(45_100%_50%/0.3)]" },
    { key: "elite", nameKey: "eliteChest", color: "from-blue-500/30 to-blue-900/20", border: "border-blue-500/40", glow: "shadow-[0_0_12px_hsl(220_100%_65%/0.3)]" },
    { key: "legend", nameKey: "legendChest", color: "from-purple-500/30 to-purple-900/20", border: "border-purple-400/40", glow: "shadow-[0_0_16px_hsl(270_80%_55%/0.4)]" },
  ];

  const handleOpenChest = () => {
    if (!chestAvailable) return;
    const reward = openDailyChest();
    setRewardAnim(reward);
    toast({
      title: `🎁 +${reward} XP!`,
      description: t("chestOpened"),
    });
    setTimeout(() => setRewardAnim(null), 3000);
  };

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title="VIP" />

      <div className="px-4 space-y-6">
        <div className="text-center">
          <p className="text-foreground text-lg font-display">{t("eachDayJoin")}</p>
          <p className="text-foreground text-lg font-display">{t("closerToFew")}</p>
        </div>

        {/* Level Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto w-fit bg-primary/15 border border-primary/40 rounded-2xl px-6 py-3 text-center shadow-gold"
        >
          <p className="text-xs text-muted-foreground">{t("level")}</p>
          <p className="text-3xl font-display font-bold text-gold-gradient">{level}</p>
          <p className="text-xs text-primary font-semibold">{xp.toLocaleString()} XP</p>
        </motion.div>

        {/* Detailed XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4 space-y-3"
        >
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground">
                {t("level")} {level} → {Math.min(level + 1, 40)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
          </div>

          <div className="relative h-5 bg-muted rounded-full overflow-hidden border border-border">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={cn(
                "h-full bg-gradient-to-r from-gold-dark via-primary to-gold-light rounded-full relative",
                isRTL && "ml-auto"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full" />
            </motion.div>
          </div>

          <div className={cn("flex justify-between text-xs", isRTL && "flex-row-reverse")}>
            <span className="text-muted-foreground">
              {xpInLevel.toLocaleString()} / {xpNeededForLevel.toLocaleString()} XP
            </span>
            {level < 40 && (
              <span className="text-primary font-semibold">
                {xpRemaining.toLocaleString()} XP ⬅️
              </span>
            )}
          </div>
        </motion.div>

        {/* Milestones */}
        <div className="space-y-3">
          <div className={cn("flex items-center justify-between gap-1", isRTL && "flex-row-reverse")}>
            {milestones.map((lv, i) => {
              const isActive = level >= lv.lvl;
              const isCurrent = level >= lv.lvl && (i === milestones.length - 1 || level < milestones[i + 1].lvl);
              return (
                <motion.div key={lv.name} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 py-2 rounded-xl border text-center flex-1",
                    isCurrent ? "bg-primary/20 border-primary shadow-gold" : isActive ? "bg-muted/50 border-border" : "bg-muted/20 border-border/50 opacity-50"
                  )}>
                  <span className="text-[10px] font-bold text-foreground">{lv.name}</span>
                  <div className="flex gap-0.5">
                    {lv.icon === "diamond" ? <Diamond className="w-3 h-3 text-blue-accent" />
                      : lv.icon === "flame" ? <Flame className="w-3 h-3 text-red-accent" />
                      : Array.from({ length: lv.stars || 0 }).map((_, si) => (
                        <Star key={si} className="w-3 h-3 text-primary fill-primary" />
                      ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Daily Chest Title */}
        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
          <Gift className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display font-bold text-foreground">{t("dailyChest")}</h2>
        </div>

        {/* 5-Tier Chests */}
        <div className="space-y-3">
          {chestTiers.map((chest, i) => {
            const config = CHEST_CONFIG[chest.key];
            const isUnlocked = level >= config.minLvl;
            const isPlayerTier = chest.key === playerTier;

            return (
              <motion.div
                key={chest.key}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "relative flex items-center gap-3 bg-gradient-to-r border rounded-xl p-3",
                  chest.color, chest.border,
                  isPlayerTier && chestAvailable && chest.glow,
                  !isUnlocked && "opacity-40",
                  isRTL && "flex-row-reverse"
                )}
              >
                {/* Chest Icon */}
                <div className={cn(
                  "w-14 h-14 rounded-lg flex items-center justify-center text-2xl shrink-0",
                  isPlayerTier ? "bg-primary/20" : "bg-muted/30"
                )}>
                  {isUnlocked ? config.emoji : <Lock className="w-5 h-5 text-muted-foreground" />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-bold text-foreground", isRTL && "text-right")}>{t(chest.nameKey)}</p>
                  <p className={cn("text-xs text-muted-foreground", isRTL && "text-right")}>
                    {config.minXP}–{config.maxXP} {t("xpRange")}
                  </p>
                  {!isUnlocked && (
                    <p className={cn("text-[10px] text-muted-foreground/70", isRTL && "text-right")}>
                      {t("level")} {config.minLvl}+
                    </p>
                  )}
                </div>

                {/* Action */}
                {isPlayerTier && (
                  <button
                    onClick={handleOpenChest}
                    disabled={!chestAvailable}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-all",
                      chestAvailable
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    {chestAvailable ? t("openChest") : t("chestOpened")}
                  </button>
                )}

                {isUnlocked && !isPlayerTier && (
                  <span className="text-[10px] text-muted-foreground/60 shrink-0">✓</span>
                )}

                {/* XP Reward Animation */}
                <AnimatePresence>
                  {isPlayerTier && rewardAnim !== null && (
                    <motion.div
                      initial={{ opacity: 1, y: 0, scale: 1 }}
                      animate={{ opacity: 0, y: -40, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 text-primary font-display font-bold text-lg pointer-events-none"
                    >
                      +{rewardAnim} XP ✨
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Last reward info */}
        {lastChestReward && !chestAvailable && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-muted-foreground"
          >
            🎁 {t("chestOpened")} +{lastChestReward} XP
          </motion.p>
        )}
      </div>
    </div>
  );
}
