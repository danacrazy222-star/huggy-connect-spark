import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { Zap } from "lucide-react";

type ReactorPlayer = {
  name: string;
  xp: number;
  frozen: boolean;
  avatar: string;
};

type ReactorEvent = {
  type: "boost" | "theft" | "overload" | "freeze";
  message: string;
  targetPlayer?: string;
  victimPlayer?: string;
};

interface CrystalReactorProps {
  playerName: string;
  isRTL?: boolean;
}

const BOT_NAMES = ["Nova", "Zara", "Rex"];
const BOT_AVATARS = ["🤖", "👾", "🛸"];
const ENERGY_PER_TAP = 1;
const XP_PER_TAP = 2;
const XP_PER_TAP_BOOSTED = 4;
const MAX_ENERGY = 100;
const EVENT_INTERVAL = 5000;
const ROUND_RESTART_DELAY = 3000;

export function CrystalReactor({ playerName, isRTL }: CrystalReactorProps) {
  const { t } = useTranslation();
  const [energy, setEnergy] = useState(0);
  const [players, setPlayers] = useState<ReactorPlayer[]>([]);
  const [activeEvent, setActiveEvent] = useState<ReactorEvent | null>(null);
  const [isBoosted, setIsBoosted] = useState(false);
  const [roundOver, setRoundOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [tapPulse, setTapPulse] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const eventTimerRef = useRef<ReturnType<typeof setInterval>>();
  const botTimerRef = useRef<ReturnType<typeof setInterval>>();
  const playerFrozenRef = useRef(false);

  // Initialize players
  const initRound = useCallback(() => {
    setEnergy(0);
    setRoundOver(false);
    setWinner(null);
    setActiveEvent(null);
    setIsBoosted(false);
    playerFrozenRef.current = false;
    setPlayers([
      { name: playerName, xp: 0, frozen: false, avatar: "⚡" },
      ...BOT_NAMES.map((name, i) => ({ name, xp: 0, frozen: false, avatar: BOT_AVATARS[i] })),
    ]);
  }, [playerName]);

  useEffect(() => {
    initRound();
  }, [initRound]);

  // Bot tapping logic
  useEffect(() => {
    if (roundOver) return;
    botTimerRef.current = setInterval(() => {
      setPlayers((prev) => {
        const updated = [...prev];
        // Random bot taps
        for (let i = 1; i < updated.length; i++) {
          if (updated[i].frozen) continue;
          if (Math.random() < 0.3) {
            updated[i] = { ...updated[i], xp: updated[i].xp + XP_PER_TAP };
          }
        }
        return updated;
      });
      setEnergy((prev) => {
        const botTaps = Math.random() < 0.3 ? 1 : 0;
        return Math.min(prev + botTaps, MAX_ENERGY);
      });
    }, 800);
    return () => clearInterval(botTimerRef.current);
  }, [roundOver]);

  // Random events
  useEffect(() => {
    if (roundOver) return;
    eventTimerRef.current = setInterval(() => {
      if (Math.random() > 0.6) return; // 40% chance of event

      const eventType = ["boost", "theft", "overload", "freeze"][Math.floor(Math.random() * 4)] as ReactorEvent["type"];

      setPlayers((prev) => {
        const updated = [...prev];
        let event: ReactorEvent;

        switch (eventType) {
          case "boost":
            event = { type: "boost", message: "⚡ Energy Boost! +4 XP per tap for 5s" };
            setIsBoosted(true);
            setTimeout(() => setIsBoosted(false), 5000);
            break;

          case "theft": {
            const thief = Math.floor(Math.random() * updated.length);
            let victim = Math.floor(Math.random() * updated.length);
            while (victim === thief) victim = Math.floor(Math.random() * updated.length);
            const stolen = Math.min(15, updated[victim].xp);
            updated[thief] = { ...updated[thief], xp: updated[thief].xp + stolen };
            updated[victim] = { ...updated[victim], xp: Math.max(0, updated[victim].xp - stolen) };
            event = {
              type: "theft",
              message: `🕵️ ${updated[thief].name} stole ${stolen} XP from ${updated[victim].name}!`,
              targetPlayer: updated[thief].name,
              victimPlayer: updated[victim].name,
            };
            break;
          }

          case "overload":
            event = { type: "overload", message: "💥 Reactor Overload! All players -10 XP" };
            for (let i = 0; i < updated.length; i++) {
              updated[i] = { ...updated[i], xp: Math.max(0, updated[i].xp - 10) };
            }
            break;

          case "freeze": {
            const target = Math.floor(Math.random() * updated.length);
            updated[target] = { ...updated[target], frozen: true };
            if (target === 0) playerFrozenRef.current = true;
            event = { type: "freeze", message: `🧊 ${updated[target].name} is frozen for 3s!` };
            setTimeout(() => {
              setPlayers((p) => {
                const u = [...p];
                if (u[target]) u[target] = { ...u[target], frozen: false };
                return u;
              });
              if (target === 0) playerFrozenRef.current = false;
            }, 3000);
            break;
          }
        }

        setActiveEvent(event!);
        setTimeout(() => setActiveEvent(null), 3000);
        return updated;
      });
    }, EVENT_INTERVAL);
    return () => clearInterval(eventTimerRef.current);
  }, [roundOver]);

  // Check win condition
  useEffect(() => {
    if (energy >= MAX_ENERGY && !roundOver) {
      setRoundOver(true);
      clearInterval(eventTimerRef.current);
      clearInterval(botTimerRef.current);

      const sorted = [...players].sort((a, b) => b.xp - a.xp);
      setWinner(sorted[0]?.name || null);

      setTimeout(() => {
        setRoundNumber((prev) => prev + 1);
        initRound();
      }, ROUND_RESTART_DELAY);
    }
  }, [energy, roundOver, players, initRound]);

  // Player tap
  const handleTap = useCallback(() => {
    if (roundOver || playerFrozenRef.current) return;
    const xpGain = isBoosted ? XP_PER_TAP_BOOSTED : XP_PER_TAP;
    setPlayers((prev) => {
      const updated = [...prev];
      updated[0] = { ...updated[0], xp: updated[0].xp + xpGain };
      return updated;
    });
    setEnergy((prev) => Math.min(prev + ENERGY_PER_TAP, MAX_ENERGY));
    setTapPulse(true);
    setTimeout(() => setTapPulse(false), 150);
  }, [roundOver, isBoosted]);

  const energyPercent = Math.min((energy / MAX_ENERGY) * 100, 100);
  const sortedPlayers = [...players].sort((a, b) => b.xp - a.xp);

  const getEventColor = (type: string) => {
    switch (type) {
      case "boost": return "bg-green-accent/20 border-green-accent/40 text-green-accent";
      case "theft": return "bg-accent/20 border-accent/40 text-accent";
      case "overload": return "bg-red-accent/20 border-red-accent/40 text-red-accent";
      case "freeze": return "bg-blue-accent/20 border-blue-accent/40 text-blue-accent";
      default: return "bg-card/80 border-border";
    }
  };

  return (
    <div className="w-full my-2">
      <div className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">💎</span>
            <span className="font-display text-xs font-bold text-foreground tracking-wide">CRYSTAL REACTOR</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">R{roundNumber}</span>
        </div>

        {/* Energy bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Energy</span>
            <span className={cn("font-bold font-mono", energyPercent >= 80 ? "text-primary" : "text-foreground")}>
              {Math.round(energyPercent)}%
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
            <motion.div
              className={cn(
                "h-full rounded-full transition-colors duration-300",
                energyPercent < 30
                  ? "bg-blue-accent"
                  : energyPercent < 70
                  ? "bg-accent"
                  : "bg-gradient-to-r from-primary to-gold-light"
              )}
              animate={{ width: `${energyPercent}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          </div>
        </div>

        {/* Event banner */}
        <div className="h-7 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {activeEvent && (
              <motion.div
                key={activeEvent.message}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={cn("text-[10px] font-bold px-3 py-1 rounded-full border", getEventColor(activeEvent.type))}
              >
                {activeEvent.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reactor + Tap button */}
        <div className="flex flex-col items-center gap-2">
          <motion.button
            onPointerDown={handleTap}
            disabled={roundOver || players[0]?.frozen}
            animate={{
              scale: tapPulse ? 0.92 : 1,
              boxShadow: isBoosted
                ? "0 0 30px hsl(140 70% 45% / 0.5)"
                : tapPulse
                ? "0 0 20px hsl(270 80% 55% / 0.5)"
                : "0 0 10px hsl(270 80% 55% / 0.2)",
            }}
            transition={{ duration: 0.1 }}
            className={cn(
              "relative w-24 h-24 rounded-full border-2 flex items-center justify-center",
              "bg-gradient-to-b from-accent/30 to-accent/5",
              players[0]?.frozen
                ? "border-blue-accent/60 opacity-50 cursor-not-allowed"
                : isBoosted
                ? "border-green-accent/60"
                : "border-accent/40 active:border-primary/60",
              roundOver && "opacity-40 cursor-not-allowed"
            )}
          >
            <motion.span
              className="text-4xl"
              animate={isBoosted ? { rotate: [0, 5, -5, 0] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              💎
            </motion.span>
            {players[0]?.frozen && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-blue-accent/20">
                <span className="text-2xl">🧊</span>
              </div>
            )}
          </motion.button>
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider",
            players[0]?.frozen ? "text-blue-accent" : "text-muted-foreground"
          )}>
            {players[0]?.frozen ? "FROZEN!" : roundOver ? "ROUND OVER" : "TAP TO CHARGE"}
          </span>
        </div>

        {/* Players scoreboard */}
        <div className="grid grid-cols-2 gap-1.5">
          {sortedPlayers.map((p, i) => (
            <div
              key={p.name}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[11px]",
                p.name === playerName
                  ? "bg-primary/10 border-primary/30"
                  : "bg-muted/30 border-border/50",
                p.frozen && "opacity-50"
              )}
            >
              <span className="text-sm">{p.avatar}</span>
              <span className={cn("flex-1 font-medium truncate", p.name === playerName ? "text-primary" : "text-foreground")}>
                {p.name === playerName ? "You" : p.name}
              </span>
              <div className="flex items-center gap-0.5">
                <Zap className="w-3 h-3 text-primary" />
                <span className="font-mono font-bold text-foreground">{p.xp}</span>
              </div>
              {i === 0 && <span className="text-[9px]">👑</span>}
            </div>
          ))}
        </div>

        {/* Round over overlay */}
        <AnimatePresence>
          {roundOver && winner && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-center space-y-1"
            >
              <span className="text-2xl">🏆</span>
              <p className="text-xs font-bold text-primary">
                {winner === playerName ? "You win!" : `${winner} wins!`}
              </p>
              <p className="text-[10px] text-muted-foreground">New round starting...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
