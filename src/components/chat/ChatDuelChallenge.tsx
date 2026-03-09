import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Timer, Trophy, Skull, Sparkles, User, Zap, Shield, Flame } from "lucide-react";
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

type Phase = "idle" | "searching" | "matched" | "picking" | "round_fight" | "round_result" | "final_result";

interface Props {
  playerName: string;
  onEnd: (won: boolean) => void;
  isRTL?: boolean;
}

export function ChatDuelChallenge({ playerName, onEnd, isRTL }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [searchTimer, setSearchTimer] = useState(40);
  const [opponentName, setOpponentName] = useState("");
  const [pickTimer, setPickTimer] = useState(15);
  const [playerPick, setPlayerPick] = useState<"player" | "opponent" | null>(null);

  // Rounds state — best of 3
  const [round, setRound] = useState(0); // 0-based current round
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [roundWinner, setRoundWinner] = useState<"player" | "opponent" | null>(null);
  const [fightStep, setFightStep] = useState(0);
  const [finalWinner, setFinalWinner] = useState<"player" | "opponent" | null>(null);

  const pickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── SEARCHING: 40s countdown, opponent joins in 3-9s ──
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
    }, 2500);
    return () => clearTimeout(t);
  }, [phase]);

  // ── PICKING: 15s to choose ──
  useEffect(() => {
    if (phase !== "picking") return;
    pickTimerRef.current = setInterval(() => {
      setPickTimer((t) => {
        if (t <= 1) {
          // Auto-pick randomly
          const autoPick = Math.random() > 0.5 ? "player" : "opponent";
          executePick(autoPick);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (pickTimerRef.current) clearInterval(pickTimerRef.current);
    };
  }, [phase, round]);

  const executePick = useCallback((pick: "player" | "opponent") => {
    if (pickTimerRef.current) clearInterval(pickTimerRef.current);
    setPlayerPick(pick);
    setPhase("round_fight");
    setFightStep(0);

    // Animate 4 fight steps
    [1, 2, 3, 4].forEach((s, i) => {
      setTimeout(() => setFightStep(s), (i + 1) * 600);
    });

    // Determine round winner
    setTimeout(() => {
      const w = Math.random() > 0.5 ? "player" : "opponent";
      setRoundWinner(w);
      setPhase("round_result");
    }, 3000);
  }, []);

  const handlePick = useCallback((pick: "player" | "opponent") => {
    if (playerPick) return;
    executePick(pick);
  }, [playerPick, executePick]);

  // ── After round result → next round or final ──
  useEffect(() => {
    if (phase !== "round_result" || !roundWinner) return;

    const newScores = { ...scores };
    if (roundWinner === "player") newScores.player++;
    else newScores.opponent++;

    setScores(newScores);

    const t = setTimeout(() => {
      // Check if someone won best of 3
      if (newScores.player >= 2) {
        setFinalWinner("player");
        setPhase("final_result");
      } else if (newScores.opponent >= 2) {
        setFinalWinner("opponent");
        setPhase("final_result");
      } else {
        // Next round
        setRound((r) => r + 1);
        setPlayerPick(null);
        setRoundWinner(null);
        setFightStep(0);
        setPhase("picking");
        setPickTimer(15);
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [phase, roundWinner]);

  const playerWon = finalWinner === playerPick;

  const startSearch = () => {
    setPhase("searching");
    setSearchTimer(40);
    setOpponentName("");
    setPlayerPick(null);
    setRound(0);
    setScores({ player: 0, opponent: 0 });
    setRoundWinner(null);
    setFinalWinner(null);
    setFightStep(0);
  };

  const handleFinish = () => {
    onEnd(playerWon);
    setPhase("idle");
  };

  // ═══════════════ IDLE ═══════════════
  if (phase === "idle") {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto my-3 w-full max-w-xs">
        <button onClick={startSearch}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white font-bold text-sm border border-purple-400/30 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all">
          <Swords className="w-5 h-5" />
          Daily Duel ⚔️
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto my-3 w-full max-w-xs">
      <div className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/90 via-black/90 to-purple-950/90 backdrop-blur-lg overflow-hidden">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 animate-pulse pointer-events-none" />

        {/* Round indicator */}
        {phase !== "searching" && phase !== "matched" && (
          <div className="relative flex items-center justify-center gap-1.5 pt-3 pb-1">
            {[0, 1, 2].map((r) => (
              <div key={r} className={cn(
                "w-6 h-1.5 rounded-full transition-all duration-300",
                r < round + (phase === "round_result" || phase === "final_result" ? 1 : 0)
                  ? scores.player > scores.opponent ? "bg-blue-400" : scores.opponent > scores.player ? "bg-red-400" : "bg-yellow-400"
                  : r === round && (phase === "picking" || phase === "round_fight") ? "bg-yellow-400/60 animate-pulse" : "bg-white/15"
              )} />
            ))}
            <span className="text-[10px] text-muted-foreground ml-2">
              {scores.player} - {scores.opponent}
            </span>
          </div>
        )}

        <div className="relative p-4">
          {/* ═══ SEARCHING ═══ */}
          {phase === "searching" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <Swords className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-pulse" />
              <p className="text-sm font-bold text-foreground mb-1">🔍 البحث عن لاعب...</p>
              <p className="text-xs text-muted-foreground mb-3">جاري إرسال دعوات للاعبين المتاحين</p>

              <div className="relative w-16 h-16 mx-auto mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" opacity={0.3} />
                  <motion.circle cx="32" cy="32" r="28" fill="none" stroke="hsl(270 80% 55%)" strokeWidth="3"
                    strokeDasharray={176} animate={{ strokeDashoffset: 176 * (1 - searchTimer / 40) }}
                    transition={{ duration: 0.5 }} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-purple-300">{searchTimer}</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{PLAYER_NAMES[Math.floor(searchTimer * 1.7) % PLAYER_NAMES.length]}</span>
                </motion.div>
                <span>•</span>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{PLAYER_NAMES[Math.floor(searchTimer * 2.3) % PLAYER_NAMES.length]}</span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ═══ MATCHED (VS screen) ═══ */}
          {phase === "matched" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              {/* Energy particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div key={i}
                    className="absolute w-1 h-1 rounded-full bg-yellow-400"
                    style={{ left: `${15 + Math.random() * 70}%`, top: `${10 + Math.random() * 80}%` }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 2, 0], y: [0, -30] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between gap-3">
                <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring" }} className="flex-1 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl font-bold text-white mb-1 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    {playerName.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-xs font-bold text-foreground truncate">{playerName}</p>
                </motion.div>

                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }}>
                  <span className="text-3xl font-black bg-gradient-to-b from-yellow-300 via-yellow-500 to-orange-600 bg-clip-text text-transparent drop-shadow-lg">VS</span>
                </motion.div>

                <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.15 }} className="flex-1 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-xl font-bold text-white mb-1 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    {opponentName.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-xs font-bold text-foreground truncate">{opponentName}</p>
                </motion.div>
              </div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-xs text-yellow-300/80 mt-3">
                ⚡ تم العثور على خصم! ⚡
              </motion.p>
            </motion.div>
          )}

          {/* ═══ PICKING (15s choose who wins) ═══ */}
          {phase === "picking" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-yellow-400" />
                <motion.span key={pickTimer} initial={{ scale: 1.4 }} animate={{ scale: 1 }}
                  className={cn("text-lg font-black", pickTimer <= 5 ? "text-red-400" : "text-yellow-300")}>
                  {pickTimer}
                </motion.span>
              </div>
              <p className="text-sm font-bold text-foreground mb-1">🎯 الجولة {round + 1} — اختر الرابح!</p>
              <p className="text-[11px] text-muted-foreground mb-3">من سيفوز بهذه الجولة؟</p>

              <div className="grid grid-cols-2 gap-3">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.93 }} onClick={() => handlePick("player")}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-blue-500/30 bg-blue-500/10 hover:border-blue-400/60 hover:bg-blue-500/20 transition-all">
                  <motion.div animate={{ boxShadow: ["0 0 10px rgba(59,130,246,0.3)", "0 0 25px rgba(59,130,246,0.6)", "0 0 10px rgba(59,130,246,0.3)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-lg font-bold text-white">
                    {playerName.charAt(0).toUpperCase()}
                  </motion.div>
                  <span className="text-xs font-bold text-blue-300 truncate max-w-full">{playerName}</span>
                </motion.button>

                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.93 }} onClick={() => handlePick("opponent")}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-red-500/30 bg-red-500/10 hover:border-red-400/60 hover:bg-red-500/20 transition-all">
                  <motion.div animate={{ boxShadow: ["0 0 10px rgba(239,68,68,0.3)", "0 0 25px rgba(239,68,68,0.6)", "0 0 10px rgba(239,68,68,0.3)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-lg font-bold text-white">
                    {opponentName.charAt(0).toUpperCase()}
                  </motion.div>
                  <span className="text-xs font-bold text-red-300 truncate max-w-full">{opponentName}</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ═══ ROUND FIGHT ═══ */}
          {phase === "round_fight" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
              <p className="text-sm font-bold text-yellow-300 mb-3">⚔️ الجولة {round + 1} — المعركة!</p>

              <div className="flex items-center justify-between gap-2 mb-3">
                <motion.div
                  animate={fightStep % 2 === 1 ? { x: [0, 25, -5, 0], rotate: [0, 5, -3, 0] } : { x: [0, -8, 0] }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 text-center">
                  <div className={cn(
                    "w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-lg font-bold text-white transition-all",
                    fightStep >= 3 && "ring-2 ring-yellow-400 ring-offset-2 ring-offset-black"
                  )}>
                    {playerName.charAt(0).toUpperCase()}
                  </div>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div key={fightStep} initial={{ scale: 0, rotate: -45 }} animate={{ scale: [0, 1.8, 1], rotate: 0 }} exit={{ scale: 0 }} className="shrink-0">
                    {fightStep === 1 && <Zap className="w-9 h-9 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />}
                    {fightStep === 2 && <Swords className="w-9 h-9 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" />}
                    {fightStep === 3 && <Flame className="w-9 h-9 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />}
                    {fightStep === 4 && <Sparkles className="w-9 h-9 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />}
                  </motion.div>
                </AnimatePresence>

                <motion.div
                  animate={fightStep % 2 === 0 && fightStep > 0 ? { x: [0, -25, 5, 0], rotate: [0, -5, 3, 0] } : { x: [0, 8, 0] }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 text-center">
                  <div className={cn(
                    "w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-lg font-bold text-white transition-all",
                    fightStep >= 3 && "ring-2 ring-yellow-400 ring-offset-2 ring-offset-black"
                  )}>
                    {opponentName.charAt(0).toUpperCase()}
                  </div>
                </motion.div>
              </div>

              {/* Hit flash */}
              {fightStep > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-white/10 pointer-events-none rounded-2xl" />
              )}

              <div className="flex justify-center gap-1.5 mt-1">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className={cn("w-2 h-2 rounded-full transition-all", fightStep >= s ? "bg-yellow-400 scale-125" : "bg-white/15")} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ ROUND RESULT ═══ */}
          {phase === "round_result" && roundWinner && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-2">
              <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ type: "spring" }}>
                <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-1" />
              </motion.div>
              <p className="text-sm font-bold text-foreground mb-1">
                🏆 {roundWinner === "player" ? playerName : opponentName} فاز بالجولة {round + 1}!
              </p>
              <p className="text-xs text-muted-foreground">
                النتيجة: <span className="text-blue-300">{scores.player + (roundWinner === "player" ? 1 : 0)}</span>
                {" - "}
                <span className="text-red-300">{scores.opponent + (roundWinner === "opponent" ? 1 : 0)}</span>
              </p>
            </motion.div>
          )}

          {/* ═══ FINAL RESULT ═══ */}
          {phase === "final_result" && finalWinner && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-2">
              {/* Confetti particles */}
              {playerWon && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(12)].map((_, i) => (
                    <motion.div key={i}
                      className={cn("absolute w-1.5 h-1.5 rounded-full", i % 3 === 0 ? "bg-yellow-400" : i % 3 === 1 ? "bg-purple-400" : "bg-blue-400")}
                      style={{ left: `${10 + Math.random() * 80}%`, top: "-5%" }}
                      animate={{ y: [0, 200], opacity: [1, 0], rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)] }}
                      transition={{ duration: 1.5 + Math.random(), delay: i * 0.08, ease: "easeOut" }}
                    />
                  ))}
                </div>
              )}

              <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}>
                {playerWon ? (
                  <Trophy className="w-14 h-14 text-yellow-400 mx-auto mb-2 drop-shadow-[0_0_15px_rgba(234,179,8,0.7)]" />
                ) : (
                  <Skull className="w-14 h-14 text-red-400 mx-auto mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]" />
                )}
              </motion.div>

              <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className={cn("text-2xl font-black mb-1",
                  playerWon ? "bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent" : "text-red-400"
                )}>
                {playerWon ? "🏆 فزت!" : "💀 خسرت!"}
              </motion.p>

              <p className="text-xs text-muted-foreground mb-1">
                النتيجة النهائية: {scores.player} - {scores.opponent}
              </p>
              <p className="text-xs text-muted-foreground mb-1">
                🏆 {finalWinner === "player" ? playerName : opponentName} فاز بالتحدي!
              </p>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className={cn("text-base font-bold mb-3", playerWon ? "text-yellow-300" : "text-red-300")}>
                {playerWon ? "+300 XP ⚡" : "+80 XP"}
              </motion.p>

              <motion.button initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                onClick={handleFinish}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-xs text-white font-bold shadow-lg">
                تم ✓
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
