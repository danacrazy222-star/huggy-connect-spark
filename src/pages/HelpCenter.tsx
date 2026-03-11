import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Gift, Gamepad2, MessageCircle, HelpCircle, Star } from "lucide-react";

export default function HelpCenter() {
  const { t, isRTL } = useTranslation();

  const sections = [
    {
      icon: Sparkles,
      title: "Daily Spin",
      content: "Spin the wheel once every 24 hours to earn free rewards: XP, Points, Game Tickets, Tarot Tickets, or Draw Entries.",
    },
    {
      icon: Gift,
      title: "Shop & Books",
      content: "Purchase book packages ($1/$2/$3) to earn XP, tickets, and entries into the $500 gift card draw. Each purchase gives you draw entries.",
    },
    {
      icon: Gamepad2,
      title: "Games & Duels",
      content: "Use Game Tickets to challenge other players. Winners earn 300 XP, losers get 80 XP. Bet points for extra excitement!",
    },
    {
      icon: MessageCircle,
      title: "Chat Rooms",
      content: "Join VIP chat rooms based on your level. World Room is open to all. Higher rooms unlock at levels 1, 9, 17, 25, and 33.",
    },
    {
      icon: Star,
      title: "VIP & Levels",
      content: "Earn XP to level up. Higher levels unlock exclusive rooms, bigger rewards, and mystery chests with special prizes.",
    },
    {
      icon: HelpCircle,
      title: "Points & Wallet",
      content: "1,000 Points = $1 credit. Earn points from spins, games, and activities. Track your balance in your Profile wallet.",
    },
  ];

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title="Help Center" />
      <div className="px-4 space-y-4 pt-2">
        <p className="text-sm text-muted-foreground text-center">
          Learn how to use the app and maximize your rewards
        </p>
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="bg-card/80 border-border">
              <CardContent className="p-4">
                <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <h3 className="text-sm font-bold text-foreground mb-1">{section.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}