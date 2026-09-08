"use client";

import { CalendarId, monthNamesFor, toFa } from "@/lib/calendar";
import { daysInMonthOf } from "@/lib/datetools";

export interface DateValue {
  cal: CalendarId;
  y: number;
  m: number;
  d: number;
}

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
      </div>
    </div>
  );
}

function safeDaysInMonth(cal: CalendarId, y: number, m: number): number {
  try {
    return daysInMonthOf(cal, y, m);
  } catch {
    return 30;
  }
}
