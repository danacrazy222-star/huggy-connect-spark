import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, X, Wallet } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { playPurchaseConfirm } from "@/utils/sounds";
import { useGameStore } from "@/store/useGameStore";
import type { BookPackage } from "@/pages/Shop";

interface ShopConfirmPopupProps {
  show: boolean;
  pkg: BookPackage | null;
  quantity: number;
  onConfirm: () => void;
  onCancel: () => void;
  isRTL: boolean;
}

export function ShopConfirmPopup({ show, pkg, quantity, onConfirm, onCancel, isRTL }: ShopConfirmPopupProps) {
  const { t } = useTranslation();
  const points = useGameStore((s) => s.points);
  if (!pkg) return null;
  const totalPrice = pkg.priceNum * quantity;
  const totalPointsCost = totalPrice * 1000;
  const canAfford = points >= totalPointsCost;

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6" onClick={onCancel}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-2xl p-5 w-full max-w-sm shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-foreground">{t("confirmPurchaseTitle")}</h3>
              <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            {quantity > 1 && (
              <div className="bg-primary/10 border border-primary/30 rounded-xl px-3 py-2 mb-3 text-center">
                <span className="text-sm font-bold text-primary">{quantity}x {pkg.name}</span>
              </div>
            )}

            {/* Wallet balance indicator */}
            <div className={`flex items-center justify-between rounded-xl px-3 py-2 mb-3 border ${canAfford ? 'bg-green-500/10 border-green-500/30' : 'bg-destructive/10 border-destructive/30'}`}>
              <div className="flex items-center gap-2">
                <Wallet className={`w-4 h-4 ${canAfford ? 'text-green-accent' : 'text-destructive'}`} />
                <span className="text-xs text-muted-foreground">{t("walletBalance")}</span>
              </div>
              <span className={`text-sm font-bold ${canAfford ? 'text-foreground' : 'text-destructive'}`}>
                {points.toLocaleString()} {t("xpPoints")}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              {quantity > 1 ? `${t("youWillReceive")} (×${quantity})` : t("youWillReceive")}
            </p>
            <ul className="space-y-2 mb-5">
              {pkg.includes.map((item, i) => {
                let displayItem = item;
                if (quantity > 1) {
                  const match = item.match(/^(\d[\d,]*)\s+(.+)$/);
                  if (match) {
                    const num = parseInt(match[1].replace(/,/g, ''));
                    const total = num * quantity;
                    displayItem = `${total.toLocaleString()} ${match[2]}`;
                  }
                }
                return (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-green-accent flex-shrink-0" />
                    <span>{displayItem}</span>
                  </li>
                );
              })}
            </ul>
            <button
              onClick={() => { if (canAfford) { playPurchaseConfirm(); onConfirm(); } }}
              disabled={!canAfford}
              className="w-full py-3 rounded-xl font-display font-bold text-sm text-primary-foreground hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(180deg, hsl(45 100% 50%), hsl(40 100% 40%))", boxShadow: "0 0 20px rgba(255,200,0,0.2)" }}>
              {canAfford
                ? `${t("confirmPurchaseBtn")} — ${totalPointsCost.toLocaleString()} ${t("xpPoints")}`
                : t("notEnoughPoints") || "Not enough points!"
              }
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
