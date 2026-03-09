import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookPackage } from "@/pages/Shop";

interface ShopSuccessPopupProps {
  showSuccess: boolean;
  selectedPkg: BookPackage | null;
  isRTL: boolean;
  t: (key: string) => string;
}

export function ShopSuccessPopup({ showSuccess, selectedPkg, isRTL, t }: ShopSuccessPopupProps) {
  return (
    <AnimatePresence>
      {showSuccess && selectedPkg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-card border border-primary/50 rounded-2xl p-6 text-center shadow-gold max-w-sm w-full"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6 }}>
              <CheckCircle className="w-16 h-16 text-green-accent mx-auto mb-3" />
            </motion.div>
            <h3 className="font-display text-xl text-gold-gradient mb-2">{t("congratulations")} 🎉</h3>
            <p className="text-sm text-foreground mb-4">{selectedPkg.name} — {selectedPkg.price}</p>
            <div className="space-y-2">
              {selectedPkg.rewards.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.15 }}
                  className={cn("flex items-center gap-2 justify-center bg-muted/30 rounded-lg px-3 py-2", isRTL && "flex-row-reverse")}
                >
                  {r.icon}
                  <span className="text-sm text-foreground font-medium">{r.label}</span>
                  <CheckCircle className="w-4 h-4 text-green-accent" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
