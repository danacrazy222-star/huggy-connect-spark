import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Trophy, Search, Swords, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { playDuelStart, playDuelClash, playDuelWin, playDuelLose } from "@/utils/sounds";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Move = "rock" | "paper" | "scissors";
type Phase = "idle" | "searching" | "matched" | "vote" | "picking" | "clash" | "round_result" | "final_result";
type Role = "idle" | "player" | "spectator";

import avatarMale1 from "@/assets/avatar-male-1.png";
import avatarMale2 from "@/assets/avatar-male-2.png";
import avatarMale3 from "@/assets/avatar-male-3.png";
import avatarFemale1 from "@/assets/avatar-female-1.png";
import avatarFemale2 from "@/assets/avatar-female-2.png";
import avatarFemale3 from "@/assets/avatar-female-3.png";

const BOT_PROFILES = [
  { name: "Ahmed", avatar: avatarMale1, gender: "male" },
  { name: "Sara", avatar: avatarFemale1, gender: "female" },
  { name: "Omar", avatar: avatarMale2, gender: "male" },
  { name: "Noor", avatar: avatarFemale2, gender: "female" },
  { name: "Khalid", avatar: avatarMale3, gender: "male" },
  { name: "Lina", avatar: avatarFemale3, gender: "female" },
  { name: "Youssef", avatar: avatarMale1, gender: "male" },
  { name: "Mira", avatar: avatarFemale1, gender: "female" },
  { name: "Rami", avatar: avatarMale2, gender: "male" },
  { name: "Dana", avatar: avatarFemale3, gender: "female" },
];
const BOT_ID = "bot-00000000-0000-0000-0000-000000000000";

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

  // Role: are we a player or spectator?
  const [role, setRole] = useState<Role>("idle");
  const [phase, setPhase] = useState<Phase>("idle");
  const [searchTimer, setSearchTimer] = useState(40);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [isPlayer1, setIsPlayer1] = useState(true);

  // Match data (visible to all)
  const [p1Name, setP1Name] = useState("");
  const [p1Level, setP1Level] = useState(1);
  const [p2Name, setP2Name] = useState("");
  const [p2Level, setP2Level] = useState(1);
  const [p1Id, setP1Id] = useState("");
  const [p2Id, setP2Id] = useState("");

  // Vote
  const [voteTimer, setVoteTimer] = useState(15);
  const [votePick, setVotePick] = useState<"p1" | "p2" | null>(null);
  const [votePercent, setVotePercent] = useState({ p1: 50, p2: 50 });

  // Round state
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [roundTimer, setRoundTimer] = useState(10);
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [p1Move, setP1Move] = useState<Move | null>(null);
  const [p2Move, setP2Move] = useState<Move | null>(null);
  const [roundWinner, setRoundWinner] = useState<"p1" | "p2" | "draw" | null>(null);
  const [finalWinner, setFinalWinner] = useState<"p1" | "p2" | null>(null);
  const [shakeIndex, setShakeIndex] = useState(0);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [isBotMatch, setIsBotMatch] = useState(false);
  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roomChannelRef = useRef<any>(null);
  const handleUpdateRef = useRef<(match: any) => void>(() => {});

  const clearTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      if (roomChannelRef.current) {
        supabase.removeChannel(roomChannelRef.current);
        roomChannelRef.current = null;
      }
    };
  }, []);

  // Keep handler ref updated
  useEffect(() => {
    handleUpdateRef.current = handleRoomMatchUpdate;
  });

  // ══════ ROOM-LEVEL SUBSCRIPTION ══════
  useEffect(() => {
    if (!user) return;
    if (roomChannelRef.current) {
      supabase.removeChannel(roomChannelRef.current);
      roomChannelRef.current = null;
    }

    const channelName = `room-rps-${roomId}-${user.id.slice(0, 8)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rps_matches',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        const match = payload.new as any;
        if (!match || !match.id) return;
        handleUpdateRef.current(match);
      })
      .subscribe();

    roomChannelRef.current = channel;

    // Reset state on room change
    setPhase("idle");
    setRole("idle");
    setMatchId(null);
    setRound(0);
    setScores({ p1: 0, p2: 0 });
    setFinalWinner(null);
    setPlayerMove(null);
    setP1Move(null);
    setP2Move(null);
    setWaitingForOpponent(false);
    clearTimer();

    // Clean stale matches older than 2 min
    const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    supabase.from('rps_matches').delete().eq('status', 'waiting').lt('created_at', twoMinAgo).then(() => {});

    // Check for existing active match on mount
    checkExistingMatch();

    return () => {
      supabase.removeChannel(channel);
      roomChannelRef.current = null;
    };
  }, [roomId, user?.id]);

  const checkExistingMatch = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('rps_matches')
      .select('*')
      .eq('room_id', roomId)
      .in('status', ['waiting', 'matched', 'playing'])
      .order('created_at', { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      const match = data[0];
      applyMatchState(match);
    }
  }, [user, roomId]);

  const applyMatchState = (match: any) => {
    if (!user) return;
    const amP1 = match.player1_id === user.id;
    const amP2 = match.player2_id === user.id;
    const amPlayer = amP1 || amP2;

    setMatchId(match.id);
    setP1Name(match.player1_name);
    setP1Level(match.player1_level ?? 1);
    setP1Id(match.player1_id);
    setP2Name(match.player2_name ?? '');
    setP2Level(match.player2_level ?? 1);
    setP2Id(match.player2_id ?? '');

    if (amPlayer) {
      setRole("player");
      setIsPlayer1(amP1);
    } else if (match.status !== 'waiting') {
      setRole("spectator");
    }

    if (match.status === 'waiting') {
      if (amP1) {
        // Calculate remaining time from creation
        const elapsed = Math.floor((Date.now() - new Date(match.created_at).getTime()) / 1000);
        const remaining = Math.max(0, 40 - elapsed);
        if (remaining <= 0) {
          // Match expired, clean it up
          supabase.from('rps_matches').delete().eq('id', match.id).then(() => {});
          return;
        }
        setPhase("searching");
        setSearchTimer(remaining);
        startSearchTimer(match.id, remaining);
      }
      // If not the creator, they'll see the "Join" button in idle
    } else if (match.status === 'matched') {
      setPhase("matched");
    } else if (match.status === 'playing') {
      setPhase("picking");
    }
  };

  const handleRoomMatchUpdate = useCallback((match: any) => {
    if (!user) return;
    const amP1 = match.player1_id === user.id;
    const amP2 = match.player2_id === user.id;
    const amPlayer = amP1 || amP2;

    // CRITICAL: Only process matches I'm involved in, or that I'm actively tracking
    // Don't let random room matches corrupt my state
    if (!amPlayer && matchId !== match.id) {
      // It's a new waiting match from someone else — update the join button
      if (match.status === 'waiting' && phase === 'idle') {
        setActiveWaitingMatch(match);
      }
      return;
    }

    // If I'm searching and someone else's match changed, but it's not mine, ignore
    if (!amPlayer && phase === 'searching') {
      return;
    }

    setMatchId(match.id);
    setP1Name(match.player1_name);
    setP1Level(match.player1_level ?? 1);
    setP1Id(match.player1_id);

    // Someone joined MY match
    if (match.status === 'matched' && match.player2_id) {
      clearTimer(); // Stop search timer
      setP2Name(match.player2_name ?? 'Player');
      setP2Level(match.player2_level ?? 1);
      setP2Id(match.player2_id);

      if (amPlayer) {
        setRole("player");
        setIsPlayer1(amP1);
        setPhase("matched");
      } else {
        setRole("spectator");
        setPhase("matched");
      }
      return;
    }

    // Game started playing
    if (match.status === 'playing') {
      if (!amPlayer && role !== "spectator") {
        setRole("spectator");
      }
    }

    // Both moves in - resolve
    if (match.player1_move && match.player2_move) {
      setP1Move(match.player1_move as Move);
      setP2Move(match.player2_move as Move);

      if (amPlayer) {
        setPlayerMove(amP1 ? match.player1_move : match.player2_move);
        setWaitingForOpponent(false);
        setPhase("clash");
        setShakeIndex(0);
      } else {
        setPhase("clash");
        setShakeIndex(0);
      }
    } else if (amPlayer) {
      const myMove = amP1 ? match.player1_move : match.player2_move;
      const oppMove = amP1 ? match.player2_move : match.player1_move;
      if (myMove && !oppMove) {
        setWaitingForOpponent(true);
      }
    }

    // Match finished
    if (match.status === 'finished') {
      const p1Score = match.player1_score ?? 0;
      const p2Score = match.player2_score ?? 0;
      setScores({ p1: p1Score, p2: p2Score });
      setFinalWinner(match.winner_id === match.player1_id ? "p1" : "p2");
      setPhase("final_result");
    }
  }, [user, role, matchId, phase]);

  // ── START SEARCH ──
  const startSearch = async () => {
    if (!user) return;

    // First check if there's already a waiting match to join
    const { data: existingMatches } = await supabase
      .from('rps_matches')
      .select('*')
      .eq('room_id', roomId)
      .eq('status', 'waiting')
      .neq('player1_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1);

    if (existingMatches && existingMatches.length > 0) {
      // Auto-join the existing match instead of creating a new one
      await joinMatch(existingMatches[0].id);
      return;
    }

    onStart?.();

    // Cleanup old matches from this user
    await supabase.from('rps_matches').delete().eq('player1_id', user.id).eq('status', 'waiting');
    const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    await supabase.from('rps_matches').delete().eq('status', 'waiting').lt('created_at', twoMinAgo);

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
      setRole("player");
      setP1Name(playerName);
      setP1Level(playerLevel);
      setP1Id(user.id);
      setPhase("searching");
      setSearchTimer(40);
      startSearchTimer(newMatch.id);
    }
  };

  // ── JOIN MATCH ──
  const joinMatch = async (id: string) => {
    if (!user) return;
    onStart?.();

    const { error } = await supabase
      .from('rps_matches')
      .update({
        player2_id: user.id,
        player2_name: playerName,
        player2_level: playerLevel,
        status: 'matched',
      })
      .eq('id', id)
      .eq('status', 'waiting');

    if (!error) {
      setMatchId(id);
      setIsPlayer1(false);
      setRole("player");
      setP2Name(playerName);
      setP2Level(playerLevel);
      setP2Id(user.id);
      setPhase("matched");
    }
  };

  const startSearchTimer = (id: string, initialTime = 40) => {
    clearTimer();
    let timer = initialTime;
    timerRef.current = setInterval(async () => {
      timer--;
      setSearchTimer(timer);

      if (timer <= 0) {
        clearTimer();
        // Bot fallback — simulate a bot joining
        startBotMatch(id);
      }
    }, 1000);
  };

  // ── BOT FALLBACK ──
  const startBotMatch = (id: string) => {
    const botProfile = BOT_PROFILES[Math.floor(Math.random() * BOT_PROFILES.length)];
    const botLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 5) - 2);

    setIsBotMatch(true);
    setP2Name(botProfile.name);
    setP2Level(botLevel);
    setP2Id(BOT_ID);
    setPhase("matched");

    // No DB update needed for bot — it's all local
  };

  // Bot auto-pick move after a delay during picking phase
  const playerMoveRef = useRef<Move | null>(null);
  playerMoveRef.current = playerMove;

  useEffect(() => {
    if (!isBotMatch || phase !== "picking" || role !== "player") return;
    
    const delay = 2000 + Math.random() * 4000; // 2-6 seconds
    botTimerRef.current = setTimeout(() => {
      const botMove = MOVES[Math.floor(Math.random() * 3)];
      setP2Move(botMove);
      
      // If player already picked, go to clash
      const currentPlayerMove = playerMoveRef.current;
      if (currentPlayerMove) {
        setP1Move(currentPlayerMove);
        setWaitingForOpponent(false);
        setPhase("clash");
        setShakeIndex(0);
      }
    }, delay);
    
    return () => { if (botTimerRef.current) clearTimeout(botTimerRef.current); };
  }, [isBotMatch, phase, round, role]);

  // When player is waiting for bot opponent and bot picks, trigger clash
  useEffect(() => {
    if (!isBotMatch || !waitingForOpponent || !playerMove || !p2Move) return;
    setP1Move(playerMove);
    setWaitingForOpponent(false);
    setPhase("clash");
    setShakeIndex(0);
  }, [isBotMatch, waitingForOpponent, playerMove, p2Move]);

  // ── MATCHED → VOTE after 3s ──
  useEffect(() => {
    if (phase !== "matched") return;
    clearTimer();
    const timeout = setTimeout(() => {
      setVoteTimer(15);
      setVotePick(null);
      const p = 35 + Math.floor(Math.random() * 30);
      setVotePercent({ p1: p, p2: 100 - p });
      setPhase("vote");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [phase]);

  // ── VOTE: 15s ──
  useEffect(() => {
    if (phase !== "vote") return;
    timerRef.current = setInterval(() => {
      setVoteTimer((t) => {
        setVotePercent((prev) => {
          const shift = Math.floor(Math.random() * 5) - 2;
          const np = Math.max(20, Math.min(80, prev.p1 + shift));
          return { p1: np, p2: 100 - np };
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

  const handleVote = (pick: "p1" | "p2") => {
    if (!user) return;
    // Players can't vote for themselves
    if (role === "player") return;
    setVotePick(pick);
  };

  const startRound = async () => {
    setRoundWinner(null);
    setPlayerMove(null);
    setP1Move(null);
    setP2Move(null);
    setRoundTimer(10);
    setWaitingForOpponent(false);

    if (!isBotMatch && matchId && role === "player" && isPlayer1) {
      await supabase.from('rps_matches').update({
        player1_move: null,
        player2_move: null,
        current_round: round,
        status: 'playing',
      }).eq('id', matchId);
    }

    setPhase("picking");
  };

  // ── PICKING: 10s per round ──
  useEffect(() => {
    if (phase !== "picking") return;
    if (role === "spectator") return; // Spectators just watch
    setRoundTimer(10);
    timerRef.current = setInterval(() => {
      setRoundTimer((t) => {
        if (t <= 1) {
          clearTimer();
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
    if (playerMove || !user || role !== "player") return;
    setPlayerMove(move);

    if (isBotMatch) {
      setP1Move(move);
      // If bot already picked, go to clash
      if (p2Move) {
        setWaitingForOpponent(false);
        setPhase("clash");
        setShakeIndex(0);
      } else {
        setWaitingForOpponent(true);
      }
      return;
    }

    if (!matchId) return;
    const moveCol = isPlayer1 ? 'player1_move' : 'player2_move';
    const oppCol = isPlayer1 ? 'player2_move' : 'player1_move';

    await supabase.from('rps_matches').update({ [moveCol]: move }).eq('id', matchId);

    const { data } = await supabase.from('rps_matches').select('*').eq('id', matchId).single();

    if (data && data[oppCol]) {
      setP1Move(data.player1_move as Move);
      setP2Move(data.player2_move as Move);
      setPhase("clash");
      setShakeIndex(0);
    } else {
      setWaitingForOpponent(true);
    }
  }, [playerMove, matchId, user, isPlayer1, role, isBotMatch, p2Move]);

  // Poll for opponent's move when waiting
  useEffect(() => {
    if (!waitingForOpponent || !matchId || !user || role !== "player" || isBotMatch) return;
    const oppCol = isPlayer1 ? 'player2_move' : 'player1_move';
    const pollInterval = setInterval(async () => {
      const { data } = await supabase.from('rps_matches').select('*').eq('id', matchId).single();
      if (data && data[oppCol]) {
        clearInterval(pollInterval);
        setP1Move(data.player1_move as Move);
        setP2Move(data.player2_move as Move);
        setWaitingForOpponent(false);
        setPhase("clash");
        setShakeIndex(0);
      }
    }, 2000);
    return () => clearInterval(pollInterval);
  }, [waitingForOpponent, matchId, user, isPlayer1, role]);

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
          if (p1Move && p2Move) {
            const result = resolveRPS(p1Move, p2Move);
            const w = result === "a" ? "p1" : result === "b" ? "p2" : "draw";
            setRoundWinner(w);
            setPhase("round_result");
          }
        }, 700);
      }
    }, 600);
    return () => clearInterval(interval);
  }, [phase, p1Move, p2Move]);

  // ── ROUND RESULT → next or final ──
  useEffect(() => {
    if (phase !== "round_result" || !roundWinner) return;
    const newScores = { ...scores };
    if (roundWinner === "p1") newScores.p1++;
    else if (roundWinner === "p2") newScores.p2++;
    setScores(newScores);

    const timeout = setTimeout(async () => {
      if (newScores.p1 >= 2) {
        setFinalWinner("p1");
        setPhase("final_result");
        if (!isBotMatch && matchId && role === "player" && isPlayer1) {
          await supabase.from('rps_matches').update({
            status: 'finished',
            player1_score: newScores.p1,
            player2_score: newScores.p2,
            winner_id: p1Id,
          }).eq('id', matchId);
        }
      } else if (newScores.p2 >= 2) {
        setFinalWinner("p2");
        setPhase("final_result");
        if (!isBotMatch && matchId && role === "player" && isPlayer1) {
          await supabase.from('rps_matches').update({
            status: 'finished',
            player1_score: newScores.p1,
            player2_score: newScores.p2,
            winner_id: p2Id,
          }).eq('id', matchId);
        }
      } else {
        setRound((r) => r + 1);
        setRoundWinner(null);
        setPlayerMove(null);
        setP1Move(null);
        setP2Move(null);
        if (!isBotMatch && matchId && role === "player" && isPlayer1) {
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
    if (role === "player") {
      const amP1 = isPlayer1;
      const iWon = (finalWinner === "p1" && amP1) || (finalWinner === "p2" && !amP1);
      const winnerName = finalWinner === "p1" ? p1Name : p2Name;
      const loserName = finalWinner === "p1" ? p2Name : p1Name;
      onEnd(iWon, winnerName, loserName);
    }
    // Reset everything
    setPhase("idle");
    setRole("idle");
    setMatchId(null);
    setRound(0);
    setScores({ p1: 0, p2: 0 });
    setFinalWinner(null);
    setRoundWinner(null);
    setPlayerMove(null);
    setP1Move(null);
    setP2Move(null);
    setVotePick(null);
    setWaitingForOpponent(false);
    setIsBotMatch(false);
    if (botTimerRef.current) { clearTimeout(botTimerRef.current); botTimerRef.current = null; }
    // Clean up DB match if it was a bot match
    if (isBotMatch && matchId) {
      supabase.from('rps_matches').delete().eq('id', matchId).then(() => {});
    }
  };

  // Check for active match to show join button
  const [activeWaitingMatch, setActiveWaitingMatch] = useState<any>(null);

  useEffect(() => {
    if (phase !== "idle" || !user) { setActiveWaitingMatch(null); return; }
    // Poll for waiting matches in room
    const poll = async () => {
      const { data } = await supabase
        .from('rps_matches')
        .select('*')
        .eq('room_id', roomId)
        .eq('status', 'waiting')
        .neq('player1_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        setActiveWaitingMatch(data[0]);
      } else {
        setActiveWaitingMatch(null);
      }
    };
    poll();
    const interval = setInterval(poll, 1500);
    return () => clearInterval(interval);
  }, [phase, roomId, user]);

  // Helper: am I a player in the current match?
  const isSpectator = role === "spectator";
  const isPlayerRole = role === "player";

  // ═══════════ RENDER ═══════════

  // IDLE: show Start or Join
  if (phase === "idle") {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto my-3 w-full max-w-xs space-y-2">
        {/* Join an existing challenge */}
        {activeWaitingMatch && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => joinMatch(activeWaitingMatch.id)}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-green-500/80 to-emerald-600/80 text-white font-bold text-sm border border-green-400/30 shadow-[0_0_20px_hsl(140_60%_40%/0.3)] hover:shadow-[0_0_30px_hsl(140_60%_40%/0.5)] transition-all animate-pulse"
          >
            <Swords className="w-5 h-5" />
            <span>{activeWaitingMatch.player1_name} {t("duelWantsChallenge") || "wants to battle!"} ⚔️</span>
          </motion.button>
        )}

        {/* Start new challenge */}
        <button onClick={startSearch} disabled={!user || !!activeWaitingMatch}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-bold text-sm border transition-all",
            activeWaitingMatch
              ? "bg-muted/30 border-muted/20 text-muted-foreground cursor-not-allowed"
              : "bg-gradient-to-r from-accent via-blue-accent to-accent text-accent-foreground border-accent/30 shadow-purple hover:shadow-[0_0_30px_hsl(270_80%_55%/0.5)]"
          )}>
          {t("duelRPS")}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto my-3 w-full max-w-xs">
      <div className="relative rounded-2xl border border-accent/30 bg-gradient-to-b from-purple-deep via-background to-purple-deep backdrop-blur-lg overflow-hidden">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/5 via-blue-accent/5 to-accent/5 pointer-events-none" />

        {/* Spectator badge */}
        {isSpectator && (
          <div className="relative flex items-center justify-center gap-1.5 pt-2 pb-1">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-primary">{t("duelSpectating") || "👁 Spectating"}</span>
          </div>
        )}

        {/* Round dots */}
        {["picking", "clash", "round_result", "final_result"].includes(phase) && (
          <div className="relative flex items-center justify-center gap-2 pt-3 pb-1">
            {[0, 1, 2].map((r) => (
              <div key={r} className={cn(
                "w-7 h-2 rounded-full transition-all duration-500",
                r < round + (["round_result", "final_result"].includes(phase) ? 1 : 0)
                  ? scores.p1 > scores.p2 ? "bg-green-accent" : scores.p2 > scores.p1 ? "bg-destructive" : "bg-primary"
                  : r === round && phase === "picking" ? "bg-primary/60 animate-pulse" : "bg-muted"
              )} />
            ))}
            <span className="text-[10px] text-muted-foreground ml-2 font-bold">{scores.p1} - {scores.p2}</span>
          </div>
        )}

        <div className="relative p-4">

          {/* ═══ SEARCHING ═══ */}
          {phase === "searching" && isPlayerRole && (
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
                    strokeDasharray={176} strokeDashoffset={176 * (1 - searchTimer / 40)} strokeLinecap="round" />
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
                    {p1Name.charAt(0).toUpperCase()}
                  </div>
                  <NameWithLevel name={p1Name} level={p1Level} />
                </motion.div>
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }}>
                  <span className="text-3xl font-black text-gold-gradient drop-shadow-lg">VS</span>
                </motion.div>
                <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.15 }} className="flex-1 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-destructive to-accent flex items-center justify-center text-xl font-bold text-accent-foreground mb-1 shadow-[0_0_15px_hsl(var(--destructive)/0.5)]">
                    {p2Name.charAt(0).toUpperCase()}
                  </div>
                  <NameWithLevel name={p2Name} level={p2Level} />
                </motion.div>
              </div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-xs text-primary mt-3">
                {isSpectator ? `⚔️ ${t("duelMatchStarting") || "Match starting!"}` : `⚡ ${t("duelFoundOpponent")} ⚡`}
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
              <p className="text-[11px] text-muted-foreground mb-3">
                {isPlayerRole
                  ? (t("duelPlayersCannotVote") || "Players can't vote — get ready to play! 🎮")
                  : (t("duelVoteBefore"))}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <motion.button whileHover={!isPlayerRole ? { scale: 1.03 } : {}} whileTap={!isPlayerRole ? { scale: 0.93 } : {}}
                  onClick={() => handleVote("p1")}
                  disabled={isPlayerRole}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    isPlayerRole ? "opacity-60 cursor-not-allowed border-accent/20 bg-accent/5" :
                    votePick === "p1"
                      ? "border-primary bg-primary/15 shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                      : "border-accent/20 bg-accent/5 hover:border-primary/40"
                  )}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-accent to-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                    {p1Name.charAt(0).toUpperCase()}
                  </div>
                  <NameWithLevel name={p1Name} level={p1Level} />
                  {votePick === "p1" && <span className="text-[10px] text-primary">{t("duelYourVote")}</span>}
                </motion.button>

                <motion.button whileHover={!isPlayerRole ? { scale: 1.03 } : {}} whileTap={!isPlayerRole ? { scale: 0.93 } : {}}
                  onClick={() => handleVote("p2")}
                  disabled={isPlayerRole}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    isPlayerRole ? "opacity-60 cursor-not-allowed border-accent/20 bg-accent/5" :
                    votePick === "p2"
                      ? "border-primary bg-primary/15 shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                      : "border-accent/20 bg-accent/5 hover:border-primary/40"
                  )}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-destructive to-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                    {p2Name.charAt(0).toUpperCase()}
                  </div>
                  <NameWithLevel name={p2Name} level={p2Level} />
                  {votePick === "p2" && <span className="text-[10px] text-primary">{t("duelYourVote")}</span>}
                </motion.button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                  <span>{p1Name} {votePercent.p1}%</span>
                  <span>{votePercent.p2}% {p2Name}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-muted/30 overflow-hidden flex">
                  <motion.div className="h-full bg-gradient-to-r from-blue-accent to-accent rounded-l-full"
                    animate={{ width: `${votePercent.p1}%` }} transition={{ duration: 0.5 }} />
                  <motion.div className="h-full bg-gradient-to-r from-destructive/80 to-destructive rounded-r-full"
                    animate={{ width: `${votePercent.p2}%` }} transition={{ duration: 0.5 }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{t("duelLiveVote")}</p>
              </div>
            </motion.div>
          )}

          {/* ═══ PICKING (PLAYER) ═══ */}
          {phase === "picking" && isPlayerRole && !waitingForOpponent && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-primary" />
                <motion.span key={roundTimer} initial={{ scale: 1.4 }} animate={{ scale: 1 }}
                  className={cn("text-lg font-black", roundTimer <= 3 ? "text-destructive" : "text-primary")}>
                  {roundTimer}
                </motion.span>
              </div>
              <p className="text-sm font-bold text-foreground mb-1">✊ {t("duelRound")} {round + 1} — {t("duelChooseMove")}</p>
              <p className="text-[11px] text-muted-foreground mb-4">{t("duelVs")} {isPlayer1 ? p2Name : p1Name} (Lv.{isPlayer1 ? p2Level : p1Level})</p>

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

          {/* ═══ PICKING (SPECTATOR) ═══ */}
          {phase === "picking" && isSpectator && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Swords className="w-8 h-8 text-primary mx-auto mb-2" />
              </motion.div>
              <p className="text-sm font-bold text-foreground">{t("duelPlayersChoosing") || "Players are choosing..."}</p>
              <div className="flex items-center justify-center gap-4 mt-2">
                <NameWithLevel name={p1Name} level={p1Level} />
                <span className="text-xs text-primary font-bold">⚔️</span>
                <NameWithLevel name={p2Name} level={p2Level} />
              </div>
            </motion.div>
          )}

          {/* ═══ WAITING FOR OPPONENT (PLAYER) — show pick buttons with selection ═══ */}
          {phase === "picking" && isPlayerRole && waitingForOpponent && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <p className="text-sm font-bold text-foreground mb-1">✊ {t("duelRound")} {round + 1}</p>
              <p className="text-[11px] text-muted-foreground mb-4">{t("duelVs")} {isPlayer1 ? p2Name : p1Name} (Lv.{isPlayer1 ? p2Level : p1Level})</p>
              <div className="grid grid-cols-3 gap-2">
                {MOVES.map((move) => (
                  <div key={move}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                      playerMove === move
                        ? "border-primary bg-primary/15 shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                        : "border-accent/20 bg-accent/5 opacity-40"
                    )}>
                    <span className="text-3xl">{MOVE_EMOJI[move]}</span>
                    <span className="text-[10px] font-bold text-foreground">{MOVE_LABEL[move]}</span>
                  </div>
                ))}
              </div>
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
                    <span className="text-5xl">{shakeIndex >= 3 && p1Move ? MOVE_EMOJI[p1Move] : "✊"}</span>
                  </motion.div>
                  <NameWithLevel name={p1Name} level={p1Level} className="text-[10px]" />
                </div>
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-xl font-black text-primary">⚔️</motion.span>
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    animate={shakeIndex < 3 ? { y: [0, -20, 0], rotate: [0, 5, 0] } : {}}
                    transition={{ duration: 0.35, repeat: shakeIndex < 3 ? Infinity : 0, delay: 0.15 }}>
                    <span className="text-5xl">{shakeIndex >= 3 && p2Move ? MOVE_EMOJI[p2Move] : "✊"}</span>
                  </motion.div>
                  <NameWithLevel name={p2Name} level={p2Level} className="text-[10px]" />
                </div>
              </div>
              {shakeIndex >= 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.4, 0] }} transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-primary/20 pointer-events-none rounded-2xl" />
              )}
            </motion.div>
          )}

          {/* ═══ ROUND RESULT ═══ */}
          {phase === "round_result" && roundWinner && p1Move && p2Move && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-3">
              <div className="flex items-center justify-center gap-6 mb-3">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center border-2 text-3xl transition-all",
                    roundWinner === "p1" ? "border-green-accent bg-green-accent/10 shadow-[0_0_15px_hsl(var(--green-accent)/0.4)]" : "border-muted bg-muted/10"
                  )}>
                    {MOVE_EMOJI[p1Move]}
                  </div>
                  <NameWithLevel name={p1Name} level={p1Level} className="text-[10px]" />
                </div>
                <span className="text-lg font-black text-muted-foreground">vs</span>
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center border-2 text-3xl transition-all",
                    roundWinner === "p2" ? "border-green-accent bg-green-accent/10 shadow-[0_0_15px_hsl(var(--green-accent)/0.4)]" : "border-muted bg-muted/10"
                  )}>
                    {MOVE_EMOJI[p2Move]}
                  </div>
                  <NameWithLevel name={p2Name} level={p2Level} className="text-[10px]" />
                </div>
              </div>
              <motion.div initial={{ y: 10 }} animate={{ y: 0 }}>
                {roundWinner === "draw" ? (
                  <p className="text-sm font-bold text-primary">{t("duelDraw")}</p>
                ) : (
                  <p className="text-sm font-bold text-green-accent">
                    🏆 {roundWinner === "p1" ? p1Name : p2Name} {t("duelWonRound")}
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
                🏆 {finalWinner === "p1" ? p1Name : p2Name} {t("duelIsWinner")}
              </p>
              <p className="text-xs text-muted-foreground mb-2">{t("duelScore")}: {scores.p1} - {scores.p2}</p>

              {/* XP rewards */}
              {isPlayerRole ? (
                <div className={cn(
                  "rounded-xl p-2 mb-3 border",
                  ((finalWinner === "p1" && isPlayer1) || (finalWinner === "p2" && !isPlayer1))
                    ? "bg-green-accent/10 border-green-accent/30"
                    : "bg-destructive/10 border-destructive/30"
                )}>
                  {((finalWinner === "p1" && isPlayer1) || (finalWinner === "p2" && !isPlayer1)) ? (
                    <>
                      <p className="text-sm font-bold text-green-accent">🏆 {t("duelYouWon") || "You won!"}</p>
                      <p className="text-xs text-green-accent/80 font-bold">+300 XP</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-destructive">{t("duelYouLost") || "You lost"}</p>
                      <p className="text-xs text-muted-foreground font-bold">+80 XP</p>
                    </>
                  )}
                </div>
              ) : votePick ? (
                votePick === finalWinner ? (
                  <div className="bg-green-accent/10 border border-green-accent/30 rounded-xl p-2 mb-3">
                    <p className="text-sm font-bold text-green-accent">{t("duelVoteCorrect")}</p>
                    <p className="text-xs text-green-accent/80 font-bold">+50 XP 🎉</p>
                  </div>
                ) : (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-2 mb-3">
                    <p className="text-sm font-bold text-destructive">{t("duelVoteWrong")}</p>
                    <p className="text-xs text-muted-foreground font-bold">+10 XP</p>
                  </div>
                )
              ) : (
                <div className="bg-muted/20 border border-muted/30 rounded-xl p-2 mb-3">
                  <p className="text-sm font-bold text-muted-foreground">{t("duelDidntVote")}</p>
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
