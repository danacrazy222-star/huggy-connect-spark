import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGameStore } from "@/store/useGameStore";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DiamondFrame } from "@/components/DiamondFrame";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { User, MessageCircle, ShieldBan, Flag, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ChatUserPopupProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  gender?: "male" | "female" | null;
  level?: number;
}

export function ChatUserPopup({ open, onClose, userId, displayName, avatarUrl, gender, level = 1 }: ChatUserPopupProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const userLevel = useGameStore((s) => s.level);
  const [blocking, setBlocking] = useState(false);
  const [reporting, setReporting] = useState(false);

  if (!open || !user || userId === user.id) return null;

  const initials = displayName.slice(0, 2).toUpperCase();
  const genderColor = gender === "female" ? "border-pink-400" : gender === "male" ? "border-blue-400" : "border-white/20";

  const handleSendMessage = () => {
    if (userLevel < 5) {
      toast({ title: t("levelRequired"), description: t("reachLevel5ToChat"), variant: "destructive" });
      return;
    }
    onClose();
    navigate(`/dm/${userId}`);
  };

  const handleBlock = async () => {
    setBlocking(true);
    try {
      await supabase.from("user_blocks").insert({ blocker_id: user.id, blocked_id: userId });
      toast({ title: t("userBlocked"), description: displayName });
      onClose();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setBlocking(false);
    }
  };

  const handleReport = async () => {
    setReporting(true);
    try {
      await supabase.from("user_reports").insert({ reporter_id: user.id, reported_id: userId, reason: "Reported from chat" });
      toast({ title: t("userReported"), description: displayName });
      onClose();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setReporting(false);
    }
  };

  const actions = [
    { icon: User, label: t("viewProfile"), onClick: () => { onClose(); navigate(`/user/${userId}`); }, color: "text-primary" },
    { icon: MessageCircle, label: t("sendMessage"), onClick: handleSendMessage, color: "text-green-400" },
    { icon: ShieldBan, label: t("blockUser"), onClick: handleBlock, color: "text-orange-400", loading: blocking },
    { icon: Flag, label: t("reportUser"), onClick: handleReport, color: "text-destructive", loading: reporting },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="w-[280px] rounded-2xl border border-border bg-card/95 backdrop-blur-xl overflow-hidden shadow-[0_8px_40px_hsl(var(--primary)/0.2)]"
          >
            {/* Header with avatar */}
            <div className="relative flex flex-col items-center pt-6 pb-4 bg-gradient-to-b from-primary/10 to-transparent">
              <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
              <DiamondFrame size="sm" active={level >= 1} level={level}>
                <Avatar className={cn("w-16 h-16 border-2", level >= 1 ? "border-transparent" : genderColor)}>
                  {avatarUrl && <AvatarImage src={avatarUrl} />}
                  <AvatarFallback className="bg-muted text-foreground font-bold">{initials}</AvatarFallback>
                </Avatar>
              </DiamondFrame>
              <h3 className="mt-2 font-display font-bold text-foreground text-sm">{displayName}</h3>
              {level > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 mt-1">
                  Lv.{level}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="px-3 pb-4 space-y-1.5">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    disabled={action.loading}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/30 hover:bg-muted/60 border border-border/50 transition-colors text-left"
                  >
                    <Icon className={cn("w-4 h-4", action.color)} />
                    <span className="text-sm font-medium text-foreground">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
