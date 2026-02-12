'use client';

import { useState } from 'react';
import { tasks, statusColumns, statusColors } from '@/data/tasks';

export default function KanbanPage() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (col: string) => {
    setCollapsed(prev => ({ ...prev, [col]: !prev[col] }));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">📋 Kanban Board</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statusColumns.map(col => {
          const colTasks = tasks.filter(t => t.status === col);
          const colors = statusColors[col];
          const isCollapsed = collapsed[col] || false;
          return (
            <div key={col} className="space-y-3">
              <button
                onClick={() => toggle(col)}
                className={`w-full rounded-lg px-3 py-2 border text-sm font-semibold ${colors} flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity`}
              >
                <span>{col} <span className="opacity-60">({colTasks.length})</span></span>
                <span className="text-xs opacity-60">{isCollapsed ? '▶' : '▼'}</span>
              </button>
              {!isCollapsed && colTasks.map(t => (
                <div key={t.name} className={`rounded-lg border p-3 text-sm space-y-1 ${colors} ${t.urgent ? 'ring-2 ring-red-500/60' : ''}`}>
                  <p className="font-medium">
                    {t.urgent && <span className="inline-block bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded mr-1.5 font-bold">URGENT</span>}
                    {t.name}
                  </p>
                  {t.vendor && <p className="text-xs opacity-70">👤 {t.vendor}</p>}
                  {t.cost && <p className="text-xs opacity-70">💰 {t.cost}</p>}
                  {t.targetDate && <p className="text-xs opacity-70">📅 {t.targetDate}</p>}
                  {t.location && <p className="text-xs opacity-60">📍 {t.location}</p>}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
