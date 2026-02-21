'use client';

import React, { useState, useEffect } from 'react';

interface Yard {
  id: number;
  name: string;
  location: string | null;
  website: string | null;
  phone: string | null;
  sandblasting: string;
  status: string;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
}

type YardForm = Omit<Yard, 'id' | 'created_at' | 'updated_at'>;

const SANDBLASTING_OPTIONS = ['Yes', 'No', 'Confirm needed', 'Unknown'];
const STATUS_OPTIONS = ['Recommended', 'To contact', 'Contacted', 'Quoted', 'Booked', 'Backup only', 'Excluded'];

const sandblastingColors: Record<string, string> = {
  'Yes': 'bg-green-600 text-white',
  'No': 'bg-red-600 text-white',
  'Unknown': 'bg-yellow-700 text-white',
  'Confirm needed': 'bg-yellow-700 text-white',
};

const statusColors: Record<string, string> = {
  'Recommended': 'bg-emerald-600 text-white',
  'To contact': 'bg-blue-600 text-white',
  'Contacted': 'bg-slate-500 text-white',
  'Quoted': 'bg-purple-600 text-white',
  'Booked': 'bg-green-600 text-white',
  'Excluded': 'bg-red-700 text-white',
  'Backup only': 'bg-orange-700 text-white',
};

const emptyForm: YardForm = {
  name: '',
  location: '',
  website: '',
  phone: '',
  sandblasting: 'Confirm needed',
  status: 'To contact',
  notes: '',
};

function inputClass(extra = '') {
  return `bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-emerald-500 w-full ${extra}`;
}

export default function HauloutYardsTable() {
  const [yards, setYards] = useState<Yard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Row editing
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<YardForm>(emptyForm);

  // Add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newYardForm, setNewYardForm] = useState<YardForm>(emptyForm);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchYards();
  }, []);

  const fetchYards = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/yards');
      if (!res.ok) throw new Error('Failed to fetch yards');
      setYards(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (yard: Yard) => {
    setEditingId(yard.id);
    setEditForm({
      name: yard.name,
      location: yard.location || '',
      website: yard.website || '',
      phone: yard.phone || '',
      sandblasting: yard.sandblasting,
      status: yard.status,
      notes: yard.notes || '',
    });
    setDeleteConfirm(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleSaveRow = async (yardId: number) => {
    if (!editForm.name.trim()) { alert('Name is required'); return; }
    try {
      setIsSubmitting(true);
      const payload = {
        ...editForm,
        location: editForm.location || null,
        website: editForm.website || null,
        phone: editForm.phone || null,
        notes: editForm.notes || null,
      };
      const res = await fetch(`/api/yards/${yardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update yard');
      const updated = await res.json();
      setYards(yards.map(y => y.id === yardId ? updated : y));
      cancelEditing();
    } catch (err) {
      console.error(err);
      alert('Failed to save changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteYard = async (yardId: number) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/yards/${yardId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete yard');
      setYards(yards.filter(y => y.id !== yardId));
      setDeleteConfirm(null);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete yard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddYard = async () => {
    if (!newYardForm.name.trim()) { alert('Name is required'); return; }
    try {
      setIsSubmitting(true);
      const payload = {
        ...newYardForm,
        location: newYardForm.location || null,
        website: newYardForm.website || null,
        phone: newYardForm.phone || null,
        notes: newYardForm.notes || null,
      };
      const res = await fetch('/api/yards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to add yard');
      const created = await res.json();
      setYards([...yards, created]);
      setShowAddForm(false);
      setNewYardForm(emptyForm);
    } catch (err) {
      console.error(err);
      alert('Failed to add yard');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-slate-400 py-4">Loading yards...</div>;
  if (error) return (
    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
      Error: {error}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex justify-end">
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
        >
          + Add Yard
        </button>
      </div>

      {/* Add Yard Form */}
      {showAddForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h3 className="font-semibold text-sm mb-3 text-white">Add New Yard</h3>
          <YardFormFields form={newYardForm} onChange={setNewYardForm} />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddYard}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Yard'}
            </button>
            <button
              onClick={() => { setShowAddForm(false); setNewYardForm(emptyForm); }}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-3 py-3 text-left font-semibold text-slate-300 text-xs uppercase tracking-wide">Name</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-300 text-xs uppercase tracking-wide">Location</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-300 text-xs uppercase tracking-wide">Website</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-300 text-xs uppercase tracking-wide">Phone</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-300 text-xs uppercase tracking-wide">Sandblasting</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-300 text-xs uppercase tracking-wide">Status</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-300 text-xs uppercase tracking-wide">Notes</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-300 text-xs uppercase tracking-wide w-20"></th>
            </tr>
          </thead>
          <tbody>
            {yards.map((yard) => {
              const isEditing = editingId === yard.id;
              return (
                <tr
                  key={yard.id}
                  className={`border-b border-slate-800 transition-colors ${isEditing ? 'bg-slate-800/80' : 'hover:bg-slate-800/40'}`}
                >
                  {/* Name */}
                  <td className="px-3 py-2 font-semibold text-white min-w-[140px]">
                    {isEditing
                      ? <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className={inputClass('font-semibold')} />
                      : yard.name
                    }
                  </td>

                  {/* Location */}
                  <td className="px-3 py-2 text-slate-300 min-w-[160px]">
                    {isEditing
                      ? <input value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} className={inputClass()} placeholder="Location" />
                      : <span className="text-slate-400 text-xs">{yard.location || '—'}</span>
                    }
                  </td>

                  {/* Website */}
                  <td className="px-3 py-2 min-w-[140px]">
                    {isEditing
                      ? <input value={editForm.website} onChange={e => setEditForm({ ...editForm, website: e.target.value })} className={inputClass()} placeholder="website.nl" />
                      : yard.website
                        ? <a href={`https://${yard.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline text-xs">{yard.website}</a>
                        : <span className="text-slate-600">—</span>
                    }
                  </td>

                  {/* Phone */}
                  <td className="px-3 py-2 text-slate-300 min-w-[120px]">
                    {isEditing
                      ? <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className={inputClass()} placeholder="Phone" />
                      : <span className="text-xs">{yard.phone || <span className="text-slate-600">—</span>}</span>
                    }
                  </td>

                  {/* Sandblasting */}
                  <td className="px-3 py-2 min-w-[130px]">
                    {isEditing
                      ? (
                        <select value={editForm.sandblasting} onChange={e => setEditForm({ ...editForm, sandblasting: e.target.value })} className={inputClass()}>
                          {SANDBLASTING_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                      )
                      : (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${sandblastingColors[yard.sandblasting] || 'bg-slate-700 text-slate-300'}`}>
                          {yard.sandblasting}
                        </span>
                      )
                    }
                  </td>

                  {/* Status */}
                  <td className="px-3 py-2 min-w-[120px]">
                    {isEditing
                      ? (
                        <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className={inputClass()}>
                          {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                      )
                      : (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[yard.status] || 'bg-slate-700 text-slate-300'}`}>
                          {yard.status}
                        </span>
                      )
                    }
                  </td>

                  {/* Notes */}
                  <td className="px-3 py-2 text-slate-400 min-w-[200px] max-w-[280px]">
                    {isEditing
                      ? <textarea value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} rows={3} className={inputClass('resize-y')} placeholder="Notes..." />
                      : <span className="text-xs line-clamp-3">{yard.notes || <span className="text-slate-600 italic">—</span>}</span>
                    }
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2">
                    {isEditing ? (
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleSaveRow(yard.id)}
                          disabled={isSubmitting}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white px-2 py-1 rounded text-xs font-semibold transition-colors w-full"
                        >
                          {isSubmitting ? '...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded text-xs transition-colors w-full"
                        >
                          Cancel
                        </button>
                        {deleteConfirm === yard.id ? (
                          <button
                            onClick={() => handleDeleteYard(yard.id)}
                            disabled={isSubmitting}
                            className="bg-red-700 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold transition-colors w-full"
                          >
                            Confirm del
                          </button>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(yard.id)}
                            className="bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-400 px-2 py-1 rounded text-xs transition-colors w-full border border-slate-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(yard)}
                        className="text-slate-500 hover:text-white px-2 py-1 rounded text-xs transition-colors border border-slate-700 hover:border-slate-500 w-full"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {yards.length === 0 && (
        <div className="text-center py-8 text-slate-500">No yards yet. Add one above.</div>
      )}
    </div>
  );
}

// Reusable form fields for the Add form
function YardFormFields({ form, onChange }: { form: YardForm; onChange: (f: YardForm) => void }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Name *"
          value={form.name}
          onChange={e => onChange({ ...form, name: e.target.value })}
          className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={e => onChange({ ...form, location: e.target.value })}
          className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <input
          type="text"
          placeholder="Website (e.g. borsch.nl)"
          value={form.website}
          onChange={e => onChange({ ...form, website: e.target.value })}
          className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={e => onChange({ ...form, phone: e.target.value })}
          className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <select
          value={form.sandblasting}
          onChange={e => onChange({ ...form, sandblasting: e.target.value })}
          className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
        >
          {SANDBLASTING_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
        <select
          value={form.status}
          onChange={e => onChange({ ...form, status: e.target.value })}
          className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
        >
          {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <textarea
        placeholder="Notes"
        value={form.notes}
        onChange={e => onChange({ ...form, notes: e.target.value })}
        rows={2}
        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-y"
      />
    </div>
  );
}
