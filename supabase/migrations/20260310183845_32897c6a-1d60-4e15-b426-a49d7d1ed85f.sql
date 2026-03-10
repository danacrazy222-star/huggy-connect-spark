
-- Drop restrictive policies
DROP POLICY IF EXISTS "Anyone can read chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.chat_messages;

-- Recreate as PERMISSIVE policies (default)
CREATE POLICY "Anyone can read chat messages"
  ON public.chat_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can send messages"
  ON public.chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
