"use client";

import { CalendarId, daysInGregorianMonth, monthGrid, monthNamesFor, toFa } from "@/lib/calendar";

export interface DateValue {
  cal: CalendarId;
  y: number;
  m: number;
  d: number;
}

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
      </div>
    </div>
  );
}
