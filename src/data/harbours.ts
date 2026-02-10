export interface Harbour {
  name: string;
  notes: string;
  status: string;
  warmth: string;
  area: string;
  location: string;
  website: string;
  electricityPrice: string;
  winterMooringPrice: string;
  carParking: boolean;
}

export const harbours: Harbour[] = [
  { name: "De Vioolsleutel", notes: "€1680 Oct–Apr 2026. Living not possible. Sleeping occasionally OK.", status: "Agreed", warmth: "Hot", area: "Zeeburg-Amsterdam", location: "https://maps.app.goo.gl/QRYsx7bAuAW3Ai7g8", website: "http://www.vioolsleutel.com/", electricityPrice: "€0.00", winterMooringPrice: "€1,680", carParking: true },
  { name: "Jachthaven Nauerna", notes: "Livable. Space for winter, must go by April. wifi, works allowed.", status: "Agreed", warmth: "Hot", area: "Zaandam", location: "https://maps.app.goo.gl/p3C4nxzBjKdb4zo88", website: "jachthavennauerna.nl", electricityPrice: "€0.56/kWh", winterMooringPrice: "€1,958", carParking: true },
  { name: "Watersportvereniging De Remming", notes: "Current mooring. Living fine. €535/mo. Gate secured. Free parking. 50c/kWh. Until 15 April. Insurance required.", status: "Agreed", warmth: "Hot", area: "Zaandam", location: "https://maps.app.goo.gl/egVehco51oiFzGrV7", website: "http://wsv-de-remming.nl/", electricityPrice: "€0.50/kWh", winterMooringPrice: "€535", carParking: true },
  { name: "Jachthaven de Vlonder", notes: "€905 winter, €1810 summer. 60c kWh. Showers €1, washer €8. Nice old couple.", status: "Agreed", warmth: "Hot", area: "Nauerna", location: "https://maps.app.goo.gl/bWwSqArxfVPv4gto8", website: "http://devlonder.info/contact.html", electricityPrice: "€0.60/kWh", winterMooringPrice: "€905", carParking: true },
  { name: "Rhebergen", notes: "First choice. NDSM. Affordable, showers, relaxed about living. €1680 + 3%.", status: "Agreed", warmth: "Hot", area: "NDSM, Amsterdam-Noord", location: "https://maps.app.goo.gl/mhaGgMbMV4Q9kbmV6", website: "https://werfrhebergen.nl/", electricityPrice: "€0.50/kWh", winterMooringPrice: "€1,680", carParking: false },
  { name: "Nautix Marina / Holland Sport", notes: "€3950/year. Strictly no living, sleeping OK occasionally.", status: "Considering", warmth: "Hot", area: "Zeeburg-Amsterdam", location: "https://maps.app.goo.gl/U1YjGTpHFhysj5MXA", website: "https://nautix.nl/", electricityPrice: "", winterMooringPrice: "€1,975", carParking: false },
  { name: "Jachtwerf Kokernoot", notes: "Need to call them.", status: "Considering", warmth: "Cold", area: "Zaandam", location: "https://maps.app.goo.gl/Ty9NKN9QhRsX344x6", website: "", electricityPrice: "", winterMooringPrice: "", carParking: false },
  { name: "mb jachtservice", notes: "Mick forwarded request to harbour.", status: "Maybe", warmth: "Cold", area: "Amsterdam", location: "https://maps.app.goo.gl/1sRtsnAJMKUqTCZY7", website: "http://www.mbjachtservice.nl/", electricityPrice: "", winterMooringPrice: "", carParking: false },
  { name: "Stichting Botenloods De Levant", notes: "They like old boats. Best to pay a visit. Say friend of Sean.", status: "Maybe", warmth: "Cold", area: "Amsterdam", location: "https://maps.app.goo.gl/aBRTN4eHsUBJXjoe6", website: "https://www.botenloods.nl/", electricityPrice: "", winterMooringPrice: "", carParking: false },
  { name: "Jachthaven Schellingwoude", notes: "€1185/mo. Free electricity. Can light fires, rent out boat. Very free but expensive.", status: "Second Choice", warmth: "Hot", area: "Schellingwoude-Amsterdam", location: "https://maps.app.goo.gl/471naDPb2rGNFT6s8", website: "http://www.jachthavenschellingwoude.nl/", electricityPrice: "€0.00", winterMooringPrice: "€14,220/yr", carParking: false },
  { name: "Jachthaven Bovendiep", notes: "Strictly no sleeping. No space atm but could change.", status: "Second Choice", warmth: "Hot", area: "Amsterdam", location: "https://maps.app.goo.gl/Xxsh1Nzwzq1QAFjF6", website: "http://www.jachthaven-bovendiep.nl/", electricityPrice: "", winterMooringPrice: "", carParking: false },
  { name: "Jachthaven 't Einde", notes: "Few days max. Pretty strict about not sleeping.", status: "Second Choice", warmth: "Hot", area: "Zeeburg-Amsterdam", location: "https://maps.app.goo.gl/Sod7EAa3ndujB7Az9", website: "http://www.jachthavenheteinde.nl/", electricityPrice: "", winterMooringPrice: "", carParking: false },
  { name: "Port Entrepot", notes: "Have space. Strictly recreational. Applied online.", status: "Second Choice", warmth: "Warm", area: "Amsterdam", location: "https://maps.app.goo.gl/deYanSzLHweo5Sf6A", website: "http://www.portentrepot.nl/", electricityPrice: "", winterMooringPrice: "", carParking: false },
  { name: "Sloepdelen Loosdrecht", notes: "Rick said possible to live here.", status: "Second Choice", warmth: "Cold", area: "Loosdrecht", location: "https://maps.app.goo.gl/5S5wEabRW15kTvkA9", website: "https://sloepdelen.nl/", electricityPrice: "", winterMooringPrice: "", carParking: false },
  { name: "De Bootcaptain", notes: "Probably possible.", status: "Second Choice", warmth: "Cold", area: "Ijmuiden", location: "", website: "https://www.boatcaptain.nl/stalling/#tarieven", electricityPrice: "", winterMooringPrice: "", carParking: false },
  { name: "Jachthaven D' Anckerplaets", notes: "Emailed.", status: "Call", warmth: "Cold", area: "Noord-Amsterdam", location: "https://maps.app.goo.gl/C9WSJJ8QLoXu2b3J6", website: "https://www.anckerplaets.nl/", electricityPrice: "", winterMooringPrice: "", carParking: false },
  { name: "Scheepswerf Stella Maris", notes: "Emailed.", status: "Call", warmth: "Cold", area: "Noord-Amsterdam", location: "https://maps.app.goo.gl/u9ucpURgf1kECi9d8", website: "http://www.scheepswerf-stellamaris.nl/", electricityPrice: "", winterMooringPrice: "", carParking: false },
  { name: "Marina Realeneiland", notes: "Got to call. Photos look promising.", status: "Call", warmth: "Cold", area: "Amsterdam", location: "https://maps.app.goo.gl/M41F6vhYt6snTg9h9", website: "", electricityPrice: "", winterMooringPrice: "", carParking: false },
  { name: "Kadoelen Wharf", notes: "Emailed.", status: "Call", warmth: "Cold", area: "Noord-Amsterdam", location: "https://maps.app.goo.gl/Tn4w63xtGM5bBcqP6", website: "https://www.kadoelenwerf.nl/", electricityPrice: "", winterMooringPrice: "", carParking: false },
  { name: "Jachthaven Het Jacht", notes: "Anais has her boat there.", status: "Call", warmth: "Cold", area: "Nieuwendam", location: "https://maps.app.goo.gl/YmLtJeisPEYsCYt3A", website: "", electricityPrice: "", winterMooringPrice: "", carParking: false },
  { name: "Coöp Werf De Zuiderzee", notes: "Near home.", status: "Call", warmth: "Cold", area: "Nieuwendam-Amsterdam", location: "https://maps.app.goo.gl/GQ45zGt2PxebunZ97", website: "", electricityPrice: "", winterMooringPrice: "", carParking: false },
];

export const statusOrder = ['Agreed', 'Considering', 'Maybe', 'Second Choice', 'Call', 'Unknown', 'Dropped'];
