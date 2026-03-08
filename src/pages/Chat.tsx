import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import { Send, Smile, Lock, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

const rooms = [
  { name: "Bronze", level: 1, color: "from-amber-700/40 to-amber-900/20", borderColor: "border-amber-600/50", icon: "🔮", bgAccent: "bg-blue-accent/10" },
  { name: "Silver", level: 5, color: "from-slate-400/30 to-slate-600/20", borderColor: "border-slate-400/50", icon: "🔮", bgAccent: "bg-purple-glow/10" },
  { name: "Gold", level: 10, color: "from-primary/30 to-gold-dark/20", borderColor: "border-primary/50", icon: "💎", bgAccent: "bg-accent/10" },
  { name: "Diamond", level: 15, color: "from-purple-glow/30 to-accent/20", borderColor: "border-accent/50", icon: "🔥", bgAccent: "bg-primary/10" },
];

const mockMessages = [
  { user: "Michael", avatar: "M", message: "Wow, this room is amazing! 🤩", crown: false },
  { user: "Luna", avatar: "L", message: "Let's go! 🤗", crown: true },
  { user: "Alex", avatar: "A", message: "Good luck all! 🍀🔥", crown: false },
];

export default function Chat() {
  const [activeRoom, setActiveRoom] = useState(0);
  const [message, setMessage] = useState("");
  const level = useGameStore((s) => s.level);
  const { t, isRTL } = useTranslation();

  const currentRoom = rooms[activeRoom];
  const canAccess = level >= currentRoom.level;

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20 flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title={t("chat")} />

      <div className={cn("flex gap-2 px-4 mb-3 overflow-x-auto pb-1", isRTL && "flex-row-reverse")}>
        {rooms.map((room, i) => {
          const locked = level < room.level;
          return (
            <button key={room.name} onClick={() => setActiveRoom(i)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium whitespace-nowrap transition-all",
                activeRoom === i ? `bg-gradient-to-r ${room.color} ${room.borderColor} text-foreground` : "bg-muted/30 border-border text-muted-foreground",
                locked && "opacity-60"
              )}>
              {locked ? <Lock className="w-3 h-3" /> : <span>{room.icon}</span>}
              <span>{room.name}</span>
              <span className="text-[10px] text-muted-foreground">Lv.{room.level}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 px-4">
        {!canAccess ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Lock className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              {t("reachLevel")} <span className="text-primary font-bold">{t("level")} {currentRoom.level}</span> {t("toUnlockRoom")}
            </p>
            <p className="text-xs text-muted-foreground">{t("yourCurrentLevel")}: {level}</p>
          </div>
        ) : (
          <div className={`rounded-2xl border ${currentRoom.borderColor} ${currentRoom.bgAccent} p-4 min-h-[300px] flex flex-col`}>
            <div className="text-center mb-4">
              <span className="text-4xl">{currentRoom.icon}</span>
              <p className="text-sm text-muted-foreground mt-1">{currentRoom.name} {t("room")}</p>
            </div>
            <div className="flex-1 space-y-3 mb-4">
              {mockMessages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                  className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground">{msg.avatar}</div>
                  <div className={isRTL ? "text-right" : ""}>
                    <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                      <span className="text-sm font-medium text-foreground">{msg.user}</span>
                      {msg.crown && <Crown className="w-3 h-3 text-primary" />}
                    </div>
                    <p className="text-sm text-foreground/80">{msg.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className={cn("flex items-center gap-2 bg-muted/50 rounded-full px-3 py-2", isRTL && "flex-row-reverse")}>
              <button className="text-muted-foreground"><Lock className="w-4 h-4" /></button>
              <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t("typeMessage")}
                className={cn("flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none", isRTL && "text-right")} />
              <button className="text-primary"><Smile className="w-5 h-5" /></button>
              <button className="text-primary"><Send className="w-5 h-5" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
