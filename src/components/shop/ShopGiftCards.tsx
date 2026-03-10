import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";
import giftcardShein from "@/assets/giftcard-shein.png";
import giftcardGooglePlay from "@/assets/giftcard-google-play.png";
import giftcardAmazon from "@/assets/giftcard-amazon.png";

const BRANDS = [
  { name: "Amazon", image: giftcardAmazon, textColor: "text-amber-400" },
  { name: "Google Play", image: giftcardGooglePlay, textColor: "text-sky-400" },
  { name: "SHEIN", image: giftcardShein, textColor: "text-pink-400" },
];

export function ShopGiftCards() {
  return (
    <div className="text-center px-4 py-3">
      <div className="inline-flex items-center gap-1.5 bg-primary/15 border border-primary/30 rounded-full px-4 py-1.5 mb-3">
        <Trophy className="w-4 h-4 text-primary" />
        <span className="text-sm font-bold text-primary">Win a $500 Gift Card</span>
      </div>

      <p className="text-xs text-muted-foreground mb-4">Choose from:</p>

      <div className="flex items-center justify-center gap-3 mb-2">
        {BRANDS.map((brand, i) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", bounce: 0.4 }}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="w-[100px] h-[68px] rounded-xl overflow-hidden border border-border/50 shadow-md">
              <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
            </div>
            <span className={cn("font-display font-bold text-xs", brand.textColor)}>{brand.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
