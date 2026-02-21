-- Create haulout_yards table
CREATE TABLE IF NOT EXISTS public.haulout_yards (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  website TEXT,
  phone TEXT,
  sandblasting TEXT DEFAULT 'Unknown',
  status TEXT DEFAULT 'To contact',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS haulout_yards_name_idx ON public.haulout_yards(name);
CREATE INDEX IF NOT EXISTS haulout_yards_status_idx ON public.haulout_yards(status);

-- Enable RLS
ALTER TABLE public.haulout_yards ENABLE ROW LEVEL SECURITY;

-- Create policies for public read and authenticated write
CREATE POLICY "Allow public read" ON public.haulout_yards
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON public.haulout_yards
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.haulout_yards
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON public.haulout_yards
  FOR DELETE USING (true);

-- Insert initial data
INSERT INTO public.haulout_yards (name, location, website, phone, sandblasting, status, notes)
VALUES
  ('Zaanhaven/Westhaven', 'Zaandam', 'zaanhaven.nl', NULL, 'Confirm needed', 'Recommended', NULL),
  ('Marina Seaport IJmuiden', 'IJmuiden', 'marinaseaport.nl', '0255 560300', 'Confirm needed', 'To contact', NULL),
  ('OfferteHaven.nl', 'Multi-yard network (NL)', 'offertehaven.nl', NULL, 'Yes', 'To contact', 'Submit specs online, get 3–5 competing quotes in 3–5 days'),
  ('Jachthaven Bouwmeester', 'Noord-Holland', 'jachthavenbouwmeester.nl', NULL, 'Confirm needed', 'To contact', NULL),
  ('Kadoelenwerf Jachtservice', 'Amsterdam', 'kadoelenwerf.nl', '020-6314052', 'No', 'Backup only', 'Max ~10–11m lift — check if 16.8m Timo fits. Backup if closer yards booked.'),
  ('Werf Rhebergen', 'Raamsdonksveer, ~40km', 'werfrhebergen.nl', NULL, 'No', 'Excluded', 'Current mooring location. Does NOT allow sandblasting on-site.')
ON CONFLICT DO NOTHING;
