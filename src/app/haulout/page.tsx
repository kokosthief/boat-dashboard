export default function HauloutPlan() {
  const costs = [
    { item: 'Haulout + lift', cost: '€595' },
    { item: 'NDT ultrasonic survey', cost: '€1,750' },
    { item: 'Sandblasting (~140m²)', cost: '€3,780' },
    { item: 'Welding contingency', cost: '€2,400' },
    { item: 'Epoxy primer (pro, 2 coats)', cost: '€1,900' },
    { item: 'Antifouling (pro)', cost: '€1,700' },
    { item: 'Topcoat paint (Henry DIY)', cost: '€400' },
    { item: 'Dry stalling 5 weeks', cost: '€1,750' },
    { item: 'Environmental fees', cost: '€525' },
  ];

  const yards = [
    {
      name: 'Werf Rhebergen',
      location: 'Raamsdonksveer, ~40km',
      desc: 'Steel specialist, on-site blasting ⭐',
      badge: 'Recommended',
      badgeColor: 'bg-emerald-600',
    },
    {
      name: 'Zaanhaven/Westhaven',
      location: 'Zaandam',
      desc: 'Modern, close',
      badge: 'To contact',
      badgeColor: 'bg-slate-700',
    },
    {
      name: 'Marina Seaport IJmuiden',
      location: 'IJmuiden',
      desc: 'Large facility',
      badge: 'To contact',
      badgeColor: 'bg-slate-700',
    },
  ];

  const timeline = [
    { label: 'Call yards by', value: 'Feb 27, 2026' },
    { label: 'Target haul-out', value: 'March/April 2026' },
    { label: 'Dry stalling duration', value: '~5 weeks' },
    { label: 'Back in water', value: 'May 2026' },
  ];

  const notes = [
    'Spring is peak season — yards book 6–8 weeks out. Call this week.',
    'NDT first — don\'t commit to welding budget until inspection results',
    'Sandblasting requires licensed facility with grit containment — cannot DIY at current mooring',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">🚢 Haulout Plan — Timo (Spring 2026)</h1>
        <p className="text-slate-400">Scenario B: Outsource critical work, DIY topcoat</p>
      </div>

      {/* Budget Summary Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-3">💰 Budget Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm opacity-90">Total budget:</span>
            <span className="text-3xl font-bold">~€14,800–15,800</span>
          </div>
          <div className="text-sm opacity-80 space-y-1 mt-3 border-t border-emerald-500 pt-3">
            <p>✓ Outsource critical work (blasting, welding, pro finishes)</p>
            <p>✓ DIY topcoat paint (save €1,300–2,000)</p>
            <p>✓ 5 weeks dry stalling</p>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">💵 Cost Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {costs.map((row, i) => (
                <tr key={i} className={`border-b border-slate-800 ${i === costs.length - 1 ? 'font-bold text-base' : ''}`}>
                  <td className="py-3 px-4">{row.item}</td>
                  <td className={`py-3 px-4 text-right ${i === costs.length - 1 ? 'text-emerald-400' : ''}`}>{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yards Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">🏗️ Yards to Contact</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {yards.map(y => (
            <div key={y.name} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{y.name}</h3>
                <span className={`${y.badgeColor} text-white text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2`}>
                  {y.badge}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-2">{y.location}</p>
              <p className="text-sm text-slate-300">{y.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">📅 Timeline</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {timeline.map((t, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
              <span className="text-slate-400 text-sm">{t.label}</span>
              <span className="font-semibold">{t.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">📝 Important Notes</h2>
        <ul className="space-y-3">
          {notes.map((note, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-yellow-500 font-bold">⚠️</span>
              <span className="text-slate-300">{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
