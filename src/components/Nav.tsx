'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: '🏠 Dashboard' },
  { href: '/kanban', label: '📋 Kanban' },
  { href: '/harbours', label: '⚓ Harbours' },
  { href: '/vendors', label: '🔧 Vendors' },
  { href: '/expenses', label: '💰 Expenses' },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6 overflow-x-auto">
        <Link href="/" className="text-lg font-bold whitespace-nowrap">⛵ Timo</Link>
        <div className="flex gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                path === l.href ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
