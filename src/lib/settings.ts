// Source: roozegar appearance settings
// Why: theme / font family / font size are applied as classes on <html> so the
//      inline pre-paint script in layout.tsx can restore them before React
//      hydrates, avoiding a flash of the default look.

export type ThemeMode = "auto" | "light" | "dark";
export type FontSize = "sm" | "md" | "lg";
export type FontFamily = "vazir" | "naskh" | "markazi";

export const THEME_LABELS: Record<ThemeMode, string> = {
  auto: "خودکار",
  light: "روشن",
  dark: "تیره",
};

export const FONT_SIZE_LABELS: Record<FontSize, string> = {
  sm: "کوچک",
  md: "متوسط",
  lg: "بزرگ",
};

export const FONT_FAMILY_LABELS: Record<FontFamily, string> = {
  vazir: "وزیرمتن",
  naskh: "نسخ",
  markazi: "مرکزی",
};

export const STORAGE_KEYS = {
  theme: "roozegar-theme",
  fontSize: "roozegar-font-size",
  fontFamily: "roozegar-font-family",
  categories: "roozegar-categories",
  prayerCity: "roozegar-prayer-city",
  prayerMethod: "roozegar-prayer-method",
  weatherCity: "roozegar-weather-city",
} as const;

export function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

export function store(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore storage failures (private browsing etc.)
  }
}

export function applyAppearance(theme: ThemeMode, size: FontSize, family: FontFamily): void {
  const root = document.documentElement;
  const dark = theme === "dark" || (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
  root.classList.remove("fs-sm", "fs-md", "fs-lg");
  root.classList.add(`fs-${size}`);
  root.classList.remove("font-vazir", "font-naskh", "font-markazi");
  root.classList.add(`font-${family}`);
}
