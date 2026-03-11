
-- Table for syncing game state across devices
CREATE TABLE public.user_game_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  points integer NOT NULL DEFAULT 500,
  game_tickets integer NOT NULL DEFAULT 3,
  tarot_tickets integer NOT NULL DEFAULT 1,
  draw_entries integer NOT NULL DEFAULT 2,
  last_spin_time bigint DEFAULT NULL,
  last_chest_time bigint DEFAULT NULL,
  last_chest_reward integer DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_game_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game data"
  ON public.user_game_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game data"
  ON public.user_game_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own game data"
  ON public.user_game_data FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-create game data row on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_game_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_game_data (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_game_data
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_game_data();

-- Updated_at trigger
CREATE TRIGGER update_user_game_data_updated_at
  BEFORE UPDATE ON public.user_game_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
