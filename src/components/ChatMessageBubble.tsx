import { useState } from "react";
import { Crown, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
    if (msg.translated || loading) return;
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

        {/* Message bubble */}
        <div className="bg-black/40 backdrop-blur-md rounded-2xl rounded-tl-sm px-3 py-1.5 border border-white/10 relative">
          <p className="text-sm text-foreground/90">{msg.message}</p>

          {/* Translated text (Last War style - below original with divider) */}
          {msg.translated && (
            <>
              <div className="border-t border-white/15 my-1.5" />
              <p className="text-sm text-foreground/70 italic">{msg.translated}</p>
            </>
          )}

          {/* Translate button - small icon at bottom-right of bubble */}
          {!isOwn && (
            <button
              onClick={translate}
              disabled={loading || !!msg.translated}
              className={cn(
                "absolute -bottom-2.5 flex items-center justify-center w-5 h-5 rounded-full bg-black/60 border border-white/20 transition-all",
                isRTL ? "-left-1.5" : "-right-1.5",
                loading && "animate-pulse",
                msg.translated ? "opacity-40" : "hover:bg-primary/30 hover:border-primary/50"
              )}
            >
              {loading ? (
                <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Languages className="w-3 h-3 text-primary" />
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
