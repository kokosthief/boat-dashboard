import fs from 'fs';
import path from 'path';

export interface Expense {
  entryNumber: string;
  date: string;
  company: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  country: string;
  hasReceipt: boolean;
}

const BOAT_KEYWORDS = [
  'boat', 'timo', 'marine', 'nautical', 'victron', 'anchor', 'hull', 'sail',
  'bilge', 'galley', 'mooring', 'harbour', 'marina',
  'mast', 'keel', 'rudder', 'propeller', 'bow thruster', 'antifoul', 'epoxy',
  'anker', 'scheep', 'jachthaven', 'nautic', 'multihull', 'yacht',
  'boat support', 'rhebergen',
];

// Exclude false positives
const BOAT_EXCLUDE = ['decksaver', 'haven hot yoga'];

// The boat purchase entry — adjust this if the actual purchase is identified differently
const BOAT_PURCHASE_KEYWORDS = ['purchase', 'aankoop', 'boat purchase'];

function isBoatRelated(row: Record<string, string>): boolean {
  const text = `${row['Company']} ${row['Category']} ${row['Comment']}`.toLowerCase();
  if (BOAT_EXCLUDE.some(ex => text.includes(ex))) return false;
  return BOAT_KEYWORDS.some(kw => text.includes(kw));
}

function isBoatPurchase(row: Record<string, string>): boolean {
  const text = `${row['Company']} ${row['Category']} ${row['Comment']}`.toLowerCase();
  return BOAT_PURCHASE_KEYWORDS.some(kw => text.includes(kw));
}

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { current += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { result.push(current.trim()); current = ''; }
      else { current += ch; }
    }
  }
  result.push(current.trim());
  return result;
}

function loadExpenses(): Expense[] {
  const expenses: Expense[] = [];

  // Try boat-expenses.csv first
  const boatExpPath = path.join(process.cwd(), 'public', 'data', 'boat-expenses.csv');
  if (fs.existsSync(boatExpPath)) {
    const rows = parseCSV(fs.readFileSync(boatExpPath, 'utf-8'));
    for (const row of rows) {
      if (row['Amount']) {
        expenses.push({
          entryNumber: row['Entry Number'] || '',
          date: row['Date'] || '',
          company: row['Company'] || '',
          category: row['Category'] || '',
          description: row['Comment'] || '',
          amount: parseFloat(row['Amount']) || 0,
          currency: row['Currency'] || 'EUR',
          country: row['Country'] || '',
          hasReceipt: false,
        });
      }
    }
  }

  // Filter 2025-expenses.csv for boat-related
  const allExpPath = path.join(process.cwd(), 'public', 'data', '2025-expenses.csv');
  if (fs.existsSync(allExpPath)) {
    const rows = parseCSV(fs.readFileSync(allExpPath, 'utf-8'));
    for (const row of rows) {
      if (isBoatRelated(row) && row['Amount']) {
        // Avoid duplicates by entry number
        const en = row['Entry Number'] || '';
        if (!expenses.find(e => e.entryNumber === en && en !== '')) {
          expenses.push({
            entryNumber: en,
            date: row['Date'] || '',
            company: row['Company'] || '',
            category: row['Category'] || '',
            description: row['Comment'] || '',
            amount: parseFloat(row['Amount']) || 0,
            currency: row['Currency'] || 'EUR',
            country: row['Country'] || '',
            hasReceipt: false,
          });
        }
      }
    }
  }

  // Also add task costs as expenses if they have costs
  // (these are planned/actual costs from boat-tasks)
  
  return expenses.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

let _cache: { expenses: Expense[]; total: number; totalExPurchase: number } | null = null;

export function getExpenseData() {
  if (_cache) return _cache;
  const expenses = loadExpenses();
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  // Exclude boat purchase
  const purchaseAmount = expenses
    .filter(e => {
      const text = `${e.company} ${e.category} ${e.description}`.toLowerCase();
      return BOAT_PURCHASE_KEYWORDS.some(kw => text.includes(kw));
    })
    .reduce((s, e) => s + e.amount, 0);
  _cache = { expenses, total, totalExPurchase: total - purchaseAmount };
  return _cache;
}
