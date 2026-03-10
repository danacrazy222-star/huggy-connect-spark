import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { ChatMsg } from "@/components/ChatMessageBubble";

const PAGE_SIZE = 50;

export function useChatRealtime(roomId: number) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Fetch recent messages for the room
  useEffect(() => {
    setLoading(true);
    supabase
      .from("chat_messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true })
      .limit(PAGE_SIZE)
      .then(({ data }) => {
        if (data) {
          setMessages(
            data.map((row: any) => dbToMsg(row))
          );
        }
        setLoading(false);
      });
  }, [roomId]);

  // Subscribe to realtime inserts
  useEffect(() => {
    const channel = supabase
      .channel(`chat-room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMsg = dbToMsg(payload.new as any);
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => (m as any)._id === (newMsg as any)._id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const sendMessage = useCallback(
    async (text: string, profile: { display_name: string; avatar_url?: string | null; gender?: string | null; level: number }) => {
      if (!user) return;
      await supabase.from("chat_messages").insert({
        room_id: roomId,
        user_id: user.id,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url || null,
        gender: profile.gender || null,
        level: profile.level,
        message: text,
      });
    },
    [user, roomId]
  );

  return { messages, loading, sendMessage };
}

function dbToMsg(row: any): ChatMsg & { _id: string; _userId: string } {
  const time = new Date(row.created_at);
  const timeStr = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`;
  return {
    _id: row.id,
    _userId: row.user_id,
    user: row.display_name || "Player",
    avatar: (row.display_name || "P").charAt(0).toUpperCase(),
    message: row.message,
    crown: row.level >= 10,
    gender: row.gender as "male" | "female" | null,
    avatarUrl: row.avatar_url || undefined,
    level: row.level ?? 1,
    time: timeStr,
    isSystem: row.is_system || false,
  };
}
