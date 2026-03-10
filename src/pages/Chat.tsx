import { useState, useEffect, useCallback, useRef } from "react";
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
import { XPRainEvent } from "@/components/chat/XPRainEvent";
import { useChatRealtime } from "@/hooks/useChatRealtime";
import { playChatSend } from "@/utils/sounds";

import roomWorld from "@/assets/room-world.jpg";
import roomBronze from "@/assets/room-bronze.jpg";
import roomSilver from "@/assets/room-silver.jpg";
import roomGold from "@/assets/room-gold.jpg";
import roomDiamond from "@/assets/room-diamond.jpg";
import roomLegendary from "@/assets/room-legendary.jpg";

import avatarMale1 from "@/assets/avatar-male-1.png";
import avatarMale2 from "@/assets/avatar-male-2.png";
import avatarFemale1 from "@/assets/avatar-female-1.png";
import avatarFemale2 from "@/assets/avatar-female-2.png";
import avatarFemale3 from "@/assets/avatar-female-3.png";

// Bot conversation scripts - each room has bots chatting about the app
const botScripts: Record<number, ChatMsg[]> = {
  0: [ // World
    { user: "Luna", avatar: "L", message: "Welcome everyone! 🌍✨ This is the World Room — open for all levels!", crown: true, gender: "female", avatarUrl: avatarFemale1, level: 7 },
    { user: "Omar", avatar: "O", message: "If you're new here — spin the wheel daily on the Home page for free rewards! 🎰", crown: false, gender: "male", avatarUrl: avatarMale2, level: 12 },
    { user: "Sara", avatar: "S", message: "You get XP, points, tickets, and even draw entries from the spin! 🎁", crown: false, gender: "female", avatarUrl: avatarFemale3, level: 15 },
    { user: "Luna", avatar: "L", message: "Don't forget to check the Shop — buy a book pack and enter the $500 gift card draw! 💳", crown: true, gender: "female", avatarUrl: avatarFemale1, level: 7 },
    { user: "Omar", avatar: "O", message: "The Draw page shows the prizes — Amazon, Google Play, or SHEIN gift cards! 🎉", crown: false, gender: "male", avatarUrl: avatarMale2, level: 12 },
    { user: "Noor", avatar: "N", message: "I love the Tarot feature! Madam Zara reads your cards with AI 🔮✨", crown: false, gender: "female", avatarUrl: avatarFemale2, level: 8 },
    { user: "Sara", avatar: "S", message: "Level up to unlock VIP rooms — Bronze at Lv.1, Silver at Lv.9, Gold at Lv.17! 👑", crown: false, gender: "female", avatarUrl: avatarFemale3, level: 15 },
    { user: "Omar", avatar: "O", message: "Challenge other players in the duel games to earn XP fast! ⚔️💪", crown: true, gender: "male", avatarUrl: avatarMale2, level: 12 },
    { user: "Luna", avatar: "L", message: "Who's here? Say hi! 👋 The more the merrier! 🎊", crown: true, gender: "female", avatarUrl: avatarFemale1, level: 7 },
    { user: "Noor", avatar: "N", message: "Pro tip: the Premium book pack gives you the most XP + tarot tickets! 📚✨", crown: false, gender: "female", avatarUrl: avatarFemale2, level: 8 },
  ],
  1: [ // Bronze (Lv 1-8)
    { user: "Luna", avatar: "L", message: "Welcome to Bronze! 🥉🔥 You made it to Level 1!", crown: true, gender: "female", avatarUrl: avatarFemale1, level: 6 },
    { user: "Omar", avatar: "O", message: "In this room we get XP Rain events every hour — tap fast to collect! ⚡", crown: false, gender: "male", avatarUrl: avatarMale2, level: 5 },
    { user: "Noor", avatar: "N", message: "XP Rain is so fun! Last time I got 27 XP in 10 seconds! 🎉", crown: false, gender: "female", avatarUrl: avatarFemale2, level: 3 },
    { user: "Sara", avatar: "S", message: "Keep spinning daily and buying books to level up faster! 📈", crown: false, gender: "female", avatarUrl: avatarFemale3, level: 7 },
    { user: "Luna", avatar: "L", message: "The duel challenge above ☝️ — tap it and compete for XP! ⚔️", crown: true, gender: "female", avatarUrl: avatarFemale1, level: 6 },
    { user: "Omar", avatar: "O", message: "Winner gets 300 XP, loser gets 80 XP — always worth playing! 💪", crown: true, gender: "male", avatarUrl: avatarMale2, level: 5 },
    { user: "Noor", avatar: "N", message: "Reach Level 9 to unlock Silver room! 🥈✨", crown: false, gender: "female", avatarUrl: avatarFemale2, level: 3 },
    { user: "Sara", avatar: "S", message: "Who wants to duel? Let's go! 🔥🎮", crown: false, gender: "female", avatarUrl: avatarFemale3, level: 7 },
  ],
  2: [ // Silver (Lv 9-16)
    { user: "Sara", avatar: "S", message: "Silver squad! 🥈✨ Level 9+ only!", crown: false, gender: "female", avatarUrl: avatarFemale3, level: 14 },
    { user: "Luna", avatar: "L", message: "This room is getting more exclusive! Keep grinding XP! 🔥", crown: true, gender: "female", avatarUrl: avatarFemale1, level: 11 },
    { user: "Omar", avatar: "O", message: "Check your VIP page to see your progress to Gold! 👑", crown: true, gender: "male", avatarUrl: avatarMale2, level: 15 },
    { user: "Noor", avatar: "N", message: "The Crown page shows all VIP perks and mystery chests! 🎁", crown: false, gender: "female", avatarUrl: avatarFemale2, level: 12 },
  ],
  3: [ // Gold (Lv 17-24)
    { user: "Omar", avatar: "O", message: "Gold room! 🥇 Only the strong reach Level 17! 👑", crown: true, gender: "male", avatarUrl: avatarMale2, level: 22 },
    { user: "Sara", avatar: "S", message: "The XP rewards get bigger in higher rooms! 💎", crown: false, gender: "female", avatarUrl: avatarFemale3, level: 19 },
    { user: "Luna", avatar: "L", message: "Diamond room at Level 25 is the next big goal! 💎🔥", crown: true, gender: "female", avatarUrl: avatarFemale1, level: 21 },
  ],
  4: [ // Diamond (Lv 25-32)
    { user: "Sara", avatar: "S", message: "Diamond room! 💎👑 Level 25+ elite club!", crown: true, gender: "female", avatarUrl: avatarFemale3, level: 30 },
    { user: "Omar", avatar: "O", message: "You're at the top! The best rewards and events happen here! 🏆✨", crown: true, gender: "male", avatarUrl: avatarMale2, level: 28 },
    { user: "Luna", avatar: "L", message: "Legend room at Level 33 is the ULTIMATE goal! 🔥👑", crown: true, gender: "female", avatarUrl: avatarFemale1, level: 27 },
    { user: "Noor", avatar: "N", message: "Diamond players get the best mystery chest drops! 🎁💎", crown: false, gender: "female", avatarUrl: avatarFemale2, level: 26 },
  ],
  5: [ // Legend (Lv 33-40)
    { user: "Sara", avatar: "S", message: "🔥 Legend room! Only true champions reach Level 33! 👑🏆", crown: true, gender: "female", avatarUrl: avatarFemale3, level: 38 },
    { user: "Omar", avatar: "O", message: "Welcome to the hall of legends! The rewards here are INSANE! 💎⚡", crown: true, gender: "male", avatarUrl: avatarMale2, level: 36 },
    { user: "Luna", avatar: "L", message: "This is where the elite gather — XP Rain drops are HUGE here! 🌧️🔥", crown: true, gender: "female", avatarUrl: avatarFemale1, level: 35 },
    { user: "Noor", avatar: "N", message: "I grinded for months to get here — totally worth it! 💪✨", crown: false, gender: "female", avatarUrl: avatarFemale2, level: 34 },
    { user: "Sara", avatar: "S", message: "Legend players are the kings of Winline! 👑🔥", crown: true, gender: "female", avatarUrl: avatarFemale3, level: 40 },
    { user: "Omar", avatar: "O", message: "Level 40 is the ultimate achievement! We made it! 🏅🔥", crown: true, gender: "male", avatarUrl: avatarMale2, level: 40 },
  ],
};

const rooms = [
  { name: "🌍 World", level: 0, image: roomWorld, accent: "from-emerald-500/60", border: "border-emerald-400/50", glow: "hsl(160 80% 50%)", shape: "circle" as const },
  { name: "🥉 Bronze", level: 1, image: roomBronze, accent: "from-blue-500/60", border: "border-blue-400/50", glow: "hsl(185 100% 60%)", shape: "circle" as const },
  { name: "🥈 Silver", level: 9, image: roomSilver, accent: "from-pink-500/60", border: "border-pink-400/50", glow: "hsl(320 100% 65%)", shape: "circle" as const },
  { name: "🥇 Gold", level: 17, image: roomGold, accent: "from-purple-500/60", border: "border-purple-400/50", glow: "hsl(280 80% 65%)", shape: "diamond" as const },
  { name: "💎 Diamond", level: 25, image: roomDiamond, accent: "from-amber-500/60", border: "border-amber-400/50", glow: "hsl(35 100% 55%)", shape: "flame" as const },
  { name: "🔥 Legend", level: 33, image: roomLegendary, accent: "from-red-500/60", border: "border-red-400/50", glow: "hsl(0 100% 55%)", shape: "flame" as const },
];

export default function Chat() {
  const [activeRoom, setActiveRoom] = useState(0);
  const [message, setMessage] = useState("");
  const [worldChallengeSessionActive, setWorldChallengeSessionActive] = useState(false);
  const [xpRainActive, setXpRainActive] = useState(false);
  const [xpRainCountdown, setXpRainCountdown] = useState(false);
  const [duelActive, setDuelActive] = useState(false);
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<{ display_name: string | null; avatar_url: string | null; gender: string | null } | null>(null);
  const level = useGameStore((s) => s.level);
  const worldChallengeUnlocked = useGameStore((s) => s.worldChallengeUnlocked);
  const addXP = useGameStore((s) => s.addXP);
  const { t, isRTL } = useTranslation();
  const { clearUnread } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [botMessages, setBotMessages] = useState<ChatMsg[]>([]);
  const [announcements, setAnnouncements] = useState<(ChatMsg & { roomId: number })[]>([]);
  const botIndexRef = useRef(0);

  const { messages: realtimeMessages, sendMessage: sendRealtimeMessage } = useChatRealtime(activeRoom);

  const currentRoom = rooms[activeRoom];
  const canAccess = level >= currentRoom.level;

  // Fetch user profile
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, avatar_url, gender")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => { if (data) setUserProfile(data as any); });
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [realtimeMessages, botMessages, announcements]);

  // Clear unread when entering
  useEffect(() => { clearUnread(); }, [clearUnread]);

  // Bot simulation — posts a message every 6-12 seconds
  useEffect(() => {
    if (!canAccess) return;
    const scripts = botScripts[activeRoom] || botScripts[0];
    // Reset bot messages when switching rooms
    setBotMessages([]);
    botIndexRef.current = 0;

    // Post first 2 messages immediately
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const initial = scripts.slice(0, 2).map(m => ({ ...m, time: timeStr }));
    setBotMessages(initial);
    botIndexRef.current = 2;

    const interval = setInterval(() => {
      const idx = botIndexRef.current % scripts.length;
      const t = new Date();
      const ts = `${t.getHours().toString().padStart(2, "0")}:${t.getMinutes().toString().padStart(2, "0")}`;
      setBotMessages(prev => [...prev.slice(-20), { ...scripts[idx], time: ts }]);
      botIndexRef.current++;
    }, 6000 + Math.random() * 6000);

    return () => clearInterval(interval);
  }, [activeRoom, canAccess]);

  // XP Rain event - triggers every hour in ALL rooms, synced to clock
  useEffect(() => {
    if (!canAccess) return;
    const triggerRain = () => {
      if (duelActive) return;
      setXpRainCountdown(true);
      setTimeout(() => {
        setXpRainCountdown(false);
        setXpRainActive(true);
      }, 3000);
    };
    // Calculate ms until next full hour
    const now = new Date();
    const msUntilNextHour = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();
    const initialTimeout = setTimeout(() => {
      triggerRain();
      // Then every 60 minutes
      const interval = setInterval(triggerRain, 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, msUntilNextHour);
    return () => clearTimeout(initialTimeout);
  }, [canAccess, duelActive]);

  const handleXPRainEnd = useCallback((collected: number) => {
    setXpRainActive(false);
    const userName = userProfile?.display_name || user?.email?.split("@")[0] || "Player";
    // Send system-like announcement as a real message
    if (user) {
      sendRealtimeMessage(
        `🎉 ${userName} ${t("xpRainAnnounce")} ${collected} XP! ⚡`,
        {
          display_name: "⚡ System",
          avatar_url: null,
          gender: null,
          level: 0,
        }
      );
    }
  }, [sendRealtimeMessage, user, userProfile, t]);

  const handleSendMessage = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed || !user) return;
    const filtered = containsProfanity(trimmed) ? censorMessage(trimmed) : trimmed;
    const displayName = userProfile?.display_name || user.email?.split("@")[0] || "Player";
    sendRealtimeMessage(filtered, {
      display_name: displayName,
      avatar_url: userProfile?.avatar_url,
      gender: userProfile?.gender,
      level,
    });
    playChatSend();
    setMessage("");
  }, [message, user, userProfile, level, sendRealtimeMessage]);

  const handleWorldChallengeStart = useCallback(() => {
    setDuelActive(true);
    if (activeRoom === 0) {
      useGameStore.getState().lockWorldChallenge();
      setWorldChallengeSessionActive(true);
    }
  }, [activeRoom]);

  const handleDuelEnd = useCallback((won: boolean, winnerName: string, loserName: string) => {
    setDuelActive(false);
    addXP(won ? 300 : 80);
    // Local styled announcement — no System account
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setAnnouncements(prev => [...prev, {
      user: "",
      avatar: "",
      message: `🏆✨ ${t("systemChampion")} ${winnerName} ${t("systemWhoChallenge")} ${loserName}! 🔥👏\n⚡ ${t("systemNewLegend")}`,
      crown: false,
      isSystem: true,
      time: timeStr,
      roomId: activeRoom,
    }]);
    if (activeRoom === 0) {
      setWorldChallengeSessionActive(false);
      useGameStore.getState().lockWorldChallenge();
    }
  }, [addXP, activeRoom, t]);

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
            {/* World challenge promo — only in World room, only if not yet unlocked */}
            {activeRoom === 0 && !worldChallengeUnlocked && (
              <WorldChallengePromo />
            )}
            {/* Duel challenge — in World room only if unlocked, in other rooms always */}
            {(activeRoom !== 0 || worldChallengeUnlocked) && (
            <ChatDuelChallenge
              playerName={userProfile?.display_name || user?.email?.split("@")[0] || "You"}
              playerLevel={level}
              roomId={activeRoom}
              onEnd={handleDuelEnd}
              onStart={handleWorldChallengeStart}
              isRTL={isRTL}
            />

            {/* Chat messages */}
            <div className="flex-1 min-h-0" />
            <div className="space-y-3 mb-3 overflow-y-auto max-h-[50vh]">
              {!user && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">{t("loginToChat") || "Login to chat with others"}</p>
                </div>
              )}
              {/* Bot messages — always show */}
              {botMessages.map((msg, i) => (
                <ChatMessageBubble key={`bot-${i}`} msg={msg} index={i} isRTL={isRTL} />
              ))}
              {realtimeMessages.map((msg, i) => (
                <ChatMessageBubble key={(msg as any)._id || i} msg={msg} index={i} isRTL={isRTL} currentUserId={user?.id} />
              ))}
              {announcements.filter(a => a.roomId === 0 || a.roomId === activeRoom).map((msg, i) => (
                <ChatMessageBubble key={`announce-${i}`} msg={msg} index={0} isRTL={isRTL} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            {user ? (
              <div className={cn("flex items-center gap-2 mb-2", isRTL && "flex-row-reverse")}>
                <div className={cn("flex-1 flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-3 py-2 border border-white/15", isRTL && "flex-row-reverse")}>
                  <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t("typeMessage")}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className={cn("flex-1 bg-transparent text-sm text-foreground placeholder:text-white/40 outline-none", isRTL && "text-right")} />
                  <button onClick={handleSendMessage} className="text-primary hover:text-primary/80 transition-colors"><Send className="w-5 h-5" /></button>
                </div>
              </div>
            ) : (
              <div className="text-center mb-2 py-2">
                <button onClick={() => window.location.href = "/auth"} className="text-sm text-primary underline">
                  {t("loginToChat") || "Login to chat"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* XP Rain overlay */}
      {xpRainActive && <XPRainEvent onEnd={handleXPRainEnd} />}

      {/* Countdown overlay */}
      {xpRainCountdown && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center space-y-2 animate-pulse">
            <span className="text-5xl">⚡</span>
            <p className="text-primary font-display text-2xl">{t("xpRainTitle")}</p>
            <p className="text-foreground text-sm">3...</p>
          </div>
        </div>
      )}
    </div>
  );
}
