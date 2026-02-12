export interface Vendor {
  name: string;
  tasks: string;
  contact: string;
  phone: string;
  email: string;
  notes: string;
}

export const vendors: Vendor[] = [
  { name: "Mees van de Nes", tasks: "Bow cabin bed conversion", contact: "Mees", phone: "+31 6 44694355", email: "", notes: "🔴 ACTIVE — Converting single bed to collapsible double bed in bow (forecabin) with fold-up section for storage access below. Due in a few days." },
  { name: "Simone", tasks: "Window frame, Aft cabin sofa-bed build", contact: "Simone", phone: "+31 6 15897070", email: "contact@reifier.nl", notes: "🟡 UPCOMING — Furniture maker. https://reifier.nl/ — Building sofa that converts to double bed. Construction starts March 1." },
  { name: "Klaas Mulder", tasks: "Bow thruster + Victron equipment supplier", contact: "", phone: "(075) 617-4535", email: "info@klaas-mulder.nl", notes: "Good for Victron and Vetus bow thruster equipment." },
  { name: "Steve", tasks: "Engine electrics", contact: "Steve", phone: "", email: "", notes: "" },
  { name: "Sjemma", tasks: "Engine maintenance, Start Engine, Diesel Heater", contact: "Sjemma", phone: "(062) 036-6661", email: "", notes: "Kind of wants to help. Scheduled." },
  { name: "Tijmon", tasks: "", contact: "Tijmon", phone: "", email: "", notes: "Carpenter. From Odessa crew." },
  { name: "DAF Specialist Company", tasks: "Engine maintenance, Start Engine", contact: "NA", phone: "(020) 636-0462", email: "", notes: "Amsterdam-Noord, specialise in DAF engines" },
  { name: "Anjema & Schneiders Auto Elektro", tasks: "Replace Start Motor", contact: "", phone: "", email: "", notes: "" },
  { name: "Eerdmans", tasks: "Obtain insurance", contact: "", phone: "", email: "", notes: "https://www.eerdmans.nl/bootverzekering-offerte-aanvragen/" },
  { name: "Andres", tasks: "Engine maintenance, Start Engine", contact: "Via Zoe/Paul", phone: "", email: "", notes: "Great guy, likes cash, only paid if he helps." },
  { name: "Frank van Meegen", tasks: "", contact: "Frank", phone: "+31 6 53590442", email: "", notes: "" },
];
