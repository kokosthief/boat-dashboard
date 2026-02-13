'use client';

import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Expense {
  date: string;
  description: string;
  vendor: string;
  category: string;
  amount: number;
  paidBy: 'Henry' | 'Mum' | 'Partial';
}

interface RecurringCost {
  description: string;
  vendor: string;
  category: string;
  monthlyEstimate: number;
  annualEstimate: number;
  entries: Expense[];
}

interface ExpenseData {
  expenses: Expense[];
  grandTotal: number;
  subtotalExPurchase: number;
  mumsContributions: number;
  henrysNetCost: number;
  categoryTotals: Record<string, number>;
  recurringCosts: RecurringCost[];
}

type SortKey = 'date' | 'description' | 'vendor' | 'category' | 'amount' | 'paidBy';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6', '#e11d48'];

function fmt(n: number) {
  return '€' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDisplayDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function ExpensesClient({ data }: { data: ExpenseData }) {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [paidByFilter, setPaidByFilter] = useState('All');
  const [showChart, setShowChart] = useState<'pie' | 'bar'>('bar');
  const [yearFilter, setYearFilter] = useState('All');

  const years = useMemo(() => {
    const yrs = Array.from(new Set(data.expenses.map(e => e.date.split('-')[0]))).sort();
    return ['All', ...yrs];
  }, [data.expenses]);

  const categories = useMemo(() => {
    const yearExpenses = yearFilter === 'All' ? data.expenses : data.expenses.filter(e => e.date.startsWith(yearFilter));
    const cats = Array.from(new Set(yearExpenses.map(e => e.category))).sort();
    return ['All', ...cats];
  }, [data.expenses, yearFilter]);

  const filtered = useMemo(() => {
    let result = data.expenses;
    if (yearFilter !== 'All') result = result.filter(e => e.date.startsWith(yearFilter));
    if (categoryFilter !== 'All') result = result.filter(e => e.category === categoryFilter);
    if (paidByFilter !== 'All') result = result.filter(e => e.paidBy === paidByFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.description.toLowerCase().includes(q) ||
        e.vendor.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [data.expenses, yearFilter, categoryFilter, paidByFilter, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const mult = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'amount') return (a.amount - b.amount) * mult;
      return (a[sortKey] || '').localeCompare(b[sortKey] || '') * mult;
    });
  }, [filtered, sortKey, sortDir]);

  const filteredTotal = filtered.reduce((s, e) => s + e.amount, 0);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }
  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  // Chart data - from filtered expenses, exclude boat purchase
  const filteredCategoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const e of filtered) {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    }
    return totals;
  }, [filtered]);

  const chartData = Object.entries(filteredCategoryTotals)
    .filter(([cat]) => cat !== 'Boat Purchase')
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }));

  // Year-over-year comparison
  const yearlyBreakdown = useMemo(() => {
    const yrs = Array.from(new Set(data.expenses.map(e => e.date.split('-')[0]))).sort();
    return yrs.map(yr => {
      const yrExpenses = data.expenses.filter(e => e.date.startsWith(yr));
      const total = yrExpenses.reduce((s, e) => s + e.amount, 0);
      const exPurchase = yrExpenses.filter(e => e.category !== 'Boat Purchase').reduce((s, e) => s + e.amount, 0);
      const mumsTotal = yrExpenses.filter(e => e.paidBy === 'Mum').reduce((s, e) => s + e.amount, 0);
      return { year: yr, total, exPurchase, mumsTotal, count: yrExpenses.length };
    });
  }, [data.expenses]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">💰 Timo — Expenses</h1>
        <div className="flex gap-1">
          {years.map(yr => (
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

      {/* Year-over-Year Comparison */}
      {yearFilter === 'All' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="font-semibold mb-3">📅 Year-over-Year</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {yearlyBreakdown.map(yr => (
              <button
                key={yr.year}
                onClick={() => { setYearFilter(yr.year); setCategoryFilter('All'); }}
                className="bg-slate-800/50 hover:bg-slate-800 rounded-lg p-4 text-left transition-colors"
              >
                <p className="text-lg font-bold">{yr.year}</p>
                <p className="text-sm text-slate-400 mt-1">{yr.count} expenses</p>
                <p className="font-mono text-blue-400 mt-2">{fmt(yr.total)}</p>
                {yr.total !== yr.exPurchase && (
                  <p className="text-xs text-slate-500 mt-1">Ex. purchase: {fmt(yr.exPurchase)}</p>
                )}
                {yr.mumsTotal > 0 && (
                  <p className="text-xs text-pink-400 mt-1">Mum: {fmt(yr.mumsTotal)}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards — reflect year filter */}
      {(() => {
        const base = yearFilter === 'All' ? data.expenses : data.expenses.filter(e => e.date.startsWith(yearFilter));
        const gt = base.reduce((s, e) => s + e.amount, 0);
        const bp = base.filter(e => e.category === 'Boat Purchase').reduce((s, e) => s + e.amount, 0);
        const mc = base.filter(e => e.paidBy === 'Mum').reduce((s, e) => s + e.amount, 0);
        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-600 rounded-xl p-4">
              <p className="text-sm opacity-80">{yearFilter === 'All' ? 'Grand Total' : `${yearFilter} Total`}</p>
              <p className="text-xl sm:text-2xl font-bold mt-1">{fmt(gt)}</p>
              <p className="text-xs opacity-70 mt-1">{base.length} expenses</p>
            </div>
            <div className="bg-emerald-600 rounded-xl p-4">
              <p className="text-sm opacity-80">Excl. Boat Purchase</p>
              <p className="text-xl sm:text-2xl font-bold mt-1">{fmt(gt - bp)}</p>
              <p className="text-xs opacity-70 mt-1">Running costs</p>
            </div>
            <div className="bg-pink-600 rounded-xl p-4">
              <p className="text-sm opacity-80">Mum&apos;s Contributions</p>
              <p className="text-xl sm:text-2xl font-bold mt-1">{fmt(mc)}</p>
              <p className="text-xs opacity-70 mt-1">{base.filter(e => e.paidBy === 'Mum').length} expenses</p>
            </div>
            <div className="bg-amber-600 rounded-xl p-4">
              <p className="text-sm opacity-80">Henry&apos;s Net Cost</p>
              <p className="text-xl sm:text-2xl font-bold mt-1">{fmt(gt - mc - bp)}</p>
              <p className="text-xs opacity-70 mt-1">Total − Mum − Purchase</p>
            </div>
          </div>
        );
      })()}

      {/* Recurring Monthly Costs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="font-semibold mb-3">🔄 Recurring Monthly Costs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-3 py-2 text-slate-400 font-medium">Category</th>
                <th className="px-3 py-2 text-slate-400 font-medium">Vendor</th>
                <th className="px-3 py-2 text-slate-400 font-medium text-right">Est. Monthly</th>
                <th className="px-3 py-2 text-slate-400 font-medium text-right">Est. Annual</th>
                <th className="px-3 py-2 text-slate-400 font-medium text-right">Entries</th>
              </tr>
            </thead>
            <tbody>
              {data.recurringCosts.map((rc, i) => (
                <tr key={i} className="border-b border-slate-800/50">
                  <td className="px-3 py-2">{rc.category}</td>
                  <td className="px-3 py-2 text-slate-400">{rc.vendor}</td>
                  <td className="px-3 py-2 text-right font-mono">{fmt(rc.monthlyEstimate)}</td>
                  <td className="px-3 py-2 text-right font-mono">{fmt(rc.annualEstimate)}</td>
                  <td className="px-3 py-2 text-right text-slate-400">{rc.entries.length}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="px-3 py-2" colSpan={2}>Total</td>
                <td className="px-3 py-2 text-right font-mono">{fmt(data.recurringCosts.reduce((s, r) => s + r.monthlyEstimate, 0))}</td>
                <td className="px-3 py-2 text-right font-mono">{fmt(data.recurringCosts.reduce((s, r) => s + r.annualEstimate, 0))}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Breakdown Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">📊 Expenses by Category</h2>
          <div className="flex gap-1">
            <button onClick={() => setShowChart('bar')} className={`px-3 py-1 text-xs rounded ${showChart === 'bar' ? 'bg-blue-600' : 'bg-slate-800'}`}>Bar</button>
            <button onClick={() => setShowChart('pie')} className={`px-3 py-1 text-xs rounded ${showChart === 'pie' ? 'bg-blue-600' : 'bg-slate-800'}`}>Pie</button>
          </div>
        </div>
        <p className="text-xs text-slate-500 mb-3">Excluding boat purchase</p>
        <div className="w-full" style={{ height: showChart === 'bar' ? Math.max(300, chartData.length * 36) : 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            {showChart === 'bar' ? (
              <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `€${v.toLocaleString()}`} />
                <YAxis type="category" dataKey="name" width={160} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip formatter={(value) => fmt(Number(value))} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" outerRadius={120} dataKey="value" label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`} labelLine={false}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => fmt(Number(value))} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={yearFilter}
          onChange={e => { setYearFilter(e.target.value); setCategoryFilter('All'); }}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
        </select>
        <input
          type="text"
          placeholder="Search expenses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:border-blue-500"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={paidByFilter}
          onChange={e => setPaidByFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="All">All Payers</option>
          <option value="Henry">Henry</option>
          <option value="Mum">Mum</option>
        </select>
      </div>

      {/* Filtered total */}
      {(yearFilter !== 'All' || categoryFilter !== 'All' || paidByFilter !== 'All' || search) && (
        <p className="text-sm text-slate-400">
          Showing {filtered.length} of {data.expenses.length} expenses — Filtered total: <span className="text-white font-semibold">{fmt(filteredTotal)}</span>
        </p>
      )}

      {/* Expense Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                {([
                  ['date', 'Date'],
                  ['description', 'Description'],
                  ['vendor', 'Vendor'],
                  ['category', 'Category'],
                  ['amount', 'Amount'],
                  ['paidBy', 'Paid By'],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th key={key}
                    className="px-4 py-3 font-medium text-slate-400 cursor-pointer hover:text-white transition-colors select-none whitespace-nowrap"
                    onClick={() => toggleSort(key)}>
                    {label}{arrow(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((e, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{formatDisplayDate(e.date)}</td>
                  <td className="px-4 py-3 max-w-[250px]">
                    <span className="line-clamp-2">{e.description}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{e.vendor}</td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-xs whitespace-nowrap">{e.category}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-right whitespace-nowrap">{fmt(e.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      e.paidBy === 'Mum' ? 'bg-pink-900/50 text-pink-300' :
                      e.paidBy === 'Partial' ? 'bg-amber-900/50 text-amber-300' :
                      'bg-blue-900/50 text-blue-300'
                    }`}>
                      {e.paidBy}
                    </span>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No expenses match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
