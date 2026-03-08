import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { useGameStore } from "@/store/useGameStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Gamepad2, Ticket, Users, Bot, Zap, Trophy, ArrowLeft, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Sparkles, Gift } from "lucide-react";
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
  const { gameTickets, addGameTicket, addXP, addPoints, points } = useGameStore();
  const { t, isRTL } = useTranslation();
  const [phase, setPhase] = useState<GamePhase>("lobby");
  const [betAmount, setBetAmount] = useState(50);
  const [searchTimer, setSearchTimer] = useState(60);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const searchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSearch = useCallback(() => {
    if (gameTickets <= 0) return;
    addGameTicket(-1);
    setPhase("searching");
    setSearchTimer(60);
    const timeout = setTimeout(() => {
      setPlayers([
        { name: "You", pos: 0, isBot: false, color: "bg-primary" },
        { name: "Bot 🤖", pos: 0, isBot: true, color: "bg-accent" },
      ]);
      setPhase("playing");
      setCurrentTurn(0);
      setMessage(t("rollTheDice"));
    }, 5000);
    searchIntervalRef.current = setInterval(() => {
      setSearchTimer((prev) => { if (prev <= 1) { if (searchIntervalRef.current) clearInterval(searchIntervalRef.current); return 0; } return prev - 1; });
    }, 1000);
    return () => { clearTimeout(timeout); if (searchIntervalRef.current) clearInterval(searchIntervalRef.current); };
  }, [gameTickets, addGameTicket, t]);

  const movePlayer = useCallback((playerIdx: number, dice: number) => {
    setPlayers((prev) => {
      const updated = [...prev];
      let newPos = updated[playerIdx].pos + dice;
      if (newPos > BOARD_SIZE) { setMessage(`${updated[playerIdx].name} needs exact roll!`); return updated; }
      if (newPos === BOARD_SIZE) { updated[playerIdx] = { ...updated[playerIdx], pos: newPos }; return updated; }
      if (SNAKES[newPos]) { const from = newPos; newPos = SNAKES[newPos]; setMessage(`🐍 ${from} → ${newPos}`); }
      else if (LADDERS[newPos]) { const from = newPos; newPos = LADDERS[newPos]; setMessage(`🪜 ${from} → ${newPos}`); }
      else { setMessage(`${updated[playerIdx].name} → ${newPos}`); }
      updated[playerIdx] = { ...updated[playerIdx], pos: newPos };
      return updated;
    });
  }, []);

  useEffect(() => {
    const w = players.find((p) => p.pos === BOARD_SIZE);
    if (w && phase === "playing") {
      setWinner(w.name);
      setPhase("finished");
      if (!w.isBot) { addXP(40); addPoints(betAmount * 2); }
      else { addXP(5); }
    }
  }, [players, phase, addXP, addPoints, betAmount]);

  useEffect(() => {
    if (phase !== "playing" || currentTurn !== 1 || !players[1]?.isBot) return;
    const timer = setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      setDiceValue(dice);
      setRolling(true);
      setTimeout(() => { setRolling(false); movePlayer(1, dice); setCurrentTurn(0); }, 800);
    }, 1200);
    return () => clearTimeout(timer);
  }, [currentTurn, phase, players, movePlayer]);

  const rollDice = () => {
    if (rolling || currentTurn !== 0 || phase !== "playing") return;
    setRolling(true);
    const dice = Math.floor(Math.random() * 6) + 1;
    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 8) { clearInterval(interval); setDiceValue(dice); setRolling(false); movePlayer(0, dice); setTimeout(() => setCurrentTurn(1), 500); }
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
          <div className="bg-card/80 border border-border rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-foreground">{t("setYourBet")}</h3>
            <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
              {[50, 100, 200, 500].map((amt) => (
                <button key={amt} onClick={() => setBetAmount(amt)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${betAmount === amt ? "bg-primary text-primary-foreground shadow-gold" : "bg-muted/50 text-muted-foreground border border-border"}`}>
                  {amt}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{t("yourPoints")}: {points.toLocaleString()}</p>
          </div>
          <div className={cn("flex items-center justify-between bg-card/60 border border-border rounded-xl px-4 py-3", isRTL && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Ticket className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">{t("entryCost")}</span>
            </div>
            <span className="text-sm font-bold text-primary">1 {t("gameTicket")}</span>
          </div>
          <div className={cn("flex items-center justify-between bg-card/60 border border-border rounded-xl px-4 py-3", isRTL && "flex-row-reverse")}>
            <span className="text-sm text-foreground">{t("yourTickets")}</span>
            <span className="text-sm font-bold text-primary">{gameTickets}</span>
          </div>
          <button onClick={startSearch} disabled={gameTickets <= 0 || points < betAmount}
            className="w-full py-3.5 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {gameTickets <= 0 ? t("noTickets") : points < betAmount ? t("notEnoughPoints") : t("findOpponent")}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "searching") {
    return (
      <div className="min-h-screen bg-premium-gradient stars-bg pb-20 flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mb-6" />
        <h2 className="font-display text-xl text-foreground mb-2">{t("findingOpponent")}</h2>
        <p className="text-muted-foreground text-sm mb-4">{t("botJoinsIn")} <span className="text-primary font-bold">{searchTimer}s</span></p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="w-4 h-4" /><span>{t("searchingPlayers")}</span>
        </div>
      </div>
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
                <p className="text-xs text-muted-foreground">{currentTurn === 0 ? t("yourTurn") : t("botsTurn")}</p>
                <p className="text-lg font-bold text-foreground">{diceValue}</p>
              </div>
            </div>
            <button onClick={rollDice} disabled={rolling || currentTurn !== 0}
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
            <h3 className="font-display text-xl text-gold-gradient">{winner === "You" ? t("youWin") : t("botWins")}</h3>
            <div className="flex gap-3 justify-center">
              <div className="bg-card border border-border rounded-lg px-4 py-2">
                <Zap className="w-4 h-4 text-primary mx-auto" />
                <span className="text-xs text-foreground">{winner === "You" ? "+40" : "+5"} XP</span>
              </div>
              {winner === "You" && (
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
