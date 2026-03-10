import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Sparkles } from "lucide-react";

interface Conversation {
  recipientId: string;
  displayName: string;
  avatarUrl: string | null;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
}

export default function Messages() {
  const { t, isRTL } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    // Fetch all private messages involving the current user
    supabase
      .from("private_messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .then(async ({ data: messages }) => {
        if (!messages || messages.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }

        // Group by conversation partner
        const convMap = new Map<string, { lastMsg: any; unread: number }>();
        for (const msg of messages) {
          const partnerId =
            msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          if (!convMap.has(partnerId)) {
            convMap.set(partnerId, {
              lastMsg: msg,
              unread: 0,
            });
          }
          const conv = convMap.get(partnerId)!;
          if (
            msg.receiver_id === user.id &&
            !msg.is_read
          ) {
            conv.unread++;
          }
        }

        // Fetch profiles for all partners
        const partnerIds = Array.from(convMap.keys());
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, display_name, avatar_url")
          .in("user_id", partnerIds);

        const profileMap = new Map(
          (profiles || []).map((p: any) => [p.user_id, p])
        );

        const convList: Conversation[] = partnerIds.map((pid) => {
          const conv = convMap.get(pid)!;
          const prof = profileMap.get(pid);
          return {
            recipientId: pid,
            displayName: prof?.display_name || "Player",
            avatarUrl: prof?.avatar_url || null,
            lastMessage: conv.lastMsg.message,
            lastTime: conv.lastMsg.created_at,
            unreadCount: conv.unread,
          };
        });

        // Sort by last message time (most recent first)
        convList.sort(
          (a, b) =>
            new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
        );

        setConversations(convList);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
        <TopBar title={t("privateMessages")} />
        <div className="flex flex-col items-center justify-center pt-20 px-4">
          <p className="text-muted-foreground">{t("loginToViewProfile")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title={t("privateMessages")} />
      <div className="px-4 space-y-2 pt-2">
        {loading ? (
          <div className="flex justify-center py-10">
            <Sparkles className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-10">
            <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">{t("noMessages")}</p>
          </div>
        ) : (
          conversations.map((conv, i) => (
            <motion.button
              key={conv.recipientId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/dm/${conv.recipientId}`)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl bg-card/80 border border-border hover:bg-muted/30 transition-colors",
                isRTL && "flex-row-reverse"
              )}
            >
              <Avatar className="w-10 h-10 border border-border">
                <AvatarImage src={conv.avatarUrl || undefined} />
                <AvatarFallback className="bg-muted text-foreground text-sm font-bold">
                  {conv.displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={cn("flex-1 min-w-0", isRTL ? "text-right" : "text-left")}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">
                    {conv.displayName}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(conv.lastTime).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {conv.unreadCount}
                </span>
              )}
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}
