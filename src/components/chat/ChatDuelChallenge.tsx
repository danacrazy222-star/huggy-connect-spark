import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Trophy, Search, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Move = "rock" | "paper" | "scissors";
type Phase = "idle" | "searching" | "matched" | "vote" | "picking" | "clash" | "round_result" | "final_result";

const MOVE_EMOJI: Record<Move, string> = { rock: "🪨", paper: "📄", scissors: "✂️" };
const MOVES: Move[] = ["rock", "paper", "scissors"];

function resolveRPS(a: Move, b: Move): "a" | "b" | "draw" {
  if (a === b) return "draw";
  if ((a === "rock" && b === "scissors") || (a === "scissors" && b === "paper") || (a === "paper" && b === "rock")) return "a";
  return "b";
}

const NameWithLevel = ({ name, level, className }: { name: string; level: number; className?: string }) => (
  <div className={cn("flex items-center justify-center gap-1", className)}>
    <span className="text-[11px] font-bold text-foreground truncate max-w-[70px]">{name}</span>
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">Lv.{level}</span>
  </div>
);

interface Props {
  playerName: string;
  playerLevel: number;
  roomId: number;
  onEnd: (won: boolean, winnerName: string, loserName: string) => void;
  onStart?: () => void;
  isRTL?: boolean;
}

export function ChatDuelChallenge({ playerName, playerLevel, roomId, onEnd, onStart, isRTL }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const MOVE_LABEL: Record<Move, string> = { rock: t("duelRock"), paper: t("duelPaper"), scissors: t("duelScissors") };
  
  const [phase, setPhase] = useState<Phase>("idle");
  const [searchTimer, setSearchTimer] = useState(40);
  const [opponentName, setOpponentName] = useState("");
  const [opponentLevel, setOpponentLevel] = useState(1);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [isPlayer1, setIsPlayer1] = useState(true);

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
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const channelRef = useRef<any>(null);

  const clearTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  // Subscribe to match changes via realtime
  const subscribeToMatch = useCallback((id: string) => {
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    
    const channel = supabase
      .channel(`rps-match-${id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rps_matches',
        filter: `id=eq.${id}`,
      }, (payload) => {
        const match = payload.new as any;
        handleMatchUpdate(match);
      })
      .subscribe();
    
    channelRef.current = channel;
  }, []);

  const handleMatchUpdate = useCallback((match: any) => {
    if (!user) return;
    const amPlayer1 = match.player1_id === user.id;
    
    // Opponent joined
    if (match.status === 'matched' && phase === 'searching') {
      if (amPlayer1) {
        setOpponentName(match.player2_name);
        setOpponentLevel(match.player2_level);
      } else {
        setOpponentName(match.player1_name);
        setOpponentLevel(match.player1_level);
      }
      setPhase("matched");
      return;
    }

    // Check if opponent submitted their move
    const myMove = amPlayer1 ? match.player1_move : match.player2_move;
    const oppMove = amPlayer1 ? match.player2_move : match.player1_move;
    
    if (myMove && oppMove && (phase === 'picking' || waitingForOpponent)) {
      // Both moves submitted - resolve
      setOpponentMove(oppMove as Move);
      setPlayerMove(myMove as Move);
      setWaitingForOpponent(false);
      setPhase("clash");
      setShakeIndex(0);
    } else if (oppMove && !myMove && phase === 'picking') {
      // Opponent picked, we haven't yet - no action needed, just keep picking
    }
  }, [user, phase, waitingForOpponent]);

  // Re-register handler when phase changes
  useEffect(() => {
    if (!matchId || !user) return;
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    
    const channel = supabase
      .channel(`rps-match-${matchId}-${phase}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rps_matches',
        filter: `id=eq.${matchId}`,
      }, (payload) => {
        const match = payload.new as any;
        if (!user) return;
        const amPlayer1 = match.player1_id === user.id;

        // Opponent joined
        if (match.status === 'matched' && match.player2_id) {
          if (amPlayer1) {
            setOpponentName(match.player2_name);
            setOpponentLevel(match.player2_level);
          }
          setPhase("matched");
          return;
        }

        // Both moves in
        const myMoveCol = amPlayer1 ? 'player1_move' : 'player2_move';
        const oppMoveCol = amPlayer1 ? 'player2_move' : 'player1_move';
        const myM = match[myMoveCol];
        const oppM = match[oppMoveCol];
        
        if (myM && oppM) {
          setPlayerMove(myM as Move);
          setOpponentMove(oppM as Move);
          setWaitingForOpponent(false);
          setPhase("clash");
          setShakeIndex(0);
        }
      })
      .subscribe();
    
    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, user, phase]);

  // ── SEARCHING: look for existing match or create one ──
  const startSearch = async () => {
    if (!user) return;
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

    // First, cleanup any old stale matches from this user
    await supabase
      .from('rps_matches')
      .delete()
      .eq('player1_id', user.id)
      .eq('status', 'waiting');

    // Also cleanup stale waiting matches older than 2 minutes
    const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    await supabase
      .from('rps_matches')
      .delete()
      .eq('status', 'waiting')
      .lt('created_at', twoMinAgo);

    // Try to find a waiting match in same room
    const { data: waitingMatches } = await supabase
      .from('rps_matches')
      .select('*')
      .eq('status', 'waiting')
      .eq('room_id', roomId)
      .neq('player1_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1);

    if (waitingMatches && waitingMatches.length > 0) {
      const match = waitingMatches[0];
      // Join this match
      const { error } = await supabase
        .from('rps_matches')
        .update({
          player2_id: user.id,
          player2_name: playerName,
          player2_level: playerLevel,
          status: 'matched',
        })
        .eq('id', match.id)
        .eq('status', 'waiting');

      if (!error) {
        setMatchId(match.id);
        setIsPlayer1(false);
        setOpponentName(match.player1_name);
        setOpponentLevel(match.player1_level ?? 1);
        subscribeToMatch(match.id);
        setPhase("matched");
        return;
      }
    }

    // No match found - create one
    const { data: newMatch, error } = await supabase
      .from('rps_matches')
      .insert({
        player1_id: user.id,
        player1_name: playerName,
        player1_level: playerLevel,
        room_id: roomId,
        status: 'waiting',
      } as any)
      .select()
      .single();

    if (newMatch && !error) {
      setMatchId(newMatch.id);
      setIsPlayer1(true);
      subscribeToMatch(newMatch.id);
      startSearchTimer(newMatch.id);
    }
  };

  const startSearchTimer = (id: string) => {
    let timer = 40;
    timerRef.current = setInterval(async () => {
      timer--;
      setSearchTimer(timer);
      
      // Poll every 3 seconds to check if someone joined
      if (timer % 3 === 0 && timer > 0) {
        const { data } = await supabase
          .from('rps_matches')
          .select('*')
          .eq('id', id)
          .single();
        if (data && data.status === 'matched' && data.player2_id) {
          clearTimer();
          setOpponentName(data.player2_name);
          setOpponentLevel(data.player2_level);
          setPhase("matched");
          return;
        }
      }
      
      if (timer <= 0) {
        clearTimer();
        supabase.from('rps_matches').delete().eq('id', id).then(() => {});
        setPhase("idle");
        setMatchId(null);
      }
    }, 1000);
  };

  // ── MATCHED → VOTE after 3s ──
  useEffect(() => {
    if (phase !== "matched") return;
    clearTimer();
    const t = setTimeout(() => {
      setVoteTimer(15);
      setVotePick(null);
      const p = 35 + Math.floor(Math.random() * 30);
      setVotePercent({ player: p, opponent: 100 - p });
      setPhase("vote");
    }, 3000);
    return () => clearTimeout(t);
  }, [phase]);

  // ── VOTE: 15s ──
  useEffect(() => {
    if (phase !== "vote") return;
    timerRef.current = setInterval(() => {
      setVoteTimer((t) => {
        setVotePercent((prev) => {
          const shift = Math.floor(Math.random() * 5) - 2;
          const np = Math.max(20, Math.min(80, prev.player + shift));
          return { player: np, opponent: 100 - np };
        });
        if (t <= 1) {
          clearTimer();
          startRound();
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

  const startRound = async () => {
    setRoundWinner(null);
    setPlayerMove(null);
    setOpponentMove(null);
    setRoundTimer(10);
    setWaitingForOpponent(false);
    
    // Clear moves in DB
    if (matchId) {
      await supabase
        .from('rps_matches')
        .update({
          player1_move: null,
          player2_move: null,
          current_round: round,
          status: 'playing',
        })
        .eq('id', matchId);
    }
    
    setPhase("picking");
  };

  // ── PICKING: 10s per round ──
  useEffect(() => {
    if (phase !== "picking") return;
    setRoundTimer(10);
    timerRef.current = setInterval(() => {
      setRoundTimer((t) => {
        if (t <= 1) {
          clearTimer();
          // Auto-pick random if didn't pick
          if (!playerMove) {
            handlePick(MOVES[Math.floor(Math.random() * 3)]);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
  }, [phase, round]);

  const handlePick = useCallback(async (move: Move) => {
    if (playerMove || !matchId || !user) return;
    setPlayerMove(move);
    
    const moveCol = isPlayer1 ? 'player1_move' : 'player2_move';
    const oppCol = isPlayer1 ? 'player2_move' : 'player1_move';
    
    // Submit move to DB
    await supabase
      .from('rps_matches')
      .update({ [moveCol]: move })
      .eq('id', matchId);

    // Check if opponent already submitted
    const { data } = await supabase
      .from('rps_matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (data && data[oppCol]) {
      // Both moves are in
      setOpponentMove(data[oppCol] as Move);
      setPhase("clash");
      setShakeIndex(0);
    } else {
      // Wait for opponent
      setWaitingForOpponent(true);
    }
  }, [playerMove, matchId, user, isPlayer1]);

  // Poll for opponent's move when waiting
  useEffect(() => {
    if (!waitingForOpponent || !matchId || !user) return;
    const oppCol = isPlayer1 ? 'player2_move' : 'player1_move';
    const pollInterval = setInterval(async () => {
      const { data } = await supabase
        .from('rps_matches')
        .select('*')
        .eq('id', matchId)
        .single();
      if (data && data[oppCol]) {
        clearInterval(pollInterval);
        setOpponentMove(data[oppCol] as Move);
        setWaitingForOpponent(false);
        setPhase("clash");
        setShakeIndex(0);
      }
    }, 2000);
    return () => clearInterval(pollInterval);
  }, [waitingForOpponent, matchId, user, isPlayer1]);

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

    const timeout = setTimeout(async () => {
      if (newScores.player >= 2) {
        setFinalWinner("player");
        setPhase("final_result");
        // Update match in DB
        if (matchId && user) {
          await supabase.from('rps_matches').update({
            status: 'finished',
            player1_score: isPlayer1 ? newScores.player : newScores.opponent,
            player2_score: isPlayer1 ? newScores.opponent : newScores.player,
            winner_id: user.id,
          }).eq('id', matchId);
        }
      } else if (newScores.opponent >= 2) {
        setFinalWinner("opponent");
        setPhase("final_result");
        if (matchId) {
          const oppId = isPlayer1 ? 'player2_id' : 'player1_id';
          const { data } = await supabase.from('rps_matches').select(oppId).eq('id', matchId).single();
          await supabase.from('rps_matches').update({
            status: 'finished',
            player1_score: isPlayer1 ? newScores.player : newScores.opponent,
            player2_score: isPlayer1 ? newScores.opponent : newScores.player,
            winner_id: data?.[oppId],
          }).eq('id', matchId);
        }
      } else {
        setRound((r) => r + 1);
        setRoundWinner(null);
        setPlayerMove(null);
        setOpponentMove(null);
        // Clear moves for next round
        if (matchId) {
          await supabase.from('rps_matches').update({
            player1_move: null,
            player2_move: null,
            current_round: round + 1,
          }).eq('id', matchId);
        }
        setPhase("picking");
      }
    }, 2500);
    return () => clearTimeout(timeout);
  }, [phase, roundWinner]);

  const handleFinish = () => {
    const playerWon = finalWinner === "player";
    const winnerName = playerWon ? playerName : opponentName;
    const loserName = playerWon ? opponentName : playerName;
    onEnd(playerWon, winnerName, loserName);
    setPhase("idle");
    setMatchId(null);
  };

  // ═══════ IDLE ═══════
  if (phase === "idle") {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto my-3 w-full max-w-xs">
        <button onClick={startSearch} disabled={!user}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-accent via-blue-accent to-accent text-accent-foreground font-bold text-sm border border-accent/30 shadow-purple hover:shadow-[0_0_30px_hsl(270_80%_55%/0.5)] transition-all disabled:opacity-50">
          {t("duelRPS")}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto my-3 w-full max-w-xs">
      <div className="relative rounded-2xl border border-accent/30 bg-gradient-to-b from-purple-deep via-background to-purple-deep backdrop-blur-lg overflow-hidden">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/5 via-blue-accent/5 to-accent/5 pointer-events-none" />

        {/* Round dots */}
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
              <p className="text-sm font-bold text-foreground mb-1">{t("duelSearching")}</p>
              <p className="text-xs text-muted-foreground mb-3">{t("duelSendingInvites")}</p>

              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" opacity={0.3} />
                  <motion.circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--accent))" strokeWidth="3"
                    strokeDasharray={176} strokeDashoffset={176 * (1 - searchTimer / 40)}
                    strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-accent">{searchTimer}</span>
              </div>

              <p className="text-[10px] text-muted-foreground">{t("duelWaitingReal") || "Waiting for a real player..."}</p>
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
                ⚡ {t("duelFoundOpponent")} ⚡
              </motion.p>
            </motion.div>
          )}

          {/* ═══ VOTE ═══ */}
          {phase === "vote" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-primary" />
                <motion.span key={voteTimer} initial={{ scale: 1.4 }} animate={{ scale: 1 }}
                  className={cn("text-lg font-black", voteTimer <= 5 ? "text-destructive" : "text-primary")}>
                  {voteTimer}
                </motion.span>
              </div>
              <p className="text-sm font-bold text-foreground mb-1">{t("duelChooseWinner")}</p>
              <p className="text-[11px] text-muted-foreground mb-3">{t("duelVoteBefore")}</p>

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
                  {votePick === "player" && <span className="text-[10px] text-primary">{t("duelYourVote")}</span>}
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
                  {votePick === "opponent" && <span className="text-[10px] text-primary">{t("duelYourVote")}</span>}
                </motion.button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                  <span>{playerName} {votePercent.player}%</span>
                  <span>{votePercent.opponent}% {opponentName}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-muted/30 overflow-hidden flex">
                  <motion.div className="h-full bg-gradient-to-r from-blue-accent to-accent rounded-l-full"
                    animate={{ width: `${votePercent.player}%` }} transition={{ duration: 0.5 }} />
                  <motion.div className="h-full bg-gradient-to-r from-destructive/80 to-destructive rounded-r-full"
                    animate={{ width: `${votePercent.opponent}%` }} transition={{ duration: 0.5 }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{t("duelLiveVote")}</p>
              </div>
            </motion.div>
          )}

          {/* ═══ PICKING ═══ */}
          {phase === "picking" && !waitingForOpponent && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-primary" />
                <motion.span key={roundTimer} initial={{ scale: 1.4 }} animate={{ scale: 1 }}
                  className={cn("text-lg font-black", roundTimer <= 3 ? "text-destructive" : "text-primary")}>
                  {roundTimer}
                </motion.span>
              </div>
              <p className="text-sm font-bold text-foreground mb-1">✊ {t("duelRound")} {round + 1} — {t("duelChooseMove")}</p>
              <p className="text-[11px] text-muted-foreground mb-4">{t("duelVs")} {opponentName} (Lv.{opponentLevel})</p>

              <div className="grid grid-cols-3 gap-2">
                {MOVES.map((move) => (
                  <motion.button key={move} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }}
                    onClick={() => handlePick(move)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                      playerMove === move
                        ? "border-primary bg-primary/15"
                        : "border-accent/20 bg-accent/5 hover:border-primary/50 hover:bg-primary/10"
                    )}>
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

          {/* ═══ WAITING FOR OPPONENT ═══ */}
          {(phase === "picking" && waitingForOpponent) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                <Search className="w-6 h-6 text-accent mx-auto mb-2" />
              </motion.div>
              <p className="text-sm font-bold text-foreground">{t("duelWaitingOpponent") || "Waiting for opponent..."}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("duelYouPicked") || "You picked"}: {playerMove ? MOVE_EMOJI[playerMove] : ""}</p>
            </motion.div>
          )}

          {/* ═══ CLASH ═══ */}
          {phase === "clash" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              <p className="text-sm font-bold text-primary mb-5">{t("duelRockPaperScissors")}</p>
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
                  <p className="text-sm font-bold text-primary">{t("duelDraw")}</p>
                ) : (
                  <p className="text-sm font-bold text-green-accent">
                    🏆 {roundWinner === "player" ? playerName : opponentName} {t("duelWonRound")}
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

              <motion.div animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.15, 1] }} transition={{ duration: 0.6 }}>
                <Trophy className="w-12 h-12 text-primary mx-auto mb-2 glow-gold" />
              </motion.div>
              <p className="text-lg font-black text-primary mb-1">
                🏆 {finalWinner === "player" ? playerName : opponentName} {t("duelIsWinner")}
              </p>
              <p className="text-xs text-muted-foreground mb-2">{t("duelScore")}: {scores.player} - {scores.opponent}</p>

              {votePick ? (
                votePick === finalWinner ? (
                  <div className="bg-green-accent/10 border border-green-accent/30 rounded-xl p-2 mb-3">
                    <p className="text-sm font-bold text-green-accent">{t("duelVoteCorrect")}</p>
                    <p className="text-xs text-green-accent/80 font-bold">+300 XP</p>
                  </div>
                ) : (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-2 mb-3">
                    <p className="text-sm font-bold text-destructive">{t("duelVoteWrong")}</p>
                    <p className="text-xs text-muted-foreground font-bold">+80 XP</p>
                  </div>
                )
              ) : (
                <div className="bg-muted/20 border border-muted/30 rounded-xl p-2 mb-3">
                  <p className="text-sm font-bold text-muted-foreground">{t("duelDidntVote")}</p>
                  <p className="text-xs text-muted-foreground font-bold">+80 XP</p>
                </div>
              )}

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleFinish}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-accent to-blue-accent text-accent-foreground text-sm font-bold shadow-purple">
                {t("duelDone")}
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
