'use client';
import { vendors } from '@/data/vendors';
import { useState, useEffect } from 'react';

export default function VendorsPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Define recency order for mobile
  const recencyOrder = ['Mees van de Nes', 'Simone'];
  
  const sortedVendors = isMobile ? [...vendors].sort((a, b) => {
    const aIndex = recencyOrder.indexOf(a.name);
    const bIndex = recencyOrder.indexOf(b.name);
    
    // If both are in recency list, sort by their position
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    // If only a is in recency list, it comes first
    if (aIndex !== -1) return -1;
    // If only b is in recency list, it comes first
    if (bIndex !== -1) return 1;
    // Otherwise keep original order
    return 0;
  }) : vendors;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">🔧 Vendors</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedVendors.map(v => (
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
