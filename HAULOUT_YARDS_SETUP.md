# Haulout Yards Table Setup

This guide explains how to set up the `haulout_yards` table in Supabase and populate it with initial data.

## Prerequisites

- Access to Supabase dashboard: https://app.supabase.com/
- Project: `girfkgisplpgvrszsrdn` (Finance Dashboard DB - shared for now)

## Step 1: Create the Table

1. Go to the Supabase dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Create a new query and paste the following SQL:

```sql
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

-- Create policies
CREATE POLICY "Allow public read" ON public.haulout_yards
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON public.haulout_yards
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.haulout_yards
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON public.haulout_yards
  FOR DELETE USING (true);
```

5. Click **Run** (or Cmd+Enter)

## Step 2: Populate Initial Data

In the same SQL Editor, paste and run:

```sql
INSERT INTO public.haulout_yards (name, location, website, phone, sandblasting, status, notes)
VALUES
  ('Zaanhaven/Westhaven', 'Zaandam', 'zaanhaven.nl', NULL, 'Confirm needed', 'Recommended', NULL),
  ('Marina Seaport IJmuiden', 'IJmuiden', 'marinaseaport.nl', '0255 560300', 'Confirm needed', 'To contact', NULL),
  ('OfferteHaven.nl', 'Multi-yard network (NL)', 'offertehaven.nl', NULL, 'Yes', 'To contact', 'Submit specs online, get 3–5 competing quotes in 3–5 days'),
  ('Jachthaven Bouwmeester', 'Noord-Holland', 'jachthavenbouwmeester.nl', NULL, 'Confirm needed', 'To contact', NULL),
  ('Kadoelenwerf Jachtservice', 'Amsterdam', 'kadoelenwerf.nl', '020-6314052', 'No', 'Backup only', 'Max ~10–11m lift — check if 16.8m Timo fits. Backup if closer yards booked.'),
  ('Werf Rhebergen', 'Raamsdonksveer, ~40km', 'werfrhebergen.nl', NULL, 'No', 'Excluded', 'Current mooring location. Does NOT allow sandblasting on-site.');
```

5. Click **Run**

## Step 3: Verify Setup

You should now see the table in the **Table Editor**:
- Go to **Table Editor** (left sidebar)
- You should see `haulout_yards` in the list
- Click on it to view the 6 pre-populated yards

## Step 4: Run the Initialization Script (Optional)

To verify everything is working, you can run:

```bash
npm run build
node scripts/init-db.js
```

This will confirm the table exists and the API can connect to it.

## API Usage

Once the table is set up, the following endpoints are available:

### GET /api/yards
Fetch all haulout yards

```bash
curl https://your-domain/api/yards
```

### POST /api/yards
Add a new yard

```bash
curl -X POST https://your-domain/api/yards \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Yard",
    "location": "City",
    "website": "website.com",
    "phone": "123-456-7890",
    "sandblasting": "Yes",
    "status": "To contact",
    "notes": "Some notes"
  }'
```

### PATCH /api/yards/[id]
Update a yard (mainly for notes and status)

```bash
curl -X PATCH https://your-domain/api/yards/1 \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Updated notes",
    "status": "Contacted"
  }'
```

## Troubleshooting

### "Could not find the table 'public.haulout_yards' in the schema cache"

- Make sure you've run the CREATE TABLE SQL above
- Check that you're using the correct Supabase project
- Refresh the dashboard and try again

### Policies not working

- Ensure Row Level Security (RLS) is enabled on the table
- Check that policies are created correctly
- For development, you can temporarily disable RLS if needed (not recommended for production)

## What Each Column Does

- **id**: Unique identifier (auto-generated)
- **name**: Yard name (required) - e.g., "Zaanhaven/Westhaven"
- **location**: City or location - e.g., "Zaandam"
- **website**: Website URL (without https://) - e.g., "zaanhaven.nl"
- **phone**: Contact phone number - e.g., "0255 560300"
- **sandblasting**: Sandblasting capability - Options: "Yes", "No", "Unknown", "Confirm needed"
- **status**: Current contact status - Options: "Recommended", "To contact", "Contacted", "Quoted", "Booked", "Excluded", "Backup only"
- **notes**: Free-form notes (editable inline on the page) - e.g., contact details, capacity info
- **created_at**: Timestamp when record was created
- **updated_at**: Timestamp when record was last updated

## Frontend Component

The `HauloutYardsTable` component (in `/src/components/HauloutYardsTable.tsx`) provides:
- Table view with all yards
- Clickable website links
- Colored badges for sandblasting and status
- Inline editing of notes
- Add new yard form
- Real-time updates via API
