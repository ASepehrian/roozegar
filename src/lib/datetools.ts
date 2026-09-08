// Source: roozegar date tools (فاصلهٔ دو تاریخ، محاسبهٔ سن)
// Why: both tools work on any of the three calendars by going through the
//      shared Gregorian day-number representation, then borrowing month
//      lengths from the requested calendar for the year/month/day breakdown.

import { CalendarId, YMD, calOf, calToGregorian, daysInGregorianMonth, monthGrid } from "./calendar";

export function dayNumber(date: Date): number {
  return Math.floor(date.getTime() / 86400000);
}

export function daysInMonthOf(calId: CalendarId, y: number, m: number): number {
  if (calId === "gregorian") return daysInGregorianMonth(y, m);
  return monthGrid(calId, y, m).daysInMonth;
}

export interface DateDiff {
  days: number;
  weeks: number;
  remainderDays: number;
  years: number;
  months: number;
  monthDays: number;
  future: boolean;
}

/** Signed-aware difference between two dates, broken down in `calId`. */
export function dateDiff(from: Date, to: Date, calId: CalendarId): DateDiff {
  const days = dayNumber(to) - dayNumber(from);
  const abs = Math.abs(days);
  const [early, late] = days >= 0 ? [from, to] : [to, from];
  const breakdown = calendarBreakdown(early, late, calId);
  return {
    days: abs,
    weeks: Math.floor(abs / 7),
    remainderDays: abs % 7,
    years: breakdown.years,
    months: breakdown.months,
    monthDays: breakdown.days,
    future: days > 0,
  };
}

/** Whole years / months / days from `early` to `late` in the given calendar. */
export function calendarBreakdown(
  early: Date,
  late: Date,
  calId: CalendarId
): { years: number; months: number; days: number } {
  const a: YMD = calOf(early, calId);
  const b: YMD = calOf(late, calId);
  let years = b.y - a.y;
  let months = b.m - a.m;
  let days = b.d - a.d;
  if (days < 0) {
    months -= 1;
    let pm = b.m - 1;
    let py = b.y;
    if (pm < 1) {
      pm = 12;
      py -= 1;
    }
    days += daysInMonthOf(calId, py, pm);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export interface AgeInfo {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthdayInDays: number;
  nextBirthdayAge: number;
}

/** Age at `today` for someone born on `birth`, counted in `calId`. */
export function ageOf(birth: Date, today: Date, calId: CalendarId): AgeInfo {
  const { years, months, days } = calendarBreakdown(birth, today, calId);
  const b = calOf(birth, calId);
  const t = calOf(today, calId);

  let nextYear = t.y;
  let nextDay = clampDay(calId, nextYear, b.m, b.d);
  let next = calToGregorian(calId, nextYear, b.m, nextDay);
  if (dayNumber(next) < dayNumber(today)) {
    nextYear += 1;
    nextDay = clampDay(calId, nextYear, b.m, b.d);
    next = calToGregorian(calId, nextYear, b.m, nextDay);
  }

  return {
    years,
    months,
    days,
    totalDays: dayNumber(today) - dayNumber(birth),
    nextBirthdayInDays: dayNumber(next) - dayNumber(today),
    nextBirthdayAge: nextYear - b.y,
  };
}

/** Keeps e.g. an Esfand 30 birthday valid in a 29-day Esfand. */
function clampDay(calId: CalendarId, y: number, m: number, d: number): number {
  return Math.min(d, daysInMonthOf(calId, y, m));
}
