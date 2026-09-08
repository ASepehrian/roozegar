"use client";

<<<<<<< HEAD
import { CalendarId, daysInGregorianMonth, monthGrid, monthNamesFor, toFa } from "@/lib/calendar";
=======
import { CalendarId, monthNamesFor, toFa } from "@/lib/calendar";
import { daysInMonthOf } from "@/lib/datetools";
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df

export interface DateValue {
  cal: CalendarId;
  y: number;
  m: number;
  d: number;
}

<<<<<<< HEAD
function maxDayFor(cal: CalendarId, y: number, m: number): number {
  if (cal === "gregorian") return daysInGregorianMonth(y, m);
  try {
    return monthGrid(cal, y, m, 12).daysInMonth;
  } catch {
    return 30;
  }
}

export default function DateFields({
  value,
  onChange,
  idPrefix,
  showCalendarSelect = true,
}: {
  value: DateValue;
  onChange: (v: DateValue) => void;
  idPrefix: string;
  showCalendarSelect?: boolean;
}) {
  const maxDay = maxDayFor(value.cal, value.y, value.m);
  const dayClamped = Math.min(value.d, maxDay);
  const months = monthNamesFor(value.cal);

  return (
    <div className="conv-row">
      {showCalendarSelect && (
        <div className="field">
          <label htmlFor={idPrefix + "-cal"}>تقویم</label>
          <select
            id={idPrefix + "-cal"}
            value={value.cal}
            onChange={(e) => onChange({ ...value, cal: e.target.value as CalendarId })}
          >
            <option value="persian">شمسی</option>
            <option value="gregorian">میلادی</option>
            <option value="islamic-civil">قمری</option>
          </select>
        </div>
      )}
      <div className="field">
        <label htmlFor={idPrefix + "-d"}>روز</label>
        <select
          id={idPrefix + "-d"}
          value={dayClamped}
          onChange={(e) => onChange({ ...value, d: parseInt(e.target.value, 10) })}
        >
          {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>{toFa(d)}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={idPrefix + "-m"}>ماه</label>
        <select
          id={idPrefix + "-m"}
          value={value.m}
          onChange={(e) => onChange({ ...value, m: parseInt(e.target.value, 10) })}
        >
          {months.map((name, idx) => (
            <option key={name} value={idx + 1}>{name}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={idPrefix + "-y"}>سال</label>
        <input
          id={idPrefix + "-y"}
          type="number"
          value={value.y}
          onChange={(e) => onChange({ ...value, y: parseInt(e.target.value, 10) || 0 })}
        />
=======
export const CALENDAR_LABELS: Record<CalendarId, string> = {
  persian: "شمسی",
  gregorian: "میلادی",
  "islamic-civil": "قمری",
};

/** Day / month / year selects for one date, with the day list clamped to the
 *  chosen month so invalid dates cannot be entered. */
export default function DateFields({
  idPrefix,
  value,
  onChange,
  showCalendar = false,
  label,
}: {
  idPrefix: string;
  value: DateValue;
  onChange: (v: DateValue) => void;
  showCalendar?: boolean;
  label?: string;
}) {
  const maxDay = safeDaysInMonth(value.cal, value.y, value.m);
  const months = monthNamesFor(value.cal);

  function update(patch: Partial<DateValue>) {
    const next = { ...value, ...patch };
    const cap = safeDaysInMonth(next.cal, next.y, next.m);
    if (next.d > cap) next.d = cap;
    onChange(next);
  }

  return (
    <div className="date-fields">
      {label && <div className="fields-label">{label}</div>}
      <div className="conv-row">
        {showCalendar && (
          <div className="field">
            <label htmlFor={`${idPrefix}-cal`}>تقویم</label>
            <select
              id={`${idPrefix}-cal`}
              value={value.cal}
              onChange={(e) => update({ cal: e.target.value as CalendarId })}
            >
              {(Object.keys(CALENDAR_LABELS) as CalendarId[]).map((c) => (
                <option key={c} value={c}>{CALENDAR_LABELS[c]}</option>
              ))}
            </select>
          </div>
        )}
        <div className="field">
          <label htmlFor={`${idPrefix}-day`}>روز</label>
          <select
            id={`${idPrefix}-day`}
            value={value.d}
            onChange={(e) => update({ d: parseInt(e.target.value, 10) })}
          >
            {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{toFa(d)}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${idPrefix}-month`}>ماه</label>
          <select
            id={`${idPrefix}-month`}
            value={value.m}
            onChange={(e) => update({ m: parseInt(e.target.value, 10) })}
          >
            {months.map((name, idx) => (
              <option key={name} value={idx + 1}>{name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${idPrefix}-year`}>سال</label>
          <input
            id={`${idPrefix}-year`}
            type="number"
            value={value.y}
            onChange={(e) => update({ y: parseInt(e.target.value, 10) || value.y })}
          />
        </div>
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

function safeDaysInMonth(cal: CalendarId, y: number, m: number): number {
  try {
    return daysInMonthOf(cal, y, m);
  } catch {
    return 30;
  }
}
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
