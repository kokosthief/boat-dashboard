export interface Vendor {
  name: string;
  tasks: string;
  contact: string;
  phone: string;
  email: string;
  notes: string;
}

export const vendors: Vendor[] = [
  { name: "Mees van de Nes", tasks: "Bow cabin bed conversion", contact: "Mees", phone: "+31 6 44694355", email: "", notes: "Built collapsible double bed in bow (forecabin) with fold-up section for storage access below. Paid €620 cash. ✅ COMPLETED" },
  { name: "Réifier (Simone)", tasks: "Window frame repair, Aft cabin sofa-bed build", contact: "Simone", phone: "+31 6 15897070", email: "contact@reifier.nl", notes: "Furniture maker. https://reifier.nl/ — Did boat window fix (azobe + iroko beams, sealant, 10hrs labour = €476.78) + follow-up labour (€101.64). Total: €578.42. KvK 96832606. BTW NL005235697B42. IBAN NL85ASNB8851750637. Building sofa that converts to double bed — construction starts March 1." },
  { name: "Klaas Mulder Watersport", tasks: "Bow thruster + Victron equipment supplier, batteries, cables, relays", contact: "K. Mulder", phone: "(075) 617-4535", email: "info@klaas-mulder.nl", notes: "Watersport shop in Zaandam. Gerrit Bolkade 9, 1507 BR Zaandam. https://klaas-mulder.nl/ Open Mon-Fri 9-18, Sat 9-17. KvK 35013134. BTW NL815271426B01. Supplied battery, cleaning fluid, relay, cable (€295.44). Good for Victron and Vetus bow thruster equipment." },
  { name: "Steve's Maintenance & Services", tasks: "DC electrical power system, battery installation, Victron wiring, engine & gearbox oil check", contact: "S.D. Davies-Williams", phone: "06-42702888", email: "SMSdoemaar@gmail.com", notes: "Marine electrician. Tutored Henry on Victron battery system install. Wired full DC power: 50mm battery cables, 300A bow thruster disconnect switch, 250A mega fuse, cable lugs. Based at Nassaukade 36-II, 1052 CK Amsterdam. KvK 90905679. Total paid: €1,212.42 (Mom). Great for future electrical work on Timo." },
  { name: "Sjemmie", tasks: "Start Engine, Diesel Heater, Water pump delivery, Heater pump thermostat switch", contact: "Sjemmie", phone: "(062) 036-6661", email: "", notes: "Very keen to help and work together. Has ordered a replacement water pump (for faucets) — ready to deliver. Planning to install a thermostat switch so the diesel heater circulation pump only runs when water reaches temperature. Stay in regular contact." },
  { name: "Andre", tasks: "Engine maintenance, mechanic", contact: "Andre", phone: "+31 6 52064042", email: "", notes: "Mechanic. Contact via Zoe/Paul. Great guy, likes cash, only paid if he helps." },
  { name: "George Kniest Boat Equipment", tasks: "Victron energy system components, boat equipment, refrigerator, solar equipment", contact: "Klantenservice", phone: "+31 36 536 9440", email: "Klantenservice@georgekniest.nl", notes: "Major marine equipment supplier at Marina Muiderzand, Almere. Supplied: Victron Cerbo GX + Touch50 display, SmartShunt 500A, Lynx Distributor, Galvanische isolator, Victron charger, solar controller, battery monitor, refrigerator, bilge pump, fuse holders, solar connectors. 5 invoices totalling €5,128.40 (Mom). Marinaweg 20, 1361 AC Almere. KvK 39063144. 'Varen is vrijheid!' Henry is klant 30105054." },
  { name: "Eerdmans Jachtverzekeringen", tasks: "Boat insurance quote", contact: "Klantenservice", phone: "0514-563655", email: "info@eerdmans.nl", notes: "Specialist boat/yacht insurer, 50+ years experience. https://www.eerdmans.nl/bootverzekering-offerte-aanvragen/ Mon-Fri 8:30-17:00. ⚠️ STATUS: Need to follow up on insurance quote." },
  { name: "Frank van Meegen", tasks: "", contact: "Frank", phone: "+31 6 53590442", email: "", notes: "⚠️ Henry can't remember what Frank does — keeping for now with phone number." },
];
