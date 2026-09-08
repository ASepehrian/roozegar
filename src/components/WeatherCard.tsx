"use client";

import { useEffect, useState } from "react";
import { IRAN_CITIES } from "@/lib/prayerTimes";
import { WeatherNow, fetchWeather, weatherDescription, weatherEmoji } from "@/lib/weather";
import { toFa } from "@/lib/calendar";

export default function WeatherCard() {
  const [cityId, setCityId] = useState("tehran");
  const [weather, setWeather] = useState<WeatherNow | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("roozegar-weather-city");
      if (saved) setCityId(saved);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("roozegar-weather-city", cityId);
    } catch {
      // ignore
    }
    const city = IRAN_CITIES.find((c) => c.id === cityId) ?? IRAN_CITIES[0];
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    fetchWeather(city.lat, city.lon).then((w) => {
      if (cancelled) return;
      setLoading(false);
      if (!w) setFailed(true);
      else setWeather(w);
    });
    return () => {
      cancelled = true;
    };
  }, [cityId]);

  return (
    <div className="card weather-card">
      <div className="mini-tools-row">
        <select value={cityId} onChange={(e) => setCityId(e.target.value)} aria-label="شهر">
          {IRAN_CITIES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      {loading && <div className="weather-status">در حال دریافت آب‌وهوا…</div>}
      {failed && <div className="weather-status">دریافت آب‌وهوا ممکن نشد.</div>}
      {weather && !loading && (
        <div className="weather-body">
          <div className="weather-emoji">{weatherEmoji(weather.code, weather.isDay)}</div>
          <div>
            <div className="weather-temp">{toFa(weather.tempC)}°</div>
            <div className="weather-desc">{weatherDescription(weather.code)}</div>
            <div className="weather-range">
              احساس واقعی {toFa(weather.feelsLikeC)}° · بیشینه {toFa(weather.maxC)}° · کمینه {toFa(weather.minC)}°
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
