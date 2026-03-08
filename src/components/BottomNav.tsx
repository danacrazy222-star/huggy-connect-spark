import { Home, ShoppingBag, MessageCircle, Crown, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/shop", icon: ShoppingBag, label: "Shop" },
  { path: "/chat", icon: MessageCircle, label: "Chat", badge: 3 },
  { path: "/vip", icon: Crown, label: "Crown" },
  { path: "/tarot", icon: Sparkles, label: "Cards" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-md">
        <nav className="flex items-center justify-around bg-card/95 backdrop-blur-xl border-t border-border px-2 py-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <div className="relative">
                  <Icon className={cn("w-5 h-5", isActive && "glow-gold")} />
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-2 bg-red-accent text-[10px] text-foreground font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
