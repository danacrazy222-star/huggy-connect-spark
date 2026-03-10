import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Swords, BookOpen, Star, Globe, CheckCircle, PartyPopper } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";

export function WorldChallengePromo() {
  const [open, setOpen] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const worldChallengeUnlocked = useGameStore((s) => s.worldChallengeUnlocked);
  const unlockWorldChallenge = useGameStore((s) => s.unlockWorldChallenge);

  const handleBuy = () => {
    setPurchased(true);
    unlockWorldChallenge();
    useGameStore.getState().addDrawEntry(1);
    useGameStore.getState().addGameTicket(1);
    setTimeout(() => {
      setPurchased(false);
      setOpen(false);
    }, 3000);
  };

  return (
    <>
      {/* Floating circle button - right side */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full flex items-center justify-center border-2 border-primary/60 shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
        style={{ background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--primary)))" }}
        animate={{ scale: [1, 1.08, 1], boxShadow: ["0 0 15px hsl(45 100% 50% / 0.3)", "0 0 30px hsl(45 100% 50% / 0.6)", "0 0 15px hsl(45 100% 50% / 0.3)"] }}
        transition={{ duration: 2, repeat: Infinity }}
        whileTap={{ scale: 0.9 }}
      >
        <Swords className="w-7 h-7 text-primary-foreground drop-shadow-md" />
      </motion.button>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-5"
            onClick={() => !purchased && setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl border-2 border-primary/40 overflow-hidden"
              style={{ background: "linear-gradient(180deg, hsl(var(--purple-deep)), hsl(var(--background)))" }}
            >
              {/* Close button */}
              {!purchased && (
                <button onClick={() => setOpen(false)} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                  <X className="w-4 h-4 text-foreground" />
                </button>
              )}

              {/* Glow effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-primary/20 blur-[60px] pointer-events-none" />

              <div className="relative p-6 pt-8 flex flex-col items-center text-center">
                <AnimatePresence mode="wait">
                  {purchased ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex flex-col items-center gap-4 py-8"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6 }}
                      >
                        <CheckCircle className="w-16 h-16 text-green-400" />
                      </motion.div>
                      <h2 className="text-xl font-bold text-foreground font-display">🎉 تم الشراء بنجاح!</h2>
                      <p className="text-sm text-muted-foreground">انفتح لك تحدي واحد الآن في غرفة العالم!</p>
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <PartyPopper className="w-10 h-10 text-primary" />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div key="form" className="flex flex-col items-center w-full">
                      {/* Icon */}
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center mb-4 shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
                      >
                        <Swords className="w-10 h-10 text-primary-foreground" />
                      </motion.div>

                      <h2 className="text-xl font-bold text-foreground mb-1 font-display">⚔️ تحدي أمام العالم</h2>
                      <p className="text-sm text-muted-foreground mb-5">اشترِ الكتاب الرقمي لتحصل على محاولة واحدة وتفتح تحدي حصري في غرفة العالم!</p>

                      <div className="w-full space-y-3 mb-6">
                        <div className="flex items-center gap-3 bg-accent/10 rounded-xl p-3 border border-accent/20">
                          <BookOpen className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-sm text-foreground text-right flex-1">كتاب رقمي حصري</span>
                        </div>
                        <div className="flex items-center gap-3 bg-accent/10 rounded-xl p-3 border border-accent/20">
                          <Globe className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-sm text-foreground text-right flex-1">تحدي واحد فقط في غرفة العالم لكل عملية شراء</span>
                        </div>
                        <div className="flex items-center gap-3 bg-accent/10 rounded-xl p-3 border border-accent/20">
                          <Star className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-sm text-foreground text-right flex-1">اسمك يبين قدام الكل كبطل التحدي</span>
                        </div>
                        <div className="flex items-center gap-3 bg-accent/10 rounded-xl p-3 border border-accent/20">
                          <Star className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-sm text-foreground text-right flex-1">🎮 بطاقة لعبة واحدة</span>
                        </div>
                        <div className="flex items-center gap-3 bg-accent/10 rounded-xl p-3 border border-accent/20">
                          <Star className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-sm text-foreground text-right flex-1">🎟️ قسيمة دخول سحب واحدة</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="text-3xl font-black text-primary font-display">$5</span>
                        <span className="text-sm text-muted-foreground mr-2">/ كتاب رقمي</span>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleBuy}
                        className="w-full py-3.5 rounded-2xl font-bold text-base text-primary-foreground border border-primary/30 shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                        style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
                      >
                        📖 اشترِ الكتاب وافتح التحدي
                      </motion.button>

                      <p className="text-[10px] text-muted-foreground mt-3">* بعد انتهاء التحدي، ينقفل فوراً وتحتاج شراء جديد للعب مرة ثانية</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
