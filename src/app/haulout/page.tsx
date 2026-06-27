import HauloutYardsTable from '@/components/HauloutYardsTable';

export default function HauloutPlan() {
  const costs = [
    { item: 'Multiship Holland August haulout package', cost: 'Booked — quote/final scope TBD' },
    { item: 'Lift, haul-out, dry standing and launch', cost: 'Confirm in booked scope' },
    { item: 'High-pressure wash / clean down', cost: 'Confirm in booked scope' },
    { item: 'Sandblasting — full boat / hull', cost: 'Booked work — confirm exact coverage' },
    { item: 'Insurance survey / hull check (if required)', cost: 'Via insurer / quote TBD' },
    { item: 'Hull welding repairs (if needed)', cost: 'Quote TBD' },
    { item: 'New exhaust — weld (Mike)', cost: 'Quote TBD', saving: true, savingNote: 'Mike may still save money if allowed alongside yard work' },
    { item: '2× International primer — underwater hull', cost: 'Confirm materials/labour' },
    { item: '2× Antifouling coats — underwater hull (Interspeed 340)', cost: '~€2,000–3,000 fallback allowance' },
    { item: 'Zinc anodes', cost: '~€200' },
    { item: '2–3 coats paint — above waterline', cost: 'Quote TBD' },
    { item: 'Fallback budget if switching yard', cost: '~€6k–12k + welding surprises' },
  ];

  const timeline = [
    { label: 'Status', value: 'Booked' },
    { label: 'Booked yard', value: 'Multiship Holland' },
    { label: 'Planned haulout', value: 'August 2026' },
  ];

  const callOrder = [
    'Schouten',
    'Amsterdam Yacht Service',
    'Braspenning / Waterland Coatings',
    'Jachtwerf Weesp',
    'Scheepswerf Van Laar',
    'Scheepswerf de IJwerf',
    'Werf Brouwer',
    'Zaanhaven / Westhaven',
  ];

  const yardBookingFacts = [
    { label: 'Yard booked', value: 'Yes — Multiship Holland' },
    { label: 'Slot', value: 'August 2026' },
    { label: 'Next action', value: 'Confirm quote, scope, dates and payment terms' },
  ];

  const yardPlan = [
    { label: 'Haul-out timing', value: 'August 2026 booked slot' },
    { label: 'Dry stalling duration', value: '~5 weeks assumption — confirm' },
    { label: 'Back in water', value: 'After yard slot + confirmed dry period' },
  ];

  const henryTasks = [
    {
      title: '🧹 Interior Hull Cleaning',
      description: 'Clean interior hull → brush/treat rust → Owatrol Oil on vertical parts → paint where needed → heated grease on horizontal areas, mostly above the concrete',
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
    'Booked plan: Multiship Holland in August 2026 for the whole works.',
    'Still keep fallback yards warm until the Multiship quote/scope/date/payment terms are written down.',
    'Fallback call order: Schouten → Amsterdam Yacht Service → Braspenning/Waterland → Jachtwerf Weesp → Van Laar → IJwerf → Brouwer → Zaanhaven/Westhaven.',
    'Fallback budget: keep ~€6k–12k available before unknown welding/survey surprises; exact Multiship quote still needs confirming.',
    'Insurance/survey: if hull-thickness measurement or inspection is needed, arrange it through the insurer or surveyor rather than DIY NDT.',
    'Welding: Mike (friend) may still be cheaper for the exhaust/hull repairs if the booked yard allows outside welding or separate prep.',
    'Bottom coating: 2x International primer + 2x Interspeed 340 antifouling + zinc anodes — confirm whether Multiship supplies or Henry supplies materials.',
    'Top coating: 2–3 coats IJssel Coatings paint — confirm whether included. Contact Niels for cheaper paint supply if Henry supplies materials.',
    'Interior hull: clean and treat rust by brush, use Owatrol Oil on vertical parts, paint where useful, and use heated grease on horizontal areas, mostly above the concrete. Henry does this.',
    'Waterline: Score real waterline with kraspen, paint 10cm above this line. Henry does this on day 1.',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">🚢 Haulout Plan — Timo 16.8m × 3.25m</h1>
        <p className="text-emerald-300 font-semibold">Booked: Multiship Holland in August 2026. Keep fallback yard calls and budget visible until scope/quote are confirmed.</p>
      </div>

      <img
        src="/haulout-timo.jpg"
        alt="Timo hauled out in the yard with the planned black and cream hull finish"
        className="rounded-xl border border-slate-800 w-full max-h-[520px] object-cover object-center shadow-lg"
      />

      {/* Booking Status */}
      <div className="bg-emerald-950/50 border border-emerald-700 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Booked yard</p>
            <h2 className="text-2xl font-bold text-white mt-1">Multiship Holland is the booked August plan</h2>
            <p className="text-emerald-100 mt-3 max-w-3xl">
              The main plan is now booked for August 2026. This page keeps the backup call list and fallback budget visible so Henry can still check availability/pricing elsewhere if Multiship's final quote or scope changes.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3 lg:min-w-64">
            {yardBookingFacts.map((fact) => (
              <div key={fact.label} className="bg-emerald-900/50 border border-emerald-800 rounded-lg p-3">
                <p className="text-xs text-emerald-200">{fact.label}</p>
                <p className="font-semibold text-white mt-1">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 border-t border-emerald-800 pt-4">
          <p className="text-sm text-emerald-200 mb-2">Fallback call order / availability checks</p>
          <div className="flex flex-wrap gap-2">
            {callOrder.map((yard, index) => (
              <span key={yard} className="rounded-lg bg-slate-900/60 border border-emerald-700 px-3 py-2 text-sm font-semibold text-white">
                {index + 1}. {yard}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Summary Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-3">💰 Budget Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm opacity-90">Fallback budget if changing yards:</span>
            <span className="text-3xl font-bold">€6k–12k+</span>
          </div>
          <div className="text-sm opacity-80 space-y-1 mt-3 border-t border-emerald-500 pt-3">
            <p>✓ Booked route: Multiship Holland, August 2026</p>
            <p>💸 Keep backup quotes warm until Multiship scope/price is written down</p>
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
        <div className="grid sm:grid-cols-3 gap-4">
          {timeline.map((t, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
              <span className="text-slate-400 text-sm">{t.label}</span>
              <span className="font-semibold">{t.value}</span>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {yardPlan.map((t, i) => (
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
        <ul className="grid sm:grid-cols-2 gap-3">
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

        {/* Chosen design */}
        <p className="text-slate-400 text-sm mb-3">Chosen — navy/near-black hull · cream superstructure · white stripe · red horizontal planes (deck) · wood trim</p>
        <img src="/colour-chosen.png" alt="Chosen colour scheme" className="rounded-lg w-full object-cover mb-4" />
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3 text-sm mb-6">
          {[
            { zone: 'Below waterline', colour: 'Near-black', note: 'Antifouling base' },
            { zone: 'Hull (above WL)', colour: 'Navy / near-black', note: '2–3 coats IJssel' },
            { zone: 'Horizontal planes', colour: 'Red', note: 'Deck surfaces' },
            { zone: 'Superstructure', colour: 'Cream / off-white', note: 'Cabin sides & wheelhouse' },
            { zone: 'Window frames', colour: 'Wood / gold', note: 'Varnish or repaint' },
          ].map((r, i) => (
            <div key={i} className="bg-slate-800 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">{r.zone}</p>
              <p className="font-semibold text-white">{r.colour}</p>
              <p className="text-slate-500 text-xs mt-1">{r.note}</p>
            </div>
          ))}
        </div>

        {/* Colour options grid */}
        <p className="text-slate-400 text-sm mb-3">All colour options explored</p>
        <img src="/colour-options.jpg" alt="Colour options" className="rounded-lg w-full" />
      </div>

      {/* Yards Research Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">🏗️ Yard Research / Backup Options</h2>
        <HauloutYardsTable />
      </div>
    </div>
  );
}
