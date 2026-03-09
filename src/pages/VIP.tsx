import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useGameStore } from "@/store/useGameStore";
import { motion } from "framer-motion";
import { Star, Diamond, Flame, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const XP_PER_LEVEL = [
  0, 5000, 11000, 18000, 27000, 39000, 53000, 71000, 93000, 121000,
  156000, 198000, 248000, 308000, 378000, 458000, 553000, 663000, 793000, 953000
];

export default function VIP() {
  const { xp, level } = useGameStore();
  const { t, isRTL } = useTranslation();

  const currentLevelXP = XP_PER_LEVEL[level - 1] || 0;
  const nextLevelXP = XP_PER_LEVEL[level] || XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
  const xpInCurrentLevel = xp - currentLevelXP;
  const xpNeededForNext = nextLevelXP - currentLevelXP;
  const progress = level >= 20 ? 100 : Math.min((xpInCurrentLevel / xpNeededForNext) * 100, 100);
  const xpRemaining = Math.max(nextLevelXP - xp, 0);

  const milestones = [
    { name: `${t("level")} 1`, lvl: 1, stars: 1 },
    { name: `${t("level")} 5`, lvl: 5, stars: 2 },
    { name: `${t("level")} 10`, lvl: 10, stars: 3 },
    { name: t("elite"), lvl: 15, icon: "diamond" as const },
    { name: t("legend"), lvl: 20, icon: "flame" as const },
  ];

  const chests = [
    { name: t("bronzeChest"), color: "from-amber-700/40 to-amber-900/20", border: "border-amber-600/40" },
    { name: t("silverChest"), color: "from-slate-400/30 to-slate-600/20", border: "border-slate-400/40" },
    { name: t("goldChest"), color: "from-primary/30 to-gold-dark/20", border: "border-primary/40" },
  ];

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
                {t("level")} {level} → {Math.min(level + 1, 20)}
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
              {xpInCurrentLevel.toLocaleString()} / {xpNeededForNext.toLocaleString()} XP
            </span>
            {level < 20 && (
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

        {/* Chests */}
        <div className="grid grid-cols-3 gap-3">
          {chests.map((chest, i) => (
            <motion.div key={chest.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-b ${chest.color} border ${chest.border} rounded-xl p-3 text-center`}>
              <div className="w-14 h-14 mx-auto mb-2 bg-muted/50 rounded-lg flex items-center justify-center text-2xl">🎁</div>
              <div className="bg-red-accent/90 rounded-md px-2 py-0.5 mb-1">
                <span className="text-[9px] font-bold text-foreground">{t("mysteryReward")}</span>
              </div>
              <p className="text-xs text-foreground">{chest.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
