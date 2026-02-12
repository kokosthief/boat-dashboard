export interface Task {
  name: string;
  location: string;
  vendor: string;
  status: 'Ideation' | 'Planning' | 'Started' | 'Research' | 'Finished';
  targetDate: string;
  cost: string;
  notes: string;
  urgent?: boolean;
}

export const tasks: Task[] = [
  { name: "Pump water out of salon", location: "Salon", vendor: "", status: "Started", targetDate: "2026-01-01", cost: "€70", notes: "Bought strong water-sucking hoover (~€70) to help.", urgent: true },
  { name: "Pump water out of forecabin", location: "Forecabin", vendor: "", status: "Started", targetDate: "2026-01-01", cost: "€0", notes: "", urgent: true },
  { name: "Pin and Make schematic for Electrics", location: "Wheelhouse / Helm", vendor: "", status: "Started", targetDate: "2026-03-31", cost: "€2", notes: "Pin it to electrical cabinet door." },
  { name: "Bow cabin bed conversion", location: "Forecabin", vendor: "Mees van de Nes", status: "Started", targetDate: "2026-02-16", cost: "", notes: "Converting single bed to collapsible double bed with fold-up section for storage access below. Due in a few days." },
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
  { name: "Have Lock Keys Cut", location: "", vendor: "", status: "Research", targetDate: "2025-09-23", cost: "€10", notes: "" },
  { name: "Obtain insurance", location: "", vendor: "Eerdmans", status: "Research", targetDate: "2026-06-30", cost: "", notes: "" },
  { name: "Make clothes rack from a tree", location: "Forecabin", vendor: "", status: "Ideation", targetDate: "", cost: "€0", notes: "" },
  { name: "Call harbours for a new place to berth", location: "", vendor: "", status: "Finished", targetDate: "", cost: "", notes: "Multiple marinas contacted." },
  { name: "New wood for broken window frame", location: "Wheelhouse / Helm", vendor: "Simone", status: "Finished", targetDate: "2025-09-23", cost: "€500", notes: "" },
  { name: "Clean Engine Room", location: "Engine Room", vendor: "", status: "Finished", targetDate: "2025-09-23", cost: "", notes: "" },
  { name: "Seal windows", location: "Wheelhouse / Helm", vendor: "", status: "Finished", targetDate: "2025-09-23", cost: "€20", notes: "" },
  { name: "Fix Interior Lights in Forecabin", location: "Forecabin", vendor: "", status: "Finished", targetDate: "2025-09-23", cost: "", notes: "" },
  { name: "Fix Locks", location: "Wheelhouse / Helm", vendor: "", status: "Finished", targetDate: "2025-09-23", cost: "€30", notes: "" },
  { name: "Start Engine", location: "Engine Room", vendor: "Sjemma, DAF, Andres", status: "Finished", targetDate: "2025-09-23", cost: "€1,000", notes: "" },
  { name: "Replace Start Motor", location: "Engine Room", vendor: "Anjema & Schneiders", status: "Finished", targetDate: "2025-09-30", cost: "€300", notes: "" },
  { name: "Engine maintenance", location: "Engine Room", vendor: "Sjemma, DAF, Andres", status: "Finished", targetDate: "2025-10-21", cost: "€200", notes: "" },
  { name: "Inspect / Fix Diesel Heater", location: "Engine Room", vendor: "Sjemma", status: "Finished", targetDate: "2025-10-22", cost: "€2,000", notes: "" },
  { name: "Frame Jana's Art", location: "Salon", vendor: "", status: "Finished", targetDate: "2025-10-22", cost: "", notes: "" },
  { name: "Change oil of gearbox", location: "Engine Room", vendor: "", status: "Finished", targetDate: "2025-10-22", cost: "€50", notes: "" },
];

export const statusColumns = ['Started', 'Planning', 'Ideation', 'Research', 'Finished'] as const;

export const statusColors: Record<string, string> = {
  Ideation: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
  Planning: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  Started: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
  Research: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
  Finished: 'bg-green-500/20 border-green-500/40 text-green-300',
};
