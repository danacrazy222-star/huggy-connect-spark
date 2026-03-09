import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useGameStore } from "@/store/useGameStore";
import { useDrawStore } from "@/store/useDrawStore";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Ticket, Sparkles, Flame, Crown, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import book1 from "@/assets/book-1.png";
import book2 from "@/assets/book-2.png";
import book3 from "@/assets/book-3.png";

const BOOK_IMAGES = [book1, book2, book3];

interface BookPackage {
  name: string;
  price: string;
  number: number;
  color: string;
  borderColor: string;
  rewards: { icon: React.ReactNode; label: string; type: "xp" | "gameTicket" | "tarotTicket" | "drawEntry"; amount: number }[];
  tag: string | null;
  entry: string;
}

export default function Shop() {
  const { t, isRTL } = useTranslation();
  const { addXP, addGameTicket, addTarotTicket, addDrawEntry } = useGameStore();
  const { addPurchase } = useDrawStore();
  const [selectedPkg, setSelectedPkg] = useState<BookPackage | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const packages: BookPackage[] = [
    {
      name: "BASIC",
      price: "$1",
      number: 1,
      color: "from-green-accent/30 to-green-accent/5",
      borderColor: "border-green-accent/50",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: `50 ${t("vipXP")}`, type: "xp", amount: 50 },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: t("drawEntry"), type: "drawEntry", amount: 1 },
      ],
      tag: null,
      entry: `$1 ${t("entry")}`,
    },
    {
      name: "PLUS",
      price: "$2",
      number: 2,
      color: "from-blue-accent/30 to-blue-accent/5",
      borderColor: "border-blue-accent/50",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: `120 ${t("vipXP")}`, type: "xp", amount: 120 },
        { icon: <Ticket className="w-4 h-4 text-red-accent" />, label: t("gameTicket"), type: "gameTicket", amount: 1 },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: t("drawEntry"), type: "drawEntry", amount: 1 },
      ],
      tag: null,
      entry: `$2 ${t("entry")}`,
    },
    {
      name: "PREMIUM",
      price: "$3",
      number: 3,
      color: "from-purple-glow/30 to-purple-glow/5",
      borderColor: "border-primary/50",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: `250 ${t("vipXP")}`, type: "xp", amount: 250 },
        { icon: <Ticket className="w-4 h-4 text-red-accent" />, label: t("gameTicket"), type: "gameTicket", amount: 1 },
        { icon: <Sparkles className="w-4 h-4 text-accent" />, label: t("tarotTicket"), type: "tarotTicket", amount: 1 },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: t("drawEntry"), type: "drawEntry", amount: 1 },
      ],
      tag: t("mostPopular"),
      entry: `300% ${t("value")}`,
    },
  ];

  const handlePurchase = () => {
    if (!selectedPkg) return;
    setPurchasing(true);

    // Simulate purchase delay
    setTimeout(() => {
      selectedPkg.rewards.forEach((r) => {
        if (r.type === "xp") addXP(r.amount);
        else if (r.type === "gameTicket") addGameTicket(r.amount);
        else if (r.type === "tarotTicket") addTarotTicket(r.amount);
        else if (r.type === "drawEntry") {
          addDrawEntry(r.amount);
          addPurchase("You", r.amount);
        }
      });

      setPurchasing(false);
      setShowSuccess(true);
      toast.success(`${t("youWon")} ${selectedPkg.name} 🎉`);

      setTimeout(() => {
        setShowSuccess(false);
        setSelectedPkg(null);
      }, 2500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title={t("shop")} />

      <div className="text-center px-4 py-4">
        <div className="inline-block bg-primary/20 border border-primary/40 rounded-full px-4 py-1 mb-2">
          <span className="text-sm font-bold text-primary">{t("giftCard")}</span>
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">
          {t("giftCard")} <span className="text-muted-foreground text-base">{t("inOur")}</span>
        </h2>
        <p className="font-display text-lg text-gold-gradient font-bold">{t("bookPurchaseDraw")}</p>
        
        <div className={cn("flex items-center justify-center gap-3 mt-3", isRTL && "flex-row-reverse")}>
          {["SHEIN", "Google Play", "Amazon"].map((name) => (
            <div key={name} className="bg-card border border-border rounded-lg px-3 py-2 text-center">
              <p className="text-xs font-bold text-foreground">{name}</p>
              <p className="text-[10px] text-primary">$500</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mb-4">
        <h3 className="font-display text-center text-lg text-foreground mb-4">{t("selectBookExperience")}</h3>
        <div className="grid grid-cols-3 gap-3">
          {packages.map((pkg, i) => (
            <motion.button key={pkg.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedPkg(pkg)}
              className={cn(
                `relative bg-gradient-to-b ${pkg.color} border ${pkg.borderColor} rounded-xl p-3 text-center transition-all hover:brightness-110 active:scale-95`,
                selectedPkg?.name === pkg.name && "ring-2 ring-primary shadow-gold"
              )}>
              {pkg.tag && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-accent rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-primary" />
                  <span className="text-[8px] font-bold text-foreground whitespace-nowrap">{pkg.tag}</span>
                </div>
              )}
              <div className="flex justify-center mb-2 mt-1">
                <div className={`w-7 h-7 rounded-full border-2 ${pkg.borderColor} flex items-center justify-center`}>
                  <span className="text-sm font-bold text-foreground">{pkg.number}</span>
                </div>
              </div>
              <h4 className="font-display text-sm font-bold text-foreground mb-3">{pkg.name}</h4>
              <div className="w-16 h-24 mx-auto mb-3 rounded-lg overflow-hidden shadow-lg border border-border">
                <img src={BOOK_IMAGES[i]} alt={pkg.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1.5 mb-3">
                {pkg.rewards.map((r, ri) => (
                  <div key={ri} className={cn("flex items-center gap-1.5 justify-center", isRTL && "flex-row-reverse")}>
                    {r.icon}
                    <span className="text-[10px] text-foreground">{r.label}</span>
                  </div>
                ))}
              </div>
              <div className="bg-primary/20 border border-primary/30 rounded-lg py-1.5">
                <span className="text-xs font-bold text-primary">{pkg.entry}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Buy Button */}
      <div className="px-4 mb-4">
        <button
          onClick={handlePurchase}
          disabled={!selectedPkg || purchasing}
          className="w-full py-3.5 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {purchasing ? (
            <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
              ⏳ {t("spinning")}
            </motion.span>
          ) : selectedPkg ? (
            `🛒 ${t("buyBook")} — ${selectedPkg.price}`
          ) : (
            t("selectBookExperience")
          )}
        </button>
      </div>

      <div className="text-center px-4 space-y-1">
        <p className="text-xs text-muted-foreground">{t("purchasesProvideAccess")}</p>
        <p className="text-[10px] text-muted-foreground">{t("bonusFeatures")}</p>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && selectedPkg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card border border-primary/50 rounded-2xl p-6 text-center shadow-gold max-w-sm w-full">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6 }}>
                <CheckCircle className="w-16 h-16 text-green-accent mx-auto mb-3" />
              </motion.div>
              <h3 className="font-display text-xl text-gold-gradient mb-2">{t("congratulations")} 🎉</h3>
              <p className="text-sm text-foreground mb-4">{selectedPkg.name} — {selectedPkg.price}</p>
              <div className="space-y-2">
                {selectedPkg.rewards.map((r, i) => (
                  <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.15 }}
                    className={cn("flex items-center gap-2 justify-center bg-muted/30 rounded-lg px-3 py-2", isRTL && "flex-row-reverse")}>
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
    </div>
  );
}
