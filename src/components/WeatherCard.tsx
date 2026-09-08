"use client";

import { useEffect, useState } from "react";
import { CITIES, cityById } from "@/lib/cities";
import { toFa } from "@/lib/calendar";
import { WeatherIcon, WeatherNow, describeWeather, fetchWeather } from "@/lib/weather";

const ICON_PATHS: Record<WeatherIcon, string> = {
  sun: "M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6L4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z",
  "cloud-sun": "M8 6.5A3.5 3.5 0 1 1 11.5 10M8 3V1.6M3.6 6.5H2.2M4.9 3.4L3.9 2.4M12.4 3.4l1-1M7 20h9a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.6 1.4A3.4 3.4 0 0 0 7 20z",
  cloud: "M7 19h10a4 4 0 0 0 .4-8 5.6 5.6 0 0 0-10.8 1.3A3.5 3.5 0 0 0 7 19z",
  rain: "M7 15h10a4 4 0 0 0 .4-8 5.6 5.6 0 0 0-10.8 1.3A3.5 3.5 0 0 0 7 15zM8 18l-1 3M13 18l-1 3M18 18l-1 3",
  snow: "M7 15h10a4 4 0 0 0 .4-8 5.6 5.6 0 0 0-10.8 1.3A3.5 3.5 0 0 0 7 15zM8 19h.01M12 21h.01M16 19h.01",
  storm: "M7 15h10a4 4 0 0 0 .4-8 5.6 5.6 0 0 0-10.8 1.3A3.5 3.5 0 0 0 7 15zM13 17l-3 4h4l-2 3",
  fog: "M5 9h14M4 13h16M6 17h12M8 21h9",
};

export default function WeatherCard({
  cityId,
  onCityChange,
}: {
  cityId: string;
  onCityChange: (id: string) => void;
}) {
  const [data, setData] = useState<WeatherNow | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const city = cityById(cityId);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetchWeather(city, controller.signal)
      .then((w) => {
        setData(w);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, [city]);

  const info = data ? describeWeather(data.code) : null;

  return (
    <div className="card weather">
      <div className="card-head">
        <span className="card-title">آب‌وهوای امروز</span>
        <select
          aria-label="شهر آب‌وهوا"
          value={cityId}
          onChange={(e) => onCityChange(e.target.value)}
        >
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      {loading && <div className="muted">در حال دریافت…</div>}
      {error && <div className="muted">دریافت آب‌وهوا ممکن نشد. اتصال اینترنت را بررسی کن.</div>}
      {data && info && (
        <>
          <div className="weather-main">
            <svg
              className="weather-icon"
              width="54"
              height="54"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={ICON_PATHS[info.icon]} />
            </svg>
            <div>
              <div className="weather-temp">{toFa(Math.round(data.tempC))}°</div>
              <div className="weather-desc">{info.text} · {city.name}</div>
            </div>
          </div>
          <div className="weather-meta">
            <span>بیشینه {toFa(Math.round(data.maxC))}°</span>
            <span>کمینه {toFa(Math.round(data.minC))}°</span>
            <span>احساس {toFa(Math.round(data.feelsC))}°</span>
            <span>رطوبت {toFa(Math.round(data.humidity))}٪</span>
            <span>باد {toFa(Math.round(data.windKmh))} کیلومتر/ساعت</span>
          </div>
        </>
      )}
    </div>
  );
}
