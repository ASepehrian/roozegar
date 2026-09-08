"use client";

<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
import { IRAN_CITIES, PrayerMethod, computePrayerTimes } from "@/lib/prayerTimes";
import { calOf, tehranNow, toFa } from "@/lib/calendar";

const LABELS: [key: keyof ReturnType<typeof computePrayerTimes>, label: string][] = [
  ["fajr", "اذان صبح"],
  ["sunrise", "طلوع آفتاب"],
  ["dhuhr", "اذان ظهر"],
  ["asr", "اذان عصر"],
  ["maghrib", "اذان مغرب"],
  ["isha", "اذان عشاء"],
];

export default function PrayerTimesCard() {
  const [cityId, setCityId] = useState("tehran");
  const [method, setMethod] = useState<PrayerMethod>("tehran");

  useEffect(() => {
    try {
      const savedCity = localStorage.getItem("roozegar-prayer-city");
      const savedMethod = localStorage.getItem("roozegar-prayer-method");
      if (savedCity) setCityId(savedCity);
      if (savedMethod === "tehran" || savedMethod === "mwl") setMethod(savedMethod);
    } catch {
      // ignore
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("roozegar-prayer-city", cityId);
      localStorage.setItem("roozegar-prayer-method", method);
    } catch {
      // ignore
    }
  }, [cityId, method]);

  const city = IRAN_CITIES.find((c) => c.id === cityId) ?? IRAN_CITIES[0];

  const times = useMemo(() => {
    const now = tehranNow();
    const g = calOf(now.anchor, "gregorian");
    return computePrayerTimes(g.y, g.m, g.d, city, method);
  }, [city, method]);

  return (
    <div className="card">
      <div className="mini-tools-row">
        <select value={cityId} onChange={(e) => setCityId(e.target.value)} aria-label="شهر">
          {IRAN_CITIES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={method} onChange={(e) => setMethod(e.target.value as PrayerMethod)} aria-label="روش محاسبه">
          <option value="tehran">روش تهران</option>
          <option value="mwl">روش جهانی (MWL)</option>
        </select>
      </div>
      <div className="prayer-grid">
        {LABELS.map(([key, label]) => (
          <div className="prayer-cell" key={key}>
            <div className="prayer-label">{label}</div>
            <div className="prayer-time">{toFa(times[key])}</div>
          </div>
        ))}
      </div>
=======
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
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
    </div>
  );
}
