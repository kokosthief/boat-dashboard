'use client';

import { useEffect, useMemo, useState } from 'react';
import { harbours } from '@/data/harbours';

interface Yard {
  id?: number;
  name: string;
  location: string | null;
  website: string | null;
  phone: string | null;
  sandblasting: string;
  status: string;
  notes: string | null;
}

interface UnifiedRow {
  name: string;
  area: string;
  website: string;
  livingPermitted: string;
  services: string[];
  mooringCost: string;
  electricityPrice: string;
  carParking: boolean;
  phone: string;
  sandblasting: string;
  hauloutStatus: string;
  notes: string;
  source: 'harbour' | 'yard' | 'both';
}

const livingPermittedMap: Record<string, string> = {
  Agreed: 'Yes',
  Considering: 'Maybe',
  Maybe: 'Maybe',
  'Second Choice': 'Maybe',
  Call: 'N/A',
  Dropped: 'No',
  Unknown: 'N/A',
  '': '',
};

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

const COMMON_WORDS = new Set([
  'jachthaven',
  'haven',
  'werf',
  'de',
  'het',
  'van',
  'den',
  'der',
  'the',
  'and',
]);

const FILTERS = ['All', 'Yes', 'Maybe', 'N/A', 'No'];

function normalizeSandblasting(value: string | null | undefined): string {
  if (!value) return '';
  if (value === 'Confirm needed') return 'Unsure';
  return value;
}

function normalizeUrl(url: string | null | undefined): string {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function getSignificantWords(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(word => word.length > 5 && !COMMON_WORDS.has(word));
}

function namesMatch(harbourName: string, yardName: string): boolean {
  const harbour = harbourName.toLowerCase();
  const yard = yardName.toLowerCase();

  if (harbour.includes(yard) || yard.includes(harbour)) return true;

  const harbourWords = new Set(getSignificantWords(harbour));
  const yardWords = getSignificantWords(yard);
  return yardWords.some(word => harbourWords.has(word));
}

export default function HarboursPage() {
  const [filter, setFilter] = useState('All');
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

  const rows = useMemo<UnifiedRow[]>(() => {
    const matchedYardIndexes = new Set<number>();

    const mergedFromHarbours: UnifiedRow[] = harbours.map(harbour => {
      const yardIndex = yards.findIndex((yard, index) => {
        if (matchedYardIndexes.has(index)) return false;
        return namesMatch(harbour.name, yard.name);
      });

      const matchedYard = yardIndex >= 0 ? yards[yardIndex] : null;
      if (yardIndex >= 0) matchedYardIndexes.add(yardIndex);

      return {
        name: harbour.name || matchedYard?.name || '',
        area: harbour.area || matchedYard?.location || '',
        website: harbour.website || matchedYard?.website || '',
        livingPermitted: livingPermittedMap[harbour.status] ?? 'N/A',
        services: harbour.services || [],
        mooringCost: harbour.winterMooringPrice || '',
        electricityPrice: harbour.electricityPrice || '',
        carParking: Boolean(harbour.carParking),
        phone: matchedYard?.phone || '',
        sandblasting: normalizeSandblasting(matchedYard?.sandblasting),
        hauloutStatus: matchedYard?.status || '',
        notes: harbour.notes || matchedYard?.notes || '',
        source: matchedYard ? 'both' : 'harbour',
      };
    });

    const yardOnlyRows: UnifiedRow[] = yards
      .map((yard, index) => ({ yard, index }))
      .filter(({ index }) => !matchedYardIndexes.has(index))
      .map(({ yard }) => ({
        name: yard.name || '',
        area: yard.location || '',
        website: yard.website || '',
        livingPermitted: '',
        services: [],
        mooringCost: '',
        electricityPrice: '',
        carParking: false,
        phone: yard.phone || '',
        sandblasting: normalizeSandblasting(yard.sandblasting),
        hauloutStatus: yard.status || '',
        notes: yard.notes || '',
        source: 'yard' as const,
      }));

    return [...mergedFromHarbours, ...yardOnlyRows];
  }, [yards]);

  const filteredRows = useMemo(() => {
    if (filter === 'All') return rows;
    return rows.filter(row => row.livingPermitted === filter);
  }, [filter, rows]);

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
        {FILTERS.map(option => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === option
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

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
            {filteredRows.map((row, index) => {
              const isExpanded = expandedNotes.has(row.name);
              const canExpand = row.notes.length > 80;
              const preview = canExpand ? `${row.notes.slice(0, 80)}...` : row.notes;
              const visibleServices = row.services.slice(0, 3);
              const remainingServices = row.services.length - visibleServices.length;

              return (
                <tr key={`${row.name}-${row.source}-${index}`} className="border-b border-slate-800/50">
                  <td className="py-2 pr-4 font-medium">
                    {row.website ? (
                      <a
                        href={normalizeUrl(row.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {row.name}
                      </a>
                    ) : (
                      row.name
                    )}
                  </td>
                  <td className="py-2 pr-4 text-slate-400">{row.area || '—'}</td>
                  <td className="py-2 pr-4">
                    {row.livingPermitted ? (
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          livingPermittedColors[row.livingPermitted] || ''
                        }`}
                      >
                        {row.livingPermitted}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {visibleServices.map(service => (
                        <span
                          key={`${row.name}-${service}`}
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
                  <td className="py-2 pr-4">{row.mooringCost || '—'}</td>
                  <td className="py-2 pr-4">{row.electricityPrice || '—'}</td>
                  <td className="py-2 pr-4">{row.carParking ? '🅿️' : '—'}</td>
                  <td className="py-2 pr-4">{row.phone || '—'}</td>
                  <td className="py-2 pr-4">
                    {row.sandblasting ? (
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          sandblastingColors[row.sandblasting] || 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {row.sandblasting}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-2 pr-4">
                    {row.hauloutStatus ? (
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          hauloutStatusColors[row.hauloutStatus] || 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {row.hauloutStatus}
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
                    {row.notes ? (
                      <>
                        <span className={isExpanded ? '' : 'truncate block'}>
                          {isExpanded ? row.notes : preview}
                        </span>
                        {canExpand && (
                          <button
                            type="button"
                            onClick={() => toggleNote(row.name)}
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
