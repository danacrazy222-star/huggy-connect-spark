import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Trophy, Search, User, Sparkles, Hand, Shield, Scissors } from "lucide-react";
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
type Phase = "idle" | "searching" | "matched" | "picking" | "clash" | "round_result" | "final_result";

const MOVE_EMOJI: Record<Move, string> = { rock: "🪨", paper: "📄", scissors: "✂️" };
const MOVE_LABEL: Record<Move, string> = { rock: "حجر", paper: "ورقة", scissors: "مقص" };

function resolveRPS(a: Move, b: Move): "a" | "b" | "draw" {
  if (a === b) return "draw";
  if ((a === "rock" && b === "scissors") || (a === "scissors" && b === "paper") || (a === "paper" && b === "rock")) return "a";
  return "b";
}

const MOVES: Move[] = ["rock", "paper", "scissors"];

interface Props {
  playerName: string;
  onEnd: (won: boolean) => void;
  isRTL?: boolean;
}

export function ChatDuelChallenge({ playerName, onEnd, isRTL }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [searchTimer, setSearchTimer] = useState(40);
  const [opponentName, setOpponentName] = useState("");

  const [round, setRound] = useState(0);
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [pickTimer, setPickTimer] = useState(15);
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [opponentMove, setOpponentMove] = useState<Move | null>(null);
  const [roundWinner, setRoundWinner] = useState<"player" | "opponent" | "draw" | null>(null);
  const [finalWinner, setFinalWinner] = useState<"player" | "opponent" | null>(null);
  const [shakeIndex, setShakeIndex] = useState(0);

  const pickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── SEARCHING ──
  useEffect(() => {
    if (phase !== "searching") return;
    const joinDelay = 3 + Math.floor(Math.random() * 7);
    let joined = false;
    const timer = setInterval(() => {
      setSearchTimer((t) => {
        if (!joined && t <= 40 - joinDelay) {
          joined = true;
          clearInterval(timer);
          setOpponentName(getRandomName(playerName));
          setPhase("matched");
          return 0;
        }
        if (t <= 1) {
          clearInterval(timer);
          setOpponentName(getRandomName(playerName));
          setPhase("matched");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, playerName]);

  // ── MATCHED → PICKING after 2.5s ──
  useEffect(() => {
    if (phase !== "matched") return;
    const t = setTimeout(() => {
      setPhase("picking");
      setPickTimer(15);
      setPlayerMove(null);
      setOpponentMove(null);
    }, 2500);
    return () => clearTimeout(t);
  }, [phase]);

  // ── PICKING: 15s countdown ──
  useEffect(() => {
    if (phase !== "picking") return;
    pickTimerRef.current = setInterval(() => {
      setPickTimer((t) => {
        if (t <= 1) {
          // Auto-pick random if time runs out
          const auto = MOVES[Math.floor(Math.random() * 3)];
          executeMove(auto);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (pickTimerRef.current) clearInterval(pickTimerRef.current); };
  }, [phase, round]);

  const executeMove = useCallback((move: Move) => {
    if (pickTimerRef.current) clearInterval(pickTimerRef.current);
    const opp = MOVES[Math.floor(Math.random() * 3)];
    setPlayerMove(move);
    setOpponentMove(opp);
    setPhase("clash");
    setShakeIndex(0);
  }, []);

  // ── CLASH animation (3 shakes then reveal) ──
  useEffect(() => {
    if (phase !== "clash") return;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setShakeIndex(count);
      if (count >= 3) {
        clearInterval(interval);
        setTimeout(() => {
          // Resolve
          const result = resolveRPS(playerMove!, opponentMove!);
          const w = result === "a" ? "player" : result === "b" ? "opponent" : "draw";
          setRoundWinner(w);
          setPhase("round_result");
        }, 600);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [phase, playerMove, opponentMove]);

  // ── ROUND RESULT → next round or final ──
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
        setPickTimer(15);
      }
    }, 2500);
    return () => clearTimeout(t);
  }, [phase, roundWinner]);

  const handlePick = useCallback((move: Move) => {
    if (playerMove) return;
    executeMove(move);
  }, [playerMove, executeMove]);

  const startSearch = () => {
    setPhase("searching");
    setSearchTimer(40);
    setOpponentName("");
    setRound(0);
    setScores({ player: 0, opponent: 0 });
    setRoundWinner(null);
    setFinalWinner(null);
    setPlayerMove(null);
    setOpponentMove(null);
  };

  const handleFinish = () => {
    onEnd(finalWinner === "player");
    setPhase("idle");
  };

  // ═══ IDLE ═══
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
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/10 via-blue-accent/10 to-accent/10 animate-pulse pointer-events-none" />

        {/* Round indicator */}
        {!["searching", "matched"].includes(phase) && (
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
              <p className="text-xs text-muted-foreground mb-3">جاري إرسال دعوات للاعبين</p>
              <div className="relative w-16 h-16 mx-auto mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" opacity={0.3} />
                  <motion.circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--accent))" strokeWidth="3"
                    strokeDasharray={176} animate={{ strokeDashoffset: 176 * (1 - searchTimer / 40) }}
                    transition={{ duration: 0.5 }} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-accent">{searchTimer}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{PLAYER_NAMES[Math.floor(searchTimer * 1.7) % PLAYER_NAMES.length]}</span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ═══ MATCHED (VS) ═══ */}
          {phase === "matched" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-primary"
                    style={{ left: `${15 + Math.random() * 70}%`, top: `${10 + Math.random() * 80}%` }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 2, 0], y: [0, -30] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
              <div className="flex items-center justify-between gap-3">
                <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring" }} className="flex-1 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-blue-accent to-accent flex items-center justify-center text-xl font-bold text-accent-foreground mb-1 shadow-[0_0_15px_hsl(210_90%_55%/0.5)]">
                    {playerName.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-xs font-bold text-foreground truncate">{playerName}</p>
                </motion.div>
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }}>
                  <span className="text-3xl font-black text-gold-gradient drop-shadow-lg">VS</span>
                </motion.div>
                <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.15 }} className="flex-1 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-destructive to-accent flex items-center justify-center text-xl font-bold text-accent-foreground mb-1 shadow-[0_0_15px_hsl(var(--destructive)/0.5)]">
                    {opponentName.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-xs font-bold text-foreground truncate">{opponentName}</p>
                </motion.div>
              </div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-xs text-primary mt-3">
                ⚡ تم العثور على خصم! ⚡
              </motion.p>
            </motion.div>
          )}

          {/* ═══ PICKING (15s) ═══ */}
          {phase === "picking" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-primary" />
                <motion.span key={pickTimer} initial={{ scale: 1.4 }} animate={{ scale: 1 }}
                  className={cn("text-lg font-black", pickTimer <= 5 ? "text-destructive" : "text-primary")}>
                  {pickTimer}
                </motion.span>
              </div>
              <p className="text-sm font-bold text-foreground mb-1">✊ الجولة {round + 1} — اختر حركتك!</p>
              <p className="text-[11px] text-muted-foreground mb-4">ضد {opponentName}</p>

              <div className="grid grid-cols-3 gap-2">
                {MOVES.map((move) => (
                  <motion.button key={move} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }}
                    onClick={() => handlePick(move)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-accent/20 bg-accent/5 hover:border-primary/50 hover:bg-primary/10 transition-all">
                    <motion.span className="text-3xl" animate={{ y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: MOVES.indexOf(move) * 0.2 }}>
                      {MOVE_EMOJI[move]}
                    </motion.span>
                    <span className="text-[10px] font-bold text-foreground">{MOVE_LABEL[move]}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ CLASH (shake animation) ═══ */}
          {phase === "clash" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              <p className="text-sm font-bold text-primary mb-5">⚡ حجر... ورقة... مقص!</p>

              <div className="flex items-center justify-center gap-8">
                {/* Player fist shaking */}
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    animate={shakeIndex < 3 ? { y: [0, -20, 0], rotate: [0, -5, 0] } : {}}
                    transition={{ duration: 0.3, repeat: shakeIndex < 3 ? Infinity : 0 }}
                  >
                    <span className="text-5xl">{shakeIndex >= 3 ? MOVE_EMOJI[playerMove!] : "✊"}</span>
                  </motion.div>
                  <span className="text-[10px] font-bold text-muted-foreground">{playerName}</span>
                </div>

                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-xl font-black text-primary">⚔️</motion.span>

                {/* Opponent fist shaking */}
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    animate={shakeIndex < 3 ? { y: [0, -20, 0], rotate: [0, 5, 0] } : {}}
                    transition={{ duration: 0.3, repeat: shakeIndex < 3 ? Infinity : 0, delay: 0.15 }}
                  >
                    <span className="text-5xl">{shakeIndex >= 3 ? MOVE_EMOJI[opponentMove!] : "✊"}</span>
                  </motion.div>
                  <span className="text-[10px] font-bold text-muted-foreground">{opponentName}</span>
                </div>
              </div>

              {/* Flash */}
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
                  <span className="text-[10px] font-bold text-muted-foreground">{playerName}</span>
                </div>

                <span className="text-lg font-black text-muted-foreground">vs</span>

                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center border-2 text-3xl transition-all",
                    roundWinner === "opponent" ? "border-green-accent bg-green-accent/10 shadow-[0_0_15px_hsl(var(--green-accent)/0.4)]" : "border-muted bg-muted/10"
                  )}>
                    {MOVE_EMOJI[opponentMove]}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">{opponentName}</span>
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

              {finalWinner === "player" ? (
                <>
                  <motion.div animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }}>
                    <Trophy className="w-12 h-12 text-primary mx-auto mb-2 glow-gold" />
                  </motion.div>
                  <p className="text-lg font-black text-primary mb-1">🎉 أنت الفائز!</p>
                  <p className="text-xs text-green-accent font-bold">+300 XP</p>
                </>
              ) : (
                <>
                  <motion.div animate={{ scale: [1, 0.9, 1] }} transition={{ duration: 0.5 }}>
                    <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  </motion.div>
                  <p className="text-lg font-black text-destructive mb-1">😔 خسرت هذه المرة</p>
                  <p className="text-xs text-muted-foreground font-bold">+80 XP</p>
                </>
              )}

              <p className="text-xs text-muted-foreground mt-1 mb-3">النتيجة: {scores.player} - {scores.opponent}</p>

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
