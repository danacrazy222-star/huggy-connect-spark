import { useState } from "react";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  onTranslated: (translated: string) => void;
}

export function ChatMessageBubble({ msg, index, isRTL, onTranslated }: Props) {
  const [loading, setLoading] = useState(false);
  const { language } = useTranslation();
  const isOwn = msg.user === "You";

  const translate = async () => {
    if (msg.translated || loading || isOwn) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: { text: msg.message, targetLang: language },
      });
      if (!error && data?.translated) {
        onTranslated(data.translated);
      }
    } finally {
      setLoading(false);
    }
  };

  const genderColor = msg.gender === "female" ? "border-pink-400 shadow-[0_0_6px_rgba(236,72,153,0.4)]" : msg.gender === "male" ? "border-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.4)]" : "border-white/20";
  const genderDot = msg.gender === "female" ? "bg-pink-400" : msg.gender === "male" ? "bg-blue-400" : null;

  const now = msg.time || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.1, 0.5) }}
      className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}
    >
      {/* Avatar with gender ring */}
      <div className="relative shrink-0">
        <Avatar className={cn("w-9 h-9 border-2", genderColor)}>
          {msg.avatarUrl ? (
            <AvatarImage src={msg.avatarUrl} alt={msg.user} />
          ) : null}
          <AvatarFallback className="bg-white/20 backdrop-blur-sm text-xs font-bold text-foreground">
            {msg.avatar}
          </AvatarFallback>
        </Avatar>
        {/* Online dot */}
        <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background", genderDot || "bg-green-400")} />
      </div>

      <div className={cn("max-w-[75%]", isRTL ? "text-right" : "")}>
        {/* Username + Level badge - ABOVE the bubble */}
        <div className={cn("flex items-center gap-1.5 mb-0.5", isRTL && "flex-row-reverse")}>
          <span className="text-xs font-medium text-foreground">{msg.user}</span>
          {msg.crown && <Crown className="w-3 h-3 text-primary" />}
          {msg.level && (
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
            {msg.translated && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="border-t border-white/15 my-1.5" />
                <div className={cn("flex items-start gap-1", isRTL && "flex-row-reverse")}>
                  <span className="text-[10px] text-primary mt-0.5">➡️</span>
                  <p className="text-sm text-primary/80 italic">{msg.translated}</p>
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
