import { useParams, useNavigate } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft, Sparkles } from "lucide-react";
import { playChatSend } from "@/utils/sounds";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function PrivateChat() {
  const { recipientId } = useParams<{ recipientId: string }>();
  const navigate = useNavigate();
  const { t, isRTL } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [recipientProfile, setRecipientProfile] = useState<{
    display_name: string | null;
    avatar_url: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch recipient profile + messages
  useEffect(() => {
    if (!user || !recipientId) return;
    setLoading(true);

    Promise.all([
      supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("user_id", recipientId)
        .maybeSingle(),
      supabase
        .from("private_messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true }),
    ]).then(([profileRes, messagesRes]) => {
      if (profileRes.data) setRecipientProfile(profileRes.data as any);
      if (messagesRes.data) setMessages(messagesRes.data as Message[]);
      setLoading(false);
    });

    // Mark as read
    supabase
      .from("private_messages")
      .update({ is_read: true })
      .eq("sender_id", recipientId)
      .eq("receiver_id", user.id)
      .eq("is_read", false)
      .then(() => {});
  }, [user, recipientId]);

  // Realtime subscription
  useEffect(() => {
    if (!user || !recipientId) return;
    const channel = supabase
      .channel(`dm-${user.id}-${recipientId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "private_messages",
        },
        (payload) => {
          const msg = payload.new as Message;
          if (
            (msg.sender_id === user.id && msg.receiver_id === recipientId) ||
            (msg.sender_id === recipientId && msg.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, msg]);
            // Mark as read if we're the receiver
            if (msg.receiver_id === user.id) {
              supabase
                .from("private_messages")
                .update({ is_read: true })
                .eq("id", msg.id)
                .then(() => {});
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, recipientId]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !user || !recipientId || sending) return;
    setSending(true);
    const text = input.trim();
    setInput("");

    try {
      await supabase.from("private_messages").insert({
        sender_id: user.id,
        receiver_id: recipientId,
        message: text,
      });
      playChatSend();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }, [input, user, recipientId, sending]);

  if (!user) {
    return (
      <div className="min-h-screen bg-premium-gradient stars-bg flex items-center justify-center">
        <p className="text-muted-foreground">{t("loginToViewProfile")}</p>
      </div>
    );
  }

  const recipientName = recipientProfile?.display_name || "Player";

  return (
    <div
      className="min-h-screen bg-premium-gradient stars-bg flex flex-col"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Avatar className="w-8 h-8 border border-border">
          <AvatarImage src={recipientProfile?.avatar_url || undefined} />
          <AvatarFallback className="bg-muted text-foreground text-xs font-bold">
            {recipientName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="font-bold text-foreground text-sm">{recipientName}</span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
      >
        {loading ? (
          <div className="flex justify-center py-10">
            <Sparkles className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            {t("typeMessage")}
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender_id === user.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex", isOwn ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3.5 py-2 border",
                    isOwn
                      ? "bg-primary/20 border-primary/30 rounded-br-sm"
                      : "bg-card/80 border-border rounded-bl-sm"
                  )}
                >
                  <p className="text-sm text-foreground">{msg.message}</p>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-card/95 backdrop-blur-md border-t border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("typeMessage")}
            className="flex-1 bg-muted/30 border border-border rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="rounded-full bg-primary text-primary-foreground w-9 h-9"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
