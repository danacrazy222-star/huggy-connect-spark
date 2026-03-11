import { useParams, useNavigate } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DiamondFrame } from "@/components/DiamondFrame";
import {
  MessageCircle, TrendingUp, BookOpen, Gift, Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { t, isRTL } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<{
    display_name: string | null;
    avatar_url: string | null;
    gender: string | null;
  } | null>(null);
  const [stats, setStats] = useState<{
    books_purchased: number;
    draw_entries: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  // We don't have a "level" column in profiles, so we show default
  const userLevel = 1;

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      supabase
        .from("profiles")
        .select("display_name, avatar_url, gender")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("user_stats")
        .select("books_purchased, draw_entries")
        .eq("user_id", userId)
        .maybeSingle(),
    ]).then(([profileRes, statsRes]) => {
      if (profileRes.data) setProfile(profileRes.data as any);
      if (statsRes.data) setStats(statsRes.data as any);
      setLoading(false);
    });
  }, [userId]);

  const displayName = profile?.display_name || "Player";
  const initials = displayName.slice(0, 2).toUpperCase();
  const genderLabel =
    profile?.gender === "male" ? "♂" : profile?.gender === "female" ? "♀" : "";
  const genderColor =
    profile?.gender === "male"
      ? "text-blue-400"
      : profile?.gender === "female"
      ? "text-pink-400"
      : "text-muted-foreground";

  if (loading) {
    return (
      <div className="min-h-screen bg-premium-gradient stars-bg flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-premium-gradient stars-bg pb-20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <TopBar title={t("profile")} />
      <div className="px-4 space-y-5">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToGames")}
        </button>

        {/* Avatar + Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3"
        >
          <DiamondFrame size="lg" active={userLevel >= 1} level={userLevel}>
            <Avatar
              className={cn(
                "w-24 h-24 border-2",
                userLevel >= 1
                  ? "border-transparent"
                  : "border-primary shadow-gold"
              )}
            >
              <AvatarImage
                src={profile?.avatar_url || undefined}
                key={profile?.avatar_url}
              />
              <AvatarFallback className="bg-muted text-foreground text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DiamondFrame>

          <div className="text-center">
            <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2 justify-center">
              {displayName}
              {genderLabel && (
                <span className={cn("text-lg", genderColor)}>
                  {genderLabel}
                </span>
              )}
            </h2>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card className="bg-card/80 border-border">
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold text-foreground">
                {stats?.books_purchased ?? 0}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {t("digitalBook")}
              </span>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border-border">
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <Gift className="w-5 h-5 text-accent" />
              <span className="text-lg font-bold text-foreground">
                {stats?.draw_entries ?? 0}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {t("drawEntry")}
              </span>
            </CardContent>
          </Card>
        </motion.div>

        {/* Private Chat Button */}
        {user && user.id !== userId && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={() => navigate(`/dm/${userId}`)}
              className="w-full bg-primary text-primary-foreground font-bold shadow-gold gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              {t("privateChat")}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
