"use client";

import { useMemo } from "react";
import { CITIES, cityById } from "@/lib/cities";
import { toFa } from "@/lib/calendar";
import { METHOD_LABELS, PRAYER_LABELS, PrayerMethod, PrayerTimes, formatHour, prayerTimes } from "@/lib/prayer";

const ORDER: (keyof PrayerTimes)[] = [
  "imsak",
  "fajr",
  "sunrise",
  "dhuhr",
  "asr",
  "sunset",
  "maghrib",
  "isha",
  "midnight",
];

export default function PrayerTimesCard({
  anchor,
  cityId,
  method,
  onCityChange,
  onMethodChange,
}: {
  anchor: Date;
  cityId: string;
  method: PrayerMethod;
  onCityChange: (id: string) => void;
  onMethodChange: (m: PrayerMethod) => void;
}) {
  const city = cityById(cityId);
  const times = useMemo(() => prayerTimes(anchor, city, method), [anchor, city, method]);

  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">اوقات شرعی</span>
        <div className="head-controls">
          <select aria-label="شهر" value={cityId} onChange={(e) => onCityChange(e.target.value)}>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <label className="switch">
            <input
              type="checkbox"
              checked={method === "tehran"}
              onChange={(e) => onMethodChange(e.target.checked ? "tehran" : "mwl")}
            />
            <span>روش تهران</span>
          </label>
        </div>
      </div>
      <div className="prayer-grid">
        {ORDER.map((key) => (
          <div className="prayer-cell" key={key}>
            <div className="lbl">{PRAYER_LABELS[key]}</div>
            <div className="val">{toFa(formatHour(times[key]))}</div>
          </div>
        ))}
      </div>
      <div className="muted small">روش محاسبه: {METHOD_LABELS[method]} · به وقت ایران</div>
    </div>
  );
}
