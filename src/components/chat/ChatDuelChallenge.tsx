import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Trophy, Search, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const PLAYER_NAMES = [
  "Ryuuki", "SakuraBlade", "KenX", "NovaStar", "ZeroHero", "Akira99",
  "Luna_X", "DarkKnight", "MoonWalker", "Phoenix99", "SilverFox",
  "StormRider", "BlazeFire", "IceQueen", "ShadowHunter", "DragonZ",
  "NightOwl", "StarGazer", "ThunderBolt", "CrystalWave", "GhostRider",
  "AlphaWolf", "NeonBlade", "CosmicRay", "VortexKing", "PixelDust",
];

function getRandomName(exclude: string): string {
  const filtered = PLAYER_NAMES.filter((n) => n !== exclude);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

type Move = "rock" | "paper" | "scissors";
type Phase = "idle" | "searching" | "matched" | "vote" | "picking" | "clash" | "round_result" | "final_result";

const MOVE_EMOJI: Record<Move, string> = { rock: "🪨", paper: "📄", scissors: "✂️" };
const MOVE_LABEL: Record<Move, string> = { rock: "حجر", paper: "ورقة", scissors: "مقص" };

function resolveRPS(a: Move, b: Move): "a" | "b" | "draw" {
  if (a === b) return "draw";
  if ((a === "rock" && b === "scissors") || (a === "scissors" && b === "paper") || (a === "paper" && b === "rock")) return "a";
  return "b";
}

const MOVES: Move[] = ["rock", "paper", "scissors"];

const NameWithLevel = ({ name, level, className }: { name: string; level: number; className?: string }) => (
  <div className={cn("flex items-center justify-center gap-1", className)}>
    <span className="text-[11px] font-bold text-foreground truncate max-w-[70px]">{name}</span>
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">Lv.{level}</span>
  </div>
);

interface Props {
  playerName: string;
  playerLevel: number;
  onEnd: (won: boolean, winnerName: string, loserName: string) => void;
  onStart?: () => void;
  isRTL?: boolean;
}

export function ChatDuelChallenge({ playerName, playerLevel, onEnd, onStart, isRTL }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [searchTimer, setSearchTimer] = useState(40);
  const [opponentName, setOpponentName] = useState("");
  const [opponentLevel, setOpponentLevel] = useState(1);

  // Vote phase
  const [voteTimer, setVoteTimer] = useState(15);
  const [votePick, setVotePick] = useState<"player" | "opponent" | null>(null);
  const [votePercent, setVotePercent] = useState({ player: 50, opponent: 50 });

  // Round state
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [roundTimer, setRoundTimer] = useState(10);
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [opponentMove, setOpponentMove] = useState<Move | null>(null);
  const [roundWinner, setRoundWinner] = useState<"player" | "opponent" | "draw" | null>(null);
  const [finalWinner, setFinalWinner] = useState<"player" | "opponent" | null>(null);
  const [shakeIndex, setShakeIndex] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  // ── SEARCHING: full 40s, bot joins if no one ──
  useEffect(() => {
    if (phase !== "searching") return;
    timerRef.current = setInterval(() => {
      setSearchTimer((t) => {
        if (t <= 1) {
          clearTimer();
          // No real player → bot with real name
          setOpponentName(getRandomName(playerName));
          setOpponentLevel(Math.max(1, playerLevel + Math.floor(Math.random() * 7) - 3));
          setPhase("matched");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
  }, [phase, playerName]);

  // Simulate a "real" player joining randomly between 5-30s
  useEffect(() => {
    if (phase !== "searching") return;
    const joinDelay = (5 + Math.floor(Math.random() * 25)) * 1000;
    const timeout = setTimeout(() => {
      if (phase === "searching") {
        clearTimer();
        setOpponentName(getRandomName(playerName));
        setOpponentLevel(Math.max(1, playerLevel + Math.floor(Math.random() * 7) - 3));
        setSearchTimer(0);
        setPhase("matched");
      }
    }, joinDelay);
    return () => clearTimeout(timeout);
  }, [phase, playerName]);

  // ── MATCHED → VOTE after 3s ──
  useEffect(() => {
    if (phase !== "matched") return;
    const t = setTimeout(() => {
      setVoteTimer(15);
      setVotePick(null);
      // Random vote percentages
      const p = 35 + Math.floor(Math.random() * 30);
      setVotePercent({ player: p, opponent: 100 - p });
      setPhase("vote");
    }, 3000);
    return () => clearTimeout(t);
  }, [phase]);

  // ── VOTE: 15s to choose who wins ──
  useEffect(() => {
    if (phase !== "vote") return;
    timerRef.current = setInterval(() => {
      setVoteTimer((t) => {
        // Simulate vote % shifting
        setVotePercent((prev) => {
          const shift = Math.floor(Math.random() * 5) - 2;
          const np = Math.max(20, Math.min(80, prev.player + shift));
          return { player: np, opponent: 100 - np };
        });
        if (t <= 1) {
          clearTimer();
          // Start round 1
          startFirstRound();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
  }, [phase]);

  const handleVote = (pick: "player" | "opponent") => {
    setVotePick(pick);
  };

  const startFirstRound = () => {
    setRound(0);
    setScores({ player: 0, opponent: 0 });
    setRoundWinner(null);
    setFinalWinner(null);
    setPlayerMove(null);
    setOpponentMove(null);
    setRoundTimer(10);
    setPhase("picking");
  };

  // ── PICKING: 10s per round ──
  useEffect(() => {
    if (phase !== "picking") return;
    setRoundTimer(10);
    setPlayerMove(null);
    setOpponentMove(null);
    timerRef.current = setInterval(() => {
      setRoundTimer((t) => {
        if (t <= 1) {
          clearTimer();
          // Auto-pick random
          executeMove(MOVES[Math.floor(Math.random() * 3)]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
  }, [phase, round]);

  const executeMove = useCallback((move: Move) => {
    clearTimer();
    const opp = MOVES[Math.floor(Math.random() * 3)];
    setPlayerMove(move);
    setOpponentMove(opp);
    setPhase("clash");
    setShakeIndex(0);
  }, []);

  const handlePick = useCallback((move: Move) => {
    if (playerMove) return;
    executeMove(move);
  }, [playerMove, executeMove]);

  // ── CLASH animation ──
  useEffect(() => {
    if (phase !== "clash") return;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setShakeIndex(count);
      if (count >= 3) {
        clearInterval(interval);
        setTimeout(() => {
          const result = resolveRPS(playerMove!, opponentMove!);
          const w = result === "a" ? "player" : result === "b" ? "opponent" : "draw";
          setRoundWinner(w);
          setPhase("round_result");
        }, 700);
      }
    }, 600);
    return () => clearInterval(interval);
  }, [phase, playerMove, opponentMove]);

  // ── ROUND RESULT → next or final ──
  useEffect(() => {
    if (phase !== "round_result" || !roundWinner) return;
    const newScores = { ...scores };
    if (roundWinner === "player") newScores.player++;
    else if (roundWinner === "opponent") newScores.opponent++;
    setScores(newScores);

    const t = setTimeout(() => {
      if (newScores.player >= 2) {
        setFinalWinner("player");
        setPhase("final_result");
      } else if (newScores.opponent >= 2) {
        setFinalWinner("opponent");
        setPhase("final_result");
      } else {
        setRound((r) => r + 1);
        setRoundWinner(null);
        setPlayerMove(null);
        setOpponentMove(null);
        setPhase("picking");
      }
    }, 2500);
    return () => clearTimeout(t);
  }, [phase, roundWinner]);

  const startSearch = () => {
    onStart?.();
    setPhase("searching");
    setSearchTimer(40);
    setOpponentName("");
    setVotePick(null);
    setRound(0);
    setScores({ player: 0, opponent: 0 });
    setRoundWinner(null);
    setFinalWinner(null);
    setPlayerMove(null);
    setOpponentMove(null);
  };

  const handleFinish = () => {
    const playerWon = finalWinner === "player";
    const winnerName = playerWon ? playerName : opponentName;
    const loserName = playerWon ? opponentName : playerName;
    onEnd(playerWon, winnerName, loserName);
    setPhase("idle");
  };

  // ═══════ IDLE ═══════
  if (phase === "idle") {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto my-3 w-full max-w-xs">
        <button onClick={startSearch}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-accent via-blue-accent to-accent text-accent-foreground font-bold text-sm border border-accent/30 shadow-purple hover:shadow-[0_0_30px_hsl(270_80%_55%/0.5)] transition-all">
          ✊✋✌️ تحدي حجر ورقة مقص
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto my-3 w-full max-w-xs">
      <div className="relative rounded-2xl border border-accent/30 bg-gradient-to-b from-purple-deep via-background to-purple-deep backdrop-blur-lg overflow-hidden">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/5 via-blue-accent/5 to-accent/5 pointer-events-none" />

        {/* Round dots — show during game rounds */}
        {["picking", "clash", "round_result", "final_result"].includes(phase) && (
          <div className="relative flex items-center justify-center gap-2 pt-3 pb-1">
            {[0, 1, 2].map((r) => (
              <div key={r} className={cn(
                "w-7 h-2 rounded-full transition-all duration-500",
                r < round + (["round_result", "final_result"].includes(phase) ? 1 : 0)
                  ? scores.player > scores.opponent ? "bg-green-accent" : scores.opponent > scores.player ? "bg-destructive" : "bg-primary"
                  : r === round && phase === "picking" ? "bg-primary/60 animate-pulse" : "bg-muted"
              )} />
            ))}
            <span className="text-[10px] text-muted-foreground ml-2 font-bold">{scores.player} - {scores.opponent}</span>
          </div>
        )}

        <div className="relative p-4">

          {/* ═══ SEARCHING ═══ */}
          {phase === "searching" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                <Search className="w-8 h-8 text-accent mx-auto mb-2" />
              </motion.div>
              <p className="text-sm font-bold text-foreground mb-1">🔍 البحث عن لاعب...</p>
              <p className="text-xs text-muted-foreground mb-3">جاري إرسال دعوات للاعبين المتاحين</p>

              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" opacity={0.3} />
                  <motion.circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--accent))" strokeWidth="3"
                    strokeDasharray={176} strokeDashoffset={176 * (1 - searchTimer / 40)}
                    strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-accent">{searchTimer}</span>
              </div>

              {/* Scrolling player names */}
              <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{PLAYER_NAMES[searchTimer % PLAYER_NAMES.length]}</span>
                </motion.div>
                <span className="text-muted">•</span>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.7 }} className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{PLAYER_NAMES[(searchTimer * 3) % PLAYER_NAMES.length]}</span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ═══ MATCHED (VS) ═══ */}
          {phase === "matched" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(10)].map((_, i) => (
                  <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-primary"
                    style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%` }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 2, 0], y: [0, -25] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.12 }} />
                ))}
              </div>
              <div className="flex items-center justify-between gap-3">
                <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring" }} className="flex-1 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-blue-accent to-accent flex items-center justify-center text-xl font-bold text-accent-foreground mb-1 shadow-[0_0_15px_hsl(210_90%_55%/0.5)]">
                    {playerName.charAt(0).toUpperCase()}
                  </div>
                  <NameWithLevel name={playerName} level={playerLevel} />
                </motion.div>
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }}>
                  <span className="text-3xl font-black text-gold-gradient drop-shadow-lg">VS</span>
                </motion.div>
                <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.15 }} className="flex-1 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-destructive to-accent flex items-center justify-center text-xl font-bold text-accent-foreground mb-1 shadow-[0_0_15px_hsl(var(--destructive)/0.5)]">
                    {opponentName.charAt(0).toUpperCase()}
                  </div>
                  <NameWithLevel name={opponentName} level={opponentLevel} />
                </motion.div>
              </div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-xs text-primary mt-3">
                ⚡ تم العثور على خصم! استعد... ⚡
              </motion.p>
            </motion.div>
          )}

          {/* ═══ VOTE: 15s choose who wins + live vote bar ═══ */}
          {phase === "vote" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-primary" />
                <motion.span key={voteTimer} initial={{ scale: 1.4 }} animate={{ scale: 1 }}
                  className={cn("text-lg font-black", voteTimer <= 5 ? "text-destructive" : "text-primary")}>
                  {voteTimer}
                </motion.span>
              </div>
              <p className="text-sm font-bold text-foreground mb-1">🎯 اختر من الرابح!</p>
              <p className="text-[11px] text-muted-foreground mb-3">صوّت قبل ما يبدأ التحدي</p>

              {/* Vote buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.93 }}
                  onClick={() => handleVote("player")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    votePick === "player"
                      ? "border-primary bg-primary/15 shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                      : "border-accent/20 bg-accent/5 hover:border-primary/40"
                  )}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-accent to-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                    {playerName.charAt(0).toUpperCase()}
                  </div>
                  <NameWithLevel name={playerName} level={playerLevel} />
                  {votePick === "player" && <span className="text-[10px] text-primary">✓ صوتك</span>}
                </motion.button>

                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.93 }}
                  onClick={() => handleVote("opponent")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    votePick === "opponent"
                      ? "border-primary bg-primary/15 shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                      : "border-accent/20 bg-accent/5 hover:border-primary/40"
                  )}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-destructive to-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                    {opponentName.charAt(0).toUpperCase()}
                  </div>
                  <NameWithLevel name={opponentName} level={opponentLevel} />
                  {votePick === "opponent" && <span className="text-[10px] text-primary">✓ صوتك</span>}
                </motion.button>
              </div>

              {/* Live vote bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                  <span>{playerName} (Lv.{playerLevel}) {votePercent.player}%</span>
                  <span>{votePercent.opponent}% {opponentName} (Lv.{opponentLevel})</span>
                </div>
                <div className="w-full h-3 rounded-full bg-muted/30 overflow-hidden flex">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-accent to-accent rounded-l-full"
                    animate={{ width: `${votePercent.player}%` }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div
                    className="h-full bg-gradient-to-r from-destructive/80 to-destructive rounded-r-full"
                    animate={{ width: `${votePercent.opponent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">📊 نسبة التصويت الحي</p>
              </div>
            </motion.div>
          )}

          {/* ═══ PICKING: 10s per round ═══ */}
          {phase === "picking" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-primary" />
                <motion.span key={roundTimer} initial={{ scale: 1.4 }} animate={{ scale: 1 }}
                  className={cn("text-lg font-black", roundTimer <= 3 ? "text-destructive" : "text-primary")}>
                  {roundTimer}
                </motion.span>
              </div>
              <p className="text-sm font-bold text-foreground mb-1">✊ الجولة {round + 1} — اختر حركتك!</p>
              <p className="text-[11px] text-muted-foreground mb-4">ضد {opponentName} (Lv.{opponentLevel})</p>

              <div className="grid grid-cols-3 gap-2">
                {MOVES.map((move) => (
                  <motion.button key={move} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }}
                    onClick={() => handlePick(move)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-accent/20 bg-accent/5 hover:border-primary/50 hover:bg-primary/10 transition-all">
                    <motion.span className="text-3xl" animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: MOVES.indexOf(move) * 0.2 }}>
                      {MOVE_EMOJI[move]}
                    </motion.span>
                    <span className="text-[10px] font-bold text-foreground">{MOVE_LABEL[move]}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ CLASH ═══ */}
          {phase === "clash" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              <p className="text-sm font-bold text-primary mb-5">⚡ حجر... ورقة... مقص!</p>
              <div className="flex items-center justify-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    animate={shakeIndex < 3 ? { y: [0, -20, 0], rotate: [0, -5, 0] } : {}}
                    transition={{ duration: 0.35, repeat: shakeIndex < 3 ? Infinity : 0 }}>
                    <span className="text-5xl">{shakeIndex >= 3 ? MOVE_EMOJI[playerMove!] : "✊"}</span>
                  </motion.div>
                  <NameWithLevel name={playerName} level={playerLevel} className="text-[10px]" />
                </div>
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-xl font-black text-primary">⚔️</motion.span>
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    animate={shakeIndex < 3 ? { y: [0, -20, 0], rotate: [0, 5, 0] } : {}}
                    transition={{ duration: 0.35, repeat: shakeIndex < 3 ? Infinity : 0, delay: 0.15 }}>
                    <span className="text-5xl">{shakeIndex >= 3 ? MOVE_EMOJI[opponentMove!] : "✊"}</span>
                  </motion.div>
                  <NameWithLevel name={opponentName} level={opponentLevel} className="text-[10px]" />
                </div>
              </div>
              {shakeIndex >= 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.4, 0] }} transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-primary/20 pointer-events-none rounded-2xl" />
              )}
            </motion.div>
          )}

          {/* ═══ ROUND RESULT ═══ */}
          {phase === "round_result" && roundWinner && playerMove && opponentMove && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-3">
              <div className="flex items-center justify-center gap-6 mb-3">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center border-2 text-3xl transition-all",
                    roundWinner === "player" ? "border-green-accent bg-green-accent/10 shadow-[0_0_15px_hsl(var(--green-accent)/0.4)]" : "border-muted bg-muted/10"
                  )}>
                    {MOVE_EMOJI[playerMove]}
                  </div>
                  <NameWithLevel name={playerName} level={playerLevel} className="text-[10px]" />
                </div>
                <span className="text-lg font-black text-muted-foreground">vs</span>
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center border-2 text-3xl transition-all",
                    roundWinner === "opponent" ? "border-green-accent bg-green-accent/10 shadow-[0_0_15px_hsl(var(--green-accent)/0.4)]" : "border-muted bg-muted/10"
                  )}>
                    {MOVE_EMOJI[opponentMove]}
                  </div>
                  <NameWithLevel name={opponentName} level={opponentLevel} className="text-[10px]" />
                </div>
              </div>
              <motion.div initial={{ y: 10 }} animate={{ y: 0 }}>
                {roundWinner === "draw" ? (
                  <p className="text-sm font-bold text-primary">🤝 تعادل! إعادة الجولة...</p>
                ) : (
                  <p className="text-sm font-bold text-green-accent">
                    🏆 {roundWinner === "player" ? playerName : opponentName} فاز بالجولة!
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* ═══ FINAL RESULT ═══ */}
          {phase === "final_result" && finalWinner && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-3">
              {/* Confetti */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(14)].map((_, i) => (
                  <motion.div key={i} className="absolute w-2 h-2 rounded-full"
                    style={{ left: `${10 + Math.random() * 80}%`,
                      background: ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--blue-accent))", "hsl(var(--green-accent))"][i % 4] }}
                    initial={{ top: "50%", opacity: 0 }}
                    animate={{ top: `${-10 + Math.random() * 30}%`, opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                    transition={{ duration: 1.5, delay: i * 0.06, repeat: 2 }} />
                ))}
              </div>

              {/* Winner announcement */}
              <motion.div animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.15, 1] }} transition={{ duration: 0.6 }}>
                <Trophy className="w-12 h-12 text-primary mx-auto mb-2 glow-gold" />
              </motion.div>
              <p className="text-lg font-black text-primary mb-1">
                🏆 {finalWinner === "player" ? playerName : opponentName} هو الفائز!
              </p>
              <p className="text-xs text-muted-foreground mb-2">النتيجة: {scores.player} - {scores.opponent}</p>

              {/* Your vote result */}
              {votePick ? (
                votePick === finalWinner ? (
                  <div className="bg-green-accent/10 border border-green-accent/30 rounded-xl p-2 mb-3">
                    <p className="text-sm font-bold text-green-accent">🎉 صوتك صحيح!</p>
                    <p className="text-xs text-green-accent/80 font-bold">+300 XP</p>
                  </div>
                ) : (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-2 mb-3">
                    <p className="text-sm font-bold text-destructive">😔 صوتك خاطئ</p>
                    <p className="text-xs text-muted-foreground font-bold">+80 XP</p>
                  </div>
                )
              ) : (
                <div className="bg-muted/20 border border-muted/30 rounded-xl p-2 mb-3">
                  <p className="text-sm font-bold text-muted-foreground">لم تصوّت</p>
                  <p className="text-xs text-muted-foreground font-bold">+80 XP</p>
                </div>
              )}

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleFinish}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-accent to-blue-accent text-accent-foreground text-sm font-bold shadow-purple">
                تم ✓
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
