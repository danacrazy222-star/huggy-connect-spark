
-- Game queue for matchmaking
CREATE TABLE public.game_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  display_name text NOT NULL DEFAULT 'Player',
  avatar_url text,
  game_type text NOT NULL DEFAULT 'snake',
  bet_amount integer NOT NULL DEFAULT 50,
  status text NOT NULL DEFAULT 'waiting',
  match_id uuid,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Game matches
CREATE TABLE public.game_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type text NOT NULL DEFAULT 'snake',
  bet_amount integer NOT NULL DEFAULT 50,
  status text NOT NULL DEFAULT 'active',
  player_ids uuid[] NOT NULL DEFAULT '{}',
  player_names text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_matches ENABLE ROW LEVEL SECURITY;

-- Queue policies: authenticated users can see all queue entries and manage their own
CREATE POLICY "Anyone can view queue" ON public.game_queue FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join queue" ON public.game_queue FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own queue entry" ON public.game_queue FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can leave queue" ON public.game_queue FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Match policies
CREATE POLICY "Players can view their matches" ON public.game_matches FOR SELECT TO authenticated USING (auth.uid() = ANY(player_ids));
CREATE POLICY "Authenticated can create matches" ON public.game_matches FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Players can update their matches" ON public.game_matches FOR UPDATE TO authenticated USING (auth.uid() = ANY(player_ids));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_matches;

-- Auto-cleanup: function to remove stale queue entries (older than 5 minutes)
CREATE OR REPLACE FUNCTION public.cleanup_stale_queue()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.game_queue 
  WHERE status = 'waiting' 
  AND joined_at < now() - interval '5 minutes';
$$;
