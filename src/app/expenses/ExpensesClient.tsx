'use client';

import { Fragment, useState } from 'react';

interface Expense {
  entryNumber: string;
  date: string;
  company: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  hasReceipt: boolean;
}

type SortKey = 'date' | 'company' | 'category' | 'description' | 'amount' | 'currency';
type SortDir = 'asc' | 'desc';

export default function ExpensesClient({ expenses, total, totalExPurchase }: {
  expenses: Expense[];
  total: number;
  totalExPurchase: number;
}) {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = [...expenses].sort((a, b) => {
    const mult = sortDir === 'asc' ? 1 : -1;
    if (sortKey === 'amount') return (a.amount - b.amount) * mult;
    return (a[sortKey] || '').localeCompare(b[sortKey] || '') * mult;
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">💰 Expenses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-600 rounded-xl p-4">
          <p className="text-sm opacity-80">Total Expenses</p>
          <p className="text-2xl font-bold mt-1">€{total.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs opacity-70 mt-1">{expenses.length} entries</p>
        </div>
        <div className="bg-emerald-600 rounded-xl p-4">
          <p className="text-sm opacity-80">Excl. Purchase Cost</p>
          <p className="text-2xl font-bold mt-1">€{totalExPurchase.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs opacity-70 mt-1">Running costs only</p>
        </div>
        <div className="bg-purple-600 rounded-xl p-4">
          <p className="text-sm opacity-80">Mom&apos;s Contributions</p>
          <p className="text-2xl font-bold mt-1">€0</p>
          <p className="text-xs opacity-70 mt-1">To be updated</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                {([
                  ['date', 'Date'],
                  ['company', 'Company'],
                  ['category', 'Category'],
                  ['description', 'Description'],
                  ['amount', 'Amount'],
                  ['currency', 'Currency'],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th key={key}
                    className="px-4 py-3 font-medium text-slate-400 cursor-pointer hover:text-white transition-colors select-none"
                    onClick={() => toggleSort(key)}>
                    {label}{arrow(key)}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium text-slate-400">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((e, i) => {
                const id = e.entryNumber || String(i);
                return (
                  <Fragment key={id}>
                    <tr
                      className="border-b border-slate-800/50 hover:bg-slate-800/50 cursor-pointer transition-colors"
                      onClick={() => setExpanded(expanded === id ? null : id)}>
                      <td className="px-4 py-3 text-slate-300">{e.date}</td>
                      <td className="px-4 py-3">{e.company}</td>
                      <td className="px-4 py-3 text-slate-400">{e.category}</td>
                      <td className="px-4 py-3 text-slate-400 max-w-[200px] truncate">{e.description}</td>
                      <td className="px-4 py-3 font-mono text-right">€{e.amount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-slate-400">{e.currency}</td>
                      <td className="px-4 py-3 text-center">{e.hasReceipt ? '📎' : '—'}</td>
                    </tr>
                    {expanded === id && (
                      <tr className="bg-slate-800/30">
                        <td colSpan={7} className="px-4 py-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="text-slate-500">Entry #:</span> {e.entryNumber}</div>
                            <div><span className="text-slate-500">Date:</span> {e.date}</div>
                            <div><span className="text-slate-500">Company:</span> {e.company}</div>
                            <div><span className="text-slate-500">Category:</span> {e.category}</div>
                            <div className="col-span-2"><span className="text-slate-500">Description:</span> {e.description || '—'}</div>
                            <div><span className="text-slate-500">Amount:</span> €{e.amount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</div>
                            <div><span className="text-slate-500">Receipt:</span> Coming soon</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No boat expenses found in CSV data.
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
