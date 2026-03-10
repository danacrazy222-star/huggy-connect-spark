import { Home, ShoppingBag, MessageCircle, Crown, Sparkles, Gamepad2, Gift, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { playNavTap } from "@/utils/sounds";
import { useTranslation } from "@/hooks/useTranslation";
import { useChatStore } from "@/store/useChatStore";

const tabs = [
  { path: "/", icon: Home, key: "home" as const },
  { path: "/shop", icon: ShoppingBag, key: "shop" as const },
  { path: "/draw", icon: Gift, key: "draw" as const },
  { path: "/games", icon: Gamepad2, key: "games" as const },
  { path: "/chat", icon: MessageCircle, key: "chat" as const, dynamicBadge: true },
  { path: "/vip", icon: Crown, key: "crown" as const },
  { path: "/tarot", icon: Sparkles, key: "cards" as const },
  { path: "/profile", icon: User, key: "profile" as const },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, isRTL } = useTranslation();
  const unreadCount = useChatStore((s) => s.unreadCount);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-md">
        <nav 
          className={cn(
            "flex items-center justify-around border-t px-1 py-1.5",
            isRTL && "flex-row-reverse"
          )}
          style={{
            background: "hsl(var(--card) / 0.95)",
            backdropFilter: "blur(16px)",
            borderColor: "hsl(var(--border))",
          }}
        >
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all min-w-[40px]",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground/70"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "hsl(var(--primary) / 0.1)" }}
                    transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                  />
                )}
                <div className="relative z-10">
                  <Icon className={cn("w-[18px] h-[18px]", isActive && "glow-gold")} strokeWidth={isActive ? 2.2 : 1.8} />
                  {tab.dynamicBadge && unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-2 text-[9px] text-foreground font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center"
                      style={{ background: "hsl(var(--red-accent))" }}
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </motion.span>
                  )}
                </div>
                <span className={cn(
                  "text-[9px] font-medium relative z-10 leading-tight",
                  isActive && "text-primary"
                )}>
                  {t(tab.key)}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
