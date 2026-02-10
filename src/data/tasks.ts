export interface Task {
  name: string;
  location: string;
  vendor: string;
  status: 'Ideation' | 'Planning' | 'Started' | 'Research' | 'Finished';
  targetDate: string;
  cost: string;
  notes: string;
}

export const tasks: Task[] = [
  { name: "Pump water out of salon", location: "Salon", vendor: "", status: "Started", targetDate: "2026-01-01", cost: "€0", notes: "" },
  { name: "Pump water out of forecabin", location: "Forecabin", vendor: "", status: "Started", targetDate: "2026-01-01", cost: "€0", notes: "" },
  { name: "Pin and Make schematic for Electrics", location: "Wheelhouse / Helm", vendor: "", status: "Started", targetDate: "2026-03-31", cost: "€2", notes: "Pin it to electrical cabinet door." },
  { name: "Remove and clean Bow Thruster", location: "Head", vendor: "Klaas Mulder", status: "Started", targetDate: "2026-03-31", cost: "€20", notes: "Clean corrosion. Short circuit. Maybe buy new solenoid." },
  { name: "Engine electrics", location: "Engine Room", vendor: "Steve", status: "Started", targetDate: "2026-03-31", cost: "€300", notes: "Steve might be the guy." },
  { name: "Sand blast boat", location: "Outside Hull", vendor: "", status: "Planning", targetDate: "2026-03-31", cost: "€1,000", notes: "Fully sand blast whole boat to bare metal." },
  { name: "Paint Exterior", location: "Outside Hull", vendor: "", status: "Planning", targetDate: "2026-03-31", cost: "", notes: "Hull and Exterior Black" },
  { name: "Antifouling", location: "Outside Hull", vendor: "", status: "Planning", targetDate: "2026-03-31", cost: "", notes: "Apply coats" },
  { name: "Sand and Paint Salon side wood", location: "Salon", vendor: "", status: "Planning", targetDate: "2026-06-30", cost: "€50", notes: "Prevent rot before winter" },
  { name: "Make Futon", location: "Salon", vendor: "Simone", status: "Planning", targetDate: "2026-06-30", cost: "€200", notes: "Great way to use the space at the back." },
  { name: "Make extendable bed", location: "Forecabin", vendor: "", status: "Planning", targetDate: "2026-06-30", cost: "€1,700", notes: "" },
  { name: "Make new Kitchen unit", location: "Salon", vendor: "", status: "Planning", targetDate: "2026-06-30", cost: "€1,000", notes: "" },
  { name: "Steering Wheel Replacement", location: "Wheelhouse / Helm", vendor: "", status: "Planning", targetDate: "2026-06-30", cost: "€50", notes: "Need shaft adapter or replacement." },
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

export const statusColumns = ['Ideation', 'Planning', 'Started', 'Research', 'Finished'] as const;

export const statusColors: Record<string, string> = {
  Ideation: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
  Planning: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  Started: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
  Research: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
  Finished: 'bg-green-500/20 border-green-500/40 text-green-300',
};
