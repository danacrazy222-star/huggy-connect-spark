
-- Private messages table
CREATE TABLE public.private_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own messages"
  ON public.private_messages FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON public.private_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can mark messages as read"
  ON public.private_messages FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id);

-- User stats table for public profile info
CREATE TABLE public.user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  books_purchased integer NOT NULL DEFAULT 0,
  draw_entries integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view user stats"
  ON public.user_stats FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can insert own stats"
  ON public.user_stats FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON public.user_stats FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime for private messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.private_messages;

-- Create indexes
CREATE INDEX idx_private_messages_sender ON public.private_messages(sender_id);
CREATE INDEX idx_private_messages_receiver ON public.private_messages(receiver_id);
CREATE INDEX idx_private_messages_pair ON public.private_messages(sender_id, receiver_id);
CREATE INDEX idx_user_stats_user_id ON public.user_stats(user_id);
