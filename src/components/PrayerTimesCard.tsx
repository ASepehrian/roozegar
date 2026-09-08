"use client";

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
    </div>
  );
}
