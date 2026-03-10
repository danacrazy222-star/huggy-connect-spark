import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Ticket, Trophy, Zap, Clock, Users, Timer, Shield, Eye, Bomb, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { MatchmakingQueue } from "@/components/games/MatchmakingQueue";

type BoxContent = "gold" | "rare" | "trap" | "steal" | "empty" | "double";
type GameMode = "solo" | "multiplayer";
type Phase = "lobby" | "searching" | "countdown" | "playing" | "results";

interface TreasureBox {
  id: number;
  content: BoxContent;
  opened: boolean;
  openedBy: number | null; // player index
}

interface TreasurePlayer {
  name: string;
  score: number;
  isBot: boolean;
  color: string;
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

const PLAYER_COLORS = ["text-primary", "text-accent", "text-green-accent", "text-blue-accent"];
const PLAYER_BG = ["bg-primary/20", "bg-accent/20", "bg-green-accent/20", "bg-blue-accent/20"];
const PLAYER_EMOJIS = ["⭐", "🔥", "🌙", "⚡"];

const GRID_ROWS = 4;
const GRID_COLS = 4;
const TOTAL_BOXES = GRID_ROWS * GRID_COLS;
const ROUND_DURATION = 40;

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
  return Array.from({ length: TOTAL_BOXES }, (_, i) => ({
    id: i,
    content: generateBoxContent(),
    opened: false,
    openedBy: null,
  }));
}

function getContentInfo(content: BoxContent) {
  return BOX_CONTENTS.find((b) => b.type === content) || BOX_CONTENTS[5];
}

export function TreasureRush({ onBack }: { onBack: () => void }) {
  const { gameTickets, addGameTicket, addXP } = useGameStore();
  const { t, isRTL } = useTranslation();
  const { user } = useAuth();

  const [phase, setPhase] = useState<Phase>("lobby");
  const [mode, setMode] = useState<GameMode>("solo");
  const [players, setPlayers] = useState<TreasurePlayer[]>([]);
  const [boxes, setBoxes] = useState<TreasureBox[]>([]);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [countdown, setCountdown] = useState(3);
  const [lastOpened, setLastOpened] = useState<{ box: TreasureBox; content: BoxContent; playerIdx: number } | null>(null);
  const [doubleActive, setDoubleActive] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [shakeBox, setShakeBox] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const botTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Start game
  const startGame = useCallback((gameMode: GameMode, matchedPlayers?: { name: string; isBot: boolean }[]) => {
    if (gameTickets <= 0) return;
    addGameTicket(-1);

    let gamePlayers: TreasurePlayer[];
    if (gameMode === "solo") {
      gamePlayers = [{ name: t("playerYou"), score: 0, isBot: false, color: PLAYER_COLORS[0], emoji: PLAYER_EMOJIS[0] }];
    } else if (matchedPlayers) {
      gamePlayers = matchedPlayers.map((p, i) => ({
        name: p.name,
        score: 0,
        isBot: p.isBot,
        color: PLAYER_COLORS[i] || PLAYER_COLORS[0],
        emoji: PLAYER_EMOJIS[i] || PLAYER_EMOJIS[0],
      }));
    } else {
      gamePlayers = [
        { name: t("playerYou"), score: 0, isBot: false, color: PLAYER_COLORS[0], emoji: PLAYER_EMOJIS[0] },
        { name: "Shadow_X", score: 0, isBot: true, color: PLAYER_COLORS[1], emoji: PLAYER_EMOJIS[1] },
      ];
    }

    setPlayers(gamePlayers);
    setBoxes(generateGrid());
    setTimeLeft(ROUND_DURATION);
    setCountdown(3);
    setLastOpened(null);
    setDoubleActive(false);
    setMode(gameMode);
    setPhase("countdown");
  }, [gameTickets, addGameTicket, t]);

  // Countdown before round
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setPhase("playing");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown]);

  // Game timer
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("results");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // Check if all boxes opened → refill grid
  useEffect(() => {
    if (phase !== "playing") return;
    const allOpened = boxes.every((b) => b.opened);
    if (allOpened) {
      setTimeout(() => {
        setBoxes(generateGrid());
        setRoundNumber((r) => r + 1);
      }, 500);
    }
  }, [boxes, phase]);

  // Bot AI — bots open boxes randomly
  useEffect(() => {
    if (phase !== "playing") return;
    const bots = players.filter((p) => p.isBot);
    if (bots.length === 0) return;

    const botAction = () => {
      const unopened = boxes.filter((b) => !b.opened);
      if (unopened.length === 0) return;

      bots.forEach((bot) => {
        const botIdx = players.indexOf(bot);
        const available = boxes.filter((b) => !b.opened);
        if (available.length === 0) return;
        const target = available[Math.floor(Math.random() * available.length)];
        openBox(target.id, botIdx);
      });
    };

    botTimerRef.current = setInterval(botAction, 1200 + Math.random() * 1500);
    return () => { if (botTimerRef.current) clearInterval(botTimerRef.current); };
  }, [phase, players, boxes]);

  // Open a box
  const openBox = useCallback((boxId: number, playerIdx: number) => {
    setBoxes((prev) => {
      const box = prev[boxId];
      if (!box || box.opened) return prev;

      const updated = [...prev];
      updated[boxId] = { ...box, opened: true, openedBy: playerIdx };

      const info = getContentInfo(box.content);
      let pointsGained = info.points;

      // Apply double if active
      if (box.content === "double") {
        setDoubleActive(true);
        setTimeout(() => setDoubleActive(false), 5000);
      } else {
        if (doubleActive && pointsGained > 0) {
          pointsGained *= 2;
        }
      }

      // Handle steal
      if (box.content === "steal" && players.length > 1) {
        const otherPlayers = players.filter((_, i) => i !== playerIdx && !players[i].isBot);
        const victims = otherPlayers.length > 0 ? otherPlayers : players.filter((_, i) => i !== playerIdx);
        if (victims.length > 0) {
          const victimIdx = players.indexOf(victims[Math.floor(Math.random() * victims.length)]);
          const stolen = Math.min(15, Math.max(0, players[victimIdx].score));
          setPlayers((pp) => {
            const u = [...pp];
            u[victimIdx] = { ...u[victimIdx], score: u[victimIdx].score - stolen };
            u[playerIdx] = { ...u[playerIdx], score: u[playerIdx].score + stolen };
            return u;
          });
          pointsGained = 0; // Already handled
        }
      }

      if (pointsGained !== 0 && box.content !== "steal") {
        setPlayers((pp) => {
          const u = [...pp];
          u[playerIdx] = { ...u[playerIdx], score: Math.max(0, u[playerIdx].score + pointsGained) };
          return u;
        });
      }

      // Shake animation for traps
      if (box.content === "trap") {
        setShakeBox(boxId);
        setTimeout(() => setShakeBox(null), 500);
      }

      setLastOpened({ box: updated[boxId], content: box.content, playerIdx });
      return updated;
    });
  }, [players, doubleActive]);

  const handlePlayerClick = (boxId: number) => {
    if (phase !== "playing") return;
    const playerIdx = players.findIndex((p) => !p.isBot);
    if (playerIdx < 0) return;
    openBox(boxId, playerIdx);
  };

  // Match found from queue
  const handleMatchFound = useCallback((matchedPlayers: { name: string; isBot: boolean }[]) => {
    const gamePlayers: TreasurePlayer[] = matchedPlayers.map((p, i) => ({
      name: p.name,
      score: 0,
      isBot: p.isBot,
      color: PLAYER_COLORS[i] || PLAYER_COLORS[0],
      emoji: PLAYER_EMOJIS[i] || PLAYER_EMOJIS[0],
    }));
    setPlayers(gamePlayers);
    setBoxes(generateGrid());
    setTimeLeft(ROUND_DURATION);
    setCountdown(3);
    setLastOpened(null);
    setDoubleActive(false);
    setMode("multiplayer");
    setPhase("countdown");
  }, []);

  // Award XP at end
  useEffect(() => {
    if (phase !== "results") return;
    const humanPlayer = players.find((p) => !p.isBot);
    if (!humanPlayer) return;
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const rank = sorted.indexOf(humanPlayer);
    const xpReward = rank === 0 ? 200 : rank === 1 ? 100 : 50;
    addXP(xpReward);
  }, [phase]);

  // ============ LOBBY ============
  if (phase === "lobby") {
    return (
      <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
        <div className={cn("flex items-center gap-3 px-4 py-3", isRTL && "flex-row-reverse")}>
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className={cn("w-5 h-5", isRTL && "rotate-180")} />
          </button>
          <h1 className="font-display text-lg font-bold text-gold-gradient">{t("treasureRush")}</h1>
        </div>

        <div className="px-4 space-y-5">
          {/* Hero */}
          <div className="text-center py-5">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <span className="text-7xl">🏴‍☠️</span>
            </motion.div>
            <h2 className="font-display text-xl text-foreground mt-3">{t("treasureRush")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("treasureRushDesc")}</p>
          </div>

          {/* Ticket info */}
          <div className={cn("flex items-center justify-between bg-card/80 border border-primary/30 rounded-xl px-4 py-4", isRTL && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{t("entryCost")}</p>
                <p className="text-xs text-muted-foreground">1 {t("gameTicket")}</p>
              </div>
            </div>
            <div className="text-center">
              <span className="text-2xl font-display font-bold text-primary">{gameTickets}</span>
              <p className="text-[10px] text-muted-foreground">{t("yourTickets")}</p>
            </div>
          </div>

          {/* Box types legend */}
          <div className="bg-card/60 border border-border rounded-xl p-4 space-y-2">
            <h4 className="font-display text-sm text-gold-gradient">{t("treasureBoxTypes")}</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-xs text-foreground"><span>💰</span> {t("treasureGold")} +10</div>
              <div className="flex items-center gap-2 text-xs text-foreground"><span>💎</span> {t("treasureRare")} +25</div>
              <div className="flex items-center gap-2 text-xs text-foreground"><span>💣</span> {t("treasureTrap")} -10</div>
              <div className="flex items-center gap-2 text-xs text-foreground"><span>👻</span> {t("treasureSteal")}</div>
              <div className="flex items-center gap-2 text-xs text-foreground"><span>⚡</span> {t("treasureDouble")}</div>
              <div className="flex items-center gap-2 text-xs text-foreground"><span>💨</span> {t("treasureEmpty")}</div>
            </div>
          </div>

          {/* Game mode buttons */}
          {!user ? (
            <button onClick={() => window.location.href = '/auth'}
              className="w-full py-3.5 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-accent/80 via-accent to-accent/80 text-primary-foreground flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" /> {t("loginToPlay")}
            </button>
          ) : (
            <div className="space-y-3">
              <button onClick={() => startGame("solo")} disabled={gameTickets <= 0}
                className="w-full py-3.5 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <Timer className="w-5 h-5" /> {gameTickets <= 0 ? t("noTickets") : t("treasureSolo")}
              </button>
              <button onClick={() => { if (gameTickets <= 0) return; addGameTicket(-1); setPhase("searching"); }} disabled={gameTickets <= 0}
                className="w-full py-3.5 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-accent/80 via-accent to-accent/80 text-primary-foreground hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <Users className="w-5 h-5" /> {gameTickets <= 0 ? t("noTickets") : t("treasureMultiplayer")}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============ SEARCHING ============
  if (phase === "searching") {
    return (
      <MatchmakingQueue
        gameType="treasure"
        betAmount={0}
        maxPlayers={4}
        onMatchFound={handleMatchFound}
        onCancel={() => { addGameTicket(1); setPhase("lobby"); }}
      />
    );
  }

  // ============ COUNTDOWN ============
  if (phase === "countdown") {
    return (
      <div className="min-h-screen bg-premium-gradient stars-bg flex flex-col items-center justify-center">
        <motion.div key={countdown} initial={{ scale: 3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
          className="text-8xl font-display font-bold text-primary">
          {countdown > 0 ? countdown : "GO!"}
        </motion.div>
        <p className="text-muted-foreground mt-4">{t("treasureGetReady")}</p>
        <div className="flex gap-2 mt-6">
          {players.map((p, i) => (
            <div key={i} className={cn("px-3 py-1.5 rounded-full text-xs font-bold", PLAYER_BG[i], PLAYER_COLORS[i])}>
              {p.emoji} {p.name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============ PLAYING ============
  if (phase === "playing") {
    const timerPct = (timeLeft / ROUND_DURATION) * 100;
    const timerColor = timeLeft <= 10 ? "text-destructive" : timeLeft <= 20 ? "text-primary" : "text-green-accent";

    return (
      <div className="h-screen bg-premium-gradient stars-bg flex flex-col overflow-hidden fixed inset-0 z-50" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header with timer */}
        <div className="px-3 py-2 shrink-0">
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
            </button>
            <div className="flex items-center gap-2">
              <Clock className={cn("w-4 h-4", timerColor)} />
              <motion.span key={timeLeft} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
                className={cn("text-xl font-mono font-bold", timerColor)}>
                {timeLeft}s
              </motion.span>
            </div>
            {doubleActive && (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}
                className="text-xs font-bold text-primary bg-primary/20 px-2 py-1 rounded-full">
                ⚡ x2
              </motion.div>
            )}
          </div>

          {/* Timer bar */}
          <div className="relative h-1.5 bg-muted/30 rounded-full mt-2 overflow-hidden">
            <motion.div animate={{ width: `${timerPct}%` }} transition={{ duration: 0.5 }}
              className={cn("h-full rounded-full", timeLeft <= 10 ? "bg-destructive" : timeLeft <= 20 ? "bg-primary" : "bg-green-accent")} />
          </div>
        </div>

        {/* Scoreboard */}
        <div className={cn("flex gap-2 px-3 py-2 overflow-x-auto shrink-0", isRTL && "flex-row-reverse")}>
          {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
            <motion.div key={p.name} layout
              className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold shrink-0",
                i === 0 ? "border-primary/50 bg-primary/10" : "border-border bg-card/50"
              )}>
              <span>{p.emoji}</span>
              <span className={cn("text-foreground", i === 0 && "text-primary")}>{p.name}</span>
              <span className="text-primary font-mono">{p.score}</span>
            </motion.div>
          ))}
        </div>

        {/* Last opened feedback */}
        <AnimatePresence>
          {lastOpened && (
            <motion.div key={`${lastOpened.box.id}-${Date.now()}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mx-3 mb-2">
              <div className={cn("text-center text-xs py-1.5 rounded-lg",
                lastOpened.content === "trap" ? "bg-destructive/20 text-destructive" :
                lastOpened.content === "steal" ? "bg-accent/20 text-accent" :
                lastOpened.content === "rare" ? "bg-primary/20 text-primary" :
                lastOpened.content === "gold" ? "bg-primary/10 text-primary" :
                lastOpened.content === "double" ? "bg-primary/20 text-primary" :
                "bg-muted/20 text-muted-foreground"
              )}>
                {getContentInfo(lastOpened.content).emoji}{" "}
                {lastOpened.content === "gold" && `+10 ${t("treasureGoldPts")}`}
                {lastOpened.content === "rare" && `+25 ${t("treasureRarePts")}`}
                {lastOpened.content === "trap" && `-10 ${t("treasureTrapPts")}`}
                {lastOpened.content === "steal" && `${t("treasureStolen")}`}
                {lastOpened.content === "double" && `${t("treasureDoubleActive")}`}
                {lastOpened.content === "empty" && `${t("treasureNothing")}`}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Box Grid */}
        <div className="px-3">
          <div className="grid grid-cols-4 gap-2">
            {boxes.map((box) => {
              const info = getContentInfo(box.content);
              return (
                <motion.button
                  key={`${roundNumber}-${box.id}`}
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{
                    scale: 1,
                    rotateY: 0,
                    x: shakeBox === box.id ? [0, -5, 5, -5, 0] : 0,
                  }}
                  transition={{ delay: box.id * 0.03, duration: 0.3 }}
                  whileTap={!box.opened ? { scale: 0.9 } : undefined}
                  onClick={() => !box.opened && handlePlayerClick(box.id)}
                  disabled={box.opened}
                  className={cn(
                    "aspect-square rounded-xl border-2 flex items-center justify-center text-2xl transition-all relative overflow-hidden",
                    box.opened
                      ? box.content === "trap"
                        ? "bg-destructive/10 border-destructive/30"
                        : box.content === "rare"
                        ? "bg-primary/15 border-primary/40"
                        : box.content === "steal"
                        ? "bg-accent/10 border-accent/30"
                        : box.content === "gold"
                        ? "bg-primary/10 border-primary/30"
                        : box.content === "double"
                        ? "bg-primary/15 border-primary/40"
                        : "bg-muted/10 border-border/30"
                      : "bg-card/80 border-primary/20 hover:border-primary/50 hover:bg-card cursor-pointer active:scale-95"
                  )}
                >
                  {box.opened ? (
                    <motion.span initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", bounce: 0.5 }}>
                      {info.emoji}
                    </motion.span>
                  ) : (
                    <motion.span animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: box.id * 0.1 }}>
                      📦
                    </motion.span>
                  )}
                  {/* Player indicator who opened */}
                  {box.opened && box.openedBy !== null && (
                    <span className="absolute bottom-0.5 right-0.5 text-[8px]">
                      {players[box.openedBy]?.emoji}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Round indicator */}
        <div className="text-center mt-3">
          <span className="text-[10px] text-muted-foreground">{t("treasureRound")} {roundNumber}</span>
        </div>
      </div>
    );
  }

  // ============ RESULTS ============
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const humanPlayer = players.find((p) => !p.isBot);
  const humanRank = humanPlayer ? sorted.indexOf(humanPlayer) : -1;
  const isWinner = humanRank === 0;

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20 flex flex-col items-center justify-center px-4" dir={isRTL ? "rtl" : "ltr"}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.4 }}
        className="text-center space-y-5 w-full max-w-sm">
        
        {/* Trophy / Result */}
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          {isWinner ? (
            <span className="text-8xl">🏆</span>
          ) : (
            <span className="text-8xl">⚔️</span>
          )}
        </motion.div>

        <h2 className="font-display text-2xl text-gold-gradient">
          {isWinner ? t("treasureYouWon") : t("treasureGameOver")}
        </h2>

        {/* Leaderboard */}
        <div className="space-y-2">
          {sorted.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, x: isRTL ? 30 : -30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border",
                i === 0 ? "bg-primary/10 border-primary/40 shadow-gold" : "bg-card/60 border-border",
                isRTL && "flex-row-reverse"
              )}>
              <span className="text-xl font-display font-bold text-primary w-8 text-center">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </span>
              <div className={cn("flex items-center gap-2 flex-1", isRTL && "flex-row-reverse")}>
                <span>{p.emoji}</span>
                <span className={cn("font-bold text-sm", i === 0 ? "text-primary" : "text-foreground")}>{p.name}</span>
              </div>
              <span className="font-mono font-bold text-primary">{p.score} 💰</span>
            </motion.div>
          ))}
        </div>

        {/* XP Reward */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-2 text-sm text-primary">
          <Zap className="w-4 h-4" />
          <span>+{isWinner ? 200 : humanRank === 1 ? 100 : 50} XP</span>
        </motion.div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button onClick={() => { setPhase("lobby"); setRoundNumber(1); }}
            className="w-full py-3 rounded-xl font-display font-bold bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold hover:brightness-110 transition-all">
            {t("treasurePlayAgain")}
          </button>
          <button onClick={onBack}
            className="w-full py-3 rounded-xl font-bold border border-border text-foreground hover:bg-muted/30 transition-all">
            {t("backToGames")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
