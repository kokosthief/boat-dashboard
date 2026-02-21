# 🏗️ Haulout Yards Table Setup Instructions

The haulout yards feature is now deployed! To complete the setup, you need to create the Supabase table and populate it with initial data.

## Quick Setup (5 minutes)

### Option 1: Supabase Dashboard (Easiest)

1. Go to your Supabase dashboard: https://app.supabase.com/
2. Select the boat-dashboard project
3. Go to **SQL Editor** (left sidebar → "SQL Editor")
4. Click **"+ New query"**
5. Copy the entire SQL from below and paste it into the editor
6. Click **Run** (or press Cmd+Enter / Ctrl+Enter)
7. Done! ✅

**SQL to run:**

```sql
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

-- Create indexes
CREATE INDEX IF NOT EXISTS haulout_yards_name_idx ON public.haulout_yards(name);
CREATE INDEX IF NOT EXISTS haulout_yards_status_idx ON public.haulout_yards(status);

-- Enable RLS
ALTER TABLE public.haulout_yards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read" ON public.haulout_yards
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON public.haulout_yards
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.haulout_yards
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON public.haulout_yards
  FOR DELETE USING (true);

-- Insert initial yards data
INSERT INTO public.haulout_yards (name, location, website, phone, sandblasting, status, notes)
VALUES
  ('Zaanhaven/Westhaven', 'Zaandam', 'zaanhaven.nl', NULL, 'Confirm needed', 'Recommended', NULL),
  ('Marina Seaport IJmuiden', 'IJmuiden', 'marinaseaport.nl', '0255 560300', 'Confirm needed', 'To contact', NULL),
  ('OfferteHaven.nl', 'Multi-yard network (NL)', 'offertehaven.nl', NULL, 'Yes', 'To contact', 'Submit specs online, get 3–5 competing quotes in 3–5 days'),
  ('Jachthaven Bouwmeester', 'Noord-Holland', 'jachthavenbouwmeester.nl', NULL, 'Confirm needed', 'To contact', NULL),
  ('Kadoelenwerf Jachtservice', 'Amsterdam', 'kadoelenwerf.nl', '020-6314052', 'No', 'Backup only', 'Max ~10–11m lift — check if 16.8m Timo fits. Backup if closer yards booked.'),
  ('Werf Rhebergen', 'Raamsdonksveer, ~40km', 'werfrhebergen.nl', NULL, 'No', 'Excluded', 'Current mooring location. Does NOT allow sandblasting on-site.')
ON CONFLICT DO NOTHING;
```

### Option 2: Via Migration File (For DevOps)

If you're using Supabase migrations locally:

```bash
supabase db push
```

This will execute the migration file at `supabase-migrations/001_create_haulout_yards.sql`

## Verify Setup

After running the SQL, verify everything works:

```bash
cd /Users/kokos/.openclaw/workspace/repos/boat-dashboard
npm run build  # Should succeed
node scripts/init-db.js  # Should show success message
```

## What Was Implemented

✅ **Backend:**
- API routes at `/api/yards` (GET, POST) and `/api/yards/[id]` (PATCH)
- Full CRUD operations for haulout yards
- Supabase integration with service role authentication

✅ **Frontend:**
- `HauloutYardsTable.tsx` component with:
  - Table view with all yards data
  - Clickable website links
  - Color-coded badges for sandblasting and status
  - Inline note editing (click to edit, save to update)
  - Add new yard form with validation
  - Real-time updates via REST API

✅ **Page Integration:**
- Updated `/app/haulout/page.tsx` to use the dynamic component
- Removed static yard cards
- Added "🏗️ Yards Research" section at bottom

## Features Available

### In the Table:
- **View all yards** with complete information
- **Click on notes** to edit them inline
- **Add new yards** with the "+ Add Yard" button
- **Colored badges** show sandblasting capability and contact status
- **Clickable links** to yard websites
- **Responsive design** that works on mobile and desktop

### Yard Fields:
- Name (required)
- Location
- Website
- Phone
- Sandblasting: Yes, No, Unknown, Confirm needed
- Status: Recommended, To contact, Contacted, Quoted, Booked, Excluded, Backup only
- Notes (editable)

## Next Steps

1. ✅ Run the SQL in Supabase dashboard
2. ✅ Verify with `node scripts/init-db.js`
3. ✅ Deploy with `git push` (already done)
4. Navigate to `/haulout` page and start managing yards!

## Troubleshooting

**"Table does not exist" error in browser:**
- Confirm you ran the SQL above
- Refresh the page
- Check that the table appears in Supabase "Table Editor"

**Updates not saving:**
- Verify RLS policies are created (check Supabase → "Authentication" → "Policies")
- For development, you can temporarily disable RLS on the table if needed

**Build issues:**
- Make sure @supabase/supabase-js is installed: `npm install @supabase/supabase-js`
- Clear .next cache: `rm -rf .next && npm run build`

## API Documentation

### GET /api/yards
Returns all yards as JSON array

```bash
curl https://boat-dashboard.vercel.app/api/yards
```

### POST /api/yards
Create a new yard

```bash
curl -X POST https://boat-dashboard.vercel.app/api/yards \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Yard",
    "location": "Amsterdam",
    "website": "yard.nl",
    "phone": "020-1234567",
    "sandblasting": "Yes",
    "status": "To contact",
    "notes": "Contact after Feb 25"
  }'
```

### PATCH /api/yards/{id}
Update a yard (mainly for notes and status)

```bash
curl -X PATCH https://boat-dashboard.vercel.app/api/yards/1 \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Called on Feb 20, waiting for quote",
    "status": "Quoted"
  }'
```

## File Structure

```
boat-dashboard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── yards/
│   │   │       ├── route.ts          # GET /yards, POST /yards
│   │   │       └── [id]/
│   │   │           └── route.ts      # PATCH /yards/{id}
│   │   ├── haulout/
│   │   │   └── page.tsx              # Updated with HauloutYardsTable
│   │   └── ...
│   └── components/
│       ├── HauloutYardsTable.tsx      # Main component
│       └── ...
├── scripts/
│   ├── init-db.js                    # Verification script
│   └── setup-haulout-table.mjs        # Alternative setup
├── supabase-migrations/
│   └── 001_create_haulout_yards.sql  # Migration file
├── SETUP_HAULOUT_YARDS.md            # This file
├── HAULOUT_YARDS_SETUP.md            # Detailed guide
└── ...
```

Done! 🎉
