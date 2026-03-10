
-- Create RPS matches table for real-time multiplayer
CREATE TABLE public.rps_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id uuid NOT NULL,
  player1_name text NOT NULL DEFAULT 'Player',
  player1_level integer NOT NULL DEFAULT 1,
  player2_id uuid,
  player2_name text DEFAULT 'Player',
  player2_level integer DEFAULT 1,
  status text NOT NULL DEFAULT 'waiting',
  current_round integer NOT NULL DEFAULT 0,
  player1_score integer NOT NULL DEFAULT 0,
  player2_score integer NOT NULL DEFAULT 0,
  player1_move text,
  player2_move text,
  winner_id uuid,
  bet_amount integer NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rps_matches ENABLE ROW LEVEL SECURITY;

-- PERMISSIVE policies
CREATE POLICY "Anyone can view rps matches" ON public.rps_matches
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create rps matches" ON public.rps_matches
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = player1_id);

CREATE POLICY "Players can update their matches" ON public.rps_matches
  FOR UPDATE TO authenticated USING (auth.uid() = player1_id OR auth.uid() = player2_id);

CREATE POLICY "Creator can delete waiting match" ON public.rps_matches
  FOR DELETE TO authenticated USING (auth.uid() = player1_id AND status = 'waiting');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.rps_matches;

-- Fix game_queue policies to PERMISSIVE
DROP POLICY IF EXISTS "Anyone can view queue" ON public.game_queue;
DROP POLICY IF EXISTS "Users can join queue" ON public.game_queue;
DROP POLICY IF EXISTS "Users can leave queue" ON public.game_queue;
DROP POLICY IF EXISTS "Users can update own queue entry" ON public.game_queue;

CREATE POLICY "Anyone can view queue" ON public.game_queue FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join queue" ON public.game_queue FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave queue" ON public.game_queue FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own queue entry" ON public.game_queue FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix game_matches policies to PERMISSIVE
DROP POLICY IF EXISTS "Players can create their matches" ON public.game_matches;
DROP POLICY IF EXISTS "Players can update their matches" ON public.game_matches;
DROP POLICY IF EXISTS "Players can view their matches" ON public.game_matches;

CREATE POLICY "Players can view their matches" ON public.game_matches FOR SELECT TO authenticated USING (auth.uid() = ANY (player_ids));
CREATE POLICY "Players can create their matches" ON public.game_matches FOR INSERT TO authenticated WITH CHECK (auth.uid() = ANY (player_ids));
CREATE POLICY "Players can update their matches" ON public.game_matches FOR UPDATE TO authenticated USING (auth.uid() = ANY (player_ids));

-- Fix chat_messages policies to PERMISSIVE
DROP POLICY IF EXISTS "Anyone can read chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.chat_messages;

CREATE POLICY "Anyone can read chat messages" ON public.chat_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can send messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Fix profiles policies to PERMISSIVE
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
