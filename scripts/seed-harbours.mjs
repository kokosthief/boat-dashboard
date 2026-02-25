import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://girfkgisplpgvrszsrdn.supabase.co';
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpcmZrZ2lzcGxwZ3Zyc3pzcmRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQyNTY1OSwiZXhwIjoyMDg3MDAxNjU5fQ.JWuj-M-hFFFfdw9AFoEwKPJmKCeylEAiAi6vup1iAoU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const livingPermittedMap = {
  Agreed: 'Yes',
  Considering: 'Maybe',
  Maybe: 'Maybe',
  'Second Choice': 'Maybe',
  Call: 'N/A',
  Dropped: 'No',
  Unknown: 'N/A',
};

function normalizeName(value) {
  return String(value || '').trim().toLowerCase();
}

function isEmpty(value) {
  return value == null || (typeof value === 'string' && value.trim() === '');
}

async function loadHarbours() {
  const filePath = path.resolve('src/data/harbours.ts');
  const source = await fs.readFile(filePath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: 'harbours.ts',
  }).outputText;

  const module = { exports: {} };
  const context = vm.createContext({
    module,
    exports: module.exports,
    console,
  });
  const script = new vm.Script(transpiled, { filename: 'harbours.transpiled.cjs' });
  script.runInContext(context);

  const harbours = module.exports.harbours;
  if (!Array.isArray(harbours)) {
    throw new Error('Failed to load harbours array from src/data/harbours.ts');
  }
  return harbours;
}

async function main() {
  const harbours = await loadHarbours();

  const { data: existingRows, error: fetchError } = await supabase
    .from('haulout_yards')
    .select('id,name,location,website,notes');

  if (fetchError) {
    throw new Error(`Failed to fetch existing rows: ${fetchError.message}`);
  }

  const existingByName = new Map();
  for (const row of existingRows || []) {
    const key = normalizeName(row.name);
    if (key && !existingByName.has(key)) {
      existingByName.set(key, row);
    }
  }

  let updated = 0;
  let inserted = 0;

  for (const harbour of harbours) {
    const key = normalizeName(harbour.name);
    const existing = existingByName.get(key);
    const mapped = {
      living_permitted: livingPermittedMap[harbour.status] || 'N/A',
      mooring_cost: harbour.winterMooringPrice || '',
      electricity_price: harbour.electricityPrice || '',
      car_parking: Boolean(harbour.carParking),
      services: Array.isArray(harbour.services) ? harbour.services : [],
    };

    if (existing) {
      const payload = {
        name: harbour.name,
        ...mapped,
      };

      if (isEmpty(existing.location)) {
        payload.location = harbour.area || '';
      }
      if (isEmpty(existing.website)) {
        payload.website = harbour.website || '';
      }
      if (isEmpty(existing.notes)) {
        payload.notes = harbour.notes || '';
      }

      const { error } = await supabase
        .from('haulout_yards')
        .update(payload)
        .eq('id', existing.id);

      if (error) {
        throw new Error(`Failed updating "${harbour.name}": ${error.message}`);
      }
      updated += 1;
    } else {
      const payload = {
        name: harbour.name,
        location: harbour.area || '',
        website: harbour.website || '',
        notes: harbour.notes || '',
        ...mapped,
      };

      const { error } = await supabase.from('haulout_yards').insert(payload);
      if (error) {
        throw new Error(`Failed inserting "${harbour.name}": ${error.message}`);
      }
      inserted += 1;
    }
  }

  console.log(`Processed harbours: ${harbours.length}`);
  console.log(`Updated existing rows: ${updated}`);
  console.log(`Inserted new rows: ${inserted}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
