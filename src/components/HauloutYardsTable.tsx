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

const sandblastingColors: Record<string, string> = {
  'Yes': 'bg-green-600 text-white',
  'No': 'bg-red-600 text-white',
  'Unknown': 'bg-yellow-600 text-white',
  'Confirm needed': 'bg-yellow-600 text-white',
};

const statusColors: Record<string, string> = {
  'Recommended': 'bg-emerald-600 text-white',
  'To contact': 'bg-blue-600 text-white',
  'Contacted': 'bg-slate-600 text-white',
  'Quoted': 'bg-purple-600 text-white',
  'Booked': 'bg-green-600 text-white',
  'Excluded': 'bg-red-600 text-white',
  'Backup only': 'bg-red-600 text-white',
};

export default function HauloutYardsTable() {
  const [yards, setYards] = useState<Yard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [editingNotesText, setEditingNotesText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newYardForm, setNewYardForm] = useState({
    name: '',
    location: '',
    website: '',
    phone: '',
    sandblasting: 'Unknown',
    status: 'To contact',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch yards on mount
  useEffect(() => {
    fetchYards();
  }, []);

  const fetchYards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/yards');
      if (!response.ok) {
        throw new Error('Failed to fetch yards');
      }
      const data = await response.json();
      setYards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching yards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditNotes = (yard: Yard) => {
    setEditingNotes(yard.id);
    setEditingNotesText(yard.notes || '');
  };

  const handleSaveNotes = async (yardId: number) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/yards/${yardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: editingNotesText }),
      });

      if (!response.ok) {
        throw new Error('Failed to update notes');
      }

      const updatedYard = await response.json();
      setYards(yards.map(y => y.id === yardId ? updatedYard : y));
      setEditingNotes(null);
      setEditingNotesText('');
    } catch (err) {
      console.error('Error saving notes:', err);
      alert('Failed to save notes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddYard = async () => {
    try {
      if (!newYardForm.name.trim()) {
        alert('Yard name is required');
        return;
      }

      setIsSubmitting(true);
      const response = await fetch('/api/yards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newYardForm),
      });

      if (!response.ok) {
        throw new Error('Failed to add yard');
      }

      const createdYard = await response.json();
      setYards([...yards, createdYard]);
      setShowAddForm(false);
      setNewYardForm({
        name: '',
        location: '',
        website: '',
        phone: '',
        sandblasting: 'Unknown',
        status: 'To contact',
        notes: '',
      });
    } catch (err) {
      console.error('Error adding yard:', err);
      alert('Failed to add yard');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-slate-400">Loading yards...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Yard Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          + Add Yard
        </button>
      </div>

      {/* Add Yard Form */}
      {showAddForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-3">Add New Yard</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Name *"
              value={newYardForm.name}
              onChange={(e) => setNewYardForm({ ...newYardForm, name: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              placeholder="Location"
              value={newYardForm.location}
              onChange={(e) => setNewYardForm({ ...newYardForm, location: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              placeholder="Website"
              value={newYardForm.website}
              onChange={(e) => setNewYardForm({ ...newYardForm, website: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={newYardForm.phone}
              onChange={(e) => setNewYardForm({ ...newYardForm, phone: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <select
              value={newYardForm.sandblasting}
              onChange={(e) => setNewYardForm({ ...newYardForm, sandblasting: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option>Unknown</option>
              <option>Yes</option>
              <option>No</option>
              <option>Confirm needed</option>
            </select>
            <select
              value={newYardForm.status}
              onChange={(e) => setNewYardForm({ ...newYardForm, status: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option>To contact</option>
              <option>Recommended</option>
              <option>Contacted</option>
              <option>Quoted</option>
              <option>Booked</option>
              <option>Excluded</option>
              <option>Backup only</option>
            </select>
          </div>
          <textarea
            placeholder="Notes"
            value={newYardForm.notes}
            onChange={(e) => setNewYardForm({ ...newYardForm, notes: e.target.value })}
            rows={2}
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddYard}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white px-4 py-2 rounded font-semibold transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Yard'}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Yards Table */}
      <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Location</th>
              <th className="px-4 py-3 text-left font-semibold">Website</th>
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-left font-semibold">Sandblasting</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {yards.map((yard) => (
              <tr key={yard.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3 font-semibold text-white">{yard.name}</td>
                <td className="px-4 py-3 text-slate-300">{yard.location || '-'}</td>
                <td className="px-4 py-3 text-slate-300">
                  {yard.website ? (
                    <a
                      href={`https://${yard.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      {yard.website}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-3 text-slate-300">{yard.phone || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${sandblastingColors[yard.sandblasting] || 'bg-slate-700'}`}>
                    {yard.sandblasting}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[yard.status] || 'bg-slate-700'}`}>
                    {yard.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {editingNotes === yard.id ? (
                    <div className="flex gap-2">
                      <textarea
                        value={editingNotesText}
                        onChange={(e) => setEditingNotesText(e.target.value)}
                        rows={2}
                        className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={() => handleSaveNotes(yard.id)}
                        disabled={isSubmitting}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors"
                      >
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleEditNotes(yard)}
                      className="cursor-pointer hover:text-white transition-colors max-w-xs line-clamp-2"
                      title={yard.notes || 'Click to edit'}
                    >
                      {yard.notes ? (
                        <span className="text-slate-400">{yard.notes}</span>
                      ) : (
                        <span className="text-slate-500 italic">Click to add notes...</span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {yards.length === 0 && !loading && (
        <div className="text-center py-8 text-slate-400">
          No yards found. Add one to get started!
        </div>
      )}
    </div>
  );
}
