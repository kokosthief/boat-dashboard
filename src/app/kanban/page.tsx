import { tasks, statusColumns, statusColors } from '@/data/tasks';

export default function KanbanPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">📋 Kanban Board</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statusColumns.map(col => {
          const colTasks = tasks.filter(t => t.status === col);
          const colors = statusColors[col];
          return (
            <div key={col} className="space-y-3">
              <div className={`rounded-lg px-3 py-2 border text-sm font-semibold ${colors}`}>
                {col} <span className="opacity-60">({colTasks.length})</span>
              </div>
              {colTasks.map(t => (
                <div key={t.name} className={`rounded-lg border p-3 text-sm space-y-1 ${colors}`}>
                  <p className="font-medium">{t.name}</p>
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
