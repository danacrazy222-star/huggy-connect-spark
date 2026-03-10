import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import giftcardAmazon from "@/assets/giftcard-amazon.png";
import giftcardGooglePlay from "@/assets/giftcard-google-play.png";
import giftcardShein from "@/assets/giftcard-shein.png";

const BRANDS = [
  {
    name: "Amazon",
    image: giftcardAmazon,
    borderColor: "#ff9900",
    glowRgb: "255,153,0",
    bgGradient: "linear-gradient(135deg, hsl(35 80% 30%) 0%, hsl(30 90% 20%) 100%)",
  },
  {
    name: "Google Play",
    image: giftcardGooglePlay,
    borderColor: "#4285f4",
    glowRgb: "66,133,244",
    bgGradient: "linear-gradient(135deg, hsl(200 80% 35%) 0%, hsl(190 90% 25%) 100%)",
  },
  {
    name: "SHEIN",
    image: giftcardShein,
    borderColor: "#ec4899",
    glowRgb: "236,72,153",
    bgGradient: "linear-gradient(135deg, hsl(330 70% 35%) 0%, hsl(340 80% 25%) 100%)",
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
            whileTap={{ scale: 1.08 }}
            className="relative flex flex-col items-center cursor-pointer"
          >
            {/* WIN $500 Badge */}
            <div
              className="relative z-10 rounded-full px-3 py-1.5 flex items-center gap-1.5 mb-[-12px]"
              style={{
                background: "linear-gradient(180deg, hsl(30 20% 15%) 0%, hsl(30 10% 8%) 100%)",
                border: "2px solid hsl(45 100% 45%)",
                boxShadow: "0 0 12px rgba(255,200,0,0.3)",
              }}
            >
              <Trophy className="w-3.5 h-3.5 text-primary" />
              <span className="text-[9px] font-bold text-primary whitespace-nowrap">WIN $500</span>
            </div>

            {/* Card with brand background + logo image centered */}
            <div
              className="w-full rounded-[14px] pt-5 pb-3 px-2 flex flex-col items-center"
              style={{
                background: brand.bgGradient,
                border: `2.5px solid ${brand.borderColor}`,
                boxShadow: `0 0 20px rgba(${brand.glowRgb},0.4), 0 0 50px rgba(${brand.glowRgb},0.15)`,
              }}
            >
              {/* Brand logo/image - no white bg, blended into card */}
              <div className="w-full flex items-center justify-center mb-2" style={{ height: "70px" }}>
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-h-[70px] max-w-[90%] object-contain rounded-lg"
                  style={{
                    filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
                  }}
                />
              </div>

              {/* Prize text */}
              <span className="text-[11px] font-bold text-white/90">$500 Gift Card</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
