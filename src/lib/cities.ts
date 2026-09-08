// Source: roozegar city table
// Why: shared by the prayer-time calculator and the weather card so both stay
//      on one set of coordinates.

export interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export const CITIES: City[] = [
  { id: "tehran", name: "تهران", lat: 35.6892, lng: 51.389 },
  { id: "mashhad", name: "مشهد", lat: 36.2605, lng: 59.6168 },
  { id: "isfahan", name: "اصفهان", lat: 32.6546, lng: 51.668 },
  { id: "shiraz", name: "شیراز", lat: 29.5918, lng: 52.5837 },
  { id: "tabriz", name: "تبریز", lat: 38.08, lng: 46.2919 },
  { id: "ahvaz", name: "اهواز", lat: 31.3183, lng: 48.6706 },
  { id: "kermanshah", name: "کرمانشاه", lat: 34.3142, lng: 47.065 },
  { id: "rasht", name: "رشت", lat: 37.2808, lng: 49.5832 },
  { id: "yazd", name: "یزد", lat: 31.8974, lng: 54.3569 },
  { id: "kerman", name: "کرمان", lat: 30.2839, lng: 57.0834 },
  { id: "bandarabbas", name: "بندرعباس", lat: 27.1832, lng: 56.2666 },
  { id: "urmia", name: "ارومیه", lat: 37.5527, lng: 45.0761 },
];

export const DEFAULT_CITY_ID = "tehran";

export function cityById(id: string): City {
  return CITIES.find((c) => c.id === id) ?? CITIES[0];
}
