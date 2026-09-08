"use client";

import {
  FONT_FAMILY_LABELS,
  FONT_SIZE_LABELS,
  FontFamily,
  FontSize,
  THEME_LABELS,
  ThemeMode,
} from "@/lib/settings";
import { CATEGORY_LABELS, OccasionCategory } from "@/lib/events";

export default function SettingsPanel({
  theme,
  fontSize,
  fontFamily,
  categories,
  onTheme,
  onFontSize,
  onFontFamily,
  onToggleCategory,
}: {
  theme: ThemeMode;
  fontSize: FontSize;
  fontFamily: FontFamily;
  categories: Set<OccasionCategory>;
  onTheme: (t: ThemeMode) => void;
  onFontSize: (s: FontSize) => void;
  onFontFamily: (f: FontFamily) => void;
  onToggleCategory: (c: OccasionCategory) => void;
}) {
  return (
    <div className="card settings">
      <div className="setting-row">
        <span className="setting-label">پوسته</span>
        <div className="seg">
          {(Object.keys(THEME_LABELS) as ThemeMode[]).map((t) => (
            <button
              key={t}
              className={theme === t ? "seg-btn active" : "seg-btn"}
              onClick={() => onTheme(t)}
              aria-pressed={theme === t}
            >
              {THEME_LABELS[t]}
            </button>
          ))}
        </div>
      </div>
      <div className="setting-row">
        <span className="setting-label">اندازهٔ قلم</span>
        <div className="seg">
          {(Object.keys(FONT_SIZE_LABELS) as FontSize[]).map((s) => (
            <button
              key={s}
              className={fontSize === s ? "seg-btn active" : "seg-btn"}
              onClick={() => onFontSize(s)}
              aria-pressed={fontSize === s}
            >
              {FONT_SIZE_LABELS[s]}
            </button>
          ))}
        </div>
      </div>
      <div className="setting-row">
        <span className="setting-label">قلم</span>
        <div className="seg">
          {(Object.keys(FONT_FAMILY_LABELS) as FontFamily[]).map((f) => (
            <button
              key={f}
              className={fontFamily === f ? "seg-btn active" : "seg-btn"}
              onClick={() => onFontFamily(f)}
              aria-pressed={fontFamily === f}
            >
              {FONT_FAMILY_LABELS[f]}
            </button>
          ))}
        </div>
      </div>
      <div className="setting-row">
        <span className="setting-label">مناسبت‌ها</span>
        <div className="seg">
          {(Object.keys(CATEGORY_LABELS) as OccasionCategory[]).map((c) => (
            <label key={c} className="switch">
              <input
                type="checkbox"
                checked={categories.has(c)}
                onChange={() => onToggleCategory(c)}
              />
              <span>{CATEGORY_LABELS[c]}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
