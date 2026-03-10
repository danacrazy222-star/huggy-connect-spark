import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import madamZara from "@/assets/madam-zara.png";

export function WelcomePopup() {
  const [show, setShow] = useState(false);
  const { t, isRTL } = useTranslation();

  useEffect(() => {
    const seen = sessionStorage.getItem("welcome_seen");
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("welcome_seen", "1");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xs rounded-3xl border border-primary/30 overflow-hidden"
            style={{
              background: "linear-gradient(180deg, hsl(var(--accent) / 0.3) 0%, hsl(var(--background)) 50%)",
            }}
          >
            {/* Sparkle decorations */}
            <div className="absolute top-3 left-4">
              <Sparkles className="w-4 h-4 text-primary/60 animate-pulse" />
            </div>
            <div className="absolute top-6 right-6">
              <Sparkles className="w-3 h-3 text-accent/60 animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Character */}
            <div className="flex justify-center pt-5 pb-2">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <img
                  src={madamZara}
                  alt="Madam Zara"
                  className="w-28 h-28 object-contain drop-shadow-[0_0_20px_hsl(var(--accent)/0.5)]"
                />
              </motion.div>
            </div>

            {/* Welcome text */}
            <div className={cn("text-center px-6 pb-6 space-y-2", isRTL && "font-arabic")} dir={isRTL ? "rtl" : "ltr"}>
              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="font-display text-xl text-gold-gradient"
              >
                {t("welcomeTitle")}
              </motion.h2>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-sm text-muted-foreground leading-relaxed"
              >
                {t("welcomeMessage")}
              </motion.p>

              <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
                onClick={handleClose}
                className="mt-3 w-full py-2.5 rounded-xl font-display text-sm tracking-wide text-primary-foreground"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                }}
                whileTap={{ scale: 0.97 }}
              >
                {t("welcomeButton")}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
