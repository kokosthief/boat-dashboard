ALTER TABLE haulout_yards
  ADD COLUMN IF NOT EXISTS living_permitted TEXT,
  ADD COLUMN IF NOT EXISTS mooring_cost TEXT,
  ADD COLUMN IF NOT EXISTS electricity_price TEXT,
  ADD COLUMN IF NOT EXISTS car_parking BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb;
