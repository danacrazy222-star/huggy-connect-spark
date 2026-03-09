import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Timer, Trophy, Search, User, Sparkles } from "lucide-react";
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

const DiceIcon = ({ value, className }: { value: number; className?: string }) => {
  const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const Icon = icons[Math.max(0, Math.min(5, value - 1))];
  return <Icon className={className} />;
};

type Phase = "idle" | "searching" | "matched" | "rolling" | "round_result" | "final_result";

interface Props {
  playerName: string;
  onEnd: (won: boolean) => void;
  isRTL?: boolean;
}

export function ChatDuelChallenge({ playerName, onEnd, isRTL }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [searchTimer, setSearchTimer] = useState(40);
  const [opponentName, setOpponentName] = useState("");

  // Dice state
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [playerDice, setPlayerDice] = useState(1);
  const [opponentDice, setOpponentDice] = useState(1);
  const [rollingTick, setRollingTick] = useState(0);
  const [roundWinner, setRoundWinner] = useState<"player" | "opponent" | "draw" | null>(null);
  const [finalWinner, setFinalWinner] = useState<"player" | "opponent" | null>(null);
  const [showDiceGlow, setShowDiceGlow] = useState(false);

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

  // ── MATCHED → auto start first roll after 2.5s ──
  useEffect(() => {
    if (phase !== "matched") return;
    const t = setTimeout(() => startRoll(), 2500);
    return () => clearTimeout(t);
  }, [phase]);

  // ── ROLLING animation ──
  useEffect(() => {
    if (phase !== "rolling") return;
    let tick = 0;
    const maxTicks = 15;
    const interval = setInterval(() => {
      tick++;
      setRollingTick(tick);
      setPlayerDice(Math.ceil(Math.random() * 6));
      setOpponentDice(Math.ceil(Math.random() * 6));
      if (tick >= maxTicks) {
        clearInterval(interval);
        // Final values
        const pVal = Math.ceil(Math.random() * 6);
        const oVal = Math.ceil(Math.random() * 6);
        setPlayerDice(pVal);
        setOpponentDice(oVal);
        setShowDiceGlow(true);

        setTimeout(() => {
          let w: "player" | "opponent" | "draw";
          if (pVal > oVal) w = "player";
          else if (oVal > pVal) w = "opponent";
          else w = "draw";
          setRoundWinner(w);
          setPhase("round_result");
        }, 800);
      }
    }, 80 + tick * 8);
    return () => clearInterval(interval);
  }, [phase, round]);

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
        // Next round (handle draw by replaying)
        setRound((r) => r + 1);
        setRoundWinner(null);
        setShowDiceGlow(false);
        startRoll();
      }
    }, 2500);
    return () => clearTimeout(t);
  }, [phase, roundWinner]);

  const startRoll = () => {
    setRollingTick(0);
    setRoundWinner(null);
    setShowDiceGlow(false);
    setPhase("rolling");
  };

  const startSearch = () => {
    setPhase("searching");
    setSearchTimer(40);
    setOpponentName("");
    setRound(0);
    setScores({ player: 0, opponent: 0 });
    setRoundWinner(null);
    setFinalWinner(null);
    setShowDiceGlow(false);
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
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-accent via-blue-accent to-accent text-accent-foreground font-bold text-sm border border-accent/30 shadow-[0_0_20px_hsl(270_80%_55%/0.3)] hover:shadow-[0_0_30px_hsl(270_80%_55%/0.5)] transition-all">
          <Dice6 className="w-5 h-5" />
          🎲 تحدي الزهر اليومي
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto my-3 w-full max-w-xs">
      <div className="relative rounded-2xl border border-accent/30 bg-gradient-to-b from-purple-deep via-background to-purple-deep backdrop-blur-lg overflow-hidden">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/10 via-blue-accent/10 to-accent/10 animate-pulse pointer-events-none" />

        {/* Round dots */}
        {phase !== "searching" && phase !== "matched" && (
          <div className="relative flex items-center justify-center gap-2 pt-3 pb-1">
            {[0, 1, 2].map((r) => (
              <div key={r} className={cn(
                "w-7 h-2 rounded-full transition-all duration-500",
                r < round + (phase === "round_result" || phase === "final_result" ? 1 : 0)
                  ? roundWinner === "player" || scores.player > scores.opponent ? "bg-blue-accent" : "bg-destructive"
                  : r === round && phase === "rolling" ? "bg-primary/60 animate-pulse" : "bg-muted"
              )} />
            ))}
            <span className="text-[10px] text-muted-foreground ml-2 font-bold">
              {scores.player} - {scores.opponent}
            </span>
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
              {/* Particles */}
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

          {/* ═══ ROLLING DICE ═══ */}
          {phase === "rolling" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <p className="text-sm font-bold text-primary mb-4">🎲 الجولة {round + 1} — رمي الزهر!</p>

              <div className="flex items-center justify-between gap-4">
                {/* Player dice */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-[11px] font-bold text-foreground truncate max-w-[80px]">{playerName}</p>
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 10, -10, 0], scale: [1, 1.1, 0.95, 1.05, 1] }}
                    transition={{ duration: 0.15, repeat: rollingTick < 15 ? Infinity : 0 }}
                    className="relative"
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-xl bg-gradient-to-br from-blue-accent/20 to-accent/20 border-2 border-blue-accent/40 flex items-center justify-center transition-all duration-300",
                      showDiceGlow && "border-primary shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                    )}>
                      <DiceIcon value={playerDice} className={cn("w-10 h-10 text-blue-accent transition-all", showDiceGlow && "text-primary")} />
                    </div>
                  </motion.div>
                  {showDiceGlow && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl font-black text-foreground">
                      {playerDice}
                    </motion.span>
                  )}
                </div>

                {/* VS */}
                <div className="shrink-0">
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}
                    className="text-xl font-black text-muted-foreground">⚔️</motion.span>
                </div>

                {/* Opponent dice */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-[11px] font-bold text-foreground truncate max-w-[80px]">{opponentName}</p>
                  <motion.div
                    animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 0.95, 1.1, 1.05, 1] }}
                    transition={{ duration: 0.15, repeat: rollingTick < 15 ? Infinity : 0 }}
                    className="relative"
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-xl bg-gradient-to-br from-destructive/20 to-accent/20 border-2 border-destructive/40 flex items-center justify-center transition-all duration-300",
                      showDiceGlow && "border-primary shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                    )}>
                      <DiceIcon value={opponentDice} className={cn("w-10 h-10 text-destructive transition-all", showDiceGlow && "text-primary")} />
                    </div>
                  </motion.div>
                  {showDiceGlow && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl font-black text-foreground">
                      {opponentDice}
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ ROUND RESULT ═══ */}
          {phase === "round_result" && roundWinner && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-2">
              {/* Dice results */}
              <div className="flex items-center justify-center gap-6 mb-3">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all",
                    roundWinner === "player" ? "border-green-accent bg-green-accent/10 shadow-[0_0_15px_hsl(var(--green-accent)/0.4)]" : "border-destructive/30 bg-destructive/5"
                  )}>
                    <DiceIcon value={playerDice} className={cn("w-9 h-9", roundWinner === "player" ? "text-green-accent" : "text-muted-foreground")} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[60px]">{playerName}</span>
                </div>

                <span className="text-lg font-black text-muted-foreground">vs</span>

                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all",
                    roundWinner === "opponent" ? "border-green-accent bg-green-accent/10 shadow-[0_0_15px_hsl(var(--green-accent)/0.4)]" : "border-destructive/30 bg-destructive/5"
                  )}>
                    <DiceIcon value={opponentDice} className={cn("w-9 h-9", roundWinner === "opponent" ? "text-green-accent" : "text-muted-foreground")} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[60px]">{opponentName}</span>
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
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-2">
              {/* Confetti */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <motion.div key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: `${10 + Math.random() * 80}%`,
                      background: ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--blue-accent))", "hsl(var(--green-accent))"][i % 4]
                    }}
                    initial={{ top: "50%", opacity: 0 }}
                    animate={{ top: `${-10 + Math.random() * 30}%`, opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                    transition={{ duration: 1.5, delay: i * 0.08, repeat: 2 }} />
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

              <p className="text-xs text-muted-foreground mt-1 mb-3">
                النتيجة: {scores.player} - {scores.opponent}
              </p>

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
