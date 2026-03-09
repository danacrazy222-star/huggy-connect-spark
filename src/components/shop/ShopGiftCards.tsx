import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BRANDS = [
  { name: "SHEIN", color: "from-pink-600 to-red-500", textColor: "text-white", logo: "SHEIN" },
  { name: "Google Play", color: "from-cyan-500 to-blue-600", textColor: "text-white", logo: "Google Play" },
  { name: "Amazon", color: "from-amber-500 to-orange-600", textColor: "text-white", logo: "amazon" },
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
      <p className="font-display text-lg text-gold-gradient font-bold mb-4">{t("bookPurchaseDraw")}</p>

      {/* Gift Card Brands - Stacked/Fanned */}
      <div className="flex items-center justify-center mb-2 h-28 relative">
        {BRANDS.map((brand, i) => {
          const rotation = (i - 1) * 12;
          const offsetX = (i - 1) * 30;
          const zIndex = i === 1 ? 30 : i === 2 ? 20 : 10;

          return (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="absolute"
              style={{
                transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
                zIndex,
              }}
            >
              <div
                className={cn(
                  "w-24 h-16 rounded-lg bg-gradient-to-br flex flex-col items-center justify-center shadow-lg border border-white/20",
                  brand.color
                )}
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
              >
                <span className={cn("font-bold text-sm", brand.textColor)}>{brand.logo}</span>
                <span className="text-primary font-bold text-xs mt-0.5">$500</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
