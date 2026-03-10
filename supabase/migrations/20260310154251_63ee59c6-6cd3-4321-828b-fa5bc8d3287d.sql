
-- Tighten the insert policy: user must be in the player_ids array
DROP POLICY "Authenticated can create matches" ON public.game_matches;
CREATE POLICY "Players can create their matches" ON public.game_matches FOR INSERT TO authenticated WITH CHECK (auth.uid() = ANY(player_ids));
