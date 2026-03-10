import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { Lock, Sparkles } from "lucide-react";

export function WorldChallengePromo() {
  const { t } = useTranslation();

  return (
    <div className="bg-card/60 backdrop-blur-md border border-accent/30 rounded-xl p-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
        <Sparkles className="w-5 h-5 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground">{t("worldChallengeTitle")}</p>
        <p className="text-[10px] text-muted-foreground truncate">{t("worldChallengeDesc")}</p>
      </div>
      <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
    </div>
  );
}
