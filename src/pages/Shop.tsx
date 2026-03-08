import { TopBar } from "@/components/TopBar";
import { motion } from "framer-motion";
import { Star, Ticket, Sparkles, Flame, Crown } from "lucide-react";

const packages = [
  {
    name: "BASIC",
    price: "$1",
    number: 1,
    color: "from-green-accent/30 to-green-accent/5",
    borderColor: "border-green-accent/50",
    rewards: [
      { icon: <Star className="w-4 h-4 text-primary" />, label: "50 VIP XP" },
      { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: "Draw Entry" },
      { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: "Draw Entry" },
    ],
    tag: null,
    entry: "$1 ENTRY",
  },
  {
    name: "PLUS",
    price: "$2",
    number: 2,
    color: "from-blue-accent/30 to-blue-accent/5",
    borderColor: "border-blue-accent/50",
    rewards: [
      { icon: <Star className="w-4 h-4 text-primary" />, label: "120 VIP XP" },
      { icon: <Ticket className="w-4 h-4 text-red-accent" />, label: "Game Ticket" },
      { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: "Draw Entry" },
    ],
    tag: null,
    entry: "$2 ENTRY",
  },
  {
    name: "PREMIUM",
    price: "$3",
    number: 3,
    color: "from-purple-glow/30 to-purple-glow/5",
    borderColor: "border-primary/50",
    rewards: [
      { icon: <Star className="w-4 h-4 text-primary" />, label: "250 VIP XP" },
      { icon: <Ticket className="w-4 h-4 text-red-accent" />, label: "Game Ticket" },
      { icon: <Sparkles className="w-4 h-4 text-accent" />, label: "Tarot Ticket" },
      { icon: <Ticket className="w-4 h-4 text-blue-accent" />, label: "Draw Entry" },
    ],
    tag: "MOST POPULAR",
    entry: "300% VALUE",
  },
];

export default function Shop() {
  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20">
      <TopBar title="Shop" />

      {/* Gift Card Banner */}
      <div className="text-center px-4 py-4">
        <div className="inline-block bg-primary/20 border border-primary/40 rounded-full px-4 py-1 mb-2">
          <span className="text-sm font-bold text-primary">$500 Gift Card</span>
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">
          $500 Gift Card <span className="text-muted-foreground text-base">in our</span>
        </h2>
        <p className="font-display text-lg text-gold-gradient font-bold">Book Purchase Draw</p>
        
        {/* Gift card logos */}
        <div className="flex items-center justify-center gap-3 mt-3">
          {["SHEIN", "Google Play", "Amazon"].map((name) => (
            <div key={name} className="bg-card border border-border rounded-lg px-3 py-2 text-center">
              <p className="text-xs font-bold text-foreground">{name}</p>
              <p className="text-[10px] text-primary">$500</p>
            </div>
          ))}
        </div>
      </div>

      {/* Select Book */}
      <div className="px-4 mb-4">
        <h3 className="font-display text-center text-lg text-foreground mb-4">Select Your Book Experience</h3>
        
        <div className="grid grid-cols-3 gap-3">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-gradient-to-b ${pkg.color} border ${pkg.borderColor} rounded-xl p-3 text-center`}
            >
              {pkg.tag && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-accent rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-primary" />
                  <span className="text-[8px] font-bold text-foreground whitespace-nowrap">{pkg.tag}</span>
                </div>
              )}
              
              {/* Number badge */}
              <div className="flex justify-center mb-2 mt-1">
                <div className={`w-7 h-7 rounded-full border-2 ${pkg.borderColor} flex items-center justify-center`}>
                  <span className="text-sm font-bold text-foreground">{pkg.number}</span>
                </div>
              </div>

              <h4 className="font-display text-sm font-bold text-foreground mb-3">{pkg.name}</h4>

              {/* Book visual */}
              <div className="w-16 h-20 mx-auto mb-3 bg-gradient-to-br from-accent/40 to-secondary/40 rounded-lg border border-border flex items-center justify-center">
                <Crown className="w-8 h-8 text-primary/60" />
              </div>

              {/* Rewards */}
              <div className="space-y-1.5 mb-3">
                {pkg.rewards.map((r, ri) => (
                  <div key={ri} className="flex items-center gap-1.5 justify-center">
                    {r.icon}
                    <span className="text-[10px] text-foreground">{r.label}</span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="bg-primary/20 border border-primary/30 rounded-lg py-1.5">
                <span className="text-xs font-bold text-primary">{pkg.entry}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer notes */}
      <div className="text-center px-4 space-y-1">
        <p className="text-xs text-muted-foreground">Purchases provide access to digital books.</p>
        <p className="text-[10px] text-muted-foreground">Bonus features are promotional rewards included with purchases.</p>
      </div>
    </div>
  );
}
