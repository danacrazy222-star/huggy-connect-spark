
CREATE TABLE public.draw_winners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  winner_name text NOT NULL,
  prize_type text NOT NULL DEFAULT 'Gift Card',
  prize_amount integer NOT NULL DEFAULT 500,
  draw_round_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.draw_winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view draw winners" ON public.draw_winners
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anon can view draw winners" ON public.draw_winners
  FOR SELECT TO anon USING (true);

INSERT INTO public.draw_winners (winner_name, prize_type, prize_amount, draw_round_id)
VALUES ('Alex_92', 'Amazon Gift Card', 500, 'round-1');
