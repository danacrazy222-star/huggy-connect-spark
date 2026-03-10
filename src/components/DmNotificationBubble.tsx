import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

interface DmNotification {
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  message: string;
  count: number;
}

export function DmNotificationBubble() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState<Map<string, DmNotification>>(new Map());

  // Load existing unread messages on mount
  const loadUnread = useCallback(async () => {
    if (!user) return;

    const { data: unreadMsgs } = await supabase
      .from("private_messages")
      .select("*")
      .eq("receiver_id", user.id)
      .eq("is_read", false)
      .order("created_at", { ascending: false });

    if (!unreadMsgs || unreadMsgs.length === 0) return;

    // Group by sender
    const senderIds = [...new Set(unreadMsgs.map((m) => m.sender_id))];

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url")
      .in("user_id", senderIds);

    const profileMap = new Map(
      (profiles || []).map((p) => [p.user_id, p])
    );

    const newMap = new Map<string, DmNotification>();
    for (const msg of unreadMsgs) {
      if (!newMap.has(msg.sender_id)) {
        const prof = profileMap.get(msg.sender_id);
        newMap.set(msg.sender_id, {
          senderId: msg.sender_id,
          senderName: prof?.display_name || "Player",
          senderAvatar: prof?.avatar_url || null,
          message: msg.message,
          count: 0,
        });
      }
      newMap.get(msg.sender_id)!.count++;
    }

    setNotifications(newMap);
  }, [user]);

  useEffect(() => {
    loadUnread();
  }, [loadUnread]);

  // Clear notification for the sender when navigating to their DM
  useEffect(() => {
    const match = location.pathname.match(/^\/dm\/(.+)$/);
    if (match) {
      const recipientId = match[1];
      setNotifications((prev) => {
        const next = new Map(prev);
        next.delete(recipientId);
        return next;
      });
    }
  }, [location.pathname]);

  // Realtime: new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`dm-notify-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "private_messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        async (payload) => {
          const msg = payload.new as any;
          // Don't add if already viewing that DM
          if (window.location.pathname === `/dm/${msg.sender_id}`) return;

          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, avatar_url")
            .eq("user_id", msg.sender_id)
            .maybeSingle();

          setNotifications((prev) => {
            const next = new Map(prev);
            const existing = next.get(msg.sender_id);
            next.set(msg.sender_id, {
              senderId: msg.sender_id,
              senderName: profile?.display_name || existing?.senderName || "Player",
              senderAvatar: profile?.avatar_url || existing?.senderAvatar || null,
              message: msg.message,
              count: (existing?.count || 0) + 1,
            });
            return next;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const notifList = Array.from(notifications.values());

  return (
    <AnimatePresence>
      {notifList.length > 0 && (
        <div className="fixed top-14 right-2 z-[100] flex flex-col gap-2 max-w-[200px]">
          {notifList.map((notif) => (
            <motion.button
              key={notif.senderId}
              initial={{ opacity: 0, x: 60, scale: 0.7 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.7 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
              onClick={() => {
                navigate(`/dm/${notif.senderId}`);
                setNotifications((prev) => {
                  const next = new Map(prev);
                  next.delete(notif.senderId);
                  return next;
                });
              }}
              className="flex items-center gap-2 p-2 pr-3 rounded-full border border-primary/30 backdrop-blur-xl cursor-pointer"
              style={{
                background: "hsl(var(--card) / 0.95)",
                boxShadow: "0 4px 20px hsl(var(--primary) / 0.25)",
              }}
            >
              {/* Shaking avatar */}
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 10, -5, 5, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className="relative"
              >
                <Avatar className="w-9 h-9 border-2 border-primary/50">
                  <AvatarImage src={notif.senderAvatar || undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                    {notif.senderName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {/* Unread count badge */}
                {notif.count > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-[9px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center text-foreground"
                    style={{ background: "hsl(var(--destructive))" }}
                  >
                    {notif.count > 99 ? "99+" : notif.count}
                  </span>
                )}
              </motion.div>

              <span className="text-xs font-bold text-primary truncate max-w-[100px]">
                {notif.senderName}
              </span>
            </motion.button>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
