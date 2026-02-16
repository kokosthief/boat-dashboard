'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { BoatExpense, BoatExpenseData } from '@/data/boat-expenses';

type SortKey = 'date' | 'company' | 'category' | 'amount';

function fmt(n: number) {
  return '€' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDisplayDate(iso: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function BoatExpensesClient({ data }: { data: BoatExpenseData }) {
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const availableYears = useMemo(() => {
    return Object.keys(data.yearTotals).map(Number).sort((a, b) => b - a);
  }, [data.yearTotals]);

  const categories = useMemo(() => {
    const yearExpenses = yearFilter === 'all' 
      ? data.expenses 
      : data.expenses.filter(e => e.year === yearFilter);
    const cats = Array.from(new Set(yearExpenses.map(e => e.category))).sort();
    return ['All', ...cats];
  }, [data.expenses, yearFilter]);

  const filtered = useMemo(() => {
    let result = data.expenses;
    
    if (yearFilter !== 'all') {
      result = result.filter(e => e.year === yearFilter);
    }
    
    if (categoryFilter !== 'All') {
      result = result.filter(e => e.category === categoryFilter);
    }
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.company.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.comment.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [data.expenses, yearFilter, categoryFilter, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const mult = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'amount') return (a.amount - b.amount) * mult;
      if (sortKey === 'date') return a.date.localeCompare(b.date) * mult;
      if (sortKey === 'company') return a.company.localeCompare(b.company) * mult;
      if (sortKey === 'category') return a.category.localeCompare(b.category) * mult;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const filteredStats = useMemo(() => {
    const total = filtered.reduce((s, e) => s + e.amount, 0);
    const boatPurchaseTotal = filtered
      .filter(e => e.category.toLowerCase().includes('boat purchase'))
      .reduce((s, e) => s + e.amount, 0);
    const mumsTotal = filtered
      .filter(e => e.paidBy === 'MUM')
      .reduce((s, e) => s + e.amount, 0);
    
    return {
      total,
      boatPurchaseTotal,
      mumsTotal,
      netCost: total - boatPurchaseTotal - mumsTotal,
      count: filtered.length,
    };
  }, [filtered]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  // Receipt modal state
  const [selectedExpense, setSelectedExpense] = useState<BoatExpense | null>(null);

  const receiptUrl = useMemo(() => {
    if (!selectedExpense?.receiptFilename) return null;
    return `/api/receipts/file?path=receipts/${selectedExpense.year}/${selectedExpense.receiptFilename}`;
  }, [selectedExpense]);

  const isImage = useMemo(() => {
    if (!selectedExpense?.receiptFilename) return false;
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(selectedExpense.receiptFilename);
  }, [selectedExpense]);

  // Close modal on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedExpense(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleRowClick = useCallback((e: BoatExpense) => {
    setSelectedExpense(e);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with Year Selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">⚓ Boat Expenses</h1>
        <div className="flex gap-1">
          <button
            onClick={() => { setYearFilter('all'); setCategoryFilter('All'); }}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
              yearFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            All
          </button>
          {availableYears.map(yr => (
            <button
              key={yr}
              onClick={() => { setYearFilter(yr); setCategoryFilter('All'); }}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                yearFilter === yr
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Year-over-Year Overview (when All selected) */}
      {yearFilter === 'all' && availableYears.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="font-semibold mb-3">📅 Year-over-Year</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {availableYears.map(yr => {
              const stats = data.yearTotals[yr];
              return (
                <button
                  key={yr}
                  onClick={() => { setYearFilter(yr); setCategoryFilter('All'); }}
                  className="bg-slate-800/50 hover:bg-slate-800 rounded-lg p-4 text-left transition-colors"
                >
                  <p className="text-lg font-bold">{yr}</p>
                  <p className="text-sm text-slate-400 mt-1">{stats.count} expenses</p>
                  <p className="font-mono text-blue-400 mt-2">{fmt(stats.total)}</p>
                  {stats.boatPurchaseTotal > 0 && (
                    <p className="text-xs text-slate-500 mt-1">
                      Ex. purchase: {fmt(stats.total - stats.boatPurchaseTotal)}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtotals Section */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-600 rounded-xl p-4 col-span-2 lg:col-span-1">
          <p className="text-sm opacity-80">Total</p>
          <p className="text-xl sm:text-2xl font-bold mt-1">{fmt(filteredStats.total)}</p>
          <p className="text-xs opacity-70 mt-1">{filteredStats.count} expenses</p>
        </div>

        <div className="bg-blue-600 rounded-xl p-4">
          <p className="text-sm opacity-80">Boat Purchase</p>
          <p className="text-xl sm:text-2xl font-bold mt-1">{fmt(filteredStats.boatPurchaseTotal)}</p>
          <p className="text-xs opacity-70 mt-1">Timotheus F</p>
        </div>
        
        <div className="bg-emerald-600 rounded-xl p-4">
          <p className="text-sm opacity-80">Running Expenses</p>
          <p className="text-xl sm:text-2xl font-bold mt-1">
            {fmt(filteredStats.total - filteredStats.boatPurchaseTotal)}
          </p>
          <p className="text-xs opacity-70 mt-1">{filteredStats.count - (filteredStats.boatPurchaseTotal > 0 ? 1 : 0)} expenses</p>
        </div>
        
        <div className="bg-amber-600 rounded-xl p-4">
          <p className="text-sm opacity-80">Henry&apos;s Total</p>
          <p className="text-xl sm:text-2xl font-bold mt-1">{fmt(filteredStats.total - filteredStats.boatPurchaseTotal - filteredStats.mumsTotal)}</p>
          <p className="text-xs opacity-70 mt-1">Excl. purchase &amp; mum</p>
        </div>
        
        <div className="bg-pink-600 rounded-xl p-4">
          <p className="text-sm opacity-80">Mum&apos;s Contributions</p>
          <p className="text-xl sm:text-2xl font-bold mt-1">{fmt(filteredStats.mumsTotal)}</p>
          <p className="text-xs opacity-70 mt-1">💝 Family support</p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search vendor, category, or notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:border-blue-500"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Filtered summary */}
      {(yearFilter !== 'all' || categoryFilter !== 'All' || search) && (
        <p className="text-sm text-slate-400">
          Showing {filtered.length} of {data.expenses.length} expenses — 
          Filtered total: <span className="text-white font-semibold">{fmt(filteredStats.total)}</span>
        </p>
      )}

      {/* Receipt Modal */}
      {selectedExpense && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedExpense(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div>
                <p className="font-semibold text-lg">{selectedExpense.company}</p>
                <p className="text-sm text-slate-400">
                  {formatDisplayDate(selectedExpense.date)} · {fmt(selectedExpense.amount)} · {selectedExpense.category}
                  {selectedExpense.paidBy === 'MUM' && ' · 💝 Mum'}
                </p>
                {selectedExpense.comment && (
                  <p className="text-xs text-slate-500 mt-1">{selectedExpense.comment}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedExpense(null)}
                className="text-slate-400 hover:text-white text-2xl leading-none px-2"
              >
                ×
              </button>
            </div>
            {/* Modal body */}
            <div className="flex-1 overflow-auto p-5">
              {receiptUrl ? (
                isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={receiptUrl} alt="Receipt" className="max-w-full rounded-lg" />
                ) : (
                  <iframe
                    src={receiptUrl}
                    className="w-full rounded-lg bg-white"
                    style={{ height: '70vh' }}
                    title="Receipt PDF"
                  />
                )
              ) : selectedExpense.comment?.toLowerCase().includes('cash') ? (
                <div className="text-center py-16 text-slate-500">
                  <p className="text-5xl mb-4">💵</p>
                  <p className="text-lg font-medium">Cash Payment</p>
                  <p className="text-sm mt-1">No digital receipt available</p>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-500">
                  <p className="text-5xl mb-4">📭</p>
                  <p className="text-lg font-medium">No Receipt</p>
                  <p className="text-sm mt-1">No receipt file linked to this expense</p>
                </div>
              )}
            </div>
            {/* Modal footer */}
            {receiptUrl && (
              <div className="px-5 py-3 border-t border-slate-800 flex justify-end">
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Open in new tab ↗
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expense Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th
                  className="px-4 py-3 font-medium text-slate-400 cursor-pointer hover:text-white transition-colors select-none whitespace-nowrap"
                  onClick={() => toggleSort('date')}
                >
                  Date{arrow('date')}
                </th>
                <th
                  className="px-4 py-3 font-medium text-slate-400 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => toggleSort('company')}
                >
                  Vendor + Expense{arrow('company')}
                </th>
                <th
                  className="px-4 py-3 font-medium text-slate-400 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => toggleSort('amount')}
                >
                  Amount{arrow('amount')}
                </th>
                <th
                  className="px-4 py-3 font-medium text-slate-400 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => toggleSort('category')}
                >
                  Category{arrow('category')}
                </th>
                <th className="px-4 py-3 font-medium text-slate-400">Paid By</th>
                <th className="px-4 py-3 font-medium text-slate-400">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((e, i) => (
                <tr 
                  key={`${e.year}-${e.entryNumber}-${i}`}
                  className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(e)}
                >
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                    {formatDisplayDate(e.date)}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{e.company}</p>
                      {e.comment && (
                        <p className="text-xs text-slate-500 mt-0.5">{e.comment}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-right whitespace-nowrap">
                    {fmt(e.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                      {e.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {e.paidBy === 'MUM' && (
                      <span className="bg-pink-600/20 text-pink-400 border border-pink-600/50 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
                        💝 Mum
                      </span>
                    )}
                    {e.paidBy === 'HENRY' && (
                      <span className="bg-blue-600/20 text-blue-400 border border-blue-600/50 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
                        Henry
                      </span>
                    )}
                    {e.paidBy === 'PARTIAL' && (
                      <span className="bg-amber-600/20 text-amber-400 border border-amber-600/50 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
                        Shared
                      </span>
                    )}
                    {!e.paidBy && (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {e.receiptFilename ? (
                      <a
                        href={`/api/receipts/file?path=receipts/${e.year}/${e.receiptFilename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors inline-block text-xl"
                        title="View receipt"
                      >
                        📄
                      </a>
                    ) : e.comment.toLowerCase().includes('cash') ? (
                      <span className="text-green-400 text-xl" title="Cash payment">💵</span>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No boat expenses match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
