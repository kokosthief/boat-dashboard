import { vendors } from '@/data/vendors';

export default function VendorsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">🔧 Vendors</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map(v => (
          <div key={v.name} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <p className="font-semibold">{v.name}</p>
            {v.tasks && <p className="text-sm text-slate-400">🔨 {v.tasks}</p>}
            {v.phone && <p className="text-sm"><a href={`tel:${v.phone}`} className="text-blue-400">📞 {v.phone}</a></p>}
            {v.email && <p className="text-sm"><a href={`mailto:${v.email}`} className="text-blue-400">✉️ {v.email}</a></p>}
            {v.notes && <p className="text-xs text-slate-500">{v.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
