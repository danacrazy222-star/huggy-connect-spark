import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Trophy, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

const PLAYER_NAMES = [
  "Ryuuki", "SakuraBlade", "KenX", "NovaStar", "ZeroHero", "Akira99",
  "Luna_X", "DarkKnight", "MoonWalker", "Phoenix99", "SilverFox",
  "StormRider", "BlazeFire", "IceQueen", "ShadowHunter", "DragonZ",
];

type BoxContent = "gold" | "rare" | "trap" | "steal" | "empty" | "double";
type Phase = "searching" | "countdown" | "playing" | "results";

interface TreasureBox {
  id: number;
  content: BoxContent;
  opened: boolean;
  openedBy: number | null;
}

interface TreasurePlayer {
  name: string;
  score: number;
  isBot: boolean;
  emoji: string;
}

const BOX_CONTENTS: { type: BoxContent; weight: number; emoji: string; points: number }[] = [
  { type: "gold", weight: 35, emoji: "💰", points: 10 },
  { type: "rare", weight: 12, emoji: "💎", points: 25 },
  { type: "trap", weight: 20, emoji: "💣", points: -10 },
  { type: "steal", weight: 8, emoji: "👻", points: 0 },
  { type: "double", weight: 5, emoji: "⚡", points: 0 },
  { type: "empty", weight: 20, emoji: "💨", points: 0 },
];

const ROUND_DURATION = 30;
const GRID_SIZE = 12; // 3x4 compact grid for chat

function generateBoxContent(): BoxContent {
  const totalWeight = BOX_CONTENTS.reduce((sum, b) => sum + b.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const box of BOX_CONTENTS) {
    rand -= box.weight;
    if (rand <= 0) return box.type;
  }
  return "empty";
}

function generateGrid(): TreasureBox[] {
  return Array.from({ length: GRID_SIZE }, (_, i) => ({
    id: i,
    content: generateBoxContent(),
    opened: false,
    openedBy: null,
  }));
}

function getContentInfo(content: BoxContent) {
  return BOX_CONTENTS.find((b) => b.type === content) || BOX_CONTENTS[5];
}

interface Props {
  playerName: string;
  playerLevel: number;
  onEnd: (won: boolean, winnerName: string, loserName: string) => void;
  onStart?: () => void;
  isRTL?: boolean;
}

export function ChatTreasureRush({ playerName, playerLevel, onEnd, onStart, isRTL }: Props) {
  const { t } = useTranslation();

  const [phase, setPhase] = useState<Phase>("searching");
  const [searchTimer, setSearchTimer] = useState(40);
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [players, setPlayers] = useState<TreasurePlayer[]>([]);
  const [boxes, setBoxes] = useState<TreasureBox[]>([]);
  const [lastOpened, setLastOpened] = useState<{ content: BoxContent } | null>(null);
  const [doubleActive, setDoubleActive] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [shakeBox, setShakeBox] = useState<number | null>(null);
  const [opponentName, setOpponentName] = useState("");
  const [finalWinner, setFinalWinner] = useState<"player" | "opponent" | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const botTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Start search on mount
  useEffect(() => {
    onStart?.();
  }, []);

  // SEARCHING
  useEffect(() => {
    if (phase !== "searching") return;
    const joinDelay = (5 + Math.floor(Math.random() * 15)) * 1000;
    const timeout = setTimeout(() => {
      const name = PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)];
      setOpponentName(name);
      setPlayers([
        { name: playerName, score: 0, isBot: false, emoji: "⭐" },
        { name, score: 0, isBot: true, emoji: "🔥" },
      ]);
      setBoxes(generateGrid());
      setTimeLeft(ROUND_DURATION);
      setCountdown(3);
      setPhase("countdown");
    }, joinDelay);

    timerRef.current = setInterval(() => {
      setSearchTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timeout);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, playerName]);

  // COUNTDOWN
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) { setPhase("playing"); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown]);

  // GAME TIMER
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setPhase("results");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // Refill grid when all opened
  useEffect(() => {
    if (phase !== "playing") return;
    if (boxes.every((b) => b.opened)) {
      setTimeout(() => {
        setBoxes(generateGrid());
        setRoundNumber((r) => r + 1);
      }, 400);
    }
  }, [boxes, phase]);

  // Bot AI
  useEffect(() => {
    if (phase !== "playing") return;
    botTimerRef.current = setInterval(() => {
      const available = boxes.filter((b) => !b.opened);
      if (available.length === 0) return;
      const target = available[Math.floor(Math.random() * available.length)];
      openBox(target.id, 1);
    }, 1400 + Math.random() * 1200);
    return () => { if (botTimerRef.current) clearInterval(botTimerRef.current); };
  }, [phase, boxes]);

  const openBox = useCallback((boxId: number, playerIdx: number) => {
    setBoxes((prev) => {
      const box = prev[boxId];
      if (!box || box.opened) return prev;
      const updated = [...prev];
      updated[boxId] = { ...box, opened: true, openedBy: playerIdx };

      const info = getContentInfo(box.content);
      let pointsGained = info.points;

      if (box.content === "double") {
        setDoubleActive(true);
        setTimeout(() => setDoubleActive(false), 5000);
      } else if (doubleActive && pointsGained > 0) {
        pointsGained *= 2;
      }

      if (box.content === "steal" && players.length > 1) {
        const otherIdx = playerIdx === 0 ? 1 : 0;
        const stolen = Math.min(15, Math.max(0, players[otherIdx].score));
        setPlayers((pp) => {
          const u = [...pp];
          u[otherIdx] = { ...u[otherIdx], score: u[otherIdx].score - stolen };
          u[playerIdx] = { ...u[playerIdx], score: u[playerIdx].score + stolen };
          return u;
        });
        pointsGained = 0;
      }

      if (pointsGained !== 0 && box.content !== "steal") {
        setPlayers((pp) => {
          const u = [...pp];
          u[playerIdx] = { ...u[playerIdx], score: Math.max(0, u[playerIdx].score + pointsGained) };
          return u;
        });
      }

      if (box.content === "trap") {
        setShakeBox(boxId);
        setTimeout(() => setShakeBox(null), 500);
      }

      setLastOpened({ content: box.content });
      return updated;
    });
  }, [players, doubleActive]);

  const handlePlayerClick = (boxId: number) => {
    if (phase !== "playing") return;
    openBox(boxId, 0);
  };

  // Results
  useEffect(() => {
    if (phase !== "results") return;
    const p = players[0];
    const o = players[1];
    if (!p || !o) return;
    setFinalWinner(p.score >= o.score ? "player" : "opponent");
  }, [phase, players]);

  const handleFinish = () => {
    const won = finalWinner === "player";
    onEnd(won, won ? playerName : opponentName, won ? opponentName : playerName);
  };

  // ══════ SEARCHING ══════
  if (phase === "searching") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="mx-auto my-3 w-full max-w-xs">
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-card via-background to-card p-4 text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <Search className="w-7 h-7 text-primary mx-auto mb-2" />
          </motion.div>
          <p className="text-sm font-bold text-foreground mb-1">{t("treasureRush")} 🏴‍☠️</p>
          <p className="text-xs text-muted-foreground mb-3">{t("duelSearching")}</p>
          <div className="relative w-16 h-16 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" opacity={0.3} />
              <motion.circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
                strokeDasharray={176} strokeDashoffset={176 * (1 - searchTimer / 40)} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-primary">{searchTimer}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // ══════ COUNTDOWN ══════
  if (phase === "countdown") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto my-3 w-full max-w-xs">
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-card via-background to-card p-6 text-center">
          <div className="flex items-center justify-center gap-6 mb-3">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold">{playerName.charAt(0)}</div>
              <span className="text-[10px] text-foreground font-bold">{playerName}</span>
            </div>
            <span className="text-2xl font-black text-gold-gradient">VS</span>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-accent/20 flex items-center justify-center text-lg font-bold">{opponentName.charAt(0)}</div>
              <span className="text-[10px] text-foreground font-bold">{opponentName}</span>
            </div>
          </div>
          <motion.span key={countdown} initial={{ scale: 3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-display font-bold text-primary">
            {countdown > 0 ? countdown : "GO!"}
          </motion.span>
        </div>
      </motion.div>
    );
  }

  // ══════ PLAYING ══════
  if (phase === "playing") {
    const timerPct = (timeLeft / ROUND_DURATION) * 100;
    const timerColor = timeLeft <= 10 ? "text-destructive" : timeLeft <= 15 ? "text-primary" : "text-green-accent";

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto my-3 w-full max-w-xs">
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-card via-background to-card overflow-hidden">
          {/* Header */}
          <div className="px-3 pt-2 pb-1">
            <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
              <div className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
                <span className="text-xs">⭐</span>
                <span className="text-xs font-bold text-foreground">{players[0]?.name}</span>
                <span className="text-xs font-mono text-primary font-bold">{players[0]?.score}</span>
              </div>
              <motion.span key={timeLeft} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
                className={cn("text-lg font-mono font-bold", timerColor)}>
                {timeLeft}s
              </motion.span>
              <div className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
                <span className="text-xs font-mono text-accent font-bold">{players[1]?.score}</span>
                <span className="text-xs font-bold text-foreground">{players[1]?.name}</span>
                <span className="text-xs">🔥</span>
              </div>
            </div>
            {/* Timer bar */}
            <div className="relative h-1 bg-muted/30 rounded-full mt-1.5 overflow-hidden">
              <motion.div animate={{ width: `${timerPct}%` }} transition={{ duration: 0.5 }}
                className={cn("h-full rounded-full", timeLeft <= 10 ? "bg-destructive" : timeLeft <= 15 ? "bg-primary" : "bg-green-accent")} />
            </div>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {lastOpened && (
              <motion.div key={Date.now()} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="px-3 py-1">
                <div className={cn("text-center text-[10px] py-1 rounded-lg",
                  lastOpened.content === "trap" ? "bg-destructive/20 text-destructive" :
                  lastOpened.content === "rare" ? "bg-primary/20 text-primary" :
                  lastOpened.content === "gold" ? "bg-primary/10 text-primary" :
                  "bg-muted/20 text-muted-foreground"
                )}>
                  {getContentInfo(lastOpened.content).emoji}{" "}
                  {lastOpened.content === "gold" && `+10`}
                  {lastOpened.content === "rare" && `+25`}
                  {lastOpened.content === "trap" && `-10`}
                  {lastOpened.content === "steal" && `👻`}
                  {lastOpened.content === "double" && `⚡x2`}
                  {lastOpened.content === "empty" && `💨`}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid 3x4 */}
          <div className="px-3 pb-3">
            <div className="grid grid-cols-4 gap-1.5">
              {boxes.map((box) => {
                const info = getContentInfo(box.content);
                return (
                  <motion.button
                    key={`${roundNumber}-${box.id}`}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: 1,
                      x: shakeBox === box.id ? [0, -4, 4, -4, 0] : 0,
                    }}
                    transition={{ delay: box.id * 0.02, duration: 0.2 }}
                    whileTap={!box.opened ? { scale: 0.9 } : undefined}
                    onClick={() => !box.opened && handlePlayerClick(box.id)}
                    disabled={box.opened}
                    className={cn(
                      "aspect-square rounded-lg border flex items-center justify-center text-lg transition-all relative",
                      box.opened
                        ? box.content === "trap"
                          ? "bg-destructive/10 border-destructive/30"
                          : box.content === "rare"
                          ? "bg-primary/15 border-primary/40"
                          : box.content === "steal"
                          ? "bg-accent/10 border-accent/30"
                          : box.content === "gold"
                          ? "bg-primary/10 border-primary/30"
                          : "bg-muted/10 border-border/30"
                        : "bg-card/80 border-primary/20 hover:border-primary/50 cursor-pointer"
                    )}
                  >
                    {box.opened ? (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                        {info.emoji}
                      </motion.span>
                    ) : (
                      <span>📦</span>
                    )}
                    {box.opened && box.openedBy !== null && (
                      <span className="absolute bottom-0 right-0.5 text-[7px]">
                        {box.openedBy === 0 ? "⭐" : "🔥"}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
            <div className="text-center mt-1">
              <span className="text-[9px] text-muted-foreground">{t("treasureRound")} {roundNumber}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ══════ RESULTS ══════
  const p = players[0];
  const o = players[1];
  const won = finalWinner === "player";

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="mx-auto my-3 w-full max-w-xs">
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-card via-background to-card p-4 text-center space-y-3">
        <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-5xl block">
          {won ? "🏆" : "⚔️"}
        </motion.span>
        <p className="font-display text-lg text-gold-gradient font-bold">
          {won ? t("treasureYouWon") : t("treasureGameOver")}
        </p>

        <div className="flex items-center justify-center gap-4">
          <div className={cn("flex flex-col items-center gap-1", won && "text-primary")}>
            <span className="text-xl font-bold">{p?.score || 0}</span>
            <span className="text-[10px] font-bold">{playerName}</span>
          </div>
          <span className="text-muted-foreground text-xs">vs</span>
          <div className={cn("flex flex-col items-center gap-1", !won && "text-accent")}>
            <span className="text-xl font-bold">{o?.score || 0}</span>
            <span className="text-[10px] font-bold">{opponentName}</span>
          </div>
        </div>

        <button onClick={handleFinish}
          className="w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold hover:brightness-110 transition-all">
          {t("continue")}
        </button>
      </div>
    </motion.div>
  );
}
