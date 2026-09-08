// Prayer times via the "adhan" library (battle-tested, used across many
// Islamic apps) rather than a hand-rolled solar-position formula — cross-
// checked against a custom implementation during development and found to
// diverge by up to ~15 minutes on Asr, which isn't acceptable for a widget
// people might actually rely on.

import { CalculationMethod, Coordinates, Madhab, PrayerTimes as AdhanPrayerTimes } from "adhan";

export interface City {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export const IRAN_CITIES: City[] = [
  { id: "tehran", name: "تهران", lat: 35.6892, lon: 51.389 },
  { id: "mashhad", name: "مشهد", lat: 36.2605, lon: 59.6168 },
  { id: "isfahan", name: "اصفهان", lat: 32.6546, lon: 51.668 },
  { id: "shiraz", name: "شیراز", lat: 29.5918, lon: 52.5837 },
  { id: "tabriz", name: "تبریز", lat: 38.08, lon: 46.2919 },
  { id: "ahvaz", name: "اهواز", lat: 31.3183, lon: 48.6706 },
  { id: "karaj", name: "کرج", lat: 35.8355, lon: 50.9915 },
  { id: "qom", name: "قم", lat: 34.6401, lon: 50.8764 },
  { id: "kermanshah", name: "کرمانشاه", lat: 34.3142, lon: 47.065 },
  { id: "rasht", name: "رشت", lat: 37.2809, lon: 49.5832 },
  { id: "yazd", name: "یزد", lat: 31.8974, lon: 54.3569 },
  { id: "bandarabbas", name: "بندرعباس", lat: 27.1865, lon: 56.2808 },
];

export type PrayerMethod = "tehran" | "mwl";

export interface PrayerTimesResult {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

function toClock(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

/**
 * Computes prayer times for a given Gregorian calendar day (as seen in the
 * city's local calendar), city coordinates, and method.
 *
 * Note: `adhan` reads a Date's *local* (server-timezone) getFullYear/Month/
 * Date fields and treats them as the target civil date — so we must build
 * the input with the plain (non-UTC) Date constructor, which is self-
 * consistent (round-trips correctly) no matter what timezone the server
 * process happens to run in.
 */
export function computePrayerTimes(
  y: number,
  m: number,
  d: number,
  city: City,
  method: PrayerMethod = "tehran"
): PrayerTimesResult {
  const coordinates = new Coordinates(city.lat, city.lon);
  const params = method === "tehran" ? CalculationMethod.Tehran() : CalculationMethod.MuslimWorldLeague();
  params.madhab = Madhab.Shafi;
  const date = new Date(y, m - 1, d);
  const times = new AdhanPrayerTimes(coordinates, date, params);
  const tz = "Asia/Tehran";
  return {
    fajr: toClock(times.fajr, tz),
    sunrise: toClock(times.sunrise, tz),
    dhuhr: toClock(times.dhuhr, tz),
    asr: toClock(times.asr, tz),
    maghrib: toClock(times.maghrib, tz),
    isha: toClock(times.isha, tz),
  };
}
