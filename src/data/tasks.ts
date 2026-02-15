export interface Task {
  name: string;
  location: string;
  vendor: string;
  status: 'Ideation' | 'Planning' | 'Started' | 'Researching' | 'Finished';
  targetDate: string;
  cost: string;
  notes: string;
  urgent?: boolean;
}

export const tasks: Task[] = [
  { name: "Pin and Make schematic for Electrics", location: "Wheelhouse / Helm", vendor: "", status: "Started", targetDate: "2026-03-31", cost: "€2", notes: "Pin it to electrical cabinet door." },
  { name: "Pump water out of boat sections", location: "Various", vendor: "", status: "Started", targetDate: "2026-02-20", cost: "", notes: "Urgent — pump water from multiple sections of the boat", urgent: true },
  { name: "Remove and clean Bow Thruster", location: "Head", vendor: "", status: "Started", targetDate: "2026-03-31", cost: "€20", notes: "Clean corrosion. Short circuit. Maybe buy new solenoid. DIY." },
  { name: "Engine electrics", location: "Engine Room", vendor: "", status: "Started", targetDate: "2026-03-31", cost: "€300", notes: "DIY first, Steve as backup if needed." },
  { name: "Sand blast boat", location: "Outside Hull", vendor: "", status: "Planning", targetDate: "2026-03-31", cost: "€1,000", notes: "Fully sand blast whole boat to bare metal." },
  { name: "Paint Exterior", location: "Outside Hull", vendor: "", status: "Planning", targetDate: "2026-03-31", cost: "", notes: "Hull and Exterior Black" },
  { name: "Antifouling", location: "Outside Hull", vendor: "", status: "Planning", targetDate: "2026-03-31", cost: "", notes: "Apply coats" },
  { name: "Sand and Paint Salon side wood", location: "Salon", vendor: "", status: "Planning", targetDate: "2026-06-30", cost: "€50", notes: "Prevent rot before winter" },
  { name: "Aft cabin sofa-bed build", location: "Salon", vendor: "Simone", status: "Started", targetDate: "2026-06-30", cost: "€1,700", notes: "Simone currently designing. Sofa that converts to double bed in aft cabin. Construction starts March 1." },
  { name: "Make new Kitchen unit", location: "Salon", vendor: "", status: "Planning", targetDate: "2026-06-30", cost: "€1,000", notes: "" },
  { name: "Steering Wheel Replacement", location: "Wheelhouse / Helm", vendor: "", status: "Planning", targetDate: "2026-06-30", cost: "", notes: "Bought beautiful old wheel but attachment point is bigger than current one. Need to figure out adapter/fitting." },
  { name: "Bathroom tiles — cut & install", location: "Head", vendor: "", status: "Planning", targetDate: "2026-03-31", cost: "", notes: "Slate/ceramic tiles bought. Cut to shape and install around toilet area (floor + sides). Replace ugly white plastic surround." },
  { name: "Install toilet brush holder", location: "Head", vendor: "", status: "Planning", targetDate: "2026-02-28", cost: "", notes: "Metal wall-mounted housing. Needs to be attached to wall." },
  { name: "Plumber — fix leaking shower pipe", location: "Head", vendor: "Plumber (TBD)", status: "Planning", targetDate: "2026-03-31", cost: "", notes: "Pipe near shower is leaking. Need to find a plumber." },
  { name: "Plumber — install new toilet sink", location: "Head", vendor: "Plumber (TBD)", status: "Planning", targetDate: "2026-03-31", cost: "", notes: "New sink bought, needs installing." },
  { name: "Plumber — replace 80L boiler with 20L", location: "Head", vendor: "Plumber (TBD)", status: "Planning", targetDate: "2026-03-31", cost: "", notes: "Swap 80L electric boiler for 20L one (already bought). Don't need the big one." },
  { name: "Fix engine room door hinge", location: "Engine Room", vendor: "", status: "Planning", targetDate: "", cost: "", notes: "One of the hinges needs fixing." },
  { name: "Have Lock Keys Cut", location: "", vendor: "", status: "Researching", targetDate: "2025-09-23", cost: "€10", notes: "" },
  { name: "Obtain insurance", location: "", vendor: "Eerdmans", status: "Researching", targetDate: "2026-06-30", cost: "", notes: "" },
  { name: "Make clothes rack from a tree", location: "Forecabin", vendor: "", status: "Ideation", targetDate: "", cost: "€0", notes: "" },
  { name: "Call harbours for a new place to berth", location: "", vendor: "", status: "Finished", targetDate: "", cost: "", notes: "Multiple marinas contacted." },
  { name: "New wood for broken window frame", location: "Wheelhouse / Helm", vendor: "Simone", status: "Finished", targetDate: "2025-09-23", cost: "€500", notes: "" },
  { name: "Clean Engine Room", location: "Engine Room", vendor: "", status: "Finished", targetDate: "2025-09-23", cost: "", notes: "" },
  { name: "Seal windows", location: "Wheelhouse / Helm", vendor: "", status: "Finished", targetDate: "2025-09-23", cost: "€20", notes: "" },
  { name: "Fix Interior Lights in Forecabin", location: "Forecabin", vendor: "", status: "Finished", targetDate: "2025-09-23", cost: "", notes: "" },
  { name: "Fix Locks", location: "Wheelhouse / Helm", vendor: "", status: "Finished", targetDate: "2025-09-23", cost: "€30", notes: "" },
  { name: "Start Engine", location: "Engine Room", vendor: "Sjemmie, DAF, Andres", status: "Finished", targetDate: "2025-09-23", cost: "€1,000", notes: "Sjemmie advised on starting procedure" },
  { name: "Replace Start Motor", location: "Engine Room", vendor: "Anjema & Schneiders", status: "Finished", targetDate: "2025-09-30", cost: "€300", notes: "" },
  { name: "Engine maintenance", location: "Engine Room", vendor: "DAF, Andres", status: "Finished", targetDate: "2025-10-21", cost: "€200", notes: "" },
  { name: "Inspect / Fix Diesel Heater", location: "Engine Room", vendor: "Sjemmie", status: "Finished", targetDate: "2025-10-22", cost: "€2,000", notes: "Sjemmie installed diesel heater" },
  { name: "Frame Jana's Art", location: "Salon", vendor: "", status: "Finished", targetDate: "2025-10-22", cost: "", notes: "" },
  { name: "Change oil of gearbox", location: "Engine Room", vendor: "", status: "Finished", targetDate: "2025-10-22", cost: "€50", notes: "" },
  { name: "Install Starlink", location: "Deck", vendor: "", status: "Finished", targetDate: "2026-01-28", cost: "", notes: "Starlink installed and working on boat" },
  { name: "Install Victron Quattro-II", location: "Engine Room", vendor: "George Kniest", status: "Finished", targetDate: "2026-01-15", cost: "€2,200", notes: "Part of Victron energy system" },
  { name: "Install galvanic isolator", location: "Engine Room", vendor: "", status: "Finished", targetDate: "2026-01-20", cost: "", notes: "Electrical safety for shore power" },
  { name: "Replace heating burner + fuel filter + temp gauge + remote thermostat", location: "Engine Room", vendor: "Sjemmie", status: "Finished", targetDate: "2026-02-01", cost: "", notes: "Full heating system overhaul — new burner, fuel filter, temperature gauge, and remote thermostat all installed" },
  { name: "Fix kitchen tap", location: "Salon", vendor: "", status: "Finished", targetDate: "2025-12-01", cost: "", notes: "Fixed when mum was visiting" },
  { name: "Bow cabin bed build", location: "Forecabin", vendor: "Mees", status: "Finished", targetDate: "2026-02-13", cost: "", notes: "Collapsible double bed with fold-up section for storage access below. Completed by Mees." },
  { name: "Install power outlets under kitchen sink", location: "Salon", vendor: "", status: "Planning", targetDate: "2026-03-31", cost: "", notes: "Switch to turn boiler (hot water) on/off conveniently" },
];

export const statusColumns = ['Started', 'Planning', 'Ideation', 'Researching', 'Finished'] as const;

export const statusColors: Record<string, string> = {
  Ideation: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
  Planning: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  Started: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
  Researching: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
  Finished: 'bg-green-500/20 border-green-500/40 text-green-300',
};
