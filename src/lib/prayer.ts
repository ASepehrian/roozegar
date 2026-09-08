// Source: roozegar prayer times (اوقات شرعی)
// Why: computed locally from solar geometry (declination + equation of time,
//      the classic PrayTimes formulation) so the app keeps working with no API
//      key, no network and no tracking.
// Note: two calculation methods are offered — the Institute of Geophysics of
//      the University of Tehran (the reference used inside Iran, with a 4.5°
//      Maghrib depression and Jafari midnight) and the Muslim World League.

import { City } from "./cities";

const DEG = Math.PI / 180;

const sin = (d: number) => Math.sin(d * DEG);
const cos = (d: number) => Math.cos(d * DEG);
const tan = (d: number) => Math.tan(d * DEG);
const arcsin = (x: number) => Math.asin(x) / DEG;
const arccos = (x: number) => Math.acos(x) / DEG;
const arctan2 = (y: number, x: number) => Math.atan2(y, x) / DEG;
const arccot = (x: number) => Math.atan(1 / x) / DEG;

function fix(a: number, b: number): number {
  const r = a - b * Math.floor(a / b);
  return r < 0 ? r + b : r;
}
const fixAngle = (a: number) => fix(a, 360);
const fixHour = (a: number) => fix(a, 24);

export type PrayerMethod = "tehran" | "mwl";

export const METHOD_LABELS: Record<PrayerMethod, string> = {
  tehran: "مؤسسهٔ ژئوفیزیک دانشگاه تهران",
  mwl: "اتحادیهٔ جهانی اسلامی (MWL)",
};

interface MethodParams {
  fajr: number;
  isha: number;
  /** Sun depression for Maghrib; null means "at sunset". */
  maghrib: number | null;
  /** Midnight measured from sunset (Jafari) instead of from sunset to sunrise. */
  jafariMidnight: boolean;
}

const METHODS: Record<PrayerMethod, MethodParams> = {
  tehran: { fajr: 17.7, isha: 14, maghrib: 4.5, jafariMidnight: true },
  mwl: { fajr: 18, isha: 17, maghrib: null, jafariMidnight: false },
};

function julianDay(y: number, m: number, d: number): number {
  let yy = y;
  let mm = m;
  if (mm <= 2) {
    yy -= 1;
    mm += 12;
  }
  const a = Math.floor(yy / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (yy + 4716)) + Math.floor(30.6001 * (mm + 1)) + d + b - 1524.5;
}

/** Apparent solar declination and equation of time (hours) at a Julian day. */
function sunPosition(jd: number): { decl: number; eqt: number } {
  const d = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * d);
  const q = fixAngle(280.459 + 0.98564736 * d);
  const l = fixAngle(q + 1.915 * sin(g) + 0.02 * sin(2 * g));
  const e = 23.439 - 0.00000036 * d;
  const ra = fixHour(arctan2(cos(e) * sin(l), cos(l)) / 15);
  return { decl: arcsin(sin(e) * sin(l)), eqt: q / 15 - ra };
}

export interface PrayerTimes {
  imsak: number;
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  sunset: number;
  maghrib: number;
  isha: number;
  midnight: number;
}

export const PRAYER_LABELS: Record<keyof PrayerTimes, string> = {
  imsak: "اذان صبح (امساک)",
  fajr: "طلوع فجر",
  sunrise: "طلوع آفتاب",
  dhuhr: "اذان ظهر",
  asr: "عصر",
  sunset: "غروب آفتاب",
  maghrib: "اذان مغرب",
  isha: "اذان عشا",
  midnight: "نیمه‌شب شرعی",
};

/**
 * Prayer times for the Tehran-timezone day `anchor` represents, as decimal
 * hours in UTC+03:30 (Iran standard time, which no longer observes DST).
 */
export function prayerTimes(anchor: Date, city: City, method: PrayerMethod): PrayerTimes {
  const params = METHODS[method];
  const tzOffset = 3.5;
  const jd = julianDay(anchor.getUTCFullYear(), anchor.getUTCMonth() + 1, anchor.getUTCDate())
    - city.lng / (15 * 24);

  // Solar noon in local clock time; the sun position is re-evaluated there so
  // the equation of time is taken at the right moment of the day.
  let transit = 12;
  let pos = sunPosition(jd);
  for (let i = 0; i < 2; i++) {
    transit = 12 - pos.eqt - city.lng / 15 + tzOffset;
    pos = sunPosition(jd + (transit - tzOffset) / 24);
  }
  const { decl } = pos;

  /** Hour offset from solar noon at which the sun sits `angle` below horizon. */
  function offsetFor(angle: number): number {
    const x = (-sin(angle) - sin(decl) * sin(city.lat)) / (cos(decl) * cos(city.lat));
    if (x < -1 || x > 1) return NaN; // polar edge case; never hit for Iran
    return arccos(x) / 15;
  }

  const sunriseOffset = offsetFor(0.833); // 0.833° covers refraction + solar radius
  const sunrise = transit - sunriseOffset;
  const sunset = transit + sunriseOffset;
  const fajr = transit - offsetFor(params.fajr);
  const maghrib = params.maghrib === null ? sunset : transit + offsetFor(params.maghrib);
  const isha = transit + offsetFor(params.isha);

  // Asr: shadow length equals the object's own length plus its noon shadow.
  const asrAngle = -arccot(1 + tan(Math.abs(city.lat - decl)));
  const asr = transit + offsetFor(asrAngle);

  const nightSpan = params.jafariMidnight
    ? fixHour(fajr + 24 - sunset)
    : fixHour(sunrise + 24 - sunset);
  const midnight = fixHour(sunset + nightSpan / 2);

  return {
    imsak: fajr - 10 / 60,
    fajr,
    sunrise,
    dhuhr: transit,
    asr,
    sunset,
    maghrib,
    isha,
    midnight,
  };
}

export function formatHour(h: number): string {
  if (!Number.isFinite(h)) return "—";
  let total = Math.round(fixHour(h) * 60);
  total = total % (24 * 60);
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
