import { useState, useEffect, useCallback } from "react";
import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { useChatStore } from "@/store/useChatStore";
import { containsProfanity, censorMessage } from "@/utils/profanityFilter";
import { ChatMessageBubble, type ChatMsg } from "@/components/ChatMessageBubble";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ChatDuelChallenge } from "@/components/chat/ChatDuelChallenge";
import { WorldChallengePromo } from "@/components/chat/WorldChallengePromo";


import roomWorld from "@/assets/room-world.jpg";
import roomBronze from "@/assets/room-bronze.jpg";
import roomSilver from "@/assets/room-silver.jpg";
import roomGold from "@/assets/room-gold.jpg";
import roomDiamond from "@/assets/room-diamond.jpg";

import avatarMale1 from "@/assets/avatar-male-1.png";
import avatarMale2 from "@/assets/avatar-male-2.png";
import avatarMale3 from "@/assets/avatar-male-3.png";
import avatarFemale1 from "@/assets/avatar-female-1.png";
import avatarFemale2 from "@/assets/avatar-female-2.png";
import avatarFemale3 from "@/assets/avatar-female-3.png";

const rooms = [
  { name: "🌍 World", level: 0, image: roomWorld, accent: "from-emerald-500/60", border: "border-emerald-400/50", glow: "hsl(160 80% 50%)", shape: "circle" as const },
  { name: "Bronze", level: 1, image: roomBronze, accent: "from-blue-500/60", border: "border-blue-400/50", glow: "hsl(185 100% 60%)", shape: "circle" as const },
  { name: "Silver", level: 5, image: roomSilver, accent: "from-pink-500/60", border: "border-pink-400/50", glow: "hsl(320 100% 65%)", shape: "circle" as const },
  { name: "Gold", level: 10, image: roomGold, accent: "from-purple-500/60", border: "border-purple-400/50", glow: "hsl(280 80% 65%)", shape: "diamond" as const },
  { name: "Diamond", level: 15, image: roomDiamond, accent: "from-amber-500/60", border: "border-amber-400/50", glow: "hsl(35 100% 55%)", shape: "flame" as const },
];

const mockMessages: ChatMsg[] = [
  { user: "Michael", avatar: "M", message: "Welcome to the Bronze room! 🔥", crown: false, gender: "male", avatarUrl: avatarMale1, level: 4, time: "02:01" },
  { user: "Luna", avatar: "L", message: "Who's spinning today?", crown: true, gender: "female", avatarUrl: avatarFemale1, level: 7, time: "02:02" },
  { user: "Alex", avatar: "A", message: "Just won a game ticket! 🎰", crown: false, gender: "male", avatarUrl: avatarMale3, level: 3, time: "02:03" },
];

type ChatMessage = ChatMsg;

export default function Chat() {
  const [activeRoom, setActiveRoom] = useState(0);
  const [message, setMessage] = useState("");
  
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<{ avatar_url: string | null; gender: string | null } | null>(null);
  const level = useGameStore((s) => s.level);
  const worldChallengeUnlocked = useGameStore((s) => s.worldChallengeUnlocked);
  const addXP = useGameStore((s) => s.addXP);
  const { t, isRTL } = useTranslation();
  const { roomMessages, addMessage, initRoom, addUnread, clearUnread, updateMessageInRoom } = useChatStore();


  // Initialize room with default messages
  useEffect(() => {
    initRoom(activeRoom, mockMessages);
  }, [activeRoom, initRoom]);

  const messages = roomMessages[activeRoom] || [];

  // Fetch current user profile for avatar & gender
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("avatar_url, gender")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setUserProfile(data as any);
      });
  }, [user]);

  const currentRoom = rooms[activeRoom];
  const canAccess = level >= currentRoom.level;

  // Clear unread when entering chat
  useEffect(() => {
    clearUnread();
  }, [clearUnread]);

  // Simulate active chat with varied messages
  useEffect(() => {
    if (!canAccess) return;

    const chatMessages: ChatMsg[] = [
      { user: "Sara", avatar: "S", message: "مرحبا! 👋 أهلاً بالجميع", crown: false, gender: "female", avatarUrl: avatarFemale3, level: 15 },
      { user: "Omar", avatar: "O", message: "يلا نلعب! 🎮 مين جاهز؟", crown: true, gender: "male", avatarUrl: avatarMale2, level: 12 },
      { user: "Noor", avatar: "N", message: "حظ سعيد للجميع 🍀", crown: false, gender: "female", avatarUrl: avatarFemale2, level: 8 },
      { user: "Sara", avatar: "S", message: "فزت بالسحب اليوم! 🎉🎉", crown: false, gender: "female", avatarUrl: avatarFemale3, level: 15 },
      { user: "Omar", avatar: "O", message: "مبروك يا سارة 🥳👏", crown: true, gender: "male", avatarUrl: avatarMale2, level: 12 },
      { user: "Noor", avatar: "N", message: "مين يبي يلعب تحدي؟ ⚔️", crown: false, gender: "female", avatarUrl: avatarFemale2, level: 8 },
      { user: "Sara", avatar: "S", message: "الغرفة اليوم حماسية 🔥🔥", crown: false, gender: "female", avatarUrl: avatarFemale3, level: 15 },
      { user: "Omar", avatar: "O", message: "أنا وصلت لفل 12! 💪", crown: true, gender: "male", avatarUrl: avatarMale2, level: 12 },
      { user: "Noor", avatar: "N", message: "شدوا حيلكم يا شباب 💪🏆", crown: false, gender: "female", avatarUrl: avatarFemale2, level: 8 },
      { user: "Omar", avatar: "O", message: "مين جرب التاروت اليوم؟ 🔮", crown: true, gender: "male", avatarUrl: avatarMale2, level: 12 },
      { user: "Sara", avatar: "S", message: "أنا بعمل سبين كل يوم ✨", crown: false, gender: "female", avatarUrl: avatarFemale3, level: 15 },
      { user: "Noor", avatar: "N", message: "Good luck everyone 🍀", crown: false, gender: "female", avatarUrl: avatarFemale2, level: 8 },
    ];

    let msgIndex = 0;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      const msg = { ...chatMessages[msgIndex % chatMessages.length], time: timeStr };
      addMessage(activeRoom, msg);
      addUnread();
      msgIndex++;
    }, 8000 + Math.random() * 7000);
    return () => clearInterval(interval);
  }, [canAccess, activeRoom, addMessage, addUnread]);

  // Welcome message when user enters
  useEffect(() => {
    if (!canAccess || !user) return;
    const userName = user.email?.split("@")[0] || "Player";
    const welcomeTimeout = setTimeout(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      addMessage(activeRoom, {
        user: "Luna",
        avatar: "L",
        message: `أهلاً ${userName}! 👋🎉 نورت الغرفة`,
        crown: true,
        gender: "female",
        avatarUrl: avatarFemale1,
        level: 7,
        time: timeStr,
      });
    }, 2000);
    return () => clearTimeout(welcomeTimeout);
  }, [activeRoom, canAccess]);


  const sendMessage = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed) return;
    const filtered = containsProfanity(trimmed) ? censorMessage(trimmed) : trimmed;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    addMessage(activeRoom, {
      user: "You",
      avatar: user?.email?.charAt(0).toUpperCase() || "Y",
      message: filtered,
      crown: false,
      avatarUrl: userProfile?.avatar_url || undefined,
      gender: (userProfile?.gender as "male" | "female" | null) || null,
      level,
      time: timeStr,
    });
    setMessage("");
  }, [message, activeRoom, addMessage, user, userProfile]);

  const handleDuelEnd = useCallback((won: boolean, winnerName: string, loserName: string) => {
    addXP(won ? 300 : 80);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    addMessage(activeRoom, {
      user: "🏆 System",
      avatar: "⚔️",
      message: `🏆✨ البطل ${winnerName} فاز بالتحدي ضد ${loserName}! 🔥👏\n⚡ أسطورة الغرفة الجديدة! من يجرؤ على تحديه؟`,
      crown: true,
      gender: null,
      level: 0,
      time: timeStr,
      isSystem: true,
    });

    if (activeRoom === 0) {
      useGameStore.getState().lockWorldChallenge();
    }
  }, [addXP, addMessage, activeRoom]);

  return (
    <div className="min-h-screen pb-20 flex flex-col relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Room background image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeRoom}
            src={currentRoom.image}
            alt={currentRoom.name}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <TopBar title={t("chat")} />

        {/* Room tabs */}
        <div className={cn("flex gap-2 px-4 mb-2 overflow-x-auto pb-1", isRTL && "flex-row-reverse")}>
          {rooms.map((room, i) => {
            const locked = level < room.level;
            return (
              <button key={room.name} onClick={() => !locked && setActiveRoom(i)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all backdrop-blur-md",
                  activeRoom === i ? `bg-white/20 ${room.border} text-foreground shadow-lg` : "bg-black/30 border-white/10 text-white/70",
                  locked && "opacity-40 cursor-not-allowed"
                )}>
                {locked ? <Lock className="w-3 h-3" /> : <span className="w-2 h-2 rounded-full bg-green-400" />}
                <span>{room.name}</span>
              </button>
            );
          })}
        </div>

        {!canAccess ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
            <Lock className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              {t("reachLevel")} <span className="text-primary font-bold">{t("level")} {currentRoom.level}</span> {t("toUnlockRoom")}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col px-4">
            {/* Duel challenge - only in World room if unlocked, always in other rooms */}
            {activeRoom === 0 && !worldChallengeUnlocked ? (
              <div className="mx-auto my-3 w-full max-w-xs text-center">
                <div className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                  <Lock className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">🔒 اشترِ الكتاب لفتح التحدي أمام العالم</p>
                </div>
              </div>
            ) : (
              <ChatDuelChallenge
                playerName={user?.email?.split("@")[0] || "You"}
                playerLevel={level}
                onEnd={handleDuelEnd}
                isRTL={isRTL}
              />
            )}

            {/* Chat messages area */}
            <div className="flex-1" />
            <div className="space-y-3 mb-3 overflow-y-auto max-h-[30vh]">
              {messages.map((msg, i) => (
                <ChatMessageBubble
                  key={i}
                  msg={msg}
                  index={i}
                  isRTL={isRTL}
                  onTranslated={(translated) =>
                    updateMessageInRoom(activeRoom, i, { translated })
                  }
                />
              ))}
            </div>

            {/* Message input */}
            <div className={cn("flex items-center gap-2 mb-2", isRTL && "flex-row-reverse")}>
              <div className={cn("flex-1 flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-3 py-2 border border-white/15", isRTL && "flex-row-reverse")}>
                <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t("typeMessage")}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className={cn("flex-1 bg-transparent text-sm text-foreground placeholder:text-white/40 outline-none", isRTL && "text-right")} />
                <button onClick={sendMessage} className="text-primary hover:text-primary/80 transition-colors"><Send className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* World room challenge promo button - only show if not yet unlocked */}
      {activeRoom === 0 && canAccess && !worldChallengeUnlocked && <WorldChallengePromo />}
    </div>
  );
}
