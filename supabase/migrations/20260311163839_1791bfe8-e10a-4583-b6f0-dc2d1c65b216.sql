CREATE POLICY "Authenticated users can insert draw winners"
ON public.draw_winners
FOR INSERT
TO authenticated
WITH CHECK (true);