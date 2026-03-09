import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import brandShein from "@/assets/brand-shein.png";
import brandGooglePlay from "@/assets/brand-google-play.png";
import brandAmazon from "@/assets/brand-amazon.png";

const BRANDS = [
  {
    name: "SHEIN",
    logo: brandShein,
    subtitle: "$500",
    borderColor: "border-pink-500",
    textColor: "text-pink-400",
    bgAccent: "from-pink-500/20 to-pink-600/10",
  },
  {
    name: "Google Play",
    logo: brandGooglePlay,
    subtitle: "$500",
    borderColor: "border-sky-500",
    textColor: "text-sky-400",
    bgAccent: "from-sky-500/20 to-blue-600/10",
  },
  {
    name: "Amazon",
    logo: brandAmazon,
    subtitle: "$500",
    borderColor: "border-amber-500",
    textColor: "text-amber-400",
    bgAccent: "from-amber-500/20 to-orange-600/10",
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: "spring", bounce: 0.4 }}
            className="flex flex-col items-center gap-1.5"
          >
            {/* Card */}
            <div
              className={cn(
                "relative w-[105px] h-[72px] rounded-xl flex flex-col items-center justify-center border-2 overflow-hidden bg-gradient-to-br from-gray-900 to-black",
                brand.borderColor
              )}
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-8 w-auto object-contain mb-0.5"
              />
              <span className={cn("font-bold text-xs", brand.textColor)}>{brand.subtitle}</span>
            </div>
            {/* Price below */}
            <span className={cn("font-display font-bold text-lg", brand.textColor)}>{brand.subtitle}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
