import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useGameStore } from "@/store/useGameStore";
import { useDrawStore } from "@/store/useDrawStore";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Ticket, Sparkles, Flame, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import book1 from "@/assets/book-1.png";
import book2 from "@/assets/book-2.png";
import book3 from "@/assets/book-3.png";
import { ShopBookCard } from "@/components/shop/ShopBookCard";
import { ShopGiftCards } from "@/components/shop/ShopGiftCards";
import { ShopSuccessPopup } from "@/components/shop/ShopSuccessPopup";

const BOOK_IMAGES = [book1, book2, book3];

export interface BookPackage {
  name: string;
  price: string;
  number: number;
  color: string;
  borderColor: string;
  glowColor: string;
  rewards: { icon: React.ReactNode; label: string; type: "xp" | "gameTicket" | "tarotTicket" | "drawEntry"; amount: number }[];
  tag: string | null;
  entry: string;
  valueTag?: string | null;
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
      color: "from-green-900/60 to-green-950/80",
      borderColor: "border-green-500/60",
      glowColor: "shadow-[0_0_20px_rgba(34,197,94,0.3)]",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: `1,500 ${t("vipXP")}`, type: "xp", amount: 1500 },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: t("drawEntry"), type: "drawEntry", amount: 1 },
      ],
      tag: null,
      entry: `$1 ${t("entry")}`,
    },
    {
      name: "PLUS",
      price: "$2",
      number: 2,
      color: "from-blue-900/60 to-blue-950/80",
      borderColor: "border-blue-500/60",
      glowColor: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: `3,500 ${t("vipXP")}`, type: "xp", amount: 3500 },
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
      color: "from-purple-900/60 to-purple-950/80",
      borderColor: "border-primary/60",
      glowColor: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: `250 ${t("vipXP")}`, type: "xp", amount: 250 },
        { icon: <Ticket className="w-4 h-4 text-red-accent" />, label: t("gameTicket"), type: "gameTicket", amount: 1 },
        { icon: <Sparkles className="w-4 h-4 text-accent" />, label: t("tarotTicket"), type: "tarotTicket", amount: 1 },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: t("drawEntry"), type: "drawEntry", amount: 1 },
      ],
      tag: t("mostPopular"),
      entry: `$3 ${t("entry")}`,
      valueTag: `300% ${t("value")}`,
    },
  ];

  const handlePurchase = () => {
    if (!selectedPkg) return;
    setPurchasing(true);

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

      {/* Gift Cards Hero Section */}
      <ShopGiftCards />

      {/* Book Selection */}
      <div className="px-3 mb-4">
        <h3 className="font-display text-center text-lg text-foreground mb-4">{t("selectBookExperience")}</h3>
        <div className="grid grid-cols-3 gap-2">
          {packages.map((pkg, i) => (
            <ShopBookCard
              key={pkg.name}
              pkg={pkg}
              index={i}
              image={BOOK_IMAGES[i]}
              isSelected={selectedPkg?.name === pkg.name}
              onSelect={() => setSelectedPkg(pkg)}
              isRTL={isRTL}
            />
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

      <ShopSuccessPopup
        showSuccess={showSuccess}
        selectedPkg={selectedPkg}
        isRTL={isRTL}
        t={t}
      />
    </div>
  );
}
