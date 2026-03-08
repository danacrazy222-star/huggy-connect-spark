import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useGameStore } from "@/store/useGameStore";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import {
  Diamond, Coins, Gamepad2, Ticket, Sparkles, Gift,
  LogIn, LogOut, Settings, Trophy, Star, TrendingUp,
} from "lucide-react";

export default function Profile() {
  const { t, isRTL } = useTranslation();
  const { user, signOut, loading: authLoading } = useAuth();
  const { points, xp, level, gameTickets, tarotTickets, drawEntries } = useGameStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Guest";
  const initials = displayName.slice(0, 2).toUpperCase();

  const stats = [
    { icon: Diamond, label: "XP", value: xp.toLocaleString(), color: "text-accent" },
    { icon: Coins, label: t("xpPoints"), value: points.toLocaleString(), color: "text-primary" },
    { icon: TrendingUp, label: t("level"), value: level, color: "text-green-accent" },
  ];

  const inventory = [
    { icon: Gamepad2, label: t("gameTickets"), value: gameTickets, color: "text-blue-accent" },
    { icon: Sparkles, label: t("tarotTicket"), value: tarotTickets, color: "text-accent" },
    { icon: Gift, label: t("extraEntries"), value: drawEntries, color: "text-primary" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-premium-gradient stars-bg flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
        <TopBar title={t("profile")} />
        <div className="px-4 flex flex-col items-center justify-center gap-6 pt-20">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Avatar className="w-24 h-24 border-2 border-border">
              <AvatarFallback className="bg-muted text-muted-foreground text-2xl">?</AvatarFallback>
            </Avatar>
          </motion.div>
          <p className="text-muted-foreground text-center">{t("loginToViewProfile")}</p>
          <Button onClick={() => navigate("/auth")} className="bg-primary text-primary-foreground font-bold shadow-gold gap-2">
            <LogIn className="w-4 h-4" /> {t("login")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title={t("profile")} />

      <div className="px-4 space-y-5">
        {/* Avatar & Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 pt-2"
        >
          <div className="relative">
            <Avatar className="w-20 h-20 border-2 border-primary shadow-gold">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-muted text-foreground text-xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Lv.{level}
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-display font-bold text-foreground">{displayName}</h2>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="bg-card/80 border-border">
                <CardContent className="p-3 flex flex-col items-center gap-1">
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                  <span className="text-lg font-bold text-foreground">{stat.value}</span>
                  <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Inventory */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm font-bold text-foreground mb-2">{t("inventory")}</h3>
          <Card className="bg-card/80 border-border">
            <CardContent className="p-3 space-y-3">
              {inventory.map((item) => (
                <div key={item.label} className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                  <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                    <item.icon className={cn("w-4 h-4", item.color)} />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* VIP Level Progress */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="text-sm font-bold text-foreground mb-2">VIP</h3>
          <Card className="bg-card/80 border-border">
            <CardContent className="p-3">
              <div className={cn("flex items-center justify-between mb-2", isRTL && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-sm font-bold text-foreground">{t("level")} {level}</span>
                </div>
                <span className="text-xs text-muted-foreground">{xp.toLocaleString()} XP</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((xp / 19000) * 100, 100)}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-gold-dark via-primary to-gold-light rounded-full"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 gap-2"
          >
            <LogOut className="w-4 h-4" /> {t("logout")}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
