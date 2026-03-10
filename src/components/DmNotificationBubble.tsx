import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DmNotification {
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  message: string;
}

export function DmNotificationBubble() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<DmNotification | null>(null);

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
          // Don't show if already on that DM page
          if (window.location.pathname === `/dm/${msg.sender_id}`) return;

          // Fetch sender profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, avatar_url")
            .eq("user_id", msg.sender_id)
            .maybeSingle();

          setNotification({
            senderId: msg.sender_id,
            senderName: profile?.display_name || "Player",
            senderAvatar: profile?.avatar_url || null,
            message: msg.message,
          });

          // Auto-dismiss after 6 seconds
          setTimeout(() => setNotification(null), 6000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.8 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
        >
          <button
            onClick={() => {
              navigate(`/dm/${notification.senderId}`);
              setNotification(null);
            }}
            className="w-full flex items-center gap-3 p-3 rounded-2xl border border-primary/30 shadow-lg backdrop-blur-xl cursor-pointer"
            style={{
              background: "hsl(var(--card) / 0.95)",
              boxShadow: "0 8px 32px hsl(var(--primary) / 0.2), 0 0 0 1px hsl(var(--primary) / 0.15)",
            }}
          >
            {/* Shaking avatar */}
            <motion.div
              animate={{
                rotate: [0, -8, 8, -8, 8, -4, 4, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 1.5,
              }}
            >
              <Avatar className="w-11 h-11 border-2 border-primary/50 ring-2 ring-primary/20">
                <AvatarImage src={notification.senderAvatar || undefined} />
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-sm">
                  {notification.senderName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-primary truncate">
                {notification.senderName}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {notification.message}
              </p>
            </div>

            {/* Pulsing dot */}
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
            </span>

            {/* Close */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNotification(null);
              }}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
