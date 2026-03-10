import { motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { useGameStore } from "@/store/useGameStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Ticket, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Games() {
  const { gameTickets } = useGameStore();
  const { t, isRTL } = useTranslation();

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title={t("games")} />
      <div className="px-4 space-y-4">
        <div className={cn("flex items-center justify-between bg-card/80 border border-border rounded-xl px-4 py-3", isRTL && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Ticket className="w-5 h-5 text-primary" />
            <span className="text-sm text-foreground">{t("gameTickets")}</span>
          </div>
          <span className="text-lg font-bold text-primary">{gameTickets}</span>
        </div>

        <h3 className="font-display text-lg text-gold-gradient">{t("availableGames")}</h3>

        {/* Coming soon placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 gap-4"
        >
          <Gamepad2 className="w-16 h-16 text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">{t("comingSoon")}</p>
        </motion.div>

        <div className="bg-card/60 border border-border rounded-xl p-4 space-y-2">
          <h4 className="font-display text-sm text-gold-gradient">{t("gameRules")}</h4>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p>🎫 {t("entryTicket")}</p>
            <p>💰 {t("betWithPoints")}</p>
            <p>🏆 {t("winnerGets")}</p>
            <p>😢 {t("loserGets")}</p>
            <p>🤖 {t("noOpponentBot")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
