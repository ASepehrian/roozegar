// Open-Meteo requires no API key and has a generous free tier, which matters
// here since this project has no server-side secrets/env vars by design.

export interface WeatherNow {
  tempC: number;
  feelsLikeC: number;
  code: number;
  isDay: boolean;
  minC: number;
  maxC: number;
}

const WMO_FA: Record<number, string> = {
  0: "آسمان صاف",
  1: "عمدتاً صاف",
  2: "کمی ابری",
  3: "ابری",
  45: "مه",
  48: "مه یخ‌زده",
  51: "نم‌نم باران",
  53: "باران ملایم",
  55: "باران",
  56: "باران یخ‌زده",
  57: "باران یخ‌زدهٔ شدید",
  61: "باران کم",
  63: "باران",
  65: "باران شدید",
  66: "باران یخ‌زده",
  67: "باران یخ‌زدهٔ شدید",
  71: "برف کم",
  73: "برف",
  75: "برف شدید",
  77: "دانه‌های برف",
  80: "رگبار کم",
  81: "رگبار",
  82: "رگبار شدید",
  85: "رگبار برف",
  86: "رگبار برف شدید",
  95: "رعد و برق",
  96: "رعد و برق با تگرگ",
  99: "رعد و برق با تگرگ شدید",
};

export function weatherDescription(code: number): string {
  return WMO_FA[code] ?? "نامشخص";
}

export function weatherEmoji(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if (code === 1 || code === 2) return isDay ? "🌤️" : "☁️";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌦️";
  if (code >= 85 && code <= 86) return "🌨️";
  if (code >= 95) return "⛈️";
  return "🌡️";
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherNow | null> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,weather_code,is_day` +
      `&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      tempC: Math.round(data.current.temperature_2m),
      feelsLikeC: Math.round(data.current.apparent_temperature),
      code: data.current.weather_code,
      isDay: data.current.is_day === 1,
      minC: Math.round(data.daily.temperature_2m_min[0]),
      maxC: Math.round(data.daily.temperature_2m_max[0]),
    };
  } catch {
    return null;
  }
}
