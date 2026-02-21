/**
 * Boat Expenses Data Layer - Fetches from Supabase
 * Replaces CSV-based loading with database-backed single source of truth
 */

const BOAT_KEYWORDS = [
  'boat', 'timo', 'marina', 'harbour', 'harbor', 'victron', 'starlink',
  'ligplaats', 'jachthaven', 'mooring', 'berth', 'nautical', 'nautiek',
  'scheeps', 'vaartuig', 'anker', 'roer', 'vaarbewijs', 'haven',
  'waterway', 'dock', 'sailing', 'vessel', 'hull', 'bilge', 'galley',
  'anchor', 'propeller', 'windlass', 'inverter', 'shore power',
  'bakdekker', 'wood burner', 'oil burner', 'aes',
];

const BOAT_VENDORS = [
  'sjemma', 'steve', 'simone', 'klaas mulder', 'mulder',
  'jachtservice', 'watersport', 'scheepswerf', 'bootman',
  'nautic', 'marine service', 'yacht',
];

const BOAT_CATEGORIES = [
  'boat', 'marine', 'nautical', 'vessel', 'maritime',
  'boat purchase', 'mooring & berth', 'boat furnishing', 'boat equipment',
  'electrical equipment', 'heating system', 'engine & fuel system',
  'professional services', 'carpentry',
];

export interface BoatExpense {
  entryNumber: string;
  date: string;
  company: string;
  category: string;
  comment: string;
  amount: number;
  currency: string;
  year: number;
  receiptFilename?: string;
  paidBy?: string; // MUM, HENRY, PARTIAL, or undefined
}

export interface BoatExpenseData {
  expenses: BoatExpense[];
  yearTotals: Record<number, {
    total: number;
    count: number;
    boatPurchaseTotal: number;
    mumsTotal: number;
  }>;
  categoryTotals: Record<string, number>;
}

interface SupabaseExpense {
  id: number;
  date: string;
  company: string;
  category: string;
  comment: string;
  amount: number | string;
  currency: string;
  year: number;
  receipt?: string;
}

function isBoatRelated(expense: SupabaseExpense): boolean {
  const searchText = [
    expense.company,
    expense.category,
    expense.comment,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Check category first (most reliable)
  for (const cat of BOAT_CATEGORIES) {
    if (searchText.includes(cat.toLowerCase())) {
      return true;
    }
  }

  // Check keywords
  for (const kw of BOAT_KEYWORDS) {
    if (searchText.includes(kw.toLowerCase())) {
      return true;
    }
  }

  // Check vendors
  for (const vendor of BOAT_VENDORS) {
    if (searchText.includes(vendor.toLowerCase())) {
      return true;
    }
  }

  return false;
}

async function fetchSupabaseExpenses(): Promise<SupabaseExpense[]> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/expenses`;
  const headers = {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
  };

  try {
    const response = await fetch(`${url}?select=*&order=date.desc`, {
      headers,
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      console.error(`Supabase API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching boat expenses from Supabase:', error);
    return [];
  }
}

export async function getBoatExpenseData(): Promise<BoatExpenseData> {
  const supabaseExpenses = await fetchSupabaseExpenses();

  const expenses: BoatExpense[] = [];
  const yearTotals: Record<
    number,
    { total: number; count: number; boatPurchaseTotal: number; mumsTotal: number }
  > = {};
  const categoryTotals: Record<string, number> = {};

  // Filter and process boat-related expenses
  const boatExpenses = supabaseExpenses.filter(isBoatRelated);

  for (let index = 0; index < boatExpenses.length; index++) {
    const sb = boatExpenses[index];
    const year = sb.year || new Date(sb.date).getFullYear();
    const amount = typeof sb.amount === 'string' ? parseFloat(sb.amount) : sb.amount;

    if (!yearTotals[year]) {
      yearTotals[year] = {
        total: 0,
        count: 0,
        boatPurchaseTotal: 0,
        mumsTotal: 0,
      };
    }

    const expense: BoatExpense = {
      entryNumber: String(index + 1),
      date: sb.date,
      company: sb.company || '',
      category: sb.category || '',
      comment: sb.comment || '',
      amount,
      currency: sb.currency || 'EUR',
      year,
      receiptFilename: sb.receipt || undefined,
      paidBy: undefined, // Not tracked in Supabase schema yet
    };

    expenses.push(expense);

    // Update totals
    yearTotals[year].total += amount;
    yearTotals[year].count += 1;

    if (
      (sb.category || '').toLowerCase().includes('boat purchase') ||
      (sb.category || '').toLowerCase().includes('purchase')
    ) {
      yearTotals[year].boatPurchaseTotal += amount;
    }

    // Try to detect MUM from comment or category
    if ((sb.comment || '').includes('MUM') || (sb.comment || '').includes('Mum')) {
      yearTotals[year].mumsTotal += amount;
    }

    // Category totals
    if (sb.category) {
      categoryTotals[sb.category] = (categoryTotals[sb.category] || 0) + amount;
    }
  }

  return {
    expenses: expenses.sort((a, b) => b.date.localeCompare(a.date)),
    yearTotals,
    categoryTotals,
  };
}
