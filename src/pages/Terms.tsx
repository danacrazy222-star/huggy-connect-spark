import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { FileText, Gift, HelpCircle, RotateCcw, AlertTriangle } from "lucide-react";

export default function Terms() {
  const { t, isRTL } = useTranslation();

  const sections = [
    {
      icon: <Gift className="w-5 h-5 text-primary" />,
      title: t("termsPromotionRules"),
      content: t("termsPromotionRulesDesc"),
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-primary" />,
      title: t("termsRewardExplanation"),
      content: t("termsRewardExplanationDesc"),
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-primary" />,
      title: t("termsRefundPolicy"),
      content: t("termsRefundPolicyDesc"),
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-primary" />,
      title: t("termsDisclaimer"),
      content: t("termsDisclaimerDesc"),
    },
  ];

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title={t("termsAndConditions")} />

      <div className="px-4 pt-4 space-y-4">
        <div className="text-center mb-2">
          <FileText className="w-10 h-10 text-primary mx-auto mb-2" />
          <h1 className="font-display text-xl font-bold text-gold-gradient">{t("termsAndConditions")}</h1>
        </div>

        {sections.map((section, i) => (
          <div key={i} className="bg-card/80 border border-border rounded-2xl p-4 space-y-2">
            <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              {section.icon}
              <h3 className="font-display text-sm font-bold text-foreground">{section.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
          </div>
        ))}

        <div className="bg-muted/40 border border-border rounded-2xl p-4 text-center">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            {t("termsLastUpdated")}
          </p>
        </div>
      </div>
    </div>
  );
}
