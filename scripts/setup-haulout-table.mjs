import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://girfkgisplpgvrszsrdn.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpcmZrZ2lzcGxwZ3Zyc3pzcmRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQyNTY1OSwiZXhwIjoyMDg3MDAxNjU5fQ.JWuj-M-hFFFfdw9AFoEwKPJmKCeylEAiAi6vup1iAoU';

const supabase = createClient(supabaseUrl, serviceKey);

async function setupTable() {
  try {
    console.log('🔧 Checking/Setting up haulout_yards table...');

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

    // Check if table exists and has data
    const { data: existing, error: checkError } = await supabase
      .from('haulout_yards')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Table does not exist:', checkError.message);
      console.log('ℹ️  Please create the table manually in Supabase dashboard using SQL:');
      console.log(`
CREATE TABLE IF NOT EXISTS haulout_yards (
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

-- Enable Row Level Security if needed
ALTER TABLE haulout_yards ENABLE ROW LEVEL SECURITY;
      `);
      return;
    }

    // Clear existing data (optional - comment out if you want to keep duplicates)
    const { error: deleteError } = await supabase
      .from('haulout_yards')
      .delete()
      .neq('id', 0);

    if (deleteError) {
      console.warn('⚠️  Could not clear existing data:', deleteError.message);
    }

    // Insert yards
    const { error: insertError, data: insertedData } = await supabase
      .from('haulout_yards')
      .insert(yards)
      .select();

    if (insertError) {
      console.error('❌ Error inserting yards:', insertError.message);
      process.exit(1);
    }

    console.log(`✅ Successfully inserted ${insertedData?.length || 0} yards`);
    console.log('✅ Table setup complete!');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupTable();
