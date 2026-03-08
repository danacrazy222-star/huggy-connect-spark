import { SpinWheel } from "@/components/SpinWheel";
import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

const Index = () => {
  const { t, isRTL } = useTranslation();

  return (
    <div className={cn("min-h-screen bg-premium-gradient stars-bg pb-20", isRTL && "dir-rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <TopBar />
      <div className="text-center px-4 py-2">
        <h1 className="font-display text-2xl font-bold text-gold-gradient">WINLINE</h1>
        <p className="text-primary font-display text-sm font-semibold">{t("giftCard")}</p>
        <p className="text-xs text-muted-foreground">{t("promotionalDraw")}</p>
      </div>
      <div className="px-4 py-4">
        <SpinWheel />
      </div>
    </div>
  );
};

export default Index;
