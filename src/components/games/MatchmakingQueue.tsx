import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Clock, Zap, Crown, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface QueuePlayer {
  id: string;
  display_name: string;
  avatar_url: string | null;
  joined_at: string;
  status: string;
}

interface MatchmakingQueueProps {
  gameType: string;
  betAmount: number;
  maxPlayers: number;
  onMatchFound: (players: { name: string; isBot: boolean }[]) => void;
  onCancel: () => void;
}

const BOT_NAMES = [
  "Shadow_X", "Luna⭐", "DragonKing", "Ace♠️", "NightWolf",
  "Blaze🔥", "Crystal", "Phoenix", "StormZ", "Viper_99",
  "IceQueen❄️", "Thunder⚡", "Ninja🥷", "Cobra🐍", "StarDust",
];

export function MatchmakingQueue({ gameType, betAmount, maxPlayers, onMatchFound, onCancel }: MatchmakingQueueProps) {
  const { t, isRTL } = useTranslation();
  const { user } = useAuth();
  const [queuePlayers, setQueuePlayers] = useState<QueuePlayer[]>([]);
  const [position, setPosition] = useState(1);
  const [countdown, setCountdown] = useState(60);
  const [phase, setPhase] = useState<"joining" | "waiting" | "matched" | "starting">("joining");
  const [matchedPlayers, setMatchedPlayers] = useState<{ name: string; isBot: boolean }[]>([]);
  const queueEntryId = useRef<string | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const hasCleanedUp = useRef(false);

  // Join queue
  useEffect(() => {
    if (!user) return;

    const joinQueue = async () => {
      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("user_id", user.id)
        .single();

      // Clean up any stale entries from this user
      await supabase.from("game_queue").delete().eq("user_id", user.id);

      // Insert into queue
      const { data, error } = await supabase
        .from("game_queue")
        .insert({
          user_id: user.id,
          display_name: profile?.display_name || user.email || "Player",
          avatar_url: profile?.avatar_url,
          game_type: gameType,
          bet_amount: betAmount,
          status: "waiting",
        })
        .select()
        .single();

      if (data) {
        queueEntryId.current = data.id;
        setPhase("waiting");
      }
    };

    joinQueue();

    return () => {
      // Cleanup on unmount
      if (!hasCleanedUp.current && queueEntryId.current) {
        hasCleanedUp.current = true;
        supabase.from("game_queue").delete().eq("id", queueEntryId.current).then(() => {});
      }
    };
  }, [user, gameType, betAmount]);

  // Subscribe to queue changes
  useEffect(() => {
    const channel = supabase
      .channel("game-queue-" + gameType)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "game_queue", filter: `game_type=eq.${gameType}` },
        () => {
          fetchQueuePlayers();
        }
      )
      .subscribe();

    fetchQueuePlayers();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameType, betAmount]);

  const fetchQueuePlayers = useCallback(async () => {
    const { data } = await supabase
      .from("game_queue")
      .select("*")
      .eq("game_type", gameType)
      .eq("bet_amount", betAmount)
      .eq("status", "waiting")
      .order("joined_at", { ascending: true });

    if (data) {
      setQueuePlayers(data as QueuePlayer[]);
      // Find my position
      const myIdx = data.findIndex((p: any) => p.user_id === user?.id);
      setPosition(myIdx >= 0 ? myIdx + 1 : data.length + 1);

      // Check if enough players for a match
      if (data.length >= 2 && phase === "waiting") {
        const matchPlayers = data.slice(0, Math.min(data.length, maxPlayers));
        const isInMatch = matchPlayers.some((p: any) => p.user_id === user?.id);
        
        if (isInMatch) {
          setPhase("matched");
          setMatchedPlayers(
            matchPlayers.map((p: any) => ({
              name: p.user_id === user?.id ? t("playerYou") : p.display_name,
              isBot: false,
            }))
          );

          // Start game after animation
          setTimeout(() => {
            setPhase("starting");
            // Clean up queue entries
            matchPlayers.forEach((p: any) => {
              supabase.from("game_queue").delete().eq("id", p.id).then(() => {});
            });
            hasCleanedUp.current = true;
            setTimeout(() => {
              onMatchFound(
                matchPlayers.map((p: any) => ({
                  name: p.user_id === user?.id ? t("playerYou") : p.display_name,
                  isBot: false,
                }))
              );
            }, 1500);
          }, 2500);
        }
      }
    }
  }, [gameType, betAmount, user, phase, maxPlayers, t, onMatchFound]);

  // Countdown timer
  useEffect(() => {
    if (phase !== "waiting") return;

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Time's up — fill with bots
          if (countdownRef.current) clearInterval(countdownRef.current);
          fillWithBots();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [phase]);

  const fillWithBots = useCallback(() => {
    const realPlayers = queuePlayers.map((p) => ({
      name: p.id === queueEntryId.current ? t("playerYou") : p.display_name,
      isBot: false,
    }));

    // Fill remaining slots with bots
    const botsNeeded = Math.max(2, maxPlayers) - realPlayers.length;
    const usedNames = new Set(realPlayers.map((p) => p.name));
    const bots: { name: string; isBot: boolean }[] = [];

    for (let i = 0; i < botsNeeded; i++) {
      let name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
      while (usedNames.has(name)) {
        name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
      }
      usedNames.add(name);
      bots.push({ name, isBot: true });
    }

    const allPlayers = [...realPlayers, ...bots];
    setMatchedPlayers(allPlayers);
    setPhase("matched");

    setTimeout(() => {
      setPhase("starting");
      // Clean up queue
      if (queueEntryId.current) {
        hasCleanedUp.current = true;
        supabase.from("game_queue").delete().eq("id", queueEntryId.current).then(() => {});
      }
      setTimeout(() => onMatchFound(allPlayers), 1500);
    }, 2500);
  }, [queuePlayers, maxPlayers, t, onMatchFound]);

  const handleCancel = async () => {
    if (queueEntryId.current) {
      hasCleanedUp.current = true;
      await supabase.from("game_queue").delete().eq("id", queueEntryId.current);
    }
    onCancel();
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // Simulated queue activity (add fake players periodically for demo feel)
  const [simulatedExtra, setSimulatedExtra] = useState<{ name: string; time: string }[]>([]);
  useEffect(() => {
    if (phase !== "waiting") return;
    const addFake = () => {
      const name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
      setSimulatedExtra((prev) => {
        if (prev.length >= 4) return prev;
        if (prev.some((p) => p.name === name)) return prev;
        return [...prev, { name, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }];
      });
    };
    const t1 = setTimeout(addFake, 3000 + Math.random() * 4000);
    const t2 = setTimeout(addFake, 8000 + Math.random() * 5000);
    const t3 = setTimeout(addFake, 15000 + Math.random() * 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase]);

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={cn("flex items-center gap-3 px-4 py-3", isRTL && "flex-row-reverse")}>
        <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className={cn("w-5 h-5", isRTL && "rotate-180")} />
        </button>
        <h1 className="font-display text-lg font-bold text-gold-gradient">{t("matchmaking")}</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <AnimatePresence mode="wait">
          {/* JOINING PHASE */}
          {phase === "joining" && (
            <motion.div key="joining" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-muted-foreground text-sm">{t("joiningQueue")}</p>
            </motion.div>
          )}

          {/* WAITING PHASE */}
          {phase === "waiting" && (
            <motion.div key="waiting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm space-y-5">
              
              {/* Position card */}
              <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                className="bg-card/90 border border-primary/40 rounded-2xl p-5 text-center shadow-gold">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t("yourPosition")}</p>
                <motion.p key={position} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-display font-bold text-primary">
                  #{position}
                </motion.p>
                <p className="text-xs text-muted-foreground mt-1">{t("inQueue")}</p>
              </motion.div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-5 h-5 text-accent" />
                <div className="text-center">
                  <p className="text-2xl font-mono font-bold text-foreground">{formatTime(countdown)}</p>
                  <p className="text-[10px] text-muted-foreground">{t("estimatedWait")}</p>
                </div>
              </div>

              {/* Progress ring */}
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                  <motion.circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--primary))" strokeWidth="4"
                    strokeLinecap="round" strokeDasharray={213.6}
                    animate={{ strokeDashoffset: 213.6 * (countdown / 60) }}
                    transition={{ duration: 1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Players in queue */}
              <div className="bg-card/60 border border-border rounded-xl p-4 space-y-3">
                <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                  <p className="text-xs font-bold text-foreground">{t("playersInQueue")}</p>
                  <span className="text-xs text-primary font-mono">{queuePlayers.length + simulatedExtra.length}</span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {/* Real queue players */}
                  {queuePlayers.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={cn("flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2", isRTL && "flex-row-reverse")}>
                      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {i + 1}
                        </div>
                        <span className="text-sm text-foreground">
                          {p.id === queueEntryId.current ? `${t("playerYou")} ⭐` : p.display_name}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(p.joined_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </motion.div>
                  ))}

                  {/* Simulated extra players */}
                  {simulatedExtra.map((p, i) => (
                    <motion.div key={`sim-${p.name}`} initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}
                      className={cn("flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2", isRTL && "flex-row-reverse")}>
                      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                        <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                          {queuePlayers.length + i + 1}
                        </div>
                        <span className="text-sm text-foreground">{p.name}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{p.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bet info */}
              <div className={cn("flex items-center justify-between bg-card/60 border border-border rounded-xl px-4 py-3", isRTL && "flex-row-reverse")}>
                <span className="text-xs text-muted-foreground">{t("betAmount")}</span>
                <span className="text-sm font-bold text-primary">{betAmount} {t("points")}</span>
              </div>

              {/* Cancel button */}
              <button onClick={handleCancel}
                className="w-full py-3 rounded-xl font-bold border border-border text-foreground hover:bg-destructive/20 hover:border-destructive/50 transition-all">
                {t("leaveQueue")}
              </button>
            </motion.div>
          )}

          {/* MATCHED PHASE */}
          {(phase === "matched" || phase === "starting") && (
            <motion.div key="matched" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm space-y-6 text-center">
              
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                <Zap className="w-16 h-16 text-primary mx-auto" />
              </motion.div>

              <h2 className="font-display text-2xl text-gold-gradient">{t("matchFound")}</h2>
              <p className="text-sm text-muted-foreground">{t("getReady")}</p>

              <div className="space-y-3">
                {matchedPlayers.map((p, i) => (
                  <motion.div key={p.name} initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.3 }}
                    className={cn(
                      "flex items-center gap-3 bg-card/80 border rounded-xl px-4 py-3",
                      p.name === t("playerYou") ? "border-primary/50 shadow-gold" : "border-border",
                      isRTL && "flex-row-reverse"
                    )}>
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold",
                      p.name === t("playerYou") ? "bg-primary/20 text-primary" : p.isBot ? "bg-accent/20 text-accent" : "bg-green-accent/20 text-green-accent"
                    )}>
                      {p.isBot ? "🤖" : p.name === t("playerYou") ? "⭐" : "👤"}
                    </div>
                    <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                      <p className="text-sm font-bold text-foreground">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {p.isBot ? t("botLabel") : p.name === t("playerYou") ? t("you") : t("realPlayer")}
                      </p>
                    </div>
                    {p.name === t("playerYou") && <Crown className="w-5 h-5 text-primary" />}
                  </motion.div>
                ))}
              </div>

              {phase === "starting" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <p className="text-sm text-primary font-bold">{t("startingGame")}</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
