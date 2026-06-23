'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { statusColumns, statusColors, type Task } from '@/data/tasks';

type Status = Task['status'];
type EditableTask = Task & { id: string; sortOrder?: number };
type DraftTask = Omit<Task, 'status'> & { status: Status; sortOrder?: number };

const emptyDraft: DraftTask = {
  name: '',
  location: '',
  vendor: '',
  status: 'Planning',
  targetDate: '',
  cost: '',
  notes: '',
  urgent: false,
};

function sortTasks(list: EditableTask[]) {
  return [...list].sort((a, b) => {
    if (a.urgent !== b.urgent) return a.urgent ? -1 : 1;
    if ((a.sortOrder ?? 0) !== (b.sortOrder ?? 0)) return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    if (a.targetDate && b.targetDate && a.targetDate !== b.targetDate) return a.targetDate.localeCompare(b.targetDate);
    if (a.targetDate && !b.targetDate) return -1;
    if (!a.targetDate && b.targetDate) return 1;
    return a.name.localeCompare(b.name);
  });
}

async function parseApiResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Kanban API request failed');
  return json as T;
}

export default function KanbanPage() {
  const [boardTasks, setBoardTasks] = useState<EditableTask[]>([]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftTask>(emptyDraft);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await parseApiResponse<{ tasks: EditableTask[] }>(await fetch('/api/kanban/tasks', { cache: 'no-store' }));
      setBoardTasks(json.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Kanban tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const counts = useMemo(() => {
    return statusColumns.reduce<Record<Status, number>>((acc, status) => {
      acc[status] = boardTasks.filter((task) => task.status === status).length;
      return acc;
    }, {} as Record<Status, number>);
  }, [boardTasks]);

  const toggle = (col: string) => {
    setCollapsed(prev => ({ ...prev, [col]: !prev[col] }));
  };

  function startEdit(task: EditableTask) {
    setIsAdding(false);
    setEditingId(task.id);
    setDraft({
      name: task.name,
      location: task.location,
      vendor: task.vendor,
      status: task.status,
      targetDate: task.targetDate,
      cost: task.cost,
      notes: task.notes,
      urgent: task.urgent || false,
      sortOrder: task.sortOrder,
    });
  }

  function startAdd(status: Status) {
    setEditingId(null);
    setDraft({ ...emptyDraft, status, sortOrder: boardTasks.length });
    setIsAdding(true);
  }

  function cancelEdit() {
    setEditingId(null);
    setIsAdding(false);
    setDraft(emptyDraft);
  }

  async function saveDraft() {
    const cleanName = draft.name.trim();
    if (!cleanName) return;

    setSaving(true);
    setError(null);
    try {
      if (isAdding) {
        const json = await parseApiResponse<{ task: EditableTask }>(await fetch('/api/kanban/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...draft, name: cleanName }),
        }));
        setBoardTasks(prev => [...prev, json.task]);
      } else if (editingId) {
        const json = await parseApiResponse<{ task: EditableTask }>(await fetch(`/api/kanban/tasks/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...draft, name: cleanName }),
        }));
        setBoardTasks(prev => prev.map(task => task.id === editingId ? json.task : task));
      }

      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    } finally {
      setSaving(false);
    }
  }

  async function updateTaskStatus(id: string, status: Status) {
    const current = boardTasks.find(task => task.id === id);
    if (!current || current.status === status) return;

    setBoardTasks(prev => prev.map(task => task.id === id ? { ...task, status } : task));
    setError(null);
    try {
      const json = await parseApiResponse<{ task: EditableTask }>(await fetch(`/api/kanban/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }));
      setBoardTasks(prev => prev.map(task => task.id === id ? json.task : task));
    } catch (err) {
      setBoardTasks(prev => prev.map(task => task.id === id ? current : task));
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  async function deleteTask(id: string) {
    if (!window.confirm('Delete this Kanban task?')) return;
    const previous = boardTasks;
    setBoardTasks(prev => prev.filter(task => task.id !== id));
    setError(null);
    try {
      await parseApiResponse<{ success: true }>(await fetch(`/api/kanban/tasks/${id}`, { method: 'DELETE' }));
      if (editingId === id) cancelEdit();
    } catch (err) {
      setBoardTasks(previous);
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">📋 Kanban Board</h1>
          <p className="mt-1 text-sm text-slate-400">
            Supabase-backed: add/edit/delete tasks, move status, mark urgent, and changes sync across devices.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadTasks()}
          disabled={loading}
          className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? 'Loading…' : 'Reload from Supabase'}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {(isAdding || editingId) && (
        <div className="rounded-xl border border-blue-500/30 bg-slate-900 p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-semibold">{isAdding ? 'Add task' : 'Edit task'}</h2>
            <button type="button" onClick={cancelEdit} disabled={saving} className="text-sm text-slate-400 hover:text-white disabled:opacity-50">Cancel</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-1 text-xs text-slate-400 xl:col-span-2">
              <span>Name</span>
              <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
            </label>
            <label className="space-y-1 text-xs text-slate-400">
              <span>Status</span>
              <select value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value as Status })} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white">
                {statusColumns.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-xs text-slate-400">
              <span>Target date</span>
              <input type="date" value={draft.targetDate} onChange={e => setDraft({ ...draft, targetDate: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
            </label>
            <label className="space-y-1 text-xs text-slate-400">
              <span>Location</span>
              <input value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
            </label>
            <label className="space-y-1 text-xs text-slate-400">
              <span>Vendor</span>
              <input value={draft.vendor} onChange={e => setDraft({ ...draft, vendor: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
            </label>
            <label className="space-y-1 text-xs text-slate-400">
              <span>Cost</span>
              <input value={draft.cost} onChange={e => setDraft({ ...draft, cost: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
            </label>
            <label className="flex items-end gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300">
              <input type="checkbox" checked={draft.urgent || false} onChange={e => setDraft({ ...draft, urgent: e.target.checked })} />
              Urgent
            </label>
            <label className="space-y-1 text-xs text-slate-400 md:col-span-2 xl:col-span-4">
              <span>Notes</span>
              <textarea value={draft.notes} onChange={e => setDraft({ ...draft, notes: e.target.value })} rows={3} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
            </label>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={cancelEdit} disabled={saving} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-50">Cancel</button>
            <button type="button" onClick={() => void saveDraft()} disabled={!draft.name.trim() || saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40">{saving ? 'Saving…' : 'Save task'}</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">Loading Kanban tasks from Supabase…</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {statusColumns.map(col => {
            const colTasks = sortTasks(boardTasks.filter(t => t.status === col));
            const colors = statusColors[col];
            const isCollapsed = collapsed[col] || false;
            return (
              <div key={col} className="space-y-3">
                <button
                  onClick={() => toggle(col)}
                  className={`w-full rounded-lg px-3 py-2 border text-sm font-semibold ${colors} flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity`}
                >
                  <span>{col} <span className="opacity-60">({counts[col] || 0})</span></span>
                  <span className="text-xs opacity-60">{isCollapsed ? '▶' : '▼'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => startAdd(col)}
                  className="w-full rounded-lg border border-dashed border-slate-700 px-3 py-2 text-xs font-medium text-slate-400 hover:border-blue-500 hover:text-blue-300"
                >
                  + Add task
                </button>
                {!isCollapsed && colTasks.map(t => (
                  <div key={t.id} className={`rounded-lg border p-3 text-sm space-y-2 ${colors} ${t.urgent ? 'ring-2 ring-red-500/60' : ''}`}>
                    <p className="font-medium">
                      {t.urgent && <span className="inline-block bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded mr-1.5 font-bold">URGENT</span>}
                      {t.name}
                    </p>
                    {t.vendor && <p className="text-xs opacity-70">👤 {t.vendor}</p>}
                    {t.cost && <p className="text-xs opacity-70">💰 {t.cost}</p>}
                    {t.targetDate && <p className="text-xs opacity-70">📅 {t.targetDate}</p>}
                    {t.location && <p className="text-xs opacity-60">📍 {t.location}</p>}
                    {t.notes && <p className="text-xs opacity-70 line-clamp-3">📝 {t.notes}</p>}
                    <div className="space-y-2 pt-2">
                      <select
                        value={t.status}
                        onChange={e => void updateTaskStatus(t.id, e.target.value as Status)}
                        className="w-full rounded-md border border-slate-700/60 bg-slate-950/70 px-2 py-1.5 text-xs text-white"
                      >
                        {statusColumns.map(status => <option key={status} value={status}>{status}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => startEdit(t)} className="flex-1 rounded-md bg-slate-950/50 px-2 py-1.5 text-xs font-medium hover:bg-slate-950/80">Edit</button>
                        <button type="button" onClick={() => void deleteTask(t.id)} className="rounded-md bg-red-950/40 px-2 py-1.5 text-xs font-medium text-red-200 hover:bg-red-900/60">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
