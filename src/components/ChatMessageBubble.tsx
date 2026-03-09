import { useState } from "react";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";

export interface ChatMsg {
  user: string;
  avatar: string;
  message: string;
  crown: boolean;
  translated?: string;
}

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.1, 0.5) }}
      className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-sm font-bold text-foreground shrink-0">
        {msg.avatar}
      </div>

      <div className={cn("max-w-[75%]", isRTL ? "text-right" : "")}>
        {/* Username */}
        <div className={cn("flex items-center gap-1 mb-0.5", isRTL && "flex-row-reverse")}>
          <span className="text-xs font-medium text-foreground">{msg.user}</span>
          {msg.crown && <Crown className="w-3 h-3 text-primary" />}
        </div>

        {/* Message bubble - tappable for translation */}
        <div
          onClick={translate}
          className={cn(
            "bg-black/40 backdrop-blur-md rounded-2xl rounded-tl-sm px-3 py-1.5 border border-white/10",
            !isOwn && !msg.translated && "cursor-pointer active:scale-[0.98] transition-transform"
          )}
        >
          <p className="text-sm text-foreground/90">{msg.message}</p>

          {/* Loading indicator */}
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

          {/* Translated text */}
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
      </div>
    </motion.div>
  );
}
