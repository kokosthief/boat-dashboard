import fs from 'fs';
import path from 'path';

export interface Expense {
  date: string;
  description: string;
  vendor: string;
  category: string;
  amount: number;
  paidBy: 'Henry' | 'Mum' | 'Partial';
}

export interface ExpenseData {
  expenses: Expense[];
  grandTotal: number;
  subtotalExPurchase: number;
  mumsContributions: number;
  henrysNetCost: number;
  categoryTotals: Record<string, number>;
  recurringCosts: { description: string; vendor: string; category: string; monthlyEstimate: number; annualEstimate: number; entries: Expense[] }[];
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else current += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { result.push(current.trim()); current = ''; }
      else current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseAmount(raw: string): number {
  // Remove € symbol, then handle European formatting: "29,500.00" or "365.33"
  const cleaned = raw.replace(/€/g, '').trim();
  // Remove thousands commas: "29,500.00" → "29500.00"
  const normalized = cleaned.replace(/,/g, '');
  return parseFloat(normalized) || 0;
}

function parseDate(raw: string): string {
  // DD/MM/YYYY → YYYY-MM-DD for sorting
  const parts = raw.split('/');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return raw;
}

function formatDate(isoDate: string): string {
  // YYYY-MM-DD → DD/MM/YYYY for display
  const parts = isoDate.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return isoDate;
}

export function getExpenseData(): ExpenseData {
  const csvPath = path.join(process.cwd(), 'public', 'data', 'boat-timo-expenses.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n');

  const expenses: Expense[] = [];

  // Skip first 3 rows (title + blank lines), row 4 is header
  for (let i = 4; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = parseCSVLine(line);
    const date = (cols[0] || '').trim();
    if (!date || !date.match(/^\d{2}\/\d{2}\/\d{4}$/)) continue; // skip non-data rows

    const amount = parseAmount(cols[4] || '');
    if (amount === 0) continue;

    const paidByRaw = (cols[5] || '').trim().toUpperCase();
    let paidBy: 'Henry' | 'Mum' | 'Partial' = 'Henry';
    if (paidByRaw === 'MUM') paidBy = 'Mum';
    else if (paidByRaw === 'PARTIAL') paidBy = 'Partial';

    expenses.push({
      date: parseDate(date),
      description: (cols[1] || '').trim(),
      vendor: (cols[2] || '').trim(),
      category: (cols[3] || '').trim(),
      amount,
      paidBy,
    });
  }

  const grandTotal = expenses.reduce((s, e) => s + e.amount, 0);
  const boatPurchaseAmount = expenses.filter(e => e.category === 'Boat Purchase').reduce((s, e) => s + e.amount, 0);
  const subtotalExPurchase = grandTotal - boatPurchaseAmount;
  const mumsContributions = expenses.filter(e => e.paidBy === 'Mum').reduce((s, e) => s + e.amount, 0);
  const henrysNetCost = grandTotal - mumsContributions - boatPurchaseAmount;

  // Category totals
  const categoryTotals: Record<string, number> = {};
  for (const e of expenses) {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  }

  // Recurring costs - manually curated list
  const recurringCosts: { description: string; vendor: string; category: string; monthlyEstimate: number; annualEstimate: number; entries: Expense[] }[] = [
    {
      description: 'Mooring & Berth (Rhebergen)',
      vendor: 'Rhebergen',
      category: 'Mooring & Berth',
      monthlyEstimate: 330,
      annualEstimate: 1980 * 2,
      entries: expenses.filter(e => e.vendor.toLowerCase().includes('rhebergen') && e.category === 'Mooring & Berth')
    },
    {
      description: 'Internet (Starlink)',
      vendor: 'Starlink',
      category: 'Internet',
      monthlyEstimate: 30,
      annualEstimate: 30 * 12,
      entries: expenses.filter(e => e.vendor.toLowerCase().includes('starlink'))
    },
    {
      description: 'Electrical Costs (est.)',
      vendor: 'Rhebergen',
      category: 'Electricity',
      monthlyEstimate: 100,
      annualEstimate: 100 * 12,
      entries: expenses.filter(e => e.vendor.toLowerCase().includes('rhebergen') && e.category === 'Electricity')
    }
  ];

  return { expenses, grandTotal, subtotalExPurchase, mumsContributions, henrysNetCost, categoryTotals, recurringCosts };
}
