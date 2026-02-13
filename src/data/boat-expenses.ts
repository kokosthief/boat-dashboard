import fs from 'fs';
import path from 'path';

export interface BoatExpense {
  entryNumber: string;
  date: string;
  company: string;
  category: string;
  comment: string;
  amount: number;
  currency: string;
  year: number;
  receiptPath?: string;
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

// Boat-related vendor keywords (case-insensitive)
const BOAT_VENDORS = [
  'george kniest',
  'sjemma',
  'sjemmie',
  'rhebergen',
  'marina',
  'diesel',
  'nautic',
  'mooring',
  'starlink',
  'timotheus',
  'nathalie versluis', // boat seller
  'klaas mulder', // bow thruster + victron
  'simone', // furniture maker
  'reifier',
  'mees van de nes', // carpenter
  'tijmon',
  'steve',
  'daf specialist',
  'anjema',
  'frank van meegen',
  'eerdmans', // insurance
  'andres',
  'bakdekker', // boat type
  'dieseldokter',
];

// Boat-related category keywords
const BOAT_CATEGORIES = [
  'boat',
  'mooring',
  'berth',
  'marina',
  'electricity',
  'diesel',
  'furnishing',
  'equipment',
  'maintenance',
  'tools',
  'diy supplies',
];

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
  if (!raw) return 0;
  const cleaned = raw.replace(/[€$,]/g, '').trim();
  return parseFloat(cleaned) || 0;
}

function parseDate(raw: string): string {
  if (!raw) return '';
  // Handle both YYYY-MM-DD and DD/MM/YYYY formats
  if (raw.includes('/')) {
    const parts = raw.split('/');
    if (parts.length === 3) {
      // Could be DD/MM/YYYY or YYYY/MM/DD
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1]}-${parts[2]}`;
      } else {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
  }
  return raw;
}

function isBoatRelated(company: string, category: string, comment: string): boolean {
  const searchText = `${company} ${category} ${comment}`.toLowerCase();
  
  // Check vendors
  for (const vendor of BOAT_VENDORS) {
    if (searchText.includes(vendor)) return true;
  }
  
  // Check categories
  for (const cat of BOAT_CATEGORIES) {
    if (searchText.includes(cat)) return true;
  }
  
  return false;
}

function findReceipt(year: number, date: string, company: string, accountingDir: string): string | undefined {
  const receiptsDir = path.join(accountingDir, 'receipts', year.toString());
  if (!fs.existsSync(receiptsDir)) return undefined;
  
  try {
    const files = fs.readdirSync(receiptsDir);
    const datePrefix = date.replace(/-/g, '-'); // YYYY-MM-DD format
    const companySlug = company.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Look for files matching the date
    const matchingFiles = files.filter(f => f.startsWith(datePrefix));
    
    if (matchingFiles.length === 1) {
      return `/accounting/receipts/${year}/${matchingFiles[0]}`;
    }
    
    // If multiple matches, try to find one with matching company name
    for (const file of matchingFiles) {
      const fileLower = file.toLowerCase();
      if (fileLower.includes(companySlug) || companySlug.includes(fileLower.split('_')[2]?.replace('.pdf', ''))) {
        return `/accounting/receipts/${year}/${file}`;
      }
    }
    
    // Return first match if no company match
    if (matchingFiles.length > 0) {
      return `/accounting/receipts/${year}/${matchingFiles[0]}`;
    }
  } catch (err) {
    console.error(`Error reading receipts dir for ${year}:`, err);
  }
  
  return undefined;
}

export function getBoatExpenseData(): BoatExpenseData {
  const accountingDir = '/Users/kokos/.openclaw/workspace/accounting';
  const years = [2023, 2024, 2025, 2026];
  const expenses: BoatExpense[] = [];
  const yearTotals: Record<number, { total: number; count: number; boatPurchaseTotal: number; mumsTotal: number }> = {};
  const categoryTotals: Record<string, number> = {};
  
  for (const year of years) {
    const csvPath = path.join(accountingDir, `${year}-expenses.csv`);
    if (!fs.existsSync(csvPath)) continue;
    
    yearTotals[year] = { total: 0, count: 0, boatPurchaseTotal: 0, mumsTotal: 0 };
    
    try {
      const content = fs.readFileSync(csvPath, 'utf-8');
      const lines = content.split('\n');
      
      // Skip header (first line)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = parseCSVLine(line);
        if (cols.length < 6) continue;
        
        const entryNumber = cols[0] || '';
        const date = parseDate(cols[1] || '');
        const company = (cols[2] || '').trim();
        const category = (cols[3] || '').trim();
        const comment = (cols[4] || '').trim();
        const amount = parseAmount(cols[5] || '');
        const currency = (cols[6] || 'EUR').trim();
        
        if (!date || amount === 0) continue;
        
        // Filter for boat-related expenses
        if (!isBoatRelated(company, category, comment)) continue;
        
        const receiptPath = findReceipt(year, date, company, accountingDir);
        
        expenses.push({
          entryNumber,
          date,
          company,
          category,
          comment,
          amount,
          currency,
          year,
          receiptPath,
        });
        
        yearTotals[year].total += amount;
        yearTotals[year].count += 1;
        
        // Track boat purchase separately
        if (category.toLowerCase().includes('boat purchase')) {
          yearTotals[year].boatPurchaseTotal += amount;
        }
        
        // Track category totals
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      }
    } catch (err) {
      console.error(`Error reading ${csvPath}:`, err);
    }
  }
  
  return {
    expenses: expenses.sort((a, b) => b.date.localeCompare(a.date)),
    yearTotals,
    categoryTotals,
  };
}
