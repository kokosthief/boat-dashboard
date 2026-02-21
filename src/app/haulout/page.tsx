export default function HauloutPlan() {
  const costs = [
    { item: 'Haulout + lift', cost: '€1,000' },
    { item: 'NDT inspection', cost: '€0 (Henry DIY)' },
    { item: 'Sandblasting DIY (16.8m, ~180m²)', cost: '~€1,000' },
    { item: 'Welding — Mike (friend rate)', cost: '~€100' },
    { item: 'Exhaust welding (materials)', cost: '€100–200' },
    { item: 'Epoxy primer (pro, 2 coats)', cost: '€1,900' },
    { item: 'Antifouling (2 coats, Interspeed 340)', cost: '~€1,700' },
    { item: 'Zinc anodes (International Paint)', cost: '~€200' },
    { item: 'Topcoat (Henry DIY, IJssel Coatings)', cost: '~€500' },
    { item: 'Dry stalling 5 weeks', cost: '€1,750' },
  ];

  const yards = [
    {
      name: 'Zaanhaven/Westhaven',
      location: 'Zaandam',
      desc: 'Modern, close — confirm sandblasting capacity',
      badge: 'Recommended',
      badgeColor: 'bg-emerald-600',
    },
    {
      name: 'Marina Seaport IJmuiden',
      location: 'IJmuiden',
      desc: 'Large facility — confirm sandblasting availability',
      badge: 'To contact',
      badgeColor: 'bg-slate-700',
    },
    {
      name: 'OfferteHaven.nl',
      location: 'Multi-yard network',
      desc: 'Submit specs, get 3–5 competing quotes in 3–5 days',
      badge: 'Get quotes',
      badgeColor: 'bg-blue-700',
    },
  ];

  const timeline = [
    { label: 'Call yards by', value: 'Feb 27, 2026' },
    { label: 'Target haul-out', value: 'March/April 2026' },
    { label: 'Dry stalling duration', value: '~5 weeks' },
    { label: 'Back in water', value: 'May 2026' },
  ];

  const diyTasks = [
    {
      title: '🧹 Interior Hull Cleaning',
      description: 'Pump bilge → wire brush rust → Brunox Epoxy treatment (purple→black cure) → paint',
      effort: 'Medium',
      savings: '€800–1,200',
    },
    {
      title: '📏 Waterline Marking',
      description: 'Score real waterline with kraspen (etching pen) → paint 10cm above for clean reference line',
      effort: 'Easy',
      savings: '€200–300',
    },
    {
      title: '🎨 Topcoat Painting',
      description: 'Apply IJssel Coatings gloss (2–3 coats) — high quality Dutch brand. Contact Niels for cheaper supply.',
      effort: 'Medium',
      savings: '€600–900',
    },
  ];

  const notes = [
    'Boat corrected: 16.8m length × 3.25m width (was estimated 13m)',
    'Spring is peak season — yards book 6–8 weeks out. Call this week.',
    'NDT: Henry does it himself via rope access equipment — zero cost',
    'Sandblasting: DIY with rented equipment (~€1,000) for 16.8m boat',
    'Welding: Friend Mike labour ~€100 (cheap friend rate). Exhaust welding materials: ~€100–200',
    'Bottom coating: 2x primer + 2x Interspeed 340 antifouling + zinc anodes (International Paint)',
    'Top coating: 2–3 coats IJssel Coatings paint. Contact Niels for cheaper supply (note: larger boat may need more paint)',
    'Interior hull: Pump, wire brush, Brunox Epoxy rust treatment (purple→black = cured), then paint',
    'Waterline: Score real waterline with kraspen, paint 10cm above this line',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">🚢 Haulout Plan — Timo 16.8m × 3.25m (Spring 2026)</h1>
        <p className="text-slate-400">Scenario B: Outsource critical work, DIY interior/topcoat/waterline</p>
      </div>

      {/* Budget Summary Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-3">💰 Budget Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm opacity-90">Total budget (16.8m boat):</span>
            <span className="text-3xl font-bold">~€8,500–9,500</span>
          </div>
          <div className="text-sm opacity-80 space-y-1 mt-3 border-t border-emerald-500 pt-3">
            <p>✓ Correct boat size: 16.8m × 3.25m (previously estimated 13m)</p>
            <p>✓ NDT free (Henry DIY via rope access contacts)</p>
            <p>✓ Sandblasting DIY with rented equipment (~€1,000)</p>
            <p>✓ Friend Mike does welding (~€100 labour)</p>
            <p>✓ Henry DIYs: interior, topcoat, waterline marking</p>
            <p>✓ Environmental fees removed</p>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">💵 Cost Breakdown (Hybrid Scenario)</h2>
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
        <p className="text-xs text-slate-400 mt-4">Range: €8,500–9,500 for 16.8m boat with DIY sandblasting, friend welding, and Henry's topcoat application</p>
      </div>

      {/* DIY Work Plan Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">🛠️ DIY Work Plan — Henry's Tasks</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {diyTasks.map((task, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-600 transition-colors">
              <h3 className="font-semibold text-emerald-400 mb-2">{task.title}</h3>
              <p className="text-sm text-slate-300 mb-3">{task.description}</p>
              <div className="flex justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                <span>Effort: <span className="text-slate-200">{task.effort}</span></span>
                <span>Saves: <span className="text-emerald-400">{task.savings}</span></span>
              </div>
            </div>
          ))}
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
              <span className="text-yellow-500 font-bold">ℹ️</span>
              <span className="text-slate-300">{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Advantages Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">✨ Why Scenario B (Hybrid) is Optimal</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>✅ <strong>Protects structural integrity:</strong> Critical epoxy primer + antifouling by professionals</li>
          <li>✅ <strong>Saves €2,500+:</strong> Eliminates €1,750 NDT cost (free), reduces welding cost (Mike), DIYs cosmetics</li>
          <li>✅ <strong>Manageable risk:</strong> Interior cleaning & topcoat are cosmetic/non-critical; interior rust treatment is proven technique</li>
          <li>✅ <strong>Hands-on experience:</strong> Build confidence for next maintenance without betting the hull</li>
          <li>✅ <strong>Budget-friendly:</strong> €12,300–13,500 all-in, under €14k target</li>
          <li>⚠️ <strong>Timeline:</strong> 5–6 weeks. Book NOW (Feb 27) for March/April slot.</li>
        </ul>
      </div>
    </div>
  );
}
