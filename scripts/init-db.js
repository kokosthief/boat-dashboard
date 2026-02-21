const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://girfkgisplpgvrszsrdn.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpcmZrZ2lzcGxwZ3Zyc3pzcmRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQyNTY1OSwiZXhwIjoyMDg3MDAxNjU5fQ.JWuj-M-hFFFfdw9AFoEwKPJmKCeylEAiAi6vup1iAoU';

const supabase = createClient(supabaseUrl, serviceKey);

const yards = [
  {
    name: 'Zaanhaven/Westhaven',
    location: 'Zaandam',
    website: 'zaanhaven.nl',
    phone: null,
    sandblasting: 'Confirm needed',
    status: 'Recommended',
    notes: null
  },
  {
    name: 'Marina Seaport IJmuiden',
    location: 'IJmuiden',
    website: 'marinaseaport.nl',
    phone: '0255 560300',
    sandblasting: 'Confirm needed',
    status: 'To contact',
    notes: null
  },
  {
    name: 'OfferteHaven.nl',
    location: 'Multi-yard network (NL)',
    website: 'offertehaven.nl',
    phone: null,
    sandblasting: 'Yes',
    status: 'To contact',
    notes: 'Submit specs online, get 3–5 competing quotes in 3–5 days'
  },
  {
    name: 'Jachthaven Bouwmeester',
    location: 'Noord-Holland',
    website: 'jachthavenbouwmeester.nl',
    phone: null,
    sandblasting: 'Confirm needed',
    status: 'To contact',
    notes: null
  },
  {
    name: 'Kadoelenwerf Jachtservice',
    location: 'Amsterdam',
    website: 'kadoelenwerf.nl',
    phone: '020-6314052',
    sandblasting: 'No',
    status: 'Backup only',
    notes: 'Max ~10–11m lift — check if 16.8m Timo fits. Backup if closer yards booked.'
  },
  {
    name: 'Werf Rhebergen',
    location: 'Raamsdonksveer, ~40km',
    website: 'werfrhebergen.nl',
    phone: null,
    sandblasting: 'No',
    status: 'Excluded',
    notes: 'Current mooring location. Does NOT allow sandblasting on-site.'
  }
];

async function initializeDatabase() {
  try {
    console.log('🔧 Checking haulout_yards table...');

    // Test if table exists
    const { error: testError } = await supabase
      .from('haulout_yards')
      .select('id')
      .limit(1);

    if (testError && testError.message.includes('does not exist')) {
      console.log('❌ Table does not exist. Please create it manually in Supabase dashboard.');
      console.log('\n📋 SQL to execute in Supabase dashboard SQL Editor:\n');
      console.log(`
-- Create table
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

-- Enable RLS
ALTER TABLE public.haulout_yards ENABLE ROW LEVEL SECURITY;

-- Create policies for public read and service role full access
CREATE POLICY "Allow public read" ON public.haulout_yards
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON public.haulout_yards
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.haulout_yards
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON public.haulout_yards
  FOR DELETE USING (true);
      `);
      return;
    }

    console.log('✅ Table exists. Inserting data...');

    // Clear existing data
    const { error: deleteError } = await supabase
      .from('haulout_yards')
      .delete()
      .neq('id', 0);

    if (deleteError) {
      console.warn('⚠️  Could not clear existing data:', deleteError.message);
    }

    // Insert new data
    const { data: inserted, error: insertError } = await supabase
      .from('haulout_yards')
      .insert(yards)
      .select();

    if (insertError) {
      console.error('❌ Error inserting yards:', insertError.message);
      process.exit(1);
    }

    console.log(`✅ Successfully inserted ${inserted?.length || 0} yards`);
    console.log('✅ Database initialization complete!');
  } catch (error) {
    console.error('❌ Error:', error.message || error);
    process.exit(1);
  }
}

initializeDatabase();
