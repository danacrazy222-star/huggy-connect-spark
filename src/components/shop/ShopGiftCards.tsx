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
    glowShadow: "0 0 20px rgba(255,165,0,0.4)",
    glowShadowActive: "0 0 40px rgba(255,165,0,0.7)",
  },
  {
    name: "Google Play",
    image: brandGooglePlay,
    borderColor: "hsl(210, 100%, 55%)",
    glowShadow: "0 0 20px rgba(59,130,246,0.4)",
    glowShadowActive: "0 0 40px rgba(59,130,246,0.7)",
  },
  {
    name: "SHEIN",
    image: brandShein,
    borderColor: "hsl(330, 80%, 55%)",
    glowShadow: "0 0 20px rgba(236,72,153,0.4)",
    glowShadowActive: "0 0 40px rgba(236,72,153,0.7)",
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
            className="relative flex flex-col items-center rounded-[18px] p-6 pb-3 cursor-pointer"
            style={{
              background: "hsl(260 60% 6%)",
              border: `2.5px solid ${brand.borderColor}`,
              boxShadow: brand.glowShadow,
            }}
          >
            {/* 🏆 $500 Prize Badge */}
            <div
              className="rounded-full px-3 py-1 mb-4 flex items-center gap-1.5"
              style={{
                background: "hsl(260 60% 4% / 0.95)",
                border: "1.5px solid hsl(45 100% 50% / 0.7)",
              }}
            >
              <Trophy className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-bold text-primary whitespace-nowrap">$500 Prize</span>
            </div>

            {/* Brand Logo - 60px, full brightness, no dark overlay */}
            <div className="flex items-center justify-center mb-4" style={{ height: "60px" }}>
              <img
                src={brand.image}
                alt={brand.name}
                className="object-contain"
                style={{ 
                  height: "60px",
                  width: "auto",
                  opacity: 1,
                  filter: "brightness(1)",
                }}
              />
            </div>

            {/* $500 Gift Card */}
            <span className="text-xs font-bold text-foreground leading-tight mb-2">$500 Gift Card</span>

            {/* Brand Name */}
            <span className="font-display text-[10px] font-bold text-muted-foreground">{brand.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
