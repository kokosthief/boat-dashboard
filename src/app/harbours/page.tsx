'use client';

import { useEffect, useState } from 'react';

interface Yard {
  id?: number;
  name: string;
  location: string | null;
  website: string | null;
  phone: string | null;
  sandblasting: string;
  status: string;
  notes: string | null;
  living_permitted: string | null;
  mooring_cost: string | null;
  electricity_price: string | null;
  car_parking: boolean | null;
  services: string[] | null;
}

const livingPermittedColors: Record<string, string> = {
  Yes: 'bg-green-700 text-green-200',
  Maybe: 'bg-yellow-800 text-yellow-200',
  No: 'bg-red-900 text-red-300',
  'N/A': 'bg-slate-700 text-slate-400',
};

const sandblastingColors: Record<string, string> = {
  Yes: 'bg-green-700 text-green-200',
  No: 'bg-red-900 text-red-300',
  Unsure: 'bg-yellow-800 text-yellow-200',
};

const hauloutStatusColors: Record<string, string> = {
  'To contact': 'bg-blue-700 text-blue-200',
  Contacted: 'bg-slate-700 text-slate-200',
  Quoted: 'bg-purple-700 text-purple-200',
  'Not suitable': 'bg-red-900 text-red-300',
  Excluded: 'bg-red-900 text-red-300',
  Recommended: 'bg-emerald-700 text-emerald-200',
  Booked: 'bg-green-700 text-green-200',
  'Backup only': 'bg-orange-800 text-orange-200',
};

function normalizeSandblasting(value: string | null | undefined): string {
  if (!value) return '';
  if (value === 'Confirm needed') return 'Unsure';
  return value;
}

function normalizeUrl(url: string | null | undefined): string {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export default function HarboursPage() {
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [yards, setYards] = useState<Yard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchYards = async () => {
      try {
        const res = await fetch('/api/yards');
        if (!res.ok) throw new Error('Failed to fetch yards');
        const data = (await res.json()) as Yard[];
        if (active) {
          setYards(Array.isArray(data) ? data : []);
        }
      } catch {
        if (active) {
          setYards([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchYards();
    return () => {
      active = false;
    };
  }, []);

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

      {loading && <div className="text-slate-400 text-sm">Loading...</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left text-slate-400">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Area</th>
              <th className="py-2 pr-4">Living Permitted</th>
              <th className="py-2 pr-4">Services</th>
              <th className="py-2 pr-4">Mooring Cost</th>
              <th className="py-2 pr-4">Electricity</th>
              <th className="py-2 pr-4">Parking</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">Sandblasting</th>
              <th className="py-2 pr-4">Haulout Status</th>
              <th className="py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {yards.map((row, index) => {
              const name = row.name || '';
              const notes = row.notes || '';
              const services = Array.isArray(row.services) ? row.services : [];
              const isExpanded = expandedNotes.has(name);
              const canExpand = notes.length > 80;
              const preview = canExpand ? `${notes.slice(0, 80)}...` : notes;
              const visibleServices = services.slice(0, 3);
              const remainingServices = services.length - visibleServices.length;
              const livingPermitted = row.living_permitted || '';

              return (
                <tr key={`${row.id ?? name}-${index}`} className="border-b border-slate-800/50">
                  <td className="py-2 pr-4 font-medium">
                    {row.website ? (
                      <a
                        href={normalizeUrl(row.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {name}
                      </a>
                    ) : (
                      name
                    )}
                  </td>
                  <td className="py-2 pr-4 text-slate-400">{row.location || '—'}</td>
                  <td className="py-2 pr-4">
                    {livingPermitted ? (
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          livingPermittedColors[livingPermitted] || ''
                        }`}
                      >
                        {livingPermitted}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {visibleServices.map(service => (
                        <span
                          key={`${name}-${service}`}
                          className="bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5 rounded"
                        >
                          {service}
                        </span>
                      ))}
                      {remainingServices > 0 && (
                        <span className="bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5 rounded">
                          +{remainingServices} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 pr-4">{row.mooring_cost || '—'}</td>
                  <td className="py-2 pr-4">{row.electricity_price || '—'}</td>
                  <td className="py-2 pr-4">{row.car_parking ? '🅿️' : '—'}</td>
                  <td className="py-2 pr-4">{row.phone || '—'}</td>
                  <td className="py-2 pr-4">
                    {normalizeSandblasting(row.sandblasting) ? (
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          sandblastingColors[normalizeSandblasting(row.sandblasting)] ||
                          'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {normalizeSandblasting(row.sandblasting)}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-2 pr-4">
                    {row.status ? (
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          hauloutStatusColors[row.status] || 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {row.status}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td
                    className={`py-2 text-slate-500 text-xs ${
                      isExpanded ? 'whitespace-normal break-words' : 'max-w-xs'
                    }`}
                  >
                    {notes ? (
                      <>
                        <span className={isExpanded ? '' : 'truncate block'}>
                          {isExpanded ? notes : preview}
                        </span>
                        {canExpand && (
                          <button
                            type="button"
                            onClick={() => toggleNote(name)}
                            className="text-blue-400/80 hover:text-blue-300 mt-1"
                          >
                            {isExpanded ? 'show less' : 'show more'}
                          </button>
                        )}
                      </>
                    ) : (
                      '—'
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
