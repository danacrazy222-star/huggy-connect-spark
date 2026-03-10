
-- Drop all existing restrictive policies on rps_matches
DROP POLICY IF EXISTS "Users can create rps matches" ON public.rps_matches;
DROP POLICY IF EXISTS "Players can update their matches" ON public.rps_matches;
DROP POLICY IF EXISTS "Creator can delete waiting match" ON public.rps_matches;
DROP POLICY IF EXISTS "Anyone can view rps matches" ON public.rps_matches;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Anyone can view rps matches"
ON public.rps_matches FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create rps matches"
ON public.rps_matches FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = player1_id);

CREATE POLICY "Players can update their matches"
ON public.rps_matches FOR UPDATE
TO authenticated
USING ((auth.uid() = player1_id) OR (auth.uid() = player2_id));

CREATE POLICY "Creator can delete waiting match"
ON public.rps_matches FOR DELETE
TO authenticated
USING ((auth.uid() = player1_id) AND (status = 'waiting'));
