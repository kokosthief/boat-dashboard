import HauloutYardsTable from '@/components/HauloutYardsTable';

export default function HauloutPlan() {
  const costs = [
    { item: 'Lift & haul-out', cost: 'Quote TBD' },
    { item: 'High-pressure wash (exterior)', cost: 'incl.' },
    { item: 'Sandblasting — full boat', cost: 'Quote TBD' },
    { item: 'NDT inspection', cost: '~€100–200', saving: true, savingNote: 'DIY — Henry rents equipment' },
    { item: 'Hull welding repairs (if needed)', cost: 'Quote TBD', saving: true, savingNote: 'Potentially Mike — friend rate ~€100' },
    { item: 'New exhaust — weld', cost: 'Quote TBD' },
    { item: '2× International primer — underwater hull', cost: 'Quote TBD' },
    { item: '2× Antifouling coats — underwater hull (Interspeed 340)', cost: '~€2,000–3,000' },
    { item: 'Zinc anodes', cost: '~€200' },
    { item: '2–3 coats paint — above waterline', cost: 'Quote TBD' },
    { item: 'Dry stalling (5 weeks)', cost: '~€1,500–2,000' },
  ];

  const timeline = [
    { label: 'Target haul-out', value: 'Week 3–4 of March 2026' },
    { label: 'Dry stalling duration', value: '~5 weeks' },
    { label: 'Target back in water', value: 'End of April / Early May 2026' },
  ];

  const henryTasks = [
    {
      title: '🧹 Interior Hull Cleaning',
      description: 'Pump bilge → wire brush rust → Brunox Epoxy treatment (purple→black cure) → paint',
      effort: 'Medium',
      when: 'Whilst out of water',
    },
    {
      title: '📏 Waterline Marking',
      description: 'Score real waterline with kraspen (etching pen) → paint 10cm above for clean reference line',
      effort: 'Easy',
      when: 'When first taken out',
    },
  ];

  const notes = [
    'Timo: 16.8m × 3.25m steel bakdekker, 1928',
    'Spring is peak season — yards book 6–8 weeks out. Contact yards ASAP.',
    'NDT: Henry rents equipment and does inspection himself (~€100–200). Potential saving vs. outsourcing.',
    'Welding: Mike (friend) may do hull repairs at a cheaper rate (~€100 labour). New exhaust welding — ask for quote.',
    'Bottom coating: 2x International primer + 2x Interspeed 340 antifouling + zinc anodes — all outsourced.',
    'Top coating: 2–3 coats IJssel Coatings paint — outsourced. Contact Niels for cheaper paint supply.',
    'Interior hull: Pump, wire brush, Brunox Epoxy rust treatment (purple→black = cured), then paint. Henry does this.',
    'Waterline: Score real waterline with kraspen, paint 10cm above this line. Henry does this on day 1.',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">🚢 Haulout Plan — Timo 16.8m × 3.25m (Spring 2026)</h1>
      </div>

      {/* Budget Summary Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-3">💰 Budget Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm opacity-90">Estimated total (awaiting quotes):</span>
            <span className="text-3xl font-bold">TBD</span>
          </div>
          <div className="text-sm opacity-80 space-y-1 mt-3 border-t border-emerald-500 pt-3">
            <p>✓ Fully outsourced — yard does all the work</p>
            <p>💸 Potential saving: NDT done by Henry (~€100–200, rented equipment)</p>
            <p>💸 Potential saving: welding via Mike (friend rate ~€100)</p>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">💵 Cost Breakdown</h2>
        <ol className="space-y-2 text-sm">
          {costs.map((row, i) => (
            <li key={i} className={`flex justify-between items-start gap-4 py-2.5 px-3 rounded-lg ${row.saving ? 'bg-emerald-900/20 border border-emerald-800/40' : 'border-b border-slate-800'}`}>
              <div className="flex-1">
                <span className="text-slate-400 mr-2">{i + 1}.</span>
                <span className={row.saving ? 'text-emerald-300' : 'text-slate-200'}>{row.item}</span>
                {row.savingNote && <p className="text-xs text-emerald-500 mt-0.5 ml-5">{row.savingNote}</p>}
              </div>
              <span className={`shrink-0 font-semibold ${row.cost === 'Quote TBD' ? 'text-slate-500 italic' : row.saving ? 'text-emerald-400' : 'text-slate-300'}`}>
                {row.cost}
              </span>
            </li>
          ))}
        </ol>
        <p className="text-xs text-slate-500 mt-4">All costs except NDT and welding are fully outsourced — quotes pending from yards.</p>
      </div>

      {/* Henry's Reminders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">📋 Henry's Reminders</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {henryTasks.map((task, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-600 transition-colors">
              <h3 className="font-semibold text-emerald-400 mb-2">{task.title}</h3>
              <p className="text-sm text-slate-300 mb-3">{task.description}</p>
              <div className="flex justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                <span>Effort: <span className="text-slate-200">{task.effort}</span></span>
                <span>When: <span className="text-yellow-400">{task.when}</span></span>
              </div>
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
        <h2 className="text-xl font-semibold mb-4">📝 Notes</h2>
        <ul className="space-y-3">
          {notes.map((note, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-yellow-500 font-bold">ℹ️</span>
              <span className="text-slate-300">{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Colour Scheme */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-2">🎨 Colour Scheme</h2>

        {/* Reference photos */}
        <p className="text-slate-400 text-sm mb-3">Current plan — forest green hull · white superstructure · near-black antifouling · gold window frames</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <img src="/colour-ref-1.jpg" alt="Colour reference 1" className="rounded-lg w-full object-cover" />
          <img src="/colour-ref-2.jpg" alt="Colour reference 2" className="rounded-lg w-full object-cover" />
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-6">
          {[
            { zone: 'Below waterline', colour: 'Near-black', note: 'Antifouling base' },
            { zone: 'Hull (above WL)', colour: 'Forest green', note: '2–3 coats IJssel' },
            { zone: 'Superstructure', colour: 'White', note: 'Cabin sides & wheelhouse' },
            { zone: 'Window frames', colour: 'Gold / dark wood', note: 'Varnish or repaint' },
          ].map((r, i) => (
            <div key={i} className="bg-slate-800 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">{r.zone}</p>
              <p className="font-semibold text-white">{r.colour}</p>
              <p className="text-slate-500 text-xs mt-1">{r.note}</p>
            </div>
          ))}
        </div>

        {/* Colour options grid */}
        <p className="text-slate-400 text-sm mb-3">All colour options for reference</p>
        <img src="/colour-options.jpg" alt="Colour options" className="rounded-lg w-full" />
      </div>

      {/* Yards Research Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">🏗️ Yards Research</h2>
        <HauloutYardsTable />
      </div>
    </div>
  );
}
