
-- Create chat messages table
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id integer NOT NULL DEFAULT 0,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name text NOT NULL DEFAULT 'Player',
  avatar_url text,
  gender text,
  level integer NOT NULL DEFAULT 1,
  message text NOT NULL,
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all messages
CREATE POLICY "Anyone can read chat messages"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert their own messages
CREATE POLICY "Users can send messages"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Index for fast room queries
CREATE INDEX idx_chat_messages_room_created ON public.chat_messages(room_id, created_at DESC);
