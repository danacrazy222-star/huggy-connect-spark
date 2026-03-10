import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { useGameStore } from "@/store/useGameStore";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { MatchmakingQueue } from "@/components/games/MatchmakingQueue";
import { Ticket, Users, Zap, Trophy, ArrowLeft, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function Games() {
  return <SnakeAndLadder />;
}

function SnakeAndLadder() {
  const { gameTickets, addGameTicket, addXP } = useGameStore();
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
  }, [t]);

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

  const resetGame = () => {
    setPhase("lobby");
    setPlayers([]);
    setWinner(null);
    setMessage("");
    setCurrentTurn(0);
    setDiceValue(1);
  };

  const DiceIcon = DICE_ICONS[diceValue - 1];

  if (phase === "lobby") {
    return (
      <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
        <TopBar title={t("games")} />
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
        betAmount={0}
        maxPlayers={2}
        onMatchFound={handleMatchFound}
        onCancel={() => { addGameTicket(1); setPhase("lobby"); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className={cn("flex items-center gap-3 px-4 py-2", isRTL && "flex-row-reverse")}>
        <button onClick={resetGame} className="text-muted-foreground hover:text-foreground">
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
            </div>
            <button onClick={resetGame} className="px-8 py-3 rounded-xl font-display font-bold bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold">
              {t("backToGames")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
