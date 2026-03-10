import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { Shield, Gift, Users, Calendar, AlertCircle } from "lucide-react";

export default function PromotionRules() {
  const { t, isRTL } = useTranslation();

  const sections = [
    {
      icon: <Gift className="w-5 h-5 text-primary" />,
      title: t("promoRulesHowDrawWorks"),
      content: t("promoRulesHowDrawWorksDesc"),
    },
    {
      icon: <Users className="w-5 h-5 text-primary" />,
      title: t("promoRulesWinnerSelection"),
      content: t("promoRulesWinnerSelectionDesc"),
    },
    {
      icon: <Calendar className="w-5 h-5 text-primary" />,
      title: t("promoRulesDateConditions"),
      content: t("promoRulesDateConditionsDesc"),
    },
    {
      icon: <AlertCircle className="w-5 h-5 text-primary" />,
      title: t("promoRulesRewardsNote"),
      content: t("promoRulesRewardsNoteDesc"),
    },
  ];

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title={t("promotionRules")} />

      <div className="px-4 pt-4 space-y-4">
        <div className="text-center mb-2">
          <Shield className="w-10 h-10 text-primary mx-auto mb-2" />
          <h1 className="font-display text-xl font-bold text-gold-gradient">{t("promotionRules")}</h1>
        </div>

        {sections.map((section, i) => (
          <div key={i} className="bg-card/80 border border-border rounded-2xl p-4 space-y-2">
            <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              {section.icon}
              <h3 className="font-display text-sm font-bold text-foreground">{section.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{section.content}</p>
          </div>
        ))}

        {/* Main Disclaimer */}
        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 text-center">
          <p className="text-xs text-foreground leading-relaxed font-medium">
            {t("promoRulesDisclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
