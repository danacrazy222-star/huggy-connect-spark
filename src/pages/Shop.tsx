import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import { Star, Ticket, Sparkles, Flame, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Shop() {
  const { t, isRTL } = useTranslation();

  const packages = [
    {
      name: "BASIC",
      price: "$1",
      number: 1,
      color: "from-green-accent/30 to-green-accent/5",
      borderColor: "border-green-accent/50",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: `50 ${t("vipXP")}` },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: t("drawEntry") },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: t("drawEntry") },
      ],
      tag: null,
      entry: `$1 ${t("entry")}`,
    },
    {
      name: "PLUS",
      price: "$2",
      number: 2,
      color: "from-blue-accent/30 to-blue-accent/5",
      borderColor: "border-blue-accent/50",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: `120 ${t("vipXP")}` },
        { icon: <Ticket className="w-4 h-4 text-red-accent" />, label: t("gameTicket") },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: t("drawEntry") },
      ],
      tag: null,
      entry: `$2 ${t("entry")}`,
    },
    {
      name: "PREMIUM",
      price: "$3",
      number: 3,
      color: "from-purple-glow/30 to-purple-glow/5",
      borderColor: "border-primary/50",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: `250 ${t("vipXP")}` },
        { icon: <Ticket className="w-4 h-4 text-red-accent" />, label: t("gameTicket") },
        { icon: <Sparkles className="w-4 h-4 text-accent" />, label: t("tarotTicket") },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: t("drawEntry") },
      ],
      tag: t("mostPopular"),
      entry: `300% ${t("value")}`,
    },
  ];

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title={t("shop")} />

      <div className="text-center px-4 py-4">
        <div className="inline-block bg-primary/20 border border-primary/40 rounded-full px-4 py-1 mb-2">
          <span className="text-sm font-bold text-primary">{t("giftCard")}</span>
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">
          {t("giftCard")} <span className="text-muted-foreground text-base">{t("inOur")}</span>
        </h2>
        <p className="font-display text-lg text-gold-gradient font-bold">{t("bookPurchaseDraw")}</p>
        
        <div className={cn("flex items-center justify-center gap-3 mt-3", isRTL && "flex-row-reverse")}>
          {["SHEIN", "Google Play", "Amazon"].map((name) => (
            <div key={name} className="bg-card border border-border rounded-lg px-3 py-2 text-center">
              <p className="text-xs font-bold text-foreground">{name}</p>
              <p className="text-[10px] text-primary">$500</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mb-4">
        <h3 className="font-display text-center text-lg text-foreground mb-4">{t("selectBookExperience")}</h3>
        <div className="grid grid-cols-3 gap-3">
          {packages.map((pkg, i) => (
            <motion.div key={pkg.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`relative bg-gradient-to-b ${pkg.color} border ${pkg.borderColor} rounded-xl p-3 text-center`}>
              {pkg.tag && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-accent rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-primary" />
                  <span className="text-[8px] font-bold text-foreground whitespace-nowrap">{pkg.tag}</span>
                </div>
              )}
              <div className="flex justify-center mb-2 mt-1">
                <div className={`w-7 h-7 rounded-full border-2 ${pkg.borderColor} flex items-center justify-center`}>
                  <span className="text-sm font-bold text-foreground">{pkg.number}</span>
                </div>
              </div>
              <h4 className="font-display text-sm font-bold text-foreground mb-3">{pkg.name}</h4>
              <div className="w-16 h-20 mx-auto mb-3 bg-gradient-to-br from-accent/40 to-secondary/40 rounded-lg border border-border flex items-center justify-center">
                <Crown className="w-8 h-8 text-primary/60" />
              </div>
              <div className="space-y-1.5 mb-3">
                {pkg.rewards.map((r, ri) => (
                  <div key={ri} className={cn("flex items-center gap-1.5 justify-center", isRTL && "flex-row-reverse")}>
                    {r.icon}
                    <span className="text-[10px] text-foreground">{r.label}</span>
                  </div>
                ))}
              </div>
              <div className="bg-primary/20 border border-primary/30 rounded-lg py-1.5">
                <span className="text-xs font-bold text-primary">{pkg.entry}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center px-4 space-y-1">
        <p className="text-xs text-muted-foreground">{t("purchasesProvideAccess")}</p>
        <p className="text-[10px] text-muted-foreground">{t("bonusFeatures")}</p>
      </div>
    </div>
  );
}
