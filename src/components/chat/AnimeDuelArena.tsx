import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Shield, Zap, Timer, Trophy, Skull, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Move = "attack" | "defend" | "special";
type DuelPhase = "idle" | "waiting" | "vs" | "choose" | "clash" | "roundResult" | "finalResult";

interface RoundResult {
  playerMove: Move;
  opponentMove: Move;
  winner: "player" | "opponent" | "draw";
}

const MOVES: { id: Move; label: string; emoji: string; icon: typeof Swords; color: string }[] = [
  { id: "attack", label: "Attack", emoji: "⚔️", icon: Swords, color: "from-red-500 to-orange-500" },
  { id: "defend", label: "Defend", emoji: "🛡️", icon: Shield, color: "from-blue-500 to-cyan-500" },
  { id: "special", label: "Special", emoji: "⚡", icon: Zap, color: "from-purple-500 to-fuchsia-500" },
];

function resolveRound(player: Move, opponent: Move): "player" | "opponent" | "draw" {
  if (player === opponent) return "draw";
  if (
    (player === "attack" && opponent === "special") ||
    (player === "defend" && opponent === "attack") ||
    (player === "special" && opponent === "defend")
  ) return "player";
  return "opponent";
}

function getBotMove(): Move {
  const moves: Move[] = ["attack", "defend", "special"];
  return moves[Math.floor(Math.random() * 3)];
}

// Floating particle effect
function EnergyParticles({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className={cn("absolute w-1.5 h-1.5 rounded-full", color)}
          initial={{
            x: Math.random() * 300 - 150,
            y: Math.random() * 300 - 150,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

interface AnimeDuelArenaProps {
  onEnd: (won: boolean) => void;
  onClose: () => void;
  playerName: string;
}

export function AnimeDuelArena({ onEnd, onClose, playerName }: AnimeDuelArenaProps) {
  const [phase, setPhase] = useState<DuelPhase>("waiting");
  const [countdown, setCountdown] = useState(60);
  const [opponentName, setOpponentName] = useState("");
  const [roundTimer, setRoundTimer] = useState(15);
  const [currentRound, setCurrentRound] = useState(0);
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [opponentMove, setOpponentMove] = useState<Move | null>(null);
  const [rounds, setRounds] = useState<RoundResult[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [lastRoundWinner, setLastRoundWinner] = useState<"player" | "opponent" | "draw">("draw");

  // Matchmaking countdown
  useEffect(() => {
    if (phase !== "waiting") return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setOpponentName("Shadow Bot 🤖");
          setPhase("vs");
          return 0;
        }
        // Random chance real player joins
        if ((c === 45 || c === 30 || c === 20) && Math.random() > 0.65) {
          clearInterval(timer);
          const names = ["Ryuuki", "SakuraBlade", "KenX", "NovaStar", "ZeroHero", "Akira99"];
          setOpponentName(names[Math.floor(Math.random() * names.length)]);
          setPhase("vs");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // VS screen → choose phase
  useEffect(() => {
    if (phase !== "vs") return;
    const t = setTimeout(() => {
      setPhase("choose");
      setCurrentRound(1);
      setRoundTimer(15);
    }, 3000);
    return () => clearTimeout(t);
  }, [phase]);

  // Round timer
  useEffect(() => {
    if (phase !== "choose") return;
    setRoundTimer(15);
    const timer = setInterval(() => {
      setRoundTimer((t) => {
        if (t <= 1) {
          clearInterval(timer);
          // Auto-pick if player didn't choose
          if (!playerMove) {
            const auto: Move = ["attack", "defend", "special"][Math.floor(Math.random() * 3)] as Move;
            setPlayerMove(auto);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, currentRound]);

  // When player picks, resolve immediately
  useEffect(() => {
    if (phase !== "choose" || !playerMove) return;
    const botMove = getBotMove();
    setOpponentMove(botMove);
    const winner = resolveRound(playerMove, botMove);
    setLastRoundWinner(winner);

    const newRound: RoundResult = { playerMove, opponentMove: botMove, winner };
    const newRounds = [...rounds, newRound];
    setRounds(newRounds);

    let ps = playerScore;
    let os = opponentScore;
    if (winner === "player") ps++;
    if (winner === "opponent") os++;
    setPlayerScore(ps);
    setOpponentScore(os);

    setPhase("clash");

    // After clash animation, check if game over
    setTimeout(() => {
      setPhase("roundResult");
    }, 2000);

    setTimeout(() => {
      if (ps >= 2 || os >= 2 || newRounds.length >= 3) {
        setPhase("finalResult");
      } else {
        setPlayerMove(null);
        setOpponentMove(null);
        setCurrentRound((r) => r + 1);
        setPhase("choose");
      }
    }, 3500);
  }, [playerMove]);

  const playerWon = playerScore > opponentScore;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

      <div className="relative w-full max-w-sm">
        {/* Close button */}
        {(phase === "waiting" || phase === "finalResult") && (
          <button
            onClick={() => {
              if (phase === "finalResult") onEnd(playerWon);
              else onClose();
            }}
            className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-muted/50 border border-border flex items-center justify-center"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}

        {/* ─── WAITING ─── */}
        {phase === "waiting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative bg-gradient-to-b from-purple-950/80 to-black/80 border border-purple-500/30 rounded-3xl p-6 text-center overflow-hidden"
          >
            <EnergyParticles color="bg-purple-400" />
            <Swords className="w-10 h-10 text-purple-400 mx-auto mb-3 animate-pulse" />
            <h3 className="text-lg font-bold text-foreground mb-1">Anime Duel Arena</h3>
            <p className="text-sm text-muted-foreground mb-4">Searching for opponent...</p>

            <div className="relative w-20 h-20 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" opacity={0.3} />
                <motion.circle
                  cx="40" cy="40" r="36" fill="none" stroke="hsl(270 80% 55%)" strokeWidth="4"
                  strokeDasharray={226}
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: 226 }}
                  transition={{ duration: 60, ease: "linear" }}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-purple-300">
                {countdown}
              </span>
            </div>

            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Timer className="w-3 h-3" />
              <span>Bot joins after timeout</span>
            </div>
          </motion.div>
        )}

        {/* ─── VS SCREEN ─── */}
        {phase === "vs" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative bg-gradient-to-b from-purple-950/90 to-black/90 border border-yellow-500/40 rounded-3xl p-6 overflow-hidden"
          >
            <EnergyParticles color="bg-yellow-400" />

            <div className="flex items-center justify-between gap-4">
              {/* Player */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex-1 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white mb-2 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  {playerName.charAt(0).toUpperCase()}
                </div>
                <p className="text-sm font-bold text-foreground truncate">{playerName}</p>
              </motion.div>

              {/* VS */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="shrink-0"
              >
                <div className="relative">
                  <span className="text-4xl font-black bg-gradient-to-b from-yellow-300 via-yellow-500 to-orange-600 bg-clip-text text-transparent drop-shadow-lg">
                    VS
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              {/* Opponent */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="flex-1 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white mb-2 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                  {opponentName.charAt(0).toUpperCase()}
                </div>
                <p className="text-sm font-bold text-foreground truncate">{opponentName}</p>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-xs text-yellow-300/80 mt-4"
            >
              ⚡ Prepare for battle! ⚡
            </motion.p>
          </motion.div>
        )}

        {/* ─── CHOOSE MOVE ─── */}
        {phase === "choose" && (
          <motion.div
            key={`round-${currentRound}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-b from-purple-950/90 to-black/90 border border-purple-500/30 rounded-3xl p-5 overflow-hidden"
          >
            <EnergyParticles color="bg-blue-400" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-bold text-purple-300">
                Round {currentRound}/3
              </div>
              <div className="flex gap-1">
                {[playerScore, opponentScore].map((s, i) => (
                  <span key={i} className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-bold",
                    i === 0 ? "bg-blue-500/30 text-blue-300" : "bg-red-500/30 text-red-300"
                  )}>
                    {i === 0 ? playerName.slice(0, 3) : opponentName.slice(0, 3)}: {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center mb-4">
              <motion.div
                className={cn(
                  "w-14 h-14 rounded-full border-[3px] flex items-center justify-center text-xl font-black",
                  roundTimer <= 5 ? "border-red-500 text-red-400" : "border-purple-400 text-purple-300"
                )}
                animate={roundTimer <= 5 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {roundTimer}
              </motion.div>
            </div>

            <p className="text-center text-sm text-foreground/80 mb-4 font-medium">Choose your move!</p>

            {/* Move buttons */}
            <div className="grid grid-cols-3 gap-3">
              {MOVES.map((move) => (
                <motion.button
                  key={move.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (!playerMove) setPlayerMove(move.id);
                  }}
                  disabled={!!playerMove}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                    playerMove === move.id
                      ? "border-yellow-400 bg-yellow-400/20 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                      : "border-white/10 bg-white/5 hover:border-white/30",
                    playerMove && playerMove !== move.id && "opacity-30"
                  )}
                >
                  <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center", move.color)}>
                    <move.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-foreground">{move.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── CLASH ANIMATION ─── */}
        {phase === "clash" && playerMove && opponentMove && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative bg-gradient-to-b from-purple-950/90 to-black/90 border border-yellow-500/40 rounded-3xl p-6 overflow-hidden"
          >
            <EnergyParticles color="bg-yellow-400" />

            <div className="flex items-center justify-between gap-2 mb-6">
              {/* Player move */}
              <motion.div
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex-1 flex flex-col items-center"
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-1",
                  MOVES.find(m => m.id === playerMove)!.color
                )}>
                  {(() => { const M = MOVES.find(m => m.id === playerMove)!; return <M.icon className="w-8 h-8 text-white" />; })()}
                </div>
                <span className="text-xs text-blue-300 font-bold">{playerName.slice(0, 6)}</span>
              </motion.div>

              {/* Impact */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 2, 1.2] }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="shrink-0"
              >
                <Sparkles className="w-10 h-10 text-yellow-400" />
              </motion.div>

              {/* Opponent move */}
              <motion.div
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex-1 flex flex-col items-center"
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-1",
                  MOVES.find(m => m.id === opponentMove)!.color
                )}>
                  {(() => { const M = MOVES.find(m => m.id === opponentMove)!; return <M.icon className="w-8 h-8 text-white" />; })()}
                </div>
                <span className="text-xs text-red-300 font-bold">{opponentName.slice(0, 6)}</span>
              </motion.div>
            </div>

            {/* Clash flash */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute inset-0 bg-white/20 pointer-events-none"
            />
          </motion.div>
        )}

        {/* ─── ROUND RESULT ─── */}
        {phase === "roundResult" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gradient-to-b from-purple-950/90 to-black/90 border border-purple-500/30 rounded-3xl p-6 text-center overflow-hidden"
          >
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              className={cn(
                "text-3xl font-black mb-2",
                lastRoundWinner === "player" ? "text-green-400" :
                lastRoundWinner === "opponent" ? "text-red-400" : "text-yellow-400"
              )}
            >
              {lastRoundWinner === "player" ? "HIT! ⚡" :
               lastRoundWinner === "opponent" ? "BLOCKED! 💥" : "CLASH! 🔥"}
            </motion.p>
            <p className="text-sm text-muted-foreground">
              {playerScore} - {opponentScore}
            </p>
          </motion.div>
        )}

        {/* ─── FINAL RESULT ─── */}
        {phase === "finalResult" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gradient-to-b from-purple-950/90 to-black/90 border border-yellow-500/40 rounded-3xl p-8 text-center overflow-hidden"
          >
            <EnergyParticles color={playerWon ? "bg-yellow-400" : "bg-red-400"} />

            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {playerWon ? (
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-3 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
              ) : (
                <Skull className="w-16 h-16 text-red-400 mx-auto mb-3 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
              )}
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "text-3xl font-black mb-1",
                playerWon
                  ? "bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent"
                  : "text-red-400"
              )}
            >
              {playerWon ? "VICTORY!" : "DEFEAT"}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-muted-foreground mb-1"
            >
              {playerScore} - {opponentScore}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className={cn(
                "text-lg font-bold mb-5",
                playerWon ? "text-yellow-300" : "text-red-300"
              )}
            >
              {playerWon ? "+300 XP ⚡" : "+80 XP"}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              onClick={() => onEnd(playerWon)}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-sm text-white font-bold shadow-lg"
            >
              Back to Chat
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
