import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { useGameStore } from "@/store/useGameStore";
import { Gamepad2, Ticket, Users, Bot, Zap, Trophy, ArrowLeft, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Snake and Ladder board definition
const BOARD_SIZE = 100;
const SNAKES: Record<number, number> = {
  99: 54, 95: 72, 92: 51, 83: 57, 64: 19, 48: 26, 16: 6,
};
const LADDERS: Record<number, number> = {
  2: 38, 7: 14, 8: 31, 15: 26, 21: 42, 28: 84, 36: 44,
  51: 67, 71: 91, 78: 98, 87: 94,
};

const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

// Get row/col from position (1-100) for a snaking board
function getCoords(pos: number): { row: number; col: number } {
  const p = pos - 1;
  const row = 9 - Math.floor(p / 10);
  const colInRow = p % 10;
  const col = row % 2 === 1 ? colInRow : 9 - colInRow;
  // Adjust: row 0 = bottom, but our visual row 0 = top
  return { row: 9 - row, col };
}

function getBoardNumber(visualRow: number, visualCol: number): number {
  const row = 9 - visualRow; // flip
  const col = row % 2 === 0 ? visualCol : 9 - visualCol;
  return row * 10 + col + 1;
}

// Colors for board cells
function getCellColor(num: number): string {
  if (SNAKES[num]) return "bg-red-accent/30 border-red-accent/50";
  if (LADDERS[num]) return "bg-green-accent/30 border-green-accent/50";
  return (Math.floor((num - 1) / 10) + num) % 2 === 0
    ? "bg-muted/40 border-border/50"
    : "bg-accent/10 border-accent/20";
}

type GamePhase = "lobby" | "searching" | "playing" | "finished";
type Player = { name: string; pos: number; isBot: boolean; color: string };

export default function Games() {
  const [showGame, setShowGame] = useState(false);

  if (showGame) {
    return <SnakeAndLadder onBack={() => setShowGame(false)} />;
  }

  return <GamesList onPlaySnake={() => setShowGame(true)} />;
}

function GamesList({ onPlaySnake }: { onPlaySnake: () => void }) {
  const { gameTickets } = useGameStore();

  const games = [
    {
      name: "Snake & Ladder",
      desc: "Classic board game • PvP or vs Bot",
      icon: "🐍",
      color: "from-green-accent/30 to-green-accent/5",
      border: "border-green-accent/40",
      multiplayer: true,
      onClick: onPlaySnake,
    },
    {
      name: "Tap Frenzy",
      desc: "Tap as fast as you can!",
      icon: "👆",
      color: "from-blue-accent/30 to-blue-accent/5",
      border: "border-blue-accent/40",
      multiplayer: false,
      onClick: () => {},
      locked: true,
    },
    {
      name: "Memory Match",
      desc: "Match the hidden cards",
      icon: "🃏",
      color: "from-purple-glow/30 to-purple-glow/5",
      border: "border-purple-glow/40",
      multiplayer: false,
      onClick: () => {},
      locked: true,
    },
  ];

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20">
      <TopBar title="Games" />
      <div className="px-4 space-y-4">
        {/* Tickets banner */}
        <div className="flex items-center justify-between bg-card/80 border border-border rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            <span className="text-sm text-foreground">Game Tickets</span>
          </div>
          <span className="text-lg font-bold text-primary">{gameTickets}</span>
        </div>

        <h3 className="font-display text-lg text-gold-gradient">Available Games</h3>

        {games.map((game, i) => (
          <motion.button
            key={game.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={game.onClick}
            disabled={game.locked}
            className={`w-full flex items-center gap-4 bg-gradient-to-r ${game.color} border ${game.border} rounded-xl p-4 text-left transition-all hover:brightness-110 disabled:opacity-40`}
          >
            <span className="text-3xl">{game.icon}</span>
            <div className="flex-1">
              <h4 className="font-bold text-foreground">{game.name}</h4>
              <p className="text-xs text-muted-foreground">{game.desc}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {game.multiplayer && (
                <span className="flex items-center gap-1 text-[10px] text-accent bg-accent/10 rounded-full px-2 py-0.5">
                  <Users className="w-3 h-3" /> PvP
                </span>
              )}
              {game.locked ? (
                <span className="text-[10px] text-muted-foreground">Coming Soon</span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-primary">
                  <Ticket className="w-3 h-3" /> 1 Ticket
                </span>
              )}
            </div>
          </motion.button>
        ))}

        {/* Rules */}
        <div className="bg-card/60 border border-border rounded-xl p-4 space-y-2">
          <h4 className="font-display text-sm text-gold-gradient">Game Rules</h4>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p>🎫 Entry: 1 Game Ticket per game</p>
            <p>💰 Bet with Points only (not XP)</p>
            <p>🏆 Winner gets +40 XP</p>
            <p>😢 Loser gets +5 XP max</p>
            <p>🤖 No opponent in 60s? Bot joins automatically</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SnakeAndLadder({ onBack }: { onBack: () => void }) {
  const { gameTickets, addGameTicket, addXP, addPoints, points } = useGameStore();
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

  // Search for opponent with 60s timeout → bot
  const startSearch = useCallback(() => {
    if (gameTickets <= 0) return;
    addGameTicket(-1);
    setPhase("searching");
    setSearchTimer(60);

    // Simulate: after random 3-60s or timeout, bot joins
    const botJoinTime = Math.min(5000, 60000); // For demo, bot joins after 5s
    const timeout = setTimeout(() => {
      setPlayers([
        { name: "You", pos: 0, isBot: false, color: "bg-primary" },
        { name: "Bot 🤖", pos: 0, isBot: true, color: "bg-accent" },
      ]);
      setPhase("playing");
      setCurrentTurn(0);
      setMessage("Game started! You go first.");
    }, botJoinTime);

    searchIntervalRef.current = setInterval(() => {
      setSearchTimer((t) => {
        if (t <= 1) {
          if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timeout);
      if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
    };
  }, [gameTickets, addGameTicket]);

  // Move logic
  const movePlayer = useCallback((playerIdx: number, dice: number) => {
    setPlayers((prev) => {
      const updated = [...prev];
      let newPos = updated[playerIdx].pos + dice;

      if (newPos > BOARD_SIZE) {
        // Can't move beyond 100
        setMessage(`${updated[playerIdx].name} needs exact roll to win!`);
        return updated;
      }

      if (newPos === BOARD_SIZE) {
        updated[playerIdx] = { ...updated[playerIdx], pos: newPos };
        return updated;
      }

      // Check snakes
      if (SNAKES[newPos]) {
        const from = newPos;
        newPos = SNAKES[newPos];
        setMessage(`🐍 ${updated[playerIdx].name} hit a snake! ${from} → ${newPos}`);
      }
      // Check ladders
      else if (LADDERS[newPos]) {
        const from = newPos;
        newPos = LADDERS[newPos];
        setMessage(`🪜 ${updated[playerIdx].name} climbed a ladder! ${from} → ${newPos}`);
      } else {
        setMessage(`${updated[playerIdx].name} moved to ${newPos}`);
      }

      updated[playerIdx] = { ...updated[playerIdx], pos: newPos };
      return updated;
    });
  }, []);

  // Check winner after player move
  useEffect(() => {
    const w = players.find((p) => p.pos === BOARD_SIZE);
    if (w && phase === "playing") {
      setWinner(w.name);
      setPhase("finished");
      if (!w.isBot) {
        addXP(40);
        addPoints(betAmount * 2);
        setMessage(`🏆 You won! +40 XP, +${betAmount * 2} Points!`);
      } else {
        addXP(5);
        setMessage(`Bot wins! You earned +5 XP for participating.`);
      }
    }
  }, [players, phase, addXP, addPoints, betAmount]);

  // Bot turn
  useEffect(() => {
    if (phase !== "playing" || currentTurn !== 1 || !players[1]?.isBot) return;
    const timer = setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      setDiceValue(dice);
      setRolling(true);
      setTimeout(() => {
        setRolling(false);
        movePlayer(1, dice);
        setCurrentTurn(0);
      }, 800);
    }, 1200);
    return () => clearTimeout(timer);
  }, [currentTurn, phase, players, movePlayer]);

  const rollDice = () => {
    if (rolling || currentTurn !== 0 || phase !== "playing") return;
    setRolling(true);
    const dice = Math.floor(Math.random() * 6) + 1;
    
    // Animate dice
    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 8) {
        clearInterval(interval);
        setDiceValue(dice);
        setRolling(false);
        movePlayer(0, dice);
        // Switch turn after move
        setTimeout(() => setCurrentTurn(1), 500);
      }
    }, 100);
  };

  const DiceIcon = DICE_ICONS[diceValue - 1];

  // LOBBY
  if (phase === "lobby") {
    return (
      <div className="min-h-screen bg-premium-gradient stars-bg pb-20">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg font-bold text-gold-gradient">Snake & Ladder</h1>
        </div>

        <div className="px-4 space-y-6">
          <div className="text-center py-6">
            <span className="text-6xl">🐍🪜</span>
            <h2 className="font-display text-xl text-foreground mt-3">Classic Board Game</h2>
            <p className="text-sm text-muted-foreground mt-1">Player vs Player • Bot Fallback</p>
          </div>

          {/* Bet selector */}
          <div className="bg-card/80 border border-border rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-foreground">Set Your Bet (Points)</h3>
            <div className="flex gap-2">
              {[50, 100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setBetAmount(amt)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    betAmount === amt
                      ? "bg-primary text-primary-foreground shadow-gold"
                      : "bg-muted/50 text-muted-foreground border border-border"
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Your Points: {points.toLocaleString()}</p>
          </div>

          {/* Entry cost */}
          <div className="flex items-center justify-between bg-card/60 border border-border rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Entry Cost</span>
            </div>
            <span className="text-sm font-bold text-primary">1 Game Ticket</span>
          </div>

          <div className="flex items-center justify-between bg-card/60 border border-border rounded-xl px-4 py-3">
            <span className="text-sm text-foreground">Your Tickets</span>
            <span className="text-sm font-bold text-primary">{gameTickets}</span>
          </div>

          {/* Play button */}
          <button
            onClick={startSearch}
            disabled={gameTickets <= 0 || points < betAmount}
            className="w-full py-3.5 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {gameTickets <= 0 ? "No Tickets!" : points < betAmount ? "Not Enough Points" : "FIND OPPONENT"}
          </button>
        </div>
      </div>
    );
  }

  // SEARCHING
  if (phase === "searching") {
    return (
      <div className="min-h-screen bg-premium-gradient stars-bg pb-20 flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mb-6"
        />
        <h2 className="font-display text-xl text-foreground mb-2">Finding Opponent...</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Bot joins in <span className="text-primary font-bold">{searchTimer}s</span>
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>Searching for players...</span>
        </div>
      </div>
    );
  }

  // PLAYING / FINISHED
  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20">
      <div className="flex items-center gap-3 px-4 py-2">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-sm font-bold text-gold-gradient flex-1">Snake & Ladder</h1>
        <div className="flex gap-3">
          {players.map((p, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${p.color}`} />
              <span className="text-xs text-foreground">{p.name}</span>
              <span className="text-[10px] text-muted-foreground">({p.pos})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Board */}
      <div className="px-2">
        <div className="grid grid-cols-10 gap-[1px] bg-border/30 rounded-lg overflow-hidden border border-border">
          {Array.from({ length: 10 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => {
              const num = getBoardNumber(row, col);
              const hasSnake = SNAKES[num];
              const hasLadder = LADDERS[num];
              const playersHere = players.filter((p) => p.pos === num);
              
              return (
                <div
                  key={`${row}-${col}`}
                  className={`relative aspect-square flex flex-col items-center justify-center text-[8px] border ${getCellColor(num)}`}
                >
                  <span className="text-muted-foreground font-mono">{num}</span>
                  {hasSnake && <span className="absolute top-0 right-0 text-[8px]">🐍</span>}
                  {hasLadder && <span className="absolute top-0 right-0 text-[8px]">🪜</span>}
                  <div className="flex gap-[2px] absolute bottom-0">
                    {playersHere.map((p, pi) => (
                      <motion.div
                        key={pi}
                        layoutId={`player-${pi}`}
                        className={`w-2.5 h-2.5 rounded-full ${p.color} border border-foreground/30`}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Game controls */}
      <div className="px-4 mt-3 space-y-3">
        {/* Message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-card/80 border border-border rounded-lg px-3 py-2 text-center"
          >
            <p className="text-xs text-foreground">{message || "Roll the dice!"}</p>
          </motion.div>
        </AnimatePresence>

        {phase === "playing" && (
          <div className="flex items-center justify-between">
            {/* Dice */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={rolling ? { rotate: [0, 90, 180, 270, 360] } : {}}
                transition={{ repeat: rolling ? Infinity : 0, duration: 0.3 }}
                className="bg-card border border-primary/50 rounded-xl p-3"
              >
                <DiceIcon className="w-8 h-8 text-primary" />
              </motion.div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {currentTurn === 0 ? "Your turn" : "Bot's turn..."}
                </p>
                <p className="text-lg font-bold text-foreground">{diceValue}</p>
              </div>
            </div>

            <button
              onClick={rollDice}
              disabled={rolling || currentTurn !== 0}
              className="px-6 py-3 rounded-xl font-display font-bold bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🎲 ROLL
            </button>
          </div>
        )}

        {phase === "finished" && (
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block"
            >
              <Trophy className="w-12 h-12 text-primary mx-auto" />
            </motion.div>
            <h3 className="font-display text-xl text-gold-gradient">
              {winner === "You" ? "YOU WIN! 🎉" : "Bot Wins!"}
            </h3>
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
            <button
              onClick={onBack}
              className="px-8 py-3 rounded-xl font-display font-bold bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold"
            >
              BACK TO GAMES
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
