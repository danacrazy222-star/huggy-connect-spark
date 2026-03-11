import { useState } from "react";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DiamondFrame } from "@/components/DiamondFrame";

export interface ChatMsg {
  user: string;
  avatar: string;
  message: string;
  crown: boolean;
  translated?: string;
  avatarUrl?: string;
  gender?: "male" | "female" | null;
  level?: number;
  time?: string;
  isSystem?: boolean;
  _userId?: string;
}

const getLevelIcon = (level: number) => {
  if (level >= 15) return "💎";
  if (level >= 10) return "🥇";
  if (level >= 5) return "🥈";
  return "🥉";
};

interface Props {
  msg: ChatMsg;
  index: number;
  isRTL: boolean;
  onTranslated?: (translated: string) => void;
  currentUserId?: string;
  onUserClick?: (userId: string, displayName: string, avatarUrl?: string | null, gender?: "male" | "female" | null, level?: number) => void;
}

export function ChatMessageBubble({ msg, index, isRTL, onTranslated, currentUserId }: Props) {
  const [loading, setLoading] = useState(false);
  const [localTranslated, setLocalTranslated] = useState<string | null>(null);
  const { language } = useTranslation();
  const navigate = useNavigate();
  const isOwn = currentUserId ? msg._userId === currentUserId : msg.user === "You";
  const translated = msg.translated || localTranslated;

  const translate = async () => {
    if (translated || loading || isOwn) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: { text: msg.message, targetLang: language },
      });
      if (!error && data?.translated) {
        if (onTranslated) {
          onTranslated(data.translated);
        } else {
          setLocalTranslated(data.translated);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const genderColor = msg.gender === "female" ? "border-pink-400 shadow-[0_0_6px_rgba(236,72,153,0.4)]" : msg.gender === "male" ? "border-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.4)]" : "border-white/20";
  const genderDot = msg.gender === "female" ? "bg-pink-400" : msg.gender === "male" ? "bg-blue-400" : null;

  const now = msg.time || "";

  // ═══ System announcement (winner) ═══
  if (msg.isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="w-full my-3"
      >
        <div className="relative rounded-2xl border-2 border-primary/60 overflow-hidden px-5 py-4 text-center shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.15), hsl(var(--primary) / 0.2))" }}>
          
          {/* Confetti particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => {
              const colors = [
                "hsl(var(--primary))",
                "hsl(var(--accent))",
                "hsl(45 100% 60%)",
                "hsl(140 70% 50%)",
                "hsl(320 80% 60%)",
                "hsl(200 90% 55%)",
              ];
              const size = 4 + Math.random() * 6;
              const isCircle = Math.random() > 0.5;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: isCircle ? size : size * 0.6,
                    height: isCircle ? size : size * 1.5,
                    borderRadius: isCircle ? "50%" : "2px",
                    background: colors[i % colors.length],
                    left: `${5 + Math.random() * 90}%`,
                    top: "-10%",
                  }}
                  animate={{
                    y: ["0%", `${300 + Math.random() * 200}%`],
                    x: [0, (Math.random() - 0.5) * 60],
                    rotate: [0, Math.random() * 720 - 360],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 1.8 + Math.random() * 1.2,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </div>

          {/* Glow pulses */}
          <motion.div
            animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 pointer-events-none"
          />
          <motion.div
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 rounded-full bg-primary/30 blur-[40px] pointer-events-none"
          />

          {/* Trophy icon */}
          <motion.div
            animate={{ rotate: [0, -8, 8, -4, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl mb-1"
          >
            🏆
          </motion.div>

          <div className="relative">
            <p className="text-sm font-bold text-foreground leading-relaxed whitespace-pre-line">{msg.message}</p>
            {now && <span className="text-[10px] text-muted-foreground mt-1.5 block">{now}</span>}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.1, 0.5) }}
      className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}
    >
      {/* Avatar with tier frame based on level */}
      <div className="relative shrink-0">
        <DiamondFrame size="sm" active={!!msg.level && msg.level >= 1} level={msg.level || 1}>
          <Avatar className={cn("w-9 h-9 border-2", msg.level && msg.level >= 1 ? "border-transparent" : genderColor)}>
            {msg.avatarUrl ? (
              <AvatarImage src={msg.avatarUrl} alt={msg.user} />
            ) : null}
            <AvatarFallback className="bg-white/20 backdrop-blur-sm text-xs font-bold text-foreground">
              {msg.avatar}
            </AvatarFallback>
          </Avatar>
        </DiamondFrame>
        {/* Online dot */}
        <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background", genderDot || "bg-green-400")} />
      </div>

      <div className={cn("max-w-[75%]", isRTL ? "text-right" : "")}>
        {/* Username + Level badge */}
        <div className={cn("flex items-center gap-1.5 mb-0.5", isRTL && "flex-row-reverse")}>
          <span
            className="text-xs font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
            onClick={() => {
              if (msg._userId && !isOwn) navigate(`/user/${msg._userId}`);
            }}
          >{msg.user}</span>
          {msg.crown && <Crown className="w-3 h-3 text-primary" />}
          {msg.level && msg.level > 0 && !msg.isSystem && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
              {getLevelIcon(msg.level)} Lv.{msg.level}
            </span>
          )}
        </div>

        {/* Message bubble */}
        <div
          onClick={translate}
          className={cn(
            "bg-black/40 backdrop-blur-md rounded-2xl rounded-tl-sm px-3 py-2 border border-white/10",
            !isOwn && !msg.translated && "cursor-pointer active:scale-[0.98] transition-transform"
          )}
        >
          <p className="text-sm text-foreground/90">{msg.message}</p>

          {loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-white/15"
            >
              <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] text-muted-foreground">Translating...</span>
            </motion.div>
          )}

          <AnimatePresence>
            {translated && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="border-t border-white/15 my-1.5" />
                <div className={cn("flex items-start gap-1", isRTL && "flex-row-reverse")}>
                  <span className="text-[10px] text-primary mt-0.5">➡️</span>
                  <p className="text-sm text-primary/80 italic">{translated}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Time stamp */}
        {now && <span className="text-[10px] text-muted-foreground mt-0.5 block">{now}</span>}
      </div>
    </motion.div>
  );
}
