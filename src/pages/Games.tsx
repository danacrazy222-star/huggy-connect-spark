import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useGameStore } from "@/store/useGameStore";
import { Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Games() {
  const { gameTickets } = useGameStore();
  const { t, isRTL } = useTranslation();

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title={t("games")} />
      <div className="px-4 space-y-6">
        <div className={cn("flex items-center justify-between bg-card/80 border border-border rounded-xl px-4 py-3", isRTL && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Ticket className="w-5 h-5 text-primary" />
            <span className="text-sm text-foreground">{t("gameTickets")}</span>
          </div>
          <span className="text-lg font-bold text-primary">{gameTickets}</span>
        </div>

        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <span className="text-6xl">🎮</span>
          <h2 className="font-display text-xl text-foreground">{t("comingSoon")}</h2>
          <p className="text-sm text-muted-foreground text-center">{t("games")}</p>
        </div>
      </div>
    </div>
  );
}
