import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useGameStore } from "@/store/useGameStore";
import { motion } from "framer-motion";
import { Star, Lock, Diamond, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VIP() {
  const { xp, level } = useGameStore();
  const { t, isRTL } = useTranslation();

  const levels: { name: string; xpNeeded: number; stars?: number; icon?: "diamond" | "flame" }[] = [
    { name: `${t("level")} 1`, xpNeeded: 0, stars: 1 },
    { name: `${t("level")} 5`, xpNeeded: 1500, stars: 2 },
    { name: `${t("level")} 10`, xpNeeded: 5500, stars: 3 },
    { name: t("elite"), xpNeeded: 12000, icon: "diamond" },
    { name: t("legend"), xpNeeded: 19000, icon: "flame" },
  ];

  const chests = [
    { name: t("bronzeChest"), color: "from-amber-700/40 to-amber-900/20", border: "border-amber-600/40" },
    { name: t("silverChest"), color: "from-slate-400/30 to-slate-600/20", border: "border-slate-400/40" },
    { name: t("goldChest"), color: "from-primary/30 to-gold-dark/20", border: "border-primary/40" },
  ];

  const currentLevelIndex = levels.findIndex((_, i) => {
    const next = levels[i + 1];
    return next ? xp < next.xpNeeded : true;
  });
  const currentLevel = levels[currentLevelIndex];
  const nextLevel = levels[Math.min(currentLevelIndex + 1, levels.length - 1)];
  const progress = nextLevel.xpNeeded > currentLevel.xpNeeded
    ? ((xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100
    : 100;

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title="VIP" />

      <div className="px-4 space-y-6">
        <div className="text-center">
          <p className="text-foreground text-lg font-display">{t("eachDayJoin")}</p>
          <p className="text-foreground text-lg font-display">{t("closerToFew")}</p>
        </div>

        <div className="space-y-3">
          <div className={cn("flex items-center justify-between gap-1", isRTL && "flex-row-reverse")}>
            {levels.map((lv, i) => {
              const isActive = i <= currentLevelIndex;
              const isCurrent = i === currentLevelIndex;
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

          <div className="relative h-4 bg-muted rounded-full overflow-hidden border border-border">
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 100)}%` }} transition={{ duration: 1, ease: "easeOut" }}
              className={cn("h-full bg-gradient-to-r from-gold-dark via-primary to-gold-light rounded-full", isRTL && "ml-auto")} />
          </div>
          <p className="text-center text-sm text-muted-foreground">{xp.toLocaleString()} / {nextLevel.xpNeeded.toLocaleString()} XP</p>
        </div>

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
