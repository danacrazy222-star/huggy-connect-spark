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
    glowShadow: "0 0 30px rgba(255,165,0,0.5), inset 0 0 20px rgba(255,165,0,0.1)",
    bgGradient: "linear-gradient(180deg, hsl(35 40% 12%) 0%, hsl(260 60% 8%) 50%, hsl(35 40% 10%) 100%)",
  },
  {
    name: "Google Play",
    image: brandGooglePlay,
    borderColor: "hsl(210, 100%, 55%)",
    glowShadow: "0 0 30px rgba(59,130,246,0.5), inset 0 0 20px rgba(59,130,246,0.1)",
    bgGradient: "linear-gradient(180deg, hsl(210 40% 14%) 0%, hsl(260 60% 8%) 50%, hsl(210 40% 12%) 100%)",
  },
  {
    name: "SHEIN",
    image: brandShein,
    borderColor: "hsl(330, 80%, 55%)",
    glowShadow: "0 0 30px rgba(236,72,153,0.5), inset 0 0 20px rgba(236,72,153,0.1)",
    bgGradient: "linear-gradient(180deg, hsl(330 40% 14%) 0%, hsl(260 60% 8%) 50%, hsl(330 40% 12%) 100%)",
  },
];

export function ShopGiftCards() {
  return (
    <div className="text-center px-3 py-3">
      <h2 className="font-display text-base font-bold text-foreground mb-4">
        Choose Your Gift Card Prize
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-2">
        {BRANDS.map((brand, i) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: "spring", bounce: 0.4 }}
            whileTap={{ scale: 1.05 }}
            className="relative flex flex-col items-center rounded-[18px] p-4 pb-3 cursor-pointer"
            style={{
              background: brand.bgGradient,
              border: `2px solid ${brand.borderColor}`,
              boxShadow: brand.glowShadow,
            }}
          >
            {/* $500 Prize Badge */}
            <div
              className="rounded-full px-2.5 py-1 mb-4 flex items-center gap-1"
              style={{
                background: "hsl(260 60% 8% / 0.9)",
                border: "1.5px solid hsl(45 100% 50% / 0.6)",
              }}
            >
              <Trophy className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-bold text-primary whitespace-nowrap">$500 Prize</span>
            </div>

            {/* Brand Logo */}
            <div className="w-[70px] h-[60px] flex items-center justify-center mb-3">
              <img src={brand.image} alt={brand.name} className="max-w-full max-h-full object-contain drop-shadow-lg" />
            </div>

            {/* $500 Gift Card */}
            <span className="text-[11px] font-bold text-foreground leading-tight mb-2">$500 Gift Card</span>

            {/* Brand Name */}
            <span className="font-display text-[10px] font-bold text-muted-foreground">{brand.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
