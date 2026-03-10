import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useGameStore } from "@/store/useGameStore";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useRef } from "react";
import { useLanguageStore, LANGUAGES } from "@/store/useLanguageStore";
import { toast } from "sonner";
import {
  Diamond, Coins, Gamepad2, Sparkles, Gift,
  LogIn, LogOut, Star, TrendingUp, Camera,
  Globe, Trash2, ChevronRight, Edit3, Check, X,
  Settings, RefreshCw, Shield, FileText,
} from "lucide-react";
import { DiamondFrame } from "@/components/DiamondFrame";

export default function Profile() {
  const { t, isRTL } = useTranslation();
  const { user, signOut, loading: authLoading } = useAuth();
  const { points, xp, level, gameTickets, tarotTickets, drawEntries } = useGameStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null; gender: string | null } | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language, setLanguage } = useLanguageStore();

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name, avatar_url, gender").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data) setProfile(data as any); });
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

  const handleLogout = async () => { await signOut(); navigate("/"); };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const avatarUrl = `${publicUrl}?v=${Date.now()}`;
      const { error: updateError } = await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("user_id", user.id);
      if (updateError) throw updateError;
      setProfile((prev) => prev ? { ...prev, avatar_url: avatarUrl } : prev);
      toast.success(t("photoUpdated"));
    } catch (err: any) {
      toast.error(err.message || t("tryAgain"));
    } finally {
      setUploading(false);
    }
  };

  const handleSaveName = async () => {
    if (!user || !nameInput.trim()) return;
    const { error } = await supabase.from("profiles").update({ display_name: nameInput.trim() }).eq("user_id", user.id);
    if (error) toast.error(error.message);
    else { setProfile((prev) => prev ? { ...prev, display_name: nameInput.trim() } : prev); toast.success(t("nameUpdated")); }
    setEditingName(false);
  };

  const handleClearData = () => {
    localStorage.clear();
    toast.success(t("dataCleared"));
    setTimeout(() => window.location.reload(), 500);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-premium-gradient stars-bg flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3 pt-2">
          <div className="relative">
            <DiamondFrame size="lg" active={level >= 15} level={level}>
              <Avatar className={cn("w-24 h-24 border-2", level >= 15 ? "border-transparent" : "border-primary shadow-gold")}>
                <AvatarImage src={profile?.avatar_url || undefined} key={profile?.avatar_url} />
                <AvatarFallback className="bg-muted text-foreground text-2xl font-bold" delayMs={600}>{initials}</AvatarFallback>
              </Avatar>
            </DiamondFrame>
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-background shadow-lg">
              {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            <div className="absolute -bottom-1 -left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {t("level")}.{level}
            </div>
          </div>

          <div className="text-center">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input value={nameInput} onChange={(e) => setNameInput(e.target.value)}
                  className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-foreground text-sm text-center outline-none focus:border-primary"
                  autoFocus onKeyDown={(e) => e.key === "Enter" && handleSaveName()} />
                <button onClick={handleSaveName} className="text-green-accent"><Check className="w-5 h-5" /></button>
                <button onClick={() => setEditingName(false)} className="text-destructive"><X className="w-5 h-5" /></button>
              </div>
            ) : (
              <button onClick={() => { setNameInput(displayName); setEditingName(true); }} className="flex items-center gap-1.5 group">
                <h2 className="text-lg font-display font-bold text-foreground">{displayName}</h2>
                <Edit3 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={async () => {
                  const newGender = profile?.gender === "male" ? null : "male";
                  await supabase.from("profiles").update({ gender: newGender } as any).eq("user_id", user.id);
                  setProfile((prev) => prev ? { ...prev, gender: newGender } : prev);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  profile?.gender === "male"
                    ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                    : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                )}>
                ♂ {t("male")}
              </button>
              <button
                onClick={async () => {
                  const newGender = profile?.gender === "female" ? null : "female";
                  await supabase.from("profiles").update({ gender: newGender } as any).eq("user_id", user.id);
                  setProfile((prev) => prev ? { ...prev, gender: newGender } : prev);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  profile?.gender === "female"
                    ? "bg-pink-500/20 border-pink-500/50 text-pink-400"
                    : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                )}>
                ♀ {t("female")}
              </button>
            </div>
          </div>
        </motion.div>

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

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5">
            <Settings className="w-4 h-4" /> {t("settings")}
          </h3>
          <Card className="bg-card/80 border-border">
            <CardContent className="p-0 divide-y divide-border">
              <button onClick={() => setShowLangPicker(!showLangPicker)}
                className={cn("w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors", isRTL && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-2.5", isRTL && "flex-row-reverse")}>
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">{t("language")}</span>
                </div>
                <div className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
                  <span className="text-xs text-muted-foreground">{LANGUAGES.find(l => l.code === language)?.nativeName}</span>
                  <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", showLangPicker && "rotate-90")} />
                </div>
              </button>
              <AnimatePresence>
                {showLangPicker && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-1.5 p-3">
                      {LANGUAGES.map((lang) => (
                        <button key={lang.code}
                          onClick={() => { setLanguage(lang.code); setShowLangPicker(false); toast.success(`${lang.nativeName} ✓`); }}
                          className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                            language === lang.code ? "bg-primary/20 border-primary/50 text-primary" : "bg-muted/30 border-border text-foreground hover:bg-muted/50"
                          )}>
                          {lang.nativeName}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={() => navigate("/messages")}
                className={cn("w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors", isRTL && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-2.5", isRTL && "flex-row-reverse")}>
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">{t("privateMessages")}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={() => navigate("/promotion-rules")}
                className={cn("w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors", isRTL && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-2.5", isRTL && "flex-row-reverse")}>
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">{t("promotionRules")}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={() => navigate("/terms")}
                className={cn("w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors", isRTL && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-2.5", isRTL && "flex-row-reverse")}>
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">{t("termsAndConditions")}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={handleClearData}
                className={cn("w-full flex items-center justify-between p-3 hover:bg-destructive/10 transition-colors", isRTL && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-2.5", isRTL && "flex-row-reverse")}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-destructive">{t("clearData")}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
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
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((xp / 19000) * 100, 100)}%` }}
                  transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-gold-dark via-primary to-gold-light rounded-full" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Button onClick={handleLogout} variant="outline" className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 gap-2">
            <LogOut className="w-4 h-4" /> {t("logout")}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
