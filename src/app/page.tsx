import Link from 'next/link';
import { tasks } from '@/data/tasks';
import { harbours } from '@/data/harbours';
import { vendors } from '@/data/vendors';
import { getExpenseData } from '@/data/expenses';

function parseCost(c: string): number {
  const m = c.replace(/[^0-9.]/g, '');
  return m ? parseFloat(m) : 0;
}

export default function Home() {
  const expenseData = getExpenseData();
  const totalExpenses = expenseData.grandTotal;
  const activeTasks = tasks.filter(t => t.status !== 'Finished');
  const upcoming = activeTasks
    .filter(t => t.targetDate)
    .sort((a, b) => a.targetDate.localeCompare(b.targetDate))[0];

  const cards = [
    { label: 'Total Expenses', value: `€${totalExpenses.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`, sub: `${expenseData.expenses.length} expenses tracked`, color: 'bg-blue-600', href: '/expenses' },
    { label: 'Current Mooring', value: '€535/mo', sub: 'De Remming, Zaandam', color: 'bg-emerald-600' },
    { label: 'Active Tasks', value: String(activeTasks.length), sub: `${tasks.filter(t => t.status === 'Finished').length} completed`, color: 'bg-amber-600' },
    { label: 'Next Deadline', value: upcoming?.targetDate || 'None', sub: upcoming?.name || '', color: 'bg-purple-600' },
  ];

  const sections = [
    { href: '/kanban', emoji: '📋', title: 'Kanban Board', desc: `${activeTasks.length} active tasks across 4 stages` },
    { href: '/harbours', emoji: '⚓', title: 'Harbours', desc: `${harbours.length} marinas tracked` },
    { href: '/vendors', emoji: '🔧', title: 'Vendors', desc: `${vendors.length} contacts` },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">⛵ Timo</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => {
          const inner = (
            <>
              <p className="text-sm opacity-80">{c.label}</p>
              <p className="text-2xl font-bold mt-1">{c.value}</p>
              <p className="text-xs opacity-70 mt-1">{c.sub}</p>
            </>
          );
          return c.href ? (
            <Link key={c.label} href={c.href} className={`${c.color} rounded-xl p-4 hover:opacity-90 transition-opacity`}>
              {inner}
            </Link>
          ) : (
            <div key={c.label} className={`${c.color} rounded-xl p-4`}>
              {inner}
            </div>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {sections.map(s => (
          <Link key={s.href} href={s.href}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors">
            <p className="text-2xl mb-2">{s.emoji}</p>
            <p className="font-semibold">{s.title}</p>
            <p className="text-sm text-slate-400 mt-1">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="font-semibold mb-3">Recent Completed</h2>
        <div className="space-y-2">
          {tasks.filter(t => t.status === 'Finished').slice(-5).reverse().map(t => (
            <div key={t.name} className="flex justify-between text-sm">
              <span className="text-slate-300">✅ {t.name}</span>
              <span className="text-slate-500">{t.cost || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
