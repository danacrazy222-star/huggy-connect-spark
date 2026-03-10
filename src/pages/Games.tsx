import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { useGameStore } from "@/store/useGameStore";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { MatchmakingQueue } from "@/components/games/MatchmakingQueue";
import { Gamepad2, Ticket, Users, Bot, Zap, Trophy, ArrowLeft, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Sparkles, Gift, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const BOARD_SIZE = 100;
const SNAKES: Record<number, number> = { 99: 54, 95: 72, 92: 51, 83: 57, 64: 19, 48: 26, 16: 6 };
const LADDERS: Record<number, number> = { 2: 38, 7: 14, 8: 31, 15: 26, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 78: 98, 87: 94 };
const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

function getBoardNumber(visualRow: number, visualCol: number): number {
  const row = 9 - visualRow;
  const col = row % 2 === 0 ? visualCol : 9 - visualCol;
  return row * 10 + col + 1;
}

function getCellColor(num: number): string {
  if (SNAKES[num]) return "bg-red-accent/30 border-red-accent/50";
  if (LADDERS[num]) return "bg-green-accent/30 border-green-accent/50";
  return (Math.floor((num - 1) / 10) + num) % 2 === 0 ? "bg-muted/40 border-border/50" : "bg-accent/10 border-accent/20";
}

type GamePhase = "lobby" | "searching" | "playing" | "finished";
type Player = { name: string; pos: number; isBot: boolean; color: string };
type ActiveGame = "none" | "snake" | "scratch";

export default function Games() {
  const [activeGame, setActiveGame] = useState<ActiveGame>("none");
  if (activeGame === "snake") return <SnakeAndLadder onBack={() => setActiveGame("none")} />;
  if (activeGame === "scratch") return <ScratchCard onBack={() => setActiveGame("none")} />;
  return <GamesList onPlaySnake={() => setActiveGame("snake")} onPlayScratch={() => setActiveGame("scratch")} />;
}

function GamesList({ onPlaySnake, onPlayScratch }: { onPlaySnake: () => void; onPlayScratch: () => void }) {
  const { gameTickets } = useGameStore();
  const { t, isRTL } = useTranslation();

  const games = [
    { name: t("snakeAndLadder"), desc: t("classicBoardGame"), icon: "🐍", color: "from-green-accent/30 to-green-accent/5", border: "border-green-accent/40", multiplayer: true, onClick: onPlaySnake },
    { name: t("scratchCard"), desc: t("scratchCardDesc"), icon: "🎫", color: "from-primary/30 to-primary/5", border: "border-primary/40", multiplayer: false, onClick: onPlayScratch },
    { name: t("tapFrenzy"), desc: t("tapAsFast"), icon: "👆", color: "from-blue-accent/30 to-blue-accent/5", border: "border-blue-accent/40", multiplayer: false, onClick: () => {}, locked: true },
    { name: t("memoryMatch"), desc: t("matchHiddenCards"), icon: "🃏", color: "from-purple-glow/30 to-purple-glow/5", border: "border-purple-glow/40", multiplayer: false, onClick: () => {}, locked: true },
  ];

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title={t("games")} />
      <div className="px-4 space-y-4">
        <div className={cn("flex items-center justify-between bg-card/80 border border-border rounded-xl px-4 py-3", isRTL && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Ticket className="w-5 h-5 text-primary" />
            <span className="text-sm text-foreground">{t("gameTickets")}</span>
          </div>
          <span className="text-lg font-bold text-primary">{gameTickets}</span>
        </div>

        <h3 className="font-display text-lg text-gold-gradient">{t("availableGames")}</h3>

        {games.map((game, i) => (
          <motion.button key={game.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            onClick={game.onClick} disabled={game.locked}
            className={cn(`w-full flex items-center gap-4 bg-gradient-to-r ${game.color} border ${game.border} rounded-xl p-4 transition-all hover:brightness-110 disabled:opacity-40`, isRTL ? "flex-row-reverse text-right" : "text-left")}>
            <span className="text-3xl">{game.icon}</span>
            <div className="flex-1">
              <h4 className="font-bold text-foreground">{game.name}</h4>
              <p className="text-xs text-muted-foreground">{game.desc}</p>
            </div>
            <div className={cn("flex flex-col gap-1", isRTL ? "items-start" : "items-end")}>
              {game.multiplayer && (
                <span className="flex items-center gap-1 text-[10px] text-accent bg-accent/10 rounded-full px-2 py-0.5">
                  <Users className="w-3 h-3" /> PvP
                </span>
              )}
              {game.locked ? (
                <span className="text-[10px] text-muted-foreground">{t("comingSoon")}</span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-primary">
                  <Ticket className="w-3 h-3" /> 1 {t("ticket")}
                </span>
              )}
            </div>
          </motion.button>
        ))}

        <div className="bg-card/60 border border-border rounded-xl p-4 space-y-2">
          <h4 className="font-display text-sm text-gold-gradient">{t("gameRules")}</h4>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p>🎫 {t("entryTicket")}</p>
            <p>💰 {t("betWithPoints")}</p>
            <p>🏆 {t("winnerGets")}</p>
            <p>😢 {t("loserGets")}</p>
            <p>🤖 {t("noOpponentBot")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SnakeAndLadder({ onBack }: { onBack: () => void }) {
  const { gameTickets, addGameTicket, addXP, addPoints } = useGameStore();
  const { t, isRTL } = useTranslation();
  const { user } = useAuth();
  const [phase, setPhase] = useState<GamePhase>("lobby");
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const startSearch = useCallback(() => {
    if (gameTickets <= 0) return;
    if (!user) return;
    addGameTicket(-1);
    setPhase("searching");
  }, [gameTickets, addGameTicket, user]);

  const handleMatchFound = useCallback((matchedPlayers: { name: string; isBot: boolean }[]) => {
    const colors = ["bg-primary", "bg-accent", "bg-green-accent", "bg-blue-accent"];
    setPlayers(
      matchedPlayers.map((p, i) => ({
        name: p.name,
        pos: 0,
        isBot: p.isBot,
        color: colors[i] || colors[0],
      }))
    );
    setPhase("playing");
    setCurrentTurn(0);
    setMessage(t("rollTheDice"));
  }, [t]);

  const movePlayer = useCallback((playerIdx: number, dice: number) => {
    setPlayers((prev) => {
      const updated = [...prev];
      let newPos = updated[playerIdx].pos + dice;
      if (newPos > BOARD_SIZE) { setMessage(`${updated[playerIdx].name} ${t("needsExactRoll")}`); return updated; }
      if (newPos === BOARD_SIZE) { updated[playerIdx] = { ...updated[playerIdx], pos: newPos }; return updated; }
      if (SNAKES[newPos]) { const from = newPos; newPos = SNAKES[newPos]; setMessage(`🐍 ${from} → ${newPos}`); }
      else if (LADDERS[newPos]) { const from = newPos; newPos = LADDERS[newPos]; setMessage(`🪜 ${from} → ${newPos}`); }
      else { setMessage(`${updated[playerIdx].name} → ${newPos}`); }
      updated[playerIdx] = { ...updated[playerIdx], pos: newPos };
      return updated;
    });
  }, []);

  const getGameXPReward = useCallback(() => {
    return { win: 300, lose: 80 };
  }, []);

  useEffect(() => {
    const w = players.find((p) => p.pos === BOARD_SIZE);
    if (w && phase === "playing") {
      setWinner(w.name);
      setPhase("finished");
      const rewards = getGameXPReward();
      if (!w.isBot) { addXP(rewards.win); }
      else { addXP(rewards.lose); }
    }
  }, [players, phase, addXP, getGameXPReward]);

  // Bot turns — handle all bot players sequentially
  useEffect(() => {
    if (phase !== "playing") return;
    const currentPlayer = players[currentTurn];
    if (!currentPlayer?.isBot) return;
    
    const timer = setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      setDiceValue(dice);
      setRolling(true);
      setTimeout(() => {
        setRolling(false);
        movePlayer(currentTurn, dice);
        // Move to next player
        setCurrentTurn((prev) => (prev + 1) % players.length);
      }, 800);
    }, 1200);
    return () => clearTimeout(timer);
  }, [currentTurn, phase, players, movePlayer]);

  const rollDice = () => {
    if (rolling || players[currentTurn]?.isBot || phase !== "playing") return;
    setRolling(true);
    const dice = Math.floor(Math.random() * 6) + 1;
    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 8) {
        clearInterval(interval);
        setDiceValue(dice);
        setRolling(false);
        movePlayer(currentTurn, dice);
        setTimeout(() => setCurrentTurn((prev) => (prev + 1) % players.length), 500);
      }
    }, 100);
  };

  const DiceIcon = DICE_ICONS[diceValue - 1];

  if (phase === "lobby") {
    return (
      <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
        <div className={cn("flex items-center gap-3 px-4 py-3", isRTL && "flex-row-reverse")}>
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className={cn("w-5 h-5", isRTL && "rotate-180")} />
          </button>
          <h1 className="font-display text-lg font-bold text-gold-gradient">{t("snakeAndLadder")}</h1>
        </div>
        <div className="px-4 space-y-6">
          <div className="text-center py-6">
            <span className="text-6xl">🐍🪜</span>
            <h2 className="font-display text-xl text-foreground mt-3">{t("snakeAndLadder")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("classicBoardGame")}</p>
          </div>

          <div className={cn("flex items-center justify-between bg-card/80 border border-primary/30 rounded-xl px-4 py-4", isRTL && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{t("entryCost")}</p>
                <p className="text-xs text-muted-foreground">1 {t("gameTicket")} {t("ticket")}</p>
              </div>
            </div>
            <div className="text-center">
              <span className="text-2xl font-display font-bold text-primary">{gameTickets}</span>
              <p className="text-[10px] text-muted-foreground">{t("yourTickets")}</p>
            </div>
          </div>
          
          {/* Queue info */}
          <div className="bg-card/60 border border-border rounded-xl p-3 space-y-1">
            <div className={cn("flex items-center gap-2 text-xs text-muted-foreground", isRTL && "flex-row-reverse")}>
              <Users className="w-4 h-4 text-accent" />
              <span>{t("queueBotFallback")}</span>
            </div>
          </div>

          {!user ? (
            <button onClick={() => window.location.href = '/auth'}
              className="w-full py-3.5 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-accent/80 via-accent to-accent/80 text-primary-foreground flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" /> {t("loginToPlay")}
            </button>
          ) : (
            <button onClick={startSearch} disabled={gameTickets <= 0}
              className="w-full py-3.5 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {gameTickets <= 0 ? t("noTickets") : t("findOpponent")}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "searching") {
    return (
      <MatchmakingQueue
        gameType="snake"
        betAmount={betAmount}
        maxPlayers={2}
        onMatchFound={handleMatchFound}
        onCancel={() => { addGameTicket(1); setPhase("lobby"); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className={cn("flex items-center gap-3 px-4 py-2", isRTL && "flex-row-reverse")}>
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className={cn("w-5 h-5", isRTL && "rotate-180")} />
        </button>
        <h1 className="font-display text-sm font-bold text-gold-gradient flex-1">{t("snakeAndLadder")}</h1>
        <div className={cn("flex gap-3", isRTL && "flex-row-reverse")}>
          {players.map((p, i) => (
            <div key={i} className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
              <div className={`w-3 h-3 rounded-full ${p.color}`} />
              <span className="text-xs text-foreground">{p.name}</span>
              <span className="text-[10px] text-muted-foreground">({p.pos})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-2">
        <div className="grid grid-cols-10 gap-[1px] bg-border/30 rounded-lg overflow-hidden border border-border">
          {Array.from({ length: 10 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => {
              const num = getBoardNumber(row, col);
              const playersHere = players.filter((p) => p.pos === num);
              return (
                <div key={`${row}-${col}`} className={`relative aspect-square flex flex-col items-center justify-center text-[8px] border ${getCellColor(num)}`}>
                  <span className="text-muted-foreground font-mono">{num}</span>
                  {SNAKES[num] && <span className="absolute top-0 right-0 text-[8px]">🐍</span>}
                  {LADDERS[num] && <span className="absolute top-0 right-0 text-[8px]">🪜</span>}
                  <div className="flex gap-[2px] absolute bottom-0">
                    {playersHere.map((p, pi) => (
                      <motion.div key={pi} layoutId={`player-${pi}`} className={`w-2.5 h-2.5 rounded-full ${p.color} border border-foreground/30`} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="px-4 mt-3 space-y-3">
        <AnimatePresence mode="wait">
          <motion.div key={message} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-card/80 border border-border rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-foreground">{message || t("rollTheDice")}</p>
          </motion.div>
        </AnimatePresence>

        {phase === "playing" && (
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <motion.div animate={rolling ? { rotate: [0, 90, 180, 270, 360] } : {}} transition={{ repeat: rolling ? Infinity : 0, duration: 0.3 }}
                className="bg-card border border-primary/50 rounded-xl p-3">
                <DiceIcon className="w-8 h-8 text-primary" />
              </motion.div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {players[currentTurn]?.isBot ? `${players[currentTurn]?.name}...` : t("yourTurn")}
                </p>
                <p className="text-lg font-bold text-foreground">{diceValue}</p>
              </div>
            </div>
            <button onClick={rollDice} disabled={rolling || players[currentTurn]?.isBot}
              className="px-6 py-3 rounded-xl font-display font-bold bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              🎲 {t("roll")}
            </button>
          </div>
        )}

        {phase === "finished" && (
          <div className="text-center space-y-3">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block">
              <Trophy className="w-12 h-12 text-primary mx-auto" />
            </motion.div>
            <h3 className="font-display text-xl text-gold-gradient">{winner === t("playerYou") ? t("youWin") : t("botWins")}</h3>
            <div className="flex gap-3 justify-center">
              {winner === t("playerYou") && (
                <div className="bg-card border border-border rounded-lg px-4 py-2">
                  <Zap className="w-4 h-4 text-primary mx-auto" />
                  <span className="text-xs text-foreground">+{getGameXPReward().win} XP</span>
                </div>
              )}
              {winner === t("playerYou") && (
                <div className="bg-card border border-border rounded-lg px-4 py-2">
                  <Trophy className="w-4 h-4 text-primary mx-auto" />
                  <span className="text-xs text-foreground">+{betAmount * 2} Pts</span>
                </div>
              )}
            </div>
            <button onClick={onBack} className="px-8 py-3 rounded-xl font-display font-bold bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold">
              {t("backToGames")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ========== SCRATCH CARD GAME ==========

interface ScratchReward {
  emoji: string;
  label: string;
  type: "points" | "xp" | "ticket" | "entry" | "none";
  amount: number;
}

const SCRATCH_REWARDS: ScratchReward[] = [
  { emoji: "⚡", label: "+100 XP", type: "xp", amount: 100 },
  { emoji: "⚡", label: "+50 XP", type: "xp", amount: 50 },
  { emoji: "⚡", label: "+20 XP", type: "xp", amount: 20 },
  { emoji: "🎫", label: "+1 Game Ticket", type: "ticket", amount: 1 },
  { emoji: "💰", label: "+50 Points", type: "points", amount: 50 },
  { emoji: "❌", label: "", type: "none", amount: 0 },
];

function getRandomReward(): ScratchReward {
  const rand = Math.random();
  if (rand < 0.05) return SCRATCH_REWARDS[0]; // 100 XP (5%)
  if (rand < 0.15) return SCRATCH_REWARDS[1]; // 50 XP (10%)
  if (rand < 0.30) return SCRATCH_REWARDS[2]; // 20 XP (15%)
  if (rand < 0.42) return SCRATCH_REWARDS[3]; // ticket (12%)
  if (rand < 0.58) return SCRATCH_REWARDS[4]; // 50 points (16%)
  return SCRATCH_REWARDS[5]; // none (42%)
}

function ScratchCard({ onBack }: { onBack: () => void }) {
  const { gameTickets, addGameTicket, addXP, addPoints, addDrawEntry } = useGameStore();
  const { t, isRTL } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"ready" | "scratching" | "revealed">("ready");
  const [reward, setReward] = useState<ScratchReward | null>(null);
  const [scratched, setScratched] = useState(0);
  const [scratchInteractions, setScratchInteractions] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const startGame = useCallback(() => {
    if (gameTickets <= 0) {
      toast.error(t("noTickets"));
      return;
    }
    addGameTicket(-1);
    const r = getRandomReward();
    setReward(r);
    setPhase("scratching");
    setScratched(0);
    setScratchInteractions(0);
    setClaimed(false);
    isDrawingRef.current = false;
    lastPointRef.current = null;
  }, [gameTickets, addGameTicket, t]);

  // Initialize scratch canvas
  useEffect(() => {
    if (phase !== "scratching" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Gold gradient cover
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "hsl(45, 100%, 50%)");
    gradient.addColorStop(0.5, "hsl(35, 100%, 40%)");
    gradient.addColorStop(1, "hsl(45, 100%, 60%)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add pattern
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.font = "20px serif";
    for (let x = 10; x < rect.width; x += 40) {
      for (let y = 25; y < rect.height; y += 40) {
        ctx.fillText("✨", x, y);
      }
    }

    // Text
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.font = "bold 16px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(t("scratchArea"), rect.width / 2, rect.height / 2 + 6);
  }, [phase, t]);

  const scratch = useCallback((clientX: number, clientY: number) => {
    if (phase !== "scratching" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = 56;

    const lastPoint = lastPointRef.current;
    if (lastPoint) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    lastPointRef.current = { x, y };

    // Calculate scratched percentage (sampled for performance)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    let total = 0;
    for (let i = 3; i < imageData.data.length; i += 32) {
      total++;
      if (imageData.data[i] < 40) transparent++;
    }

    const pct = (transparent / total) * 100;
    setScratched(pct);

    if (pct >= 8) {
      isDrawingRef.current = false;
      lastPointRef.current = null;
      setPhase("revealed");
    }
  }, [phase]);

  const registerScratchInteraction = useCallback(() => {
    setScratchInteractions((prev) => {
      const next = prev + 1;
      if (next >= 2) {
        isDrawingRef.current = false;
        lastPointRef.current = null;
        setPhase("revealed");
      }
      return next;
    });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDrawingRef.current = true;
    lastPointRef.current = null;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // no-op for browsers that don't support capture
    }
    scratch(e.clientX, e.clientY);
    registerScratchInteraction();
  }, [scratch, registerScratchInteraction]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    scratch(e.clientX, e.clientY);
  }, [scratch]);

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (typeof window !== "undefined" && "PointerEvent" in window) return;
    e.preventDefault();
    isDrawingRef.current = true;
    lastPointRef.current = null;
    const touch = e.touches[0];
    if (touch) {
      scratch(touch.clientX, touch.clientY);
      registerScratchInteraction();
    }
  }, [scratch, registerScratchInteraction]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (typeof window !== "undefined" && "PointerEvent" in window) return;
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) scratch(touch.clientX, touch.clientY);
  }, [scratch]);

  const claimReward = () => {
    if (!reward || claimed) return;
    setClaimed(true);
    if (reward.type === "points") addPoints(reward.amount);
    else if (reward.type === "xp") addXP(reward.amount);
    else if (reward.type === "ticket") addGameTicket(reward.amount);
    else if (reward.type === "entry") addDrawEntry(reward.amount);
    toast.success(`${t("youRevealed")}: ${reward.emoji} ${reward.label}`);
  };

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className={cn("flex items-center gap-3 px-4 py-3", isRTL && "flex-row-reverse")}>
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className={cn("w-5 h-5", isRTL && "rotate-180")} />
        </button>
        <h1 className="font-display text-lg font-bold text-gold-gradient">{t("scratchCard")}</h1>
      </div>

      <div className="px-4 space-y-6">
        {/* Ticket info */}
        <div className={cn("flex items-center justify-between bg-card/80 border border-border rounded-xl px-4 py-3", isRTL && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Ticket className="w-5 h-5 text-primary" />
            <span className="text-sm text-foreground">{t("gameTickets")}</span>
          </div>
          <span className="text-lg font-bold text-primary">{gameTickets}</span>
        </div>

        {phase === "ready" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="text-center py-8">
              <motion.span animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-7xl inline-block">
                🎫
              </motion.span>
              <h2 className="font-display text-xl text-foreground mt-4">{t("scratchCard")}</h2>
              <p className="text-sm text-muted-foreground mt-2">{t("scratchToReveal")}</p>
            </div>

            <div className="bg-card/60 border border-border rounded-xl p-4 space-y-2">
              <p className="text-xs text-muted-foreground">🎫 {t("scratchCardCost")}</p>
              <p className="text-xs text-muted-foreground">💰 {t("winnerGets")}: {t("scratchWinTypes")}</p>
            </div>

            <button onClick={startGame} disabled={gameTickets <= 0}
              className="w-full py-3.5 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {gameTickets <= 0 ? t("noTickets") : `🎫 ${t("scratchCard")} — 1 ${t("ticket")}`}
            </button>
          </motion.div>
        )}

        {phase === "scratching" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">{t("scratchToReveal")}</p>

            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-primary/40 shadow-gold">
              {/* Prize underneath */}
              <div className="absolute inset-0 bg-card-gradient flex flex-col items-center justify-center gap-3">
                <span className="text-6xl">{reward?.emoji}</span>
                <p className="text-lg font-bold text-foreground">
                  {reward?.type === "none" ? t("noReward") : reward?.label}
                </p>
                {reward?.type !== "none" && (
                  <Sparkles className="w-6 h-6 text-primary animate-sparkle" />
                )}
              </div>

              {/* Scratch overlay */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair"
                style={{ touchAction: "none" }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                onPointerCancel={stopDrawing}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={stopDrawing}
                onTouchCancel={stopDrawing}
              />
            </div>

            <div className="relative h-3 bg-muted rounded-full overflow-hidden border border-border">
              <motion.div animate={{ width: `${Math.min(Math.max((scratched / 8) * 100, (scratchInteractions / 2) * 100), 100)}%` }}
                className="h-full bg-gradient-to-r from-gold-dark via-primary to-gold-light rounded-full" />
            </div>

            <button
              onClick={() => setPhase("revealed")}
              className="w-full py-2.5 rounded-xl font-bold bg-card/80 border border-border text-foreground hover:bg-muted/40 transition-all"
            >
              {t("revealRewardNow")}
            </button>
          </motion.div>
        )}

        {phase === "revealed" && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
              {reward?.type !== "none" ? (
                <>
                  <span className="text-8xl inline-block">{reward?.emoji}</span>
                  <Trophy className="w-10 h-10 text-primary mx-auto mt-3" />
                </>
              ) : (
                <span className="text-8xl inline-block">😔</span>
              )}
            </motion.div>

            <h3 className="font-display text-xl text-gold-gradient">
              {reward?.type !== "none" ? `${t("youRevealed")}: ${reward?.label}` : t("noReward")}
            </h3>

            {reward?.type !== "none" && !claimed && (
              <button onClick={claimReward}
                className="w-full py-3 rounded-xl font-display font-bold bg-gradient-to-r from-green-accent/80 to-green-accent text-primary-foreground shadow-gold hover:brightness-110 transition-all">
                {t("claimReward")}
              </button>
            )}

            <button onClick={() => { setPhase("ready"); setReward(null); }}
              className="w-full py-3 rounded-xl font-display font-bold bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold hover:brightness-110 transition-all">
              {t("tryAnotherCard")}
            </button>

            <button onClick={onBack}
              className="w-full py-3 rounded-xl font-bold border border-border text-foreground hover:bg-muted/30 transition-all">
              {t("backToGames")}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
