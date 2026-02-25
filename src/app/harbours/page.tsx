'use client';
import { useState } from 'react';
import { harbours, statusOrder } from '@/data/harbours';

const statusColors: Record<string, string> = {
  Agreed: 'bg-green-900/40 text-green-300',
  Considering: 'bg-yellow-900/40 text-yellow-300',
  Maybe: 'bg-orange-900/40 text-orange-300',
  'Second Choice': 'bg-slate-800 text-slate-300',
  Call: 'bg-red-900/40 text-red-300',
  Dropped: 'bg-slate-900 text-slate-500',
};

export default function HarboursPage() {
  const [filter, setFilter] = useState('All');
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const statuses = ['All', ...statusOrder];
  const baseFiltered = filter === 'All' ? harbours : harbours.filter(h => h.status === filter);
  
  // Sort to put Rhebergen at the top
  const filtered = [...baseFiltered].sort((a, b) => {
    const aIsCurrent = a.name.toLowerCase().includes('rhebergen');
    const bIsCurrent = b.name.toLowerCase().includes('rhebergen');
    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;
    return 0;
  });

  const toggleNote = (name: string) => {
    setExpandedNotes(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">⚓ Harbours</h1>
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-lg text-sm ${filter === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left text-slate-400">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Area</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Services</th>
              <th className="py-2 pr-4">Winter Cost</th>
              <th className="py-2 pr-4">Electricity</th>
              <th className="py-2 pr-4">Parking</th>
              <th className="py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(h => {
              const isCurrent = h.name.toLowerCase().includes('rhebergen');
              const isExpanded = expandedNotes.has(h.name);
              const canExpand = h.notes.length > 80;
              const preview = canExpand ? `${h.notes.slice(0, 80)}...` : h.notes;
              const visibleServices = h.services.slice(0, 3);
              const remainingServices = h.services.length - visibleServices.length;
              return (
                <tr key={h.name} className={`border-b border-slate-800/50 ${isCurrent ? 'bg-emerald-900/30 border-l-4 border-l-emerald-500' : ''}`}>
                  <td className="py-2 pr-4 font-medium">
                    {h.website ? <a href={h.website} target="_blank" className="text-blue-400 hover:underline">{h.name}</a> : h.name}
                    {isCurrent && <span className="ml-2 text-xs bg-emerald-600 px-1.5 py-0.5 rounded">★ CURRENT</span>}
                  </td>
                  <td className="py-2 pr-4 text-slate-400">{h.area}</td>
                  <td className="py-2 pr-4"><span className={`px-2 py-0.5 rounded text-xs ${statusColors[h.status] || ''}`}>{h.status}</span></td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {visibleServices.map(service => (
                        <span key={service} className="bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5 rounded">{service}</span>
                      ))}
                      {remainingServices > 0 && (
                        <span className="bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5 rounded">+{remainingServices} more</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 pr-4">{h.winterMooringPrice || '—'}</td>
                  <td className="py-2 pr-4">{h.electricityPrice || '—'}</td>
                  <td className="py-2 pr-4">{h.carParking ? '🅿️' : '—'}</td>
                  <td className={`py-2 text-slate-500 text-xs ${isExpanded ? 'whitespace-normal break-words' : 'max-w-xs'}`}>
                    <span className={isExpanded ? '' : 'truncate block'}>{isExpanded ? h.notes : preview}</span>
                    {canExpand && (
                      <button
                        type="button"
                        onClick={() => toggleNote(h.name)}
                        className="text-blue-400/80 hover:text-blue-300 mt-1"
                      >
                        {isExpanded ? 'show less' : 'show more'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
