import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageCircle, Sparkles } from "lucide-react";

interface Conversation {
  recipientId: string;
  displayName: string;
  avatarUrl: string | null;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
}

export function PrivateMessagesList() {
  const { t, isRTL } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: messages } = await supabase
      .from("private_messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!messages || messages.length === 0) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const convMap = new Map<string, { lastMsg: any; unread: number }>();
    for (const msg of messages) {
      const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      if (!convMap.has(partnerId)) {
        convMap.set(partnerId, { lastMsg: msg, unread: 0 });
      }
      if (msg.receiver_id === user.id && !msg.is_read) {
        convMap.get(partnerId)!.unread++;
      }
    }

    const partnerIds = Array.from(convMap.keys());
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url")
      .in("user_id", partnerIds);

    const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));

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

    convList.sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime());
    setConversations(convList);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Realtime refresh
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`pm-list-${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "private_messages" }, () => {
        loadConversations();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, loadConversations]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground text-sm">{t("loginToViewProfile")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-4 pt-2 pb-4 overflow-y-auto max-h-[65vh]">
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
            <div className="relative">
              <Avatar className="w-10 h-10 border border-border">
                <AvatarImage src={conv.avatarUrl || undefined} />
                <AvatarFallback className="bg-muted text-foreground text-sm font-bold">
                  {conv.displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Online dot placeholder */}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card bg-green-400" />
            </div>
            <div className={cn("flex-1 min-w-0", isRTL ? "text-right" : "text-left")}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">{conv.displayName}</span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(conv.lastTime).toLocaleDateString([], { month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-xs text-muted-foreground truncate flex-1">{conv.lastMessage}</p>
                {conv.unreadCount > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        ))
      )}
    </div>
  );
}
