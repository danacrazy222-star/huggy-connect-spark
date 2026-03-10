import { SpinWheel } from "@/components/SpinWheel";
import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

const Index = () => {
  const { isRTL } = useTranslation();

  return (
    <div className={cn("min-h-screen bg-premium-gradient stars-bg pb-24", isRTL && "dir-rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <TopBar />
      
      {/* Hero Section */}
      <div className="text-center px-4 pt-1 pb-3">
        <h1 className="font-display text-2xl font-bold text-gold-gradient tracking-wider">
          WINLINE DAILY SPIN
        </h1>
        <p className="text-foreground/70 text-sm mt-0.5">
          Win a <span className="text-primary font-semibold">$500</span> Gift Card
        </p>
      </div>

      <div className="px-4 pb-4">
        <SpinWheel />
      </div>
    </div>
  );
};

export default Index;
