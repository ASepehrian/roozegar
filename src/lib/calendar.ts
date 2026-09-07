// Source: roozegar calendar core
// Why: Jalali/Gregorian/Hijri conversion backed by the browser/runtime Intl
//      calendar implementations (calendar: persian, islamic-civil), verified
//      by round-trip tests rather than hand-rolled leap-year arithmetic.
// Env-Deps: relies on Intl.DateTimeFormat supporting the "persian" and
//      "islamic-civil" calendar extensions (Node >=13 full-icu, all evergreen
//      browsers).

export type CalendarId = "persian" | "gregorian" | "islamic-civil";

export const PERSIAN_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

export const HIJRI_MONTHS = [
  "محرم", "صفر", "ربیع‌الاول", "ربیع‌الثانی", "جمادی‌الاول", "جمادی‌الثانی",
  "رجب", "شعبان", "رمضان", "شوال", "ذی‌القعده", "ذی‌الحجه",
];

export const GREGORIAN_MONTHS = [
  "ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن",
  "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر",
];

export const WEEKDAYS = [
  "شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه",
];

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toFa(n: number | string): string {
  return String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export interface YMD {
  y: number;
  m: number;
  d: number;
}

// Search bounds: Jalali 1200-1600 / Hijri ~1300-1500 both live comfortably
// inside this Gregorian range, so binary search always converges.
const LOW_DAY = Date.UTC(1700, 0, 1) / 86400000;
const HIGH_DAY = Date.UTC(2300, 0, 1) / 86400000;

export function calOf(dateUTC: Date, calId: CalendarId): YMD {
  if (calId === "gregorian") {
    return {
      y: dateUTC.getUTCFullYear(),
      m: dateUTC.getUTCMonth() + 1,
      d: dateUTC.getUTCDate(),
    };
  }
  const parts = new Intl.DateTimeFormat(`en-u-ca-${calId}`, {
    timeZone: "UTC",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(dateUTC);
  const o: Partial<YMD> = {};
  for (const p of parts) {
    if (p.type === "year") o.y = parseInt(p.value, 10);
    if (p.type === "month") o.m = parseInt(p.value, 10);
    if (p.type === "day") o.d = parseInt(p.value, 10);
  }
  return o as YMD;
}

function cmpYMD(a: YMD, b: YMD): number {
  if (a.y !== b.y) return a.y - b.y;
  if (a.m !== b.m) return a.m - b.m;
  return a.d - b.d;
}

export function calToGregorian(calId: CalendarId, y: number, m: number, d: number): Date {
  if (calId === "gregorian") {
    return new Date(Date.UTC(y, m - 1, d));
  }
  let low = LOW_DAY;
  let high = HIGH_DAY;
  const target: YMD = { y, m, d };
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const dt = new Date(mid * 86400000);
    const c = calOf(dt, calId);
    if (cmpYMD(c, target) < 0) low = mid + 1;
    else high = mid;
  }
  return new Date(low * 86400000);
}

export interface MonthGrid {
  first: Date;
  daysInMonth: number;
  startIndex: number; // 0 = Saturday .. 6 = Friday
}

export function monthGrid(calId: CalendarId, y: number, m: number, monthsInYear = 12): MonthGrid {
  const first = calToGregorian(calId, y, m, 1);
  let ny = y;
  let nm = m + 1;
  if (nm > monthsInYear) {
    nm = 1;
    ny = y + 1;
  }
  const next = calToGregorian(calId, ny, nm, 1);
  const daysInMonth = Math.round((next.getTime() - first.getTime()) / 86400000);
  const dow = first.getUTCDay(); // 0 = Sun .. 6 = Sat
  const startIndex = (dow + 1) % 7; // 0 = Sat .. 6 = Fri
  return { first, daysInMonth, startIndex };
}

export function daysInGregorianMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export interface TehranNow {
  anchor: Date; // UTC date object representing the Tehran calendar day, noon UTC
  hh: string;
  mm: string;
  ss: string;
}

export function tehranNow(): TehranNow {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const o: Record<string, string> = {};
  for (const p of parts) o[p.type] = p.value;
  const anchor = new Date(
    Date.UTC(parseInt(o.year, 10), parseInt(o.month, 10) - 1, parseInt(o.day, 10), 12, 0, 0)
  );
  return { anchor, hh: o.hour, mm: o.minute, ss: o.second };
}

export function monthNamesFor(calId: CalendarId): string[] {
  if (calId === "persian") return PERSIAN_MONTHS;
  if (calId === "islamic-civil") return HIJRI_MONTHS;
  return GREGORIAN_MONTHS;
}

export function weekdayOf(dateUTC: Date): string {
  return WEEKDAYS[(dateUTC.getUTCDay() + 1) % 7];
}

export function dayOfPersianYear(p: YMD): number {
  let doy = p.d;
  for (let mm = 1; mm < p.m; mm++) {
    doy += monthGrid("persian", p.y, mm).daysInMonth;
  }
  return doy;
}

export function daysUntilNextNowruz(anchor: Date, currentPersianYear: number): { days: number; year: number } {
  const nextYear = currentPersianYear + 1;
  const nowruz = calToGregorian("persian", nextYear, 1, 1);
  const todayDay = Math.floor(anchor.getTime() / 86400000);
  const nowruzDay = Math.floor(nowruz.getTime() / 86400000);
  return { days: nowruzDay - todayDay, year: nextYear };
}
