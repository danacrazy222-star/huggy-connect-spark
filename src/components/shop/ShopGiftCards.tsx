import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import brandAmazon from "@/assets/brand-amazon.png";
import brandGooglePlay from "@/assets/brand-google-play.png";
import brandShein from "@/assets/brand-shein.png";

const BRANDS = [
  {
    name: "Amazon",
    image: brandAmazon,
    glowColor: "shadow-[0_0_25px_rgba(255,165,0,0.4)]",
    borderColor: "border-amber-500/60",
    bgGradient: "from-amber-950/80 via-background/90 to-amber-950/60",
  },
  {
    name: "Google Play",
    image: brandGooglePlay,
    glowColor: "shadow-[0_0_25px_rgba(59,130,246,0.4)]",
    borderColor: "border-sky-500/60",
    bgGradient: "from-sky-950/80 via-background/90 to-sky-950/60",
  },
  {
    name: "SHEIN",
    image: brandShein,
    glowColor: "shadow-[0_0_25px_rgba(236,72,153,0.4)]",
    borderColor: "border-pink-500/60",
    bgGradient: "from-pink-950/80 via-background/90 to-pink-950/60",
  },
];

export function ShopGiftCards() {
  return (
    <div className="text-center px-4 py-3">
      <h2 className="font-display text-base font-bold text-foreground mb-4">
        Choose Your Gift Card Prize
      </h2>

      <div className="flex items-stretch justify-center gap-2.5 mb-2">
        {BRANDS.map((brand, i) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", bounce: 0.4 }}
            className={`relative flex flex-col items-center rounded-2xl border-2 ${brand.borderColor} ${brand.glowColor} bg-gradient-to-b ${brand.bgGradient} p-2.5 pb-3 w-[110px]`}
          >
            {/* Prize Badge */}
            <div className="bg-background/80 border border-primary/50 rounded-full px-2.5 py-1 mb-2.5 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold text-primary">500 Prize</span>
            </div>

            {/* Brand Logo */}
            <div className="w-[70px] h-[50px] flex items-center justify-center mb-2">
              <img src={brand.image} alt={brand.name} className="max-w-full max-h-full object-contain" />
            </div>

            {/* Price Label */}
            <span className="text-xs font-bold text-foreground/90 mb-1.5">$500 Gift Card</span>

            {/* Brand Name */}
            <span className="font-display text-[11px] font-bold text-muted-foreground">{brand.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
