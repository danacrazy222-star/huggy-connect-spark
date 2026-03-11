import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useGameStore } from "@/store/useGameStore";
import { useDrawStore } from "@/store/useDrawStore";
import { motion } from "framer-motion";
import { Star, Ticket, Sparkles, Flame, CheckCircle, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import book1 from "@/assets/book-1.png";
import book2 from "@/assets/book-2.png";
import book3 from "@/assets/book-3.png";
import { ShopGiftCards } from "@/components/shop/ShopGiftCards";
import { ShopSuccessPopup } from "@/components/shop/ShopSuccessPopup";
import { ShopConfirmPopup } from "@/components/shop/ShopConfirmPopup";

const BOOK_IMAGES = [book1, book2, book3, book3];

export interface BookPackage {
  nameKey: string;
  name: string;
  price: string;
  priceNum: number;
  number: number;
  color: string;
  borderColor: string;
  glowColor: string;
  rewards: { icon: React.ReactNode; label: string; type: "xp" | "points" | "gameTicket" | "tarotTicket" | "drawEntry"; amount: number }[];
  tag: string | null;
  includes: string[];
}

export default function Shop() {
  const { t, isRTL } = useTranslation();
  const { addXP, addPoints, addGameTicket, addTarotTicket, addDrawEntry } = useGameStore();
  const { addPurchase } = useDrawStore();
  const [selectedPkg, setSelectedPkg] = useState<BookPackage | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [purchaseQty, setPurchaseQty] = useState(1);

  const getQty = (name: string) => quantities[name] || 1;

  const setQty = (name: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [name]: Math.max(1, Math.min(99, (prev[name] || 1) + delta)),
    }));
  };

  const packages: BookPackage[] = [
    {
      nameKey: "basicPack",
      name: t("basicPack"),
      price: "$1",
      priceNum: 1,
      number: 1,
      color: "from-green-900/50 to-green-950/70",
      borderColor: "border-green-500/40",
      glowColor: "shadow-[0_0_15px_rgba(34,197,94,0.15)]",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: `300 ${t("vipXP")}`, type: "xp", amount: 300 },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: `1 ${t("drawEntry")}`, type: "drawEntry", amount: 1 },
      ],
      tag: null,
      includes: [`1 ${t("digitalBook")}`, `300 ${t("vipXP")}`, `1 ${t("drawEntry")}`],
    },
    {
      nameKey: "plusPack",
      name: t("plusPack"),
      price: "$2",
      priceNum: 2,
      number: 2,
      color: "from-blue-900/50 to-blue-950/70",
      borderColor: "border-blue-500/40",
      glowColor: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: `700 ${t("vipXP")}`, type: "xp", amount: 700 },
        { icon: <Ticket className="w-4 h-4 text-red-accent" />, label: `1 ${t("gameTicket")}`, type: "gameTicket", amount: 1 },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: `1 ${t("drawEntry")}`, type: "drawEntry", amount: 1 },
      ],
      tag: null,
      includes: [`1 ${t("digitalBook")}`, `700 ${t("vipXP")}`, `1 ${t("gameTicket")}`, `1 ${t("drawEntry")}`],
    },
    {
      nameKey: "premiumPack",
      name: t("premiumPack"),
      price: "$3",
      priceNum: 3,
      number: 3,
      color: "from-purple-900/50 to-purple-950/70",
      borderColor: "border-primary/40",
      glowColor: "shadow-[0_0_20px_rgba(168,85,247,0.2)]",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: `6,000 ${t("vipXP")}`, type: "xp", amount: 6000 },
        { icon: <Sparkles className="w-4 h-4 text-primary" />, label: `20 ${t("xpPoints")}`, type: "points", amount: 20 },
        { icon: <Ticket className="w-4 h-4 text-red-accent" />, label: `1 ${t("gameTicket")}`, type: "gameTicket", amount: 1 },
        { icon: <Sparkles className="w-4 h-4 text-accent" />, label: `1 ${t("tarotTicket")}`, type: "tarotTicket", amount: 1 },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: `2 ${t("drawEntry")}`, type: "drawEntry", amount: 2 },
      ],
      tag: null,
      includes: [`1 ${t("digitalBook")}`, `6,000 ${t("vipXP")}`, `20 ${t("xpPoints")}`, `1 ${t("gameTicket")}`, `1 ${t("tarotTicket")}`, `2 ${t("drawEntry")}`],
    },
    {
      nameKey: "elitePack",
      name: t("elitePack") || "Elite Pack",
      price: "$5",
      priceNum: 5,
      number: 3,
      color: "from-amber-900/50 to-yellow-950/70",
      borderColor: "border-yellow-500/40",
      glowColor: "shadow-[0_0_25px_rgba(234,179,8,0.25)]",
      rewards: [
        { icon: <Star className="w-4 h-4 text-primary" />, label: `12,000 ${t("vipXP")}`, type: "xp", amount: 12000 },
        { icon: <Sparkles className="w-4 h-4 text-primary" />, label: `50 ${t("xpPoints")}`, type: "points", amount: 50 },
        { icon: <Ticket className="w-4 h-4 text-red-accent" />, label: `2 ${t("gameTicket")}`, type: "gameTicket", amount: 2 },
        { icon: <Sparkles className="w-4 h-4 text-accent" />, label: `2 ${t("tarotTicket")}`, type: "tarotTicket", amount: 2 },
        { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: `3 ${t("drawEntry")}`, type: "drawEntry", amount: 3 },
      ],
      tag: t("mostPopular"),
      includes: [`1 ${t("digitalBook")}`, `12,000 ${t("vipXP")}`, `50 ${t("xpPoints")}`, `2 ${t("gameTicket")}`, `2 ${t("tarotTicket")}`, `3 ${t("drawEntry")}`],
    },
  ];

  const handleBuyClick = (pkg: BookPackage) => {
    setSelectedPkg(pkg);
    setPurchaseQty(getQty(pkg.nameKey));
    setShowConfirm(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedPkg) return;
    setShowConfirm(false);
    setPurchasing(true);
    const qty = purchaseQty;

    setTimeout(() => {
      selectedPkg.rewards.forEach((r) => {
        const totalAmount = r.amount * qty;
        if (r.type === "xp") addXP(totalAmount);
        else if (r.type === "points") addPoints(totalAmount);
        else if (r.type === "gameTicket") addGameTicket(totalAmount);
        else if (r.type === "tarotTicket") addTarotTicket(totalAmount);
        else if (r.type === "drawEntry") {
          addDrawEntry(totalAmount);
          for (let i = 0; i < totalAmount; i++) {
            addPurchase(t("playerYou"), selectedPkg.priceNum);
          }
        }
      });

      setPurchasing(false);
      setShowSuccess(true);
      toast.success(`${qty}x ${selectedPkg.name} ${t("purchasedToast")} 🎉`);

      setQuantities(prev => ({ ...prev, [selectedPkg.nameKey]: 1 }));

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
          {t("shopHeroTitle").split("\n").map((line, i) => (
            <span key={i}>
              {i === 0 ? line : <><br /><span className="text-gold-gradient">{line}</span></>}
            </span>
          ))}
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[300px] mx-auto">
          {t("shopHeroSubtitle")}
        </p>
      </div>

      <ShopGiftCards />

      <div className="px-4 mb-3">
        <h2 className="font-display text-lg font-bold text-foreground text-center">
          {t("chooseBookPack")}
        </h2>
      </div>

      <div className="px-4 space-y-3 mb-4">
        {packages.map((pkg, i) => {
          const qty = getQty(pkg.nameKey);
          const totalPrice = pkg.priceNum * qty;

          return (
            <motion.div
              key={pkg.nameKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative bg-gradient-to-b rounded-2xl p-4 transition-all",
                pkg.color, `border ${pkg.borderColor}`, pkg.glowColor,
                pkg.tag && "scale-[1.05]"
              )}
            >
              {pkg.tag && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                  <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-full px-3 py-1 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-yellow-300" />
                    <span className="text-[9px] font-bold text-white whitespace-nowrap">{t("mostPopular")}</span>
                  </div>
                  <div className="bg-gradient-to-r from-primary to-gold-dark rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-primary-foreground" />
                    <span className="text-[9px] font-bold text-primary-foreground whitespace-nowrap">{t("bestValueTag")}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-20 h-28 flex-shrink-0 flex items-center justify-center">
                  <img src={BOOK_IMAGES[i]} alt={pkg.name}
                    className="max-w-full max-h-full object-contain drop-shadow-[0_0_12px_rgba(255,215,0,0.3)]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display text-base font-bold text-foreground">{pkg.name}</h3>
                    <span className="font-display text-lg font-bold text-primary">{pkg.price}</span>
                  </div>

                  <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">{t("includesLabel")}</p>
                  <ul className="space-y-1 mb-3">
                    {pkg.includes.map((item, idx) => (
                      <li key={idx} className={cn("flex items-center gap-1.5 text-xs text-foreground/85", isRTL && "flex-row-reverse")}>
                        <CheckCircle className="w-3 h-3 text-green-accent flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-[9px] text-muted-foreground mb-2 leading-relaxed italic">
                    {t("shopPackDisclaimer")}
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0 bg-background/40 border border-border rounded-xl overflow-hidden">
                      <button onClick={() => setQty(pkg.nameKey, -1)} disabled={qty <= 1}
                        className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors disabled:opacity-30">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-display font-bold text-sm text-foreground">{qty}</span>
                      <button onClick={() => setQty(pkg.nameKey, 1)}
                        className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button onClick={() => handleBuyClick(pkg)} disabled={purchasing}
                      className="flex-1 py-2 rounded-xl font-display font-bold text-sm text-primary-foreground shadow-gold hover:brightness-110 transition-all disabled:opacity-40"
                      style={{
                        background: "linear-gradient(180deg, hsl(45 100% 50%), hsl(40 100% 40%))",
                        boxShadow: "0 0 20px rgba(255,200,0,0.2)",
                      }}>
                      {qty > 1 ? `${qty}x — $${totalPrice}` : `${t("buyForPrice")} ${pkg.price}`}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center px-4 space-y-1 pb-4">
        <p className="text-xs text-muted-foreground">{t("purchasesProvideAccess")}</p>
        <p className="text-[10px] text-muted-foreground">{t("shopPackDisclaimer")}</p>
        <p className="text-[10px] text-muted-foreground">{t("shopDisclaimer2")}</p>
      </div>

      <ShopConfirmPopup
        show={showConfirm} pkg={selectedPkg} quantity={purchaseQty}
        onConfirm={handleConfirmPurchase} onCancel={() => setShowConfirm(false)} isRTL={isRTL}
      />

      <ShopSuccessPopup
        showSuccess={showSuccess} selectedPkg={selectedPkg} quantity={purchaseQty} isRTL={isRTL} t={t}
      />
    </div>
  );
}
