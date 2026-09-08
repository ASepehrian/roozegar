// Occasion data is necessarily a curated subset, not an exhaustive official
// almanac — good enough for a personal/small-audience calendar, not a legal
// source of truth for public holidays.
//
// Two buckets, matching the two toggle states in the UI:
//   "cultural" — national & cultural occasions, shown by default
//   "religious" — religious & official/government occasions, behind a toggle
//
// Religious occasions are dated on the Hijri (lunar) calendar and are
// resolved against the Gregorian date at render time using the same
// Intl "islamic-civil" calendar already used elsewhere in the app.

import { calOf, calToGregorian } from "./calendar";

export type OccasionBucket = "cultural" | "religious";

export interface Occasion {
  title: string;
  bucket: OccasionBucket;
  holiday?: boolean; // "تعطیل رسمی"
}

interface FixedOccasion extends Occasion {
  month: number;
  day: number;
}

// ---- Persian solar calendar, fixed month/day ----
export const SOLAR_OCCASIONS: FixedOccasion[] = [
  { month: 1, day: 1, title: "نوروز", bucket: "cultural", holiday: true },
  { month: 1, day: 2, title: "نوروز", bucket: "cultural", holiday: true },
  { month: 1, day: 3, title: "نوروز", bucket: "cultural", holiday: true },
  { month: 1, day: 4, title: "نوروز", bucket: "cultural", holiday: true },
  { month: 1, day: 12, title: "روز جمهوری اسلامی", bucket: "religious", holiday: false },
  { month: 1, day: 13, title: "سیزده‌به‌در", bucket: "cultural", holiday: true },
  { month: 2, day: 1, title: "بزرگداشت سعدی", bucket: "cultural" },
  { month: 2, day: 11, title: "روز جهانی کارگر", bucket: "cultural" },
  { month: 2, day: 25, title: "بزرگداشت فردوسی", bucket: "cultural" },
  { month: 3, day: 14, title: "رحلت امام خمینی", bucket: "religious", holiday: true },
  { month: 3, day: 15, title: "قیام پانزده خرداد", bucket: "religious", holiday: true },
  { month: 6, day: 31, title: "آغاز پاییز", bucket: "cultural" },
  { month: 7, day: 17, title: "بزرگداشت مولانا", bucket: "cultural" },
  { month: 7, day: 20, title: "بزرگداشت حافظ", bucket: "cultural" },
  { month: 8, day: 13, title: "روز دانش‌آموز", bucket: "religious" },
  { month: 9, day: 16, title: "روز دانشجو", bucket: "religious" },
  { month: 9, day: 30, title: "شب یلدا", bucket: "cultural" },
  { month: 11, day: 12, title: "بازگشت امام خمینی به ایران", bucket: "religious" },
  { month: 11, day: 22, title: "پیروزی انقلاب اسلامی", bucket: "religious", holiday: true },
  { month: 12, day: 29, title: "روز ملی‌شدن صنعت نفت", bucket: "religious" },
];

// ---- Hijri (lunar) calendar, fixed month/day, resolved per-year ----
const HIJRI_OCCASIONS: FixedOccasion[] = [
  { month: 1, day: 9, title: "تاسوعای حسینی", bucket: "religious", holiday: true },
  { month: 1, day: 10, title: "عاشورای حسینی", bucket: "religious", holiday: true },
  { month: 2, day: 20, title: "اربعین حسینی", bucket: "religious", holiday: true },
  { month: 2, day: 28, title: "رحلت پیامبر اکرم و شهادت امام حسن مجتبی", bucket: "religious", holiday: true },
  { month: 2, day: 30, title: "شهادت امام رضا", bucket: "religious", holiday: true },
  { month: 3, day: 8, title: "شهادت امام حسن عسکری", bucket: "religious", holiday: true },
  { month: 3, day: 17, title: "میلاد پیامبر اکرم", bucket: "religious", holiday: true },
  { month: 7, day: 13, title: "ولادت امام علی", bucket: "religious" },
  { month: 7, day: 27, title: "مبعث پیامبر اکرم", bucket: "religious", holiday: true },
  { month: 8, day: 15, title: "نیمهٔ شعبان", bucket: "religious", holiday: true },
  { month: 9, day: 1, title: "آغاز ماه رمضان", bucket: "religious" },
  { month: 9, day: 19, title: "ضربت‌خوردن امام علی", bucket: "religious" },
  { month: 9, day: 21, title: "شهادت امام علی", bucket: "religious", holiday: true },
  { month: 9, day: 23, title: "شب قدر", bucket: "religious" },
  { month: 10, day: 1, title: "عید فطر", bucket: "religious", holiday: true },
  { month: 10, day: 2, title: "عید فطر", bucket: "religious", holiday: true },
  { month: 12, day: 9, title: "عرفه", bucket: "religious" },
  { month: 12, day: 10, title: "عید قربان", bucket: "religious", holiday: true },
  { month: 12, day: 18, title: "عید غدیر خم", bucket: "religious", holiday: true },
];

export function occasionsForSolarDate(month: number, day: number): Occasion[] {
  return SOLAR_OCCASIONS.filter((o) => o.month === month && o.day === day);
}

export function occasionsForHijriDate(month: number, day: number): Occasion[] {
  return HIJRI_OCCASIONS.filter((o) => o.month === month && o.day === day);
}

/** All occasions (solar + resolved hijri + Chaharshanbe Suri) landing on a given Gregorian day. */
export function occasionsForGregorianDate(gDate: Date): Occasion[] {
  const p = calOf(gDate, "persian");
  const h = calOf(gDate, "islamic-civil");
  const result = [...occasionsForSolarDate(p.m, p.d), ...occasionsForHijriDate(h.m, h.d)];
  const cs = chaharshanbeSuriGregorian(p.m === 12 ? p.y : p.y - 1);
  if (cs && sameDay(cs, gDate)) {
    result.push({ title: "چهارشنبه‌سوری", bucket: "cultural", holiday: false });
  }
  return result;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

/**
 * Chaharshanbe Suri falls on the eve of the last Wednesday before Nowruz —
 * computed here rather than stored as a fixed date, since its solar-calendar
 * date shifts from year to year. `persianYearOfEsfand` is the year whose
 * Esfand (12th month) precedes the Nowruz in question.
 */
export function chaharshanbeSuriGregorian(persianYearOfEsfand: number): Date | null {
  try {
    const nowruz = calToGregorian("persian", persianYearOfEsfand + 1, 1, 1);
    const dow = nowruz.getUTCDay(); // 0=Sun..6=Sat
    let daysBack = (dow - 3 + 7) % 7; // distance back to Wednesday
    if (daysBack === 0) daysBack = 7;
    return new Date(nowruz.getTime() - daysBack * 86400000);
  } catch {
    return null;
  }
}
