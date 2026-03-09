import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import giftcardShein from "@/assets/giftcard-shein.png";
import giftcardGooglePlay from "@/assets/giftcard-google-play.png";
import giftcardAmazon from "@/assets/giftcard-amazon.png";

const BRANDS = [
  {
    name: "SHEIN",
    image: giftcardShein,
    subtitle: "$500",
    textColor: "text-pink-400",
  },
  {
    name: "Google Play",
    image: giftcardGooglePlay,
    subtitle: "$500",
    textColor: "text-sky-400",
  },
  {
    name: "Amazon",
    image: giftcardAmazon,
    subtitle: "$500",
    textColor: "text-amber-400",
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
            <div className="w-[105px] h-[72px] rounded-xl overflow-hidden shadow-lg">
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className={cn("font-display font-bold text-lg", brand.textColor)}>{brand.subtitle}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
