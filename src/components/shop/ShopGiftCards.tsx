import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import giftcardAmazon from "@/assets/giftcard-amazon.png";
import giftcardGooglePlay from "@/assets/giftcard-google-play.png";
import giftcardShein from "@/assets/giftcard-shein.png";

const BRANDS = [
  {
    name: "Amazon",
    image: giftcardAmazon,
    borderColor: "hsl(35, 100%, 50%)",
    glowShadow: "0 0 40px rgba(255,165,0,0.5), 0 0 80px rgba(255,165,0,0.2)",
    bgGradient: "linear-gradient(180deg, hsl(35 30% 10%) 0%, hsl(260 60% 6%) 60%, hsl(35 30% 8%) 100%)",
  },
  {
    name: "Google Play",
    image: giftcardGooglePlay,
    borderColor: "hsl(210, 100%, 55%)",
    glowShadow: "0 0 40px rgba(59,130,246,0.5), 0 0 80px rgba(59,130,246,0.2)",
    bgGradient: "linear-gradient(180deg, hsl(210 30% 12%) 0%, hsl(260 60% 6%) 60%, hsl(210 30% 10%) 100%)",
  },
  {
    name: "SHEIN",
    image: giftcardShein,
    borderColor: "hsl(330, 80%, 55%)",
    glowShadow: "0 0 40px rgba(236,72,153,0.5), 0 0 80px rgba(236,72,153,0.2)",
    bgGradient: "linear-gradient(180deg, hsl(330 30% 12%) 0%, hsl(260 60% 6%) 60%, hsl(330 30% 10%) 100%)",
  },
];

export function ShopGiftCards() {
  return (
    <div className="text-center px-3 py-3">
      <h2 className="font-display text-base font-bold text-foreground mb-4">
        Choose Your Gift Card Prize
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-2">
        {BRANDS.map((brand, i) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: "spring", bounce: 0.4 }}
            whileTap={{ scale: 1.05 }}
            className="relative flex flex-col items-center rounded-[16px] overflow-hidden cursor-pointer"
            style={{
              background: brand.bgGradient,
              border: `2.5px solid ${brand.borderColor}`,
              boxShadow: brand.glowShadow,
            }}
          >
            {/* $500 Prize Badge - overlapping top */}
            <div
              className="rounded-full px-2.5 py-1 mt-2 mb-2 flex items-center gap-1 z-10"
              style={{
                background: "hsl(260 60% 6% / 0.95)",
                border: "1.5px solid hsl(45 100% 50% / 0.7)",
              }}
            >
              <Trophy className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-bold text-primary whitespace-nowrap">500 Prize</span>
            </div>

            {/* Gift Card Image - large & visible */}
            <div className="w-full px-2 mb-2 flex items-center justify-center" style={{ minHeight: "80px" }}>
              <img
                src={brand.image}
                alt={`${brand.name} $500 Gift Card`}
                className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                style={{ maxHeight: "90px" }}
              />
            </div>

            {/* $500 Gift Card text */}
            <span className="text-[11px] font-bold text-foreground leading-tight mb-1">$500 Gift Card</span>

            {/* Brand Name */}
            <div
              className="w-full py-1.5 mt-1"
              style={{
                background: `linear-gradient(180deg, transparent, ${brand.borderColor}22)`,
                borderTop: `1px solid ${brand.borderColor}44`,
              }}
            >
              <span className="font-display text-[11px] font-bold text-muted-foreground">{brand.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
