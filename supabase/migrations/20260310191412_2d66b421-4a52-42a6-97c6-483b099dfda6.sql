
-- Fix ALL RLS policies to be PERMISSIVE instead of RESTRICTIVE

-- rps_matches
DROP POLICY IF EXISTS "Anyone can view rps matches" ON public.rps_matches;
DROP POLICY IF EXISTS "Users can create rps matches" ON public.rps_matches;
DROP POLICY IF EXISTS "Players can update their matches" ON public.rps_matches;
DROP POLICY IF EXISTS "Creator can delete waiting match" ON public.rps_matches;

CREATE POLICY "Anyone can view rps matches" ON public.rps_matches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create rps matches" ON public.rps_matches FOR INSERT TO authenticated WITH CHECK (auth.uid() = player1_id);
CREATE POLICY "Players can update their matches" ON public.rps_matches FOR UPDATE TO authenticated USING (auth.uid() = player1_id OR auth.uid() = player2_id);
CREATE POLICY "Creator can delete waiting match" ON public.rps_matches FOR DELETE TO authenticated USING (auth.uid() = player1_id AND status = 'waiting');

-- chat_messages
DROP POLICY IF EXISTS "Anyone can read chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.chat_messages;

CREATE POLICY "Anyone can read chat messages" ON public.chat_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can send messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- game_queue
DROP POLICY IF EXISTS "Anyone can view queue" ON public.game_queue;
DROP POLICY IF EXISTS "Users can join queue" ON public.game_queue;
DROP POLICY IF EXISTS "Users can leave queue" ON public.game_queue;
DROP POLICY IF EXISTS "Users can update own queue entry" ON public.game_queue;

CREATE POLICY "Anyone can view queue" ON public.game_queue FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join queue" ON public.game_queue FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave queue" ON public.game_queue FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own queue entry" ON public.game_queue FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- game_matches
DROP POLICY IF EXISTS "Players can view their matches" ON public.game_matches;
DROP POLICY IF EXISTS "Players can create their matches" ON public.game_matches;
DROP POLICY IF EXISTS "Players can update their matches" ON public.game_matches;

CREATE POLICY "Players can view their matches" ON public.game_matches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Players can create their matches" ON public.game_matches FOR INSERT TO authenticated WITH CHECK (auth.uid() = ANY(player_ids));
CREATE POLICY "Players can update their matches" ON public.game_matches FOR UPDATE TO authenticated USING (auth.uid() = ANY(player_ids));

-- profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
