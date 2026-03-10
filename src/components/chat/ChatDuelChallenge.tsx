import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { Trophy, Zap } from "lucide-react";

import avatarMale2 from "@/assets/avatar-male-2.png";
import avatarFemale2 from "@/assets/avatar-female-2.png";

type RPSChoice = "rock" | "paper" | "scissors" | null;
type DuelPhase = "waiting" | "choosing" | "reveal" | "result";

interface ChatDuelChallengeProps {
  playerName: string;
  playerLevel: number;
  onEnd: (won: boolean, winnerName: string, loserName: string) => void;
  onStart?: () => void;
  isRTL?: boolean;
}

const CHOICES: { key: RPSChoice; emoji: string; label: string }[] = [
  { key: "rock", emoji: "✊", label: "Rock" },
  { key: "paper", emoji: "✋", label: "Paper" },
  { key: "scissors", emoji: "✌️", label: "Scissors" },
];

const BOT_NAMES = ["Omar", "Noor", "Sara", "Rex"];
const BOT_AVATARS = [avatarMale2, avatarFemale2, avatarMale2, avatarFemale2];

function getWinner(a: RPSChoice, b: RPSChoice): "a" | "b" | "draw" {
  if (a === b) return "draw";
  if (
    (a === "rock" && b === "scissors") ||
    (a === "paper" && b === "rock") ||
    (a === "scissors" && b === "paper")
  ) return "a";
  return "b";
}

export function ChatDuelChallenge({ playerName, playerLevel, onEnd, onStart, isRTL }: ChatDuelChallengeProps) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<DuelPhase>("waiting");
  const [playerChoice, setPlayerChoice] = useState<RPSChoice>(null);
  const [botChoice, setBotChoice] = useState<RPSChoice>(null);
  const [botName] = useState(() => BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]);
  const [botAvatar] = useState(() => BOT_AVATARS[Math.floor(Math.random() * BOT_AVATARS.length)]);
  const [botLevel] = useState(() => Math.floor(Math.random() * 10) + 3);
  const [round, setRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [resultText, setResultText] = useState("");
  const maxRounds = 3;

  const startDuel = useCallback(() => {
    onStart?.();
    setPhase("choosing");
    setPlayerChoice(null);
    setBotChoice(null);
  }, [onStart]);

  const makeChoice = useCallback((choice: RPSChoice) => {
    if (phase !== "choosing" || !choice) return;
    setPlayerChoice(choice);

    const botPick = CHOICES[Math.floor(Math.random() * 3)].key;
    setBotChoice(botPick);
    setPhase("reveal");

    setTimeout(() => {
      const result = getWinner(choice, botPick);
      if (result === "a") {
        setPlayerScore((s) => s + 1);
        setResultText(`${playerName} wins! 🎉`);
      } else if (result === "b") {
        setBotScore((s) => s + 1);
        setResultText(`${botName} wins! 😤`);
      } else {
        setResultText("Draw! 🤝");
      }
      setPhase("result");
    }, 1500);
  }, [phase, playerName, botName]);

  // Next round or end
  useEffect(() => {
    if (phase !== "result") return;
    const timer = setTimeout(() => {
      if (round >= maxRounds) {
        const playerWon = playerScore > botScore || (playerScore === botScore);
        onEnd(
          playerWon,
          playerWon ? playerName : botName,
          playerWon ? botName : playerName
        );
      } else {
        setRound((r) => r + 1);
        setPhase("choosing");
        setPlayerChoice(null);
        setBotChoice(null);
        setResultText("");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [phase, round, playerScore, botScore, playerName, botName, onEnd]);

  const getChoiceEmoji = (c: RPSChoice) => CHOICES.find((ch) => ch.key === c)?.emoji || "❓";

  return (
    <div className="w-full my-2">
      <div className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚔️</span>
            <span className="font-display text-xs font-bold text-foreground tracking-wide">
              {t("duelRPS")}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            R{round}/{maxRounds}
          </span>
        </div>

        {phase === "waiting" ? (
          /* Lobby */
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xl">⚡</div>
                <span className="text-[11px] font-bold text-foreground">{playerName}</span>
                <span className="text-[9px] text-muted-foreground">Lv.{playerLevel}</span>
              </div>
              <span className="text-xl font-bold text-muted-foreground">VS</span>
              <div className="flex flex-col items-center gap-1">
                <img src={botAvatar} alt={botName} className="w-12 h-12 rounded-full border border-accent/30 object-cover" />
                <span className="text-[11px] font-bold text-foreground">{botName}</span>
                <span className="text-[9px] text-muted-foreground">Lv.{botLevel}</span>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={startDuel}
              className="px-6 py-2.5 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-gold-dark via-primary to-gold-dark text-primary-foreground shadow-gold"
            >
              ⚔️ {t("startDuel") || "START DUEL"}
            </motion.button>
          </div>
        ) : (
          <>
            {/* Score */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-foreground font-bold">{playerName}</span>
                <span className="text-lg font-bold text-primary">{playerScore}</span>
              </div>
              <span className="text-muted-foreground text-xs">—</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-accent">{botScore}</span>
                <span className="text-[11px] text-foreground font-bold">{botName}</span>
              </div>
            </div>

            {/* Arena */}
            <div className="flex items-center justify-center gap-8 py-2">
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <span className="text-3xl">
                    {phase === "choosing" ? "❓" : getChoiceEmoji(playerChoice)}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">{playerName}</span>
              </div>
              <span className="text-lg font-bold text-muted-foreground">VS</span>
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {phase === "choosing" ? (
                      <motion.span
                        key="thinking"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                        className="text-3xl"
                      >
                        🤔
                      </motion.span>
                    ) : (
                      <motion.span
                        key="choice"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-3xl"
                      >
                        {getChoiceEmoji(botChoice)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-[10px] text-muted-foreground">{botName}</span>
              </div>
            </div>

            {/* Choice buttons */}
            {phase === "choosing" && (
              <div className="flex justify-center gap-3">
                {CHOICES.map((c) => (
                  <motion.button
                    key={c.key}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => makeChoice(c.key)}
                    className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-muted/40 border border-border hover:border-primary/40 transition-colors"
                  >
                    <span className="text-3xl">{c.emoji}</span>
                    <span className="text-[9px] text-muted-foreground">{c.label}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Result text */}
            {resultText && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm font-bold text-foreground"
              >
                {resultText}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
