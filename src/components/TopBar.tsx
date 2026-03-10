import { Diamond, Coins, Globe, LogIn, LogOut, Volume2, VolumeX } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { useTranslation } from "@/hooks/useTranslation";
import { useState } from "react";
import { LANGUAGES, useLanguageStore } from "@/store/useLanguageStore";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { isMuted, toggleMute } from "@/utils/sounds";

export function TopBar({ title = "WINLINE" }: { title?: string }) {
  const { points, xp } = useGameStore();
  const { isRTL } = useTranslation();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [muted, setMutedState] = useState(isMuted());
  const { language, setLanguage } = useLanguageStore();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleToggleMute = () => {
    toggleMute();
    setMutedState(isMuted());
  };

  return (
    <>
      <div className={cn("flex items-center justify-between px-4 py-3", isRTL && "flex-row-reverse")}>
        <div className={cn("flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5", isRTL && "flex-row-reverse")}>
          <Diamond className="w-4 h-4 text-accent" />
          <span className="text-sm font-bold text-foreground">{Math.floor(xp)}</span>
          <span className="text-primary text-xs">+</span>
        </div>
        
        <div className="flex items-center gap-2">
          <h1 className="font-display text-lg font-bold text-gold-gradient">{title}</h1>
          <button onClick={handleToggleMute} className={cn("text-muted-foreground hover:text-foreground", muted && "text-destructive/70")}>
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setShowLangPicker(!showLangPicker)} className="text-muted-foreground hover:text-foreground">
            <Globe className="w-4 h-4" />
          </button>
          {user ? (
            <button onClick={() => signOut()} className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => navigate('/auth')} className="text-muted-foreground hover:text-primary">
              <LogIn className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className={cn("flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5", isRTL && "flex-row-reverse")}>
          <Coins className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-foreground">{points.toLocaleString()}</span>
          <span className="text-primary text-xs">+</span>
        </div>
      </div>

      {showLangPicker && (
        <div className="px-4 pb-3">
          <div className="bg-card border border-border rounded-xl p-3 grid grid-cols-2 gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setShowLangPicker(false); }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                  language === lang.code
                    ? "bg-primary/20 border border-primary/40 text-foreground"
                    : "bg-muted/30 border border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="font-medium">{lang.nativeName}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
