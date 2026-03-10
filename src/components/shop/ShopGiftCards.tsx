import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import brandAmazon from "@/assets/brand-amazon.png";
import brandGooglePlay from "@/assets/brand-google-play.png";
import brandShein from "@/assets/brand-shein.png";

const BRANDS = [
  {
    name: "Amazon",
    image: brandAmazon,
    borderColor: "hsl(35, 100%, 50%)",
    glowShadow: "0 0 35px rgba(255,165,0,0.45), 0 0 70px rgba(255,165,0,0.15)",
    glowShadowActive: "0 0 60px rgba(255,165,0,0.7), 0 0 100px rgba(255,165,0,0.3)",
    bgGradient: "linear-gradient(180deg, hsl(35 25% 10%) 0%, hsl(260 60% 6%) 55%, hsl(35 20% 8%) 100%)",
  },
  {
    name: "Google Play",
    image: brandGooglePlay,
    borderColor: "hsl(210, 100%, 55%)",
    glowShadow: "0 0 35px rgba(59,130,246,0.45), 0 0 70px rgba(59,130,246,0.15)",
    glowShadowActive: "0 0 60px rgba(59,130,246,0.7), 0 0 100px rgba(59,130,246,0.3)",
    bgGradient: "linear-gradient(180deg, hsl(210 25% 12%) 0%, hsl(260 60% 6%) 55%, hsl(210 20% 10%) 100%)",
  },
  {
    name: "SHEIN",
    image: brandShein,
    borderColor: "hsl(330, 80%, 55%)",
    glowShadow: "0 0 35px rgba(236,72,153,0.45), 0 0 70px rgba(236,72,153,0.15)",
    glowShadowActive: "0 0 60px rgba(236,72,153,0.7), 0 0 100px rgba(236,72,153,0.3)",
    bgGradient: "linear-gradient(180deg, hsl(330 25% 12%) 0%, hsl(260 60% 6%) 55%, hsl(330 20% 10%) 100%)",
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
            whileTap={{ scale: 1.05, boxShadow: brand.glowShadowActive }}
            className="relative flex flex-col items-center rounded-[16px] p-3 pb-2 cursor-pointer"
            style={{
              background: brand.bgGradient,
              border: `2.5px solid ${brand.borderColor}`,
              boxShadow: brand.glowShadow,
            }}
          >
            {/* 🏆 $500 Prize Badge */}
            <div
              className="rounded-full px-2.5 py-1 mb-3 flex items-center gap-1"
              style={{
                background: "hsl(260 60% 6% / 0.95)",
                border: "1.5px solid hsl(45 100% 50% / 0.7)",
              }}
            >
              <Trophy className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-bold text-primary whitespace-nowrap">$500 Prize</span>
            </div>

            {/* Brand Logo - large & centered */}
            <div className="w-full flex items-center justify-center mb-3" style={{ height: "70px" }}>
              <img
                src={brand.image}
                alt={brand.name}
                className="max-w-[85%] max-h-[70px] object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
              />
            </div>

            {/* $500 Gift Card */}
            <span className="text-[11px] font-bold text-foreground leading-tight mb-2">$500 Gift Card</span>

            {/* Brand Name footer */}
            <div
              className="w-full py-1.5 rounded-b-[12px] -mx-3 -mb-2"
              style={{
                borderTop: `1px solid ${brand.borderColor}33`,
                background: `linear-gradient(180deg, transparent, ${brand.borderColor}15)`,
              }}
            >
              <span className="font-display text-[10px] font-bold text-muted-foreground">{brand.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
