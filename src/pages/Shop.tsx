import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useGameStore } from "@/store/useGameStore";
import { useDrawStore } from "@/store/useDrawStore";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Ticket, Sparkles, Flame, CheckCircle, BookOpen, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import book1 from "@/assets/book-1.png";
import book2 from "@/assets/book-2.png";
import book3 from "@/assets/book-3.png";
import { ShopGiftCards } from "@/components/shop/ShopGiftCards";
import { ShopSuccessPopup } from "@/components/shop/ShopSuccessPopup";
import { ShopConfirmPopup } from "@/components/shop/ShopConfirmPopup";

const BOOK_IMAGES = [book1, book2, book3];

export interface BookPackage {
  name: string;
  price: string;
  priceNum: number;
  number: number;
  color: string;
  borderColor: string;
  glowColor: string;
  rewards: { icon: React.ReactNode; label: string; type: "xp" | "gameTicket" | "tarotTicket" | "drawEntry"; amount: number }[];
  tag: string | null;
  includes: string[];
}

export default function Shop() {
  const { t, isRTL } = useTranslation();
  const { addXP, addGameTicket, addTarotTicket, addDrawEntry } = useGameStore();
  const { addPurchase } = useDrawStore();
  const [selectedPkg, setSelectedPkg] = useState<BookPackage | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const packages: BookPackage[] = [
    {
      name: "Basic Pack",
      price: "$1",
      priceNum: 1,
      number: 1,
      color: "from-green-900/50 to-green-950/70",
      borderColor: "border-green-500/40",
      glowColor: "shadow-[0_0_15px_rgba(34,197,94,0.15)]",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: "1,500 VIP XP", type: "xp", amount: 1500 },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: "1 Draw Entry", type: "drawEntry", amount: 1 },
      ],
      tag: null,
      includes: ["1 Digital Book", "1,500 VIP XP", "1 Draw Entry"],
    },
    {
      name: "Plus Pack",
      price: "$2",
      priceNum: 2,
      number: 2,
      color: "from-blue-900/50 to-blue-950/70",
      borderColor: "border-blue-500/40",
      glowColor: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: "3,500 VIP XP", type: "xp", amount: 3500 },
        { icon: <Ticket className="w-4 h-4 text-red-accent" />, label: "1 Game Ticket", type: "gameTicket", amount: 1 },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: "1 Draw Entry", type: "drawEntry", amount: 1 },
      ],
      tag: null,
      includes: ["1 Digital Book", "3,500 VIP XP", "1 Game Ticket", "1 Draw Entry"],
    },
    {
      name: "Premium Pack",
      price: "$3",
      priceNum: 3,
      number: 3,
      color: "from-purple-900/50 to-purple-950/70",
      borderColor: "border-primary/40",
      glowColor: "shadow-[0_0_20px_rgba(168,85,247,0.2)]",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: "6,000 VIP XP", type: "xp", amount: 6000 },
        { icon: <Ticket className="w-4 h-4 text-red-accent" />, label: "1 Game Ticket", type: "gameTicket", amount: 1 },
        { icon: <Sparkles className="w-4 h-4 text-accent" />, label: "1 Tarot Ticket", type: "tarotTicket", amount: 1 },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: "1 Draw Entry", type: "drawEntry", amount: 1 },
      ],
      tag: "Most Popular",
      includes: ["1 Digital Book", "6,000 VIP XP", "1 Game Ticket", "1 Tarot Ticket", "1 Draw Entry"],
    },
  ];

  const handleBuyClick = (pkg: BookPackage) => {
    setSelectedPkg(pkg);
    setShowConfirm(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedPkg) return;
    setShowConfirm(false);
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
      toast.success(`${selectedPkg.name} purchased! 🎉`);

      setTimeout(() => {
        setShowSuccess(false);
        setSelectedPkg(null);
      }, 2500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title={t("shop")} />

      {/* Hero Header */}
      <div className="text-center px-5 pt-4 pb-2">
        <h1 className="font-display text-xl font-bold text-foreground leading-tight mb-2">
          Buy a Digital Book &<br />
          <span className="text-gold-gradient">Enter the $500 Gift Card Draw</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[300px] mx-auto">
          Every purchase gives you game rewards and a chance to win a $500 Gift Card.
        </p>
      </div>

      {/* Gift Cards Section */}
      <ShopGiftCards />

      {/* Book Packs Title */}
      <div className="px-4 mb-3">
        <h2 className="font-display text-lg font-bold text-foreground text-center">
          Choose Your Book Pack
        </h2>
      </div>

      {/* Book Pack Cards - Vertical */}
      <div className="px-4 space-y-3 mb-4">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "relative bg-gradient-to-b rounded-2xl p-4 transition-all",
              pkg.color,
              `border ${pkg.borderColor}`,
              pkg.glowColor,
              pkg.tag && "scale-[1.02]"
            )}
          >
            {/* Most Popular Tag */}
            {pkg.tag && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-500 rounded-full px-4 py-1 flex items-center gap-1.5 z-10">
                <Flame className="w-3.5 h-3.5 text-yellow-300" />
                <span className="text-[10px] font-bold text-white whitespace-nowrap">{pkg.tag}</span>
              </div>
            )}

            <div className="flex items-start gap-3">
              {/* Book Image */}
              <div className="w-20 h-28 flex-shrink-0 flex items-center justify-center">
                <img
                  src={BOOK_IMAGES[i]}
                  alt={pkg.name}
                  className="max-w-full max-h-full object-contain drop-shadow-[0_0_12px_rgba(255,215,0,0.3)]"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display text-base font-bold text-foreground">{pkg.name}</h3>
                  <span className="font-display text-lg font-bold text-primary">{pkg.price}</span>
                </div>

                {/* Includes List */}
                <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">Includes:</p>
                <ul className="space-y-1 mb-3">
                  {pkg.includes.map((item, idx) => (
                    <li key={idx} className={cn("flex items-center gap-1.5 text-xs text-foreground/85", isRTL && "flex-row-reverse")}>
                      <CheckCircle className="w-3 h-3 text-green-accent flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Buy Button */}
                <button
                  onClick={() => handleBuyClick(pkg)}
                  disabled={purchasing}
                  className="w-full py-2 rounded-xl font-display font-bold text-sm text-primary-foreground shadow-gold hover:brightness-110 transition-all disabled:opacity-40"
                  style={{
                    background: "linear-gradient(180deg, #FFD700, #FFB000)",
                    boxShadow: "0 0 20px rgba(255,200,0,0.2)",
                  }}
                >
                  Buy for {pkg.price}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="text-center px-4 space-y-1 pb-4">
        <p className="text-xs text-muted-foreground">
          Purchases provide access to digital books.
        </p>
        <p className="text-[10px] text-muted-foreground">
          Game rewards and draw entries are promotional bonuses.
        </p>
      </div>

      {/* Confirm Purchase Popup */}
      <ShopConfirmPopup
        show={showConfirm}
        pkg={selectedPkg}
        onConfirm={handleConfirmPurchase}
        onCancel={() => setShowConfirm(false)}
        isRTL={isRTL}
      />

      {/* Success Popup */}
      <ShopSuccessPopup
        showSuccess={showSuccess}
        selectedPkg={selectedPkg}
        isRTL={isRTL}
        t={t}
      />
    </div>
  );
}
