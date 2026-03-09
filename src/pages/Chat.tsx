import { useState, useEffect, useCallback } from "react";
import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Smile, Lock, Swords } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { useChatStore } from "@/store/useChatStore";
import { containsProfanity, censorMessage } from "@/utils/profanityFilter";
import { ChatMessageBubble, type ChatMsg } from "@/components/ChatMessageBubble";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AnimeDuelArena } from "@/components/chat/AnimeDuelArena";

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
  { name: "Bronze", level: 1, image: roomBronze, accent: "from-blue-500/60", border: "border-blue-400/50", glow: "hsl(185 100% 60%)", shape: "circle" as const },
  { name: "Silver", level: 5, image: roomSilver, accent: "from-pink-500/60", border: "border-pink-400/50", glow: "hsl(320 100% 65%)", shape: "circle" as const },
  { name: "Gold", level: 10, image: roomGold, accent: "from-purple-500/60", border: "border-purple-400/50", glow: "hsl(280 80% 65%)", shape: "diamond" as const },
  { name: "Diamond", level: 15, image: roomDiamond, accent: "from-amber-500/60", border: "border-amber-400/50", glow: "hsl(35 100% 55%)", shape: "flame" as const },
];

const mockMessages: ChatMsg[] = [
  { user: "Michael", avatar: "M", message: "Wow, this room is amazing! 🤩", crown: false, gender: "male", avatarUrl: avatarMale1 },
  { user: "Luna", avatar: "L", message: "Let's go! 🤗", crown: true, gender: "female", avatarUrl: avatarFemale1 },
  { user: "Alex", avatar: "A", message: "Good luck all! 🍀🔥", crown: false, gender: "male", avatarUrl: avatarMale3 },
];

type ChatMessage = ChatMsg;

export default function Chat() {
  const [activeRoom, setActiveRoom] = useState(0);
  const [message, setMessage] = useState("");
  const [challengeState, setChallengeState] = useState<ChallengeState>("idle");
  const [countdown, setCountdown] = useState(60);
  const [opponent, setOpponent] = useState<string | null>(null);
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<{ avatar_url: string | null; gender: string | null } | null>(null);
  const level = useGameStore((s) => s.level);
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

  // Simulate incoming messages with notification sound
  useEffect(() => {
    if (!canAccess) return;
    const fakeMessages: ChatMsg[] = [
      { user: "Sara", avatar: "S", message: "مرحبا! 👋", crown: false, gender: "female", avatarUrl: avatarFemale3 },
      { user: "Omar", avatar: "O", message: "يلا نلعب! 🎮", crown: true, gender: "male", avatarUrl: avatarMale2 },
      { user: "Noor", avatar: "N", message: "حظ سعيد للجميع 🍀", crown: false, gender: "female", avatarUrl: avatarFemale2 },
    ];
    const interval = setInterval(() => {
      const msg = fakeMessages[Math.floor(Math.random() * fakeMessages.length)];
      addMessage(activeRoom, msg);
      addUnread();
    }, 15000 + Math.random() * 10000);
    return () => clearInterval(interval);
  }, [canAccess, activeRoom, addMessage, addUnread]);

  // Waiting room countdown
  useEffect(() => {
    if (challengeState !== "waiting") return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setOpponent("Bot 🤖");
          setChallengeState("playing");
          return 60;
        }
        // Random chance opponent joins
        if (c === 50 || c === 40 || c === 30) {
          if (Math.random() > 0.6) {
            clearInterval(timer);
            setOpponent("Player_" + Math.floor(Math.random() * 999));
            setChallengeState("playing");
            return 60;
          }
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [challengeState]);

  // Start playing after 3s countdown
  useEffect(() => {
    if (challengeState !== "playing") return;
    const t = setTimeout(() => setChallengeState("pickWinner"), 1500);
    return () => clearTimeout(t);
  }, [challengeState]);

  const sendMessage = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed) return;
    const filtered = containsProfanity(trimmed) ? censorMessage(trimmed) : trimmed;
    addMessage(activeRoom, {
      user: "You",
      avatar: user?.email?.charAt(0).toUpperCase() || "Y",
      message: filtered,
      crown: false,
      avatarUrl: userProfile?.avatar_url || undefined,
      gender: (userProfile?.gender as "male" | "female" | null) || null,
    });
    setMessage("");
  }, [message, activeRoom, addMessage, user, userProfile]);

  const startChallenge = useCallback(() => {
    setChallengeState("waiting");
    setCountdown(60);
    setOpponent(null);
  }, []);

  const handleGameEnd = useCallback((won: boolean) => {
    addXP(won ? 40 : 5);
    setChallengeState("idle");
    setOpponent(null);
  }, [addXP]);

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
            {/* Challenge / Game area (top half when active) */}
            <AnimatePresence>
              {challengeState !== "idle" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-3 rounded-2xl border border-primary/30 bg-black/60 backdrop-blur-xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                    <div className="flex items-center gap-2 text-xs text-primary font-medium">
                      <Gamepad2 className="w-4 h-4" />
                      <span>تحدي 1v1</span>
                    </div>
                    <button onClick={() => { setChallengeState("idle"); setOpponent(null); }}>
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  {challengeState === "waiting" && (
                    <div className="p-6 flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-2 border-primary/50 flex items-center justify-center">
                          <Users className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {countdown}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80">بانتظار لاعب...</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Timer className="w-3 h-3" />
                        <span>بوت بيدخل بعد {countdown} ثانية</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: "100%" }}
                          animate={{ width: "0%" }}
                          transition={{ duration: 60, ease: "linear" }}
                        />
                      </div>
                    </div>
                  )}

                  {challengeState === "playing" && opponent && (
                    <div className="p-4 flex flex-col items-center gap-3">
                      <p className="text-sm text-foreground">
                        ⚔️ ضد <span className="text-primary font-bold">{opponent}</span>
                      </p>
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-muted-foreground">جاري التحضير...</p>
                    </div>
                  )}

                  {challengeState === "pickWinner" && (
                    <PickWinnerGame onEnd={handleGameEnd} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat messages area */}
            <div className="flex-1" />
            <div className="space-y-3 mb-3 overflow-y-auto max-h-[35vh]">
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

            {/* Input bar + challenge button */}
            <div className={cn("flex items-center gap-2 mb-2", isRTL && "flex-row-reverse")}>
              {/* Challenge button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={startChallenge}
                disabled={challengeState !== "idle"}
                className={cn(
                  "shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-all",
                  challengeState === "idle"
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "bg-muted/30 border-border text-muted-foreground opacity-50"
                )}
              >
                <Gamepad2 className="w-5 h-5" />
              </motion.button>

              {/* Message input */}
              <div className={cn("flex-1 flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-3 py-2 border border-white/15", isRTL && "flex-row-reverse")}>
                <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t("typeMessage")}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className={cn("flex-1 bg-transparent text-sm text-foreground placeholder:text-white/40 outline-none", isRTL && "text-right")} />
                <button className="text-primary/70 hover:text-primary transition-colors"><Smile className="w-5 h-5" /></button>
                <button onClick={sendMessage} className="text-primary hover:text-primary/80 transition-colors"><Send className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
