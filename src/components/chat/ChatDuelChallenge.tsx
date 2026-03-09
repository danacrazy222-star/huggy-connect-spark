import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Timer, Trophy, Skull, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

// Pool of realistic player names
const PLAYER_NAMES = [
  "Ryuuki", "SakuraBlade", "KenX", "NovaStar", "ZeroHero", "Akira99",
  "Luna_X", "DarkKnight", "MoonWalker", "Phoenix99", "SilverFox",
  "StormRider", "BlazeFire", "IceQueen", "ShadowHunter", "DragonZ",
  "NightOwl", "StarGazer", "ThunderBolt", "CrystalWave", "GhostRider",
  "AlphaWolf", "NeonBlade", "CosmicRay", "VortexKing", "PixelDust",
  "OmegaX", "TurboMax", "CyberNova", "AquaFlame", "SteelWing",
];

function getRandomName(exclude: string): string {
  const filtered = PLAYER_NAMES.filter((n) => n !== exclude);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

type Phase =
  | "idle"
  | "searching"
  | "matched"
  | "betting"
  | "fighting"
  | "result";

interface ChatDuelChallengeProps {
  playerName: string;
  onEnd: (won: boolean) => void;
  isRTL?: boolean;
}

export function ChatDuelChallenge({ playerName, onEnd, isRTL }: ChatDuelChallengeProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [searchTimer, setSearchTimer] = useState(40);
  const [opponentName, setOpponentName] = useState("");
  const [playerPick, setPlayerPick] = useState<"player" | "opponent" | null>(null);
  const [winner, setWinner] = useState<"player" | "opponent" | null>(null);
  const [fightStep, setFightStep] = useState(0);

  // Searching phase: countdown 40s, opponent joins randomly in first 10s
  useEffect(() => {
    if (phase !== "searching") return;
    const joinDelay = 3 + Math.floor(Math.random() * 7); // 3–9 seconds
    let joined = false;

    const timer = setInterval(() => {
      setSearchTimer((t) => {
        if (!joined && t <= 40 - joinDelay) {
          joined = true;
          clearInterval(timer);
          const name = getRandomName(playerName);
          setOpponentName(name);
          setPhase("matched");
          return 0;
        }
        if (t <= 1) {
          clearInterval(timer);
          const name = getRandomName(playerName);
          setOpponentName(name);
          setPhase("matched");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, playerName]);

  // Matched → betting after 2.5s
  useEffect(() => {
    if (phase !== "matched") return;
    const t = setTimeout(() => setPhase("betting"), 2500);
    return () => clearTimeout(t);
  }, [phase]);

  // When player picks winner → fight
  const handlePick = useCallback(
    (pick: "player" | "opponent") => {
      if (playerPick) return;
      setPlayerPick(pick);
      setPhase("fighting");
      setFightStep(0);

      // Animate 3 fight steps
      const steps = [1, 2, 3];
      steps.forEach((s, i) => {
        setTimeout(() => setFightStep(s), (i + 1) * 800);
      });

      // Determine winner after fight
      setTimeout(() => {
        const w = Math.random() > 0.5 ? "player" : "opponent";
        setWinner(w);
        setPhase("result");
      }, 3200);
    },
    [playerPick]
  );

  const playerWon = winner === playerPick;

  const startSearch = () => {
    setPhase("searching");
    setSearchTimer(40);
    setOpponentName("");
    setPlayerPick(null);
    setWinner(null);
    setFightStep(0);
  };

  const handleFinish = () => {
    onEnd(playerWon);
    setPhase("idle");
  };

  // ─── IDLE: Show "Start Duel" button ───
  if (phase === "idle") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto my-3 w-full max-w-xs"
      >
        <button
          onClick={startSearch}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white font-bold text-sm border border-purple-400/30 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all"
        >
          <Swords className="w-5 h-5" />
          Daily Duel ⚔️
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto my-3 w-full max-w-xs"
    >
      <div className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/90 via-black/90 to-purple-950/90 backdrop-blur-lg overflow-hidden">
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 animate-pulse pointer-events-none" />

        <div className="relative p-4">
          {/* ─── SEARCHING ─── */}
          {phase === "searching" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Swords className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-pulse" />
              <p className="text-sm font-bold text-foreground mb-1">
                🔍 البحث عن لاعب...
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                جاري إرسال دعوات للاعبين المتاحين
              </p>

              {/* Timer circle */}
              <div className="relative w-16 h-16 mx-auto mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" opacity={0.3} />
                  <motion.circle
                    cx="32" cy="32" r="28" fill="none" stroke="hsl(270 80% 55%)" strokeWidth="3"
                    strokeDasharray={176}
                    animate={{ strokeDashoffset: 176 * (1 - searchTimer / 40) }}
                    transition={{ duration: 0.5 }}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-purple-300">
                  {searchTimer}
                </span>
              </div>

              {/* Scanning names effect */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center gap-1"
                >
                  <User className="w-3 h-3" />
                  <span>{PLAYER_NAMES[Math.floor(searchTimer * 1.7) % PLAYER_NAMES.length]}</span>
                </motion.div>
                <span>•</span>
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  className="flex items-center gap-1"
                >
                  <User className="w-3 h-3" />
                  <span>{PLAYER_NAMES[Math.floor(searchTimer * 2.3) % PLAYER_NAMES.length]}</span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ─── MATCHED ─── */}
          {phase === "matched" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="flex items-center justify-between gap-3">
                <motion.div
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring" }}
                  className="flex-1 text-center"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl font-bold text-white mb-1 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    {playerName.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-xs font-bold text-foreground truncate">{playerName}</p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <span className="text-3xl font-black bg-gradient-to-b from-yellow-300 via-yellow-500 to-orange-600 bg-clip-text text-transparent">
                    VS
                  </span>
                </motion.div>

                <motion.div
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", delay: 0.15 }}
                  className="flex-1 text-center"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-xl font-bold text-white mb-1 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    {opponentName.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-xs font-bold text-foreground truncate">{opponentName}</p>
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xs text-yellow-300/80 mt-3"
              >
                ⚡ تم العثور على خصم! ⚡
              </motion.p>
            </motion.div>
          )}

          {/* ─── BETTING ─── */}
          {phase === "betting" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-sm font-bold text-foreground mb-1">🎯 اختر الرابح!</p>
              <p className="text-xs text-muted-foreground mb-4">من سيفوز في هذا التحدي؟</p>

              <div className="grid grid-cols-2 gap-3">
                {/* Pick Player */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePick("player")}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-blue-500/30 bg-blue-500/10 hover:border-blue-400/60 hover:bg-blue-500/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-lg font-bold text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]">
                    {playerName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-blue-300 truncate max-w-full">
                    {playerName}
                  </span>
                </motion.button>

                {/* Pick Opponent */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePick("opponent")}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-red-500/30 bg-red-500/10 hover:border-red-400/60 hover:bg-red-500/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-lg font-bold text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]">
                    {opponentName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-red-300 truncate max-w-full">
                    {opponentName}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ─── FIGHTING ─── */}
          {phase === "fighting" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-2"
            >
              <p className="text-sm font-bold text-yellow-300 mb-3">⚔️ المعركة بدأت!</p>

              <div className="flex items-center justify-between gap-2 mb-3">
                {/* Player side */}
                <motion.div
                  animate={fightStep % 2 === 1 ? { x: [0, 20, 0] } : { x: [0, -5, 0] }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 text-center"
                >
                  <div className={cn(
                    "w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-lg font-bold text-white",
                    fightStep >= 2 && fightStep % 2 === 0 && "ring-2 ring-yellow-400 ring-offset-2 ring-offset-black"
                  )}>
                    {playerName.charAt(0).toUpperCase()}
                  </div>
                </motion.div>

                {/* Fight effects */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={fightStep}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: [0, 1.5, 1], rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="shrink-0"
                  >
                    {fightStep === 1 && <Sparkles className="w-8 h-8 text-yellow-400" />}
                    {fightStep === 2 && <Swords className="w-8 h-8 text-red-400" />}
                    {fightStep === 3 && <Sparkles className="w-8 h-8 text-purple-400" />}
                  </motion.div>
                </AnimatePresence>

                {/* Opponent side */}
                <motion.div
                  animate={fightStep % 2 === 0 && fightStep > 0 ? { x: [0, -20, 0] } : { x: [0, 5, 0] }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 text-center"
                >
                  <div className={cn(
                    "w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-lg font-bold text-white",
                    fightStep >= 2 && fightStep % 2 === 1 && "ring-2 ring-yellow-400 ring-offset-2 ring-offset-black"
                  )}>
                    {opponentName.charAt(0).toUpperCase()}
                  </div>
                </motion.div>
              </div>

              {/* Hit flashes */}
              {fightStep > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.4, 0] }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-white/10 pointer-events-none rounded-2xl"
                />
              )}

              <div className="flex justify-center gap-1">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      fightStep >= s ? "bg-yellow-400 scale-125" : "bg-muted/30"
                    )}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── RESULT ─── */}
          {phase === "result" && winner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-2"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {playerWon ? (
                  <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2 drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]" />
                ) : (
                  <Skull className="w-12 h-12 text-red-400 mx-auto mb-2 drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
                )}
              </motion.div>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  "text-2xl font-black mb-1",
                  playerWon
                    ? "bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent"
                    : "text-red-400"
                )}
              >
                {playerWon ? "🏆 فزت!" : "💀 خسرت!"}
              </motion.p>

              <p className="text-xs text-muted-foreground mb-1">
                🏆 {winner === "player" ? playerName : opponentName} فاز بالتحدي!
              </p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={cn(
                  "text-base font-bold mb-3",
                  playerWon ? "text-yellow-300" : "text-red-300"
                )}
              >
                {playerWon ? "+300 XP ⚡" : "+80 XP"}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={handleFinish}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-xs text-white font-bold shadow-lg"
              >
                تم ✓
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
