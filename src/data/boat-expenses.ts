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

function findReceipt(year: number, date: string, company: string, accountingDir: string): string | undefined {
  // For receipts, we'll need to access the original accounting directory
  // In production (Vercel), this won't work - receipts would need to be uploaded to cloud storage
  // For now, return undefined in production and only work locally
  const isProduction = process.env.NODE_ENV === 'production' || !accountingDir.includes('openclaw');
  if (isProduction) {
    // TODO: Integrate with cloud storage (S3, Cloudflare R2, etc.) for receipt hosting
    return undefined;
  }
  
  const receiptsDir = path.join('/Users/kokos/.openclaw/workspace/accounting/receipts', year.toString());
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
  // Use public directory for Vercel deployment
  const accountingDir = path.join(process.cwd(), 'public', 'data', 'accounting');
  const years = [2023, 2024, 2025, 2026];
  const expenses: BoatExpense[] = [];
  const yearTotals: Record<number, { total: number; count: number; boatPurchaseTotal: number; mumsTotal: number }> = {};
  const categoryTotals: Record<string, number> = {};
  
  // First, load from boat-timo-expenses.csv (all years)
  const boatTimoPath = path.join(process.cwd(), 'public', 'data', 'boat-timo-expenses.csv');
  if (fs.existsSync(boatTimoPath)) {
    try {
      const content = fs.readFileSync(boatTimoPath, 'utf-8');
      const lines = content.split('\n');
      
      // Skip first 4 rows (title + blank lines + header)
      for (let i = 4; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = parseCSVLine(line);
        if (cols.length < 5) continue;
        
        const date = parseDate(cols[0] || '');
        if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) continue;
        
        const year = parseInt(date.split('-')[0]);
        
        const company = (cols[2] || '').trim();
        const category = (cols[3] || '').trim();
        const amount = parseAmount(cols[4] || '');
        const paidBy = (cols[5] || '').trim(); // MUM, HENRY, PARTIAL, or empty
        
        if (amount === 0) continue;
        
        if (!yearTotals[year]) {
          yearTotals[year] = { total: 0, count: 0, boatPurchaseTotal: 0, mumsTotal: 0 };
        }
        
        const receiptPath = findReceipt(year, date, company, accountingDir);
        
        expenses.push({
          entryNumber: String(i - 3),
          date,
          company,
          category,
          comment: (cols[1] || '').trim(),
          amount,
          currency: 'EUR',
          year,
          receiptPath,
          paidBy: paidBy || undefined,
        });
        
        yearTotals[year].total += amount;
        yearTotals[year].count += 1;
        
        if (category.toLowerCase().includes('boat purchase')) {
          yearTotals[year].boatPurchaseTotal += amount;
        }
        
        // Track Mum's contributions
        if (paidBy === 'MUM') {
          yearTotals[year].mumsTotal += amount;
        }
        
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      }
    } catch (err) {
      console.error('Error reading boat-timo-expenses.csv:', err);
    }
  }
  
  return {
    expenses: expenses.sort((a, b) => b.date.localeCompare(a.date)),
    yearTotals,
    categoryTotals,
  };
}
