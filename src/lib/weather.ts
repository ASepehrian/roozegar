// Source: roozegar weather card
// Why: Open-Meteo needs no API key and no account, which keeps the "no keys,
//      no tracking" promise of the project; the request is made from the
//      browser so the server stays stateless.

import { City } from "./cities";

export type WeatherIcon = "sun" | "cloud-sun" | "cloud" | "rain" | "snow" | "storm" | "fog";

export interface WeatherNow {
  tempC: number;
  feelsC: number;
  humidity: number;
  windKmh: number;
  isDay: boolean;
  maxC: number;
  minC: number;
  code: number;
}

interface OpenMeteoResponse {
  current?: { temperature_2m?: number; apparent_temperature?: number; relative_humidity_2m?: number; wind_speed_10m?: number; is_day?: number; weather_code?: number };
  daily?: { temperature_2m_max?: number[]; temperature_2m_min?: number[] };
}

const WMO: Record<number, { text: string; icon: WeatherIcon }> = {
  0: { text: "آفتابی", icon: "sun" }, 1: { text: "کمی ابری", icon: "cloud-sun" }, 2: { text: "نیمه‌ابری", icon: "cloud-sun" }, 3: { text: "ابری", icon: "cloud" }, 45: { text: "مه", icon: "fog" }, 48: { text: "مه یخ‌زده", icon: "fog" },
  51: { text: "نم‌نم باران", icon: "rain" }, 53: { text: "نم‌نم باران", icon: "rain" }, 55: { text: "نم‌نم باران شدید", icon: "rain" }, 56: { text: "باران یخ‌زده", icon: "rain" }, 57: { text: "باران یخ‌زده", icon: "rain" }, 61: { text: "باران سبک", icon: "rain" }, 63: { text: "باران", icon: "rain" }, 65: { text: "باران شدید", icon: "rain" }, 66: { text: "باران یخ‌زده", icon: "rain" }, 67: { text: "باران یخ‌زدهٔ شدید", icon: "rain" },
  71: { text: "برف سبک", icon: "snow" }, 73: { text: "برف", icon: "snow" }, 75: { text: "برف سنگین", icon: "snow" }, 77: { text: "دانهٔ برف", icon: "snow" }, 80: { text: "رگبار پراکنده", icon: "rain" }, 81: { text: "رگبار", icon: "rain" }, 82: { text: "رگبار شدید", icon: "rain" }, 85: { text: "بارش برف", icon: "snow" }, 86: { text: "بارش سنگین برف", icon: "snow" }, 95: { text: "رعد و برق", icon: "storm" }, 96: { text: "رعد و برق با تگرگ", icon: "storm" }, 99: { text: "رعد و برق شدید با تگرگ", icon: "storm" },
};

export function describeWeather(code: number): { text: string; icon: WeatherIcon } { return WMO[code] ?? { text: "نامشخص", icon: "cloud" }; }

export async function fetchWeather(city: City, signal?: AbortSignal): Promise<WeatherNow> {
  const url = "https://api.open-meteo.com/v1/forecast" + `?latitude=${city.lat}&longitude=${city.lng}` + "&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,is_day,weather_code" + "&daily=temperature_2m_max,temperature_2m_min" + "&timezone=Asia%2FTehran&forecast_days=1";
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`weather request failed: ${res.status}`);
  const data: OpenMeteoResponse = await res.json();
  const c = data.current;
  if (!c || typeof c.temperature_2m !== "number") throw new Error("weather response missing current block");
  return { tempC: c.temperature_2m, feelsC: c.apparent_temperature ?? c.temperature_2m, humidity: c.relative_humidity_2m ?? 0, windKmh: c.wind_speed_10m ?? 0, isDay: c.is_day !== 0, maxC: data.daily?.temperature_2m_max?.[0] ?? c.temperature_2m, minC: data.daily?.temperature_2m_min?.[0] ?? c.temperature_2m, code: c.weather_code ?? 3 };
}
