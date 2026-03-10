import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import brandAmazon from "@/assets/brand-amazon.png";
import brandGooglePlay from "@/assets/brand-google-play.png";
import brandShein from "@/assets/brand-shein.png";

const BRANDS = [
  {
    name: "Amazon",
    logo: brandAmazon,
    borderColor: "#ff9900",
    glowRgb: "255,153,0",
    bgHue: "35",
  },
  {
    name: "Google Play",
    logo: brandGooglePlay,
    borderColor: "#4285f4",
    glowRgb: "66,133,244",
    bgHue: "210",
  },
  {
    name: "SHEIN",
    logo: brandShein,
    borderColor: "#ec4899",
    glowRgb: "236,72,153",
    bgHue: "330",
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
            className="relative flex flex-col items-center cursor-pointer"
          >
            {/* WIN $500 Badge - positioned on top of card */}
            <div
              className="relative z-10 rounded-full px-3 py-1.5 flex items-center gap-1.5 mb-[-14px]"
              style={{
                background: "linear-gradient(180deg, hsl(30 20% 15%) 0%, hsl(30 10% 8%) 100%)",
                border: "2px solid hsl(45 100% 45%)",
                boxShadow: "0 0 12px rgba(255,200,0,0.3)",
              }}
            >
              <Trophy className="w-3.5 h-3.5 text-primary" />
              <span className="text-[9px] font-bold text-primary whitespace-nowrap">WIN $500</span>
            </div>

            {/* Card body */}
            <div
              className="w-full rounded-[16px] pt-6 pb-3 px-3 flex flex-col items-center"
              style={{
                background: `radial-gradient(ellipse at 50% 30%, hsla(${brand.bgHue}, 60%, 20%, 0.8) 0%, hsl(260, 60%, 6%) 70%)`,
                border: `2.5px solid ${brand.borderColor}`,
                boxShadow: `0 0 25px rgba(${brand.glowRgb},0.4), 0 0 60px rgba(${brand.glowRgb},0.15), inset 0 0 30px rgba(${brand.glowRgb},0.05)`,
              }}
            >
              {/* Brand Logo */}
              <div className="flex items-center justify-center mb-3" style={{ height: "60px" }}>
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-[60px] w-full object-contain"
                  style={{ filter: "brightness(1.2)" }}
                />
              </div>

              {/* $500 Gift Card */}
              <span className="text-xs font-semibold text-foreground/80 mb-3">$500 Gift Card</span>

              {/* Brand Name footer */}
              <div
                className="w-full pt-2 mt-1"
                style={{ borderTop: `1px solid rgba(${brand.glowRgb},0.2)` }}
              >
                <span className="font-display text-[10px] font-bold text-muted-foreground">{brand.name}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
