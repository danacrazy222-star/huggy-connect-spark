import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import type { BookPackage } from "@/pages/Shop";

interface ShopConfirmPopupProps {
  show: boolean;
  pkg: BookPackage | null;
  onConfirm: () => void;
  onCancel: () => void;
  isRTL: boolean;
}

export function ShopConfirmPopup({ show, pkg, onConfirm, onCancel, isRTL }: ShopConfirmPopupProps) {
  if (!pkg) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl p-5 w-full max-w-sm shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-foreground">Confirm Purchase</h3>
              <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-3">You will receive:</p>

            <ul className="space-y-2 mb-5">
              {pkg.includes.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-green-accent flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onConfirm}
              className="w-full py-3 rounded-xl font-display font-bold text-sm text-primary-foreground hover:brightness-110 transition-all"
              style={{
                background: "linear-gradient(180deg, #FFD700, #FFB000)",
                boxShadow: "0 0 20px rgba(255,200,0,0.2)",
              }}
            >
              Confirm Purchase — {pkg.price}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
