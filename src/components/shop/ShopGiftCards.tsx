import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BRANDS = [
  {
    name: "SHEIN",
    bg: "bg-gradient-to-br from-pink-500 to-rose-600",
    logo: "SHEIN",
    subtitle: "$500",
  },
  {
    name: "Google Play",
    bg: "bg-gradient-to-br from-sky-400 to-blue-600",
    logo: "Google Play",
    subtitle: "$500",
  },
  {
    name: "Amazon",
    bg: "bg-gradient-to-br from-amber-400 to-orange-600",
    logo: "amazon",
    subtitle: "$500",
  },
];

export function ShopGiftCards() {
  const { t, isRTL } = useTranslation();

  return (
    <div className="text-center px-4 py-4">
      <div className="inline-block bg-primary/20 border border-primary/40 rounded-full px-5 py-1.5 mb-3">
        <span className="text-sm font-bold text-primary">{t("giftCard")}</span>
      </div>

      <h2 className="font-display text-xl font-bold text-foreground mb-1">
        {t("giftCard")} <span className="text-muted-foreground text-base">{t("inOur")}</span>
      </h2>
      <p className="font-display text-lg text-gold-gradient font-bold mb-5">{t("bookPurchaseDraw")}</p>

      {/* Gift Card Brands - Row */}
      <div className={cn("flex items-center justify-center gap-3 mb-3", isRTL && "flex-row-reverse")}>
        {BRANDS.map((brand, i) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.12, type: "spring", bounce: 0.4 }}
            className={cn(
              "relative w-[100px] h-[68px] rounded-xl flex flex-col items-center justify-center shadow-lg border border-white/20 overflow-hidden",
              brand.bg
            )}
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)" }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
            <span className="font-bold text-white text-sm drop-shadow-md z-10">{brand.logo}</span>
            <span className="font-bold text-primary text-xs z-10">{brand.subtitle}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
