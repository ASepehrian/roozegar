"use client";

<<<<<<< HEAD
import { useState } from "react";

export type Theme = "light" | "dark" | "auto";
export type FontFamily = "vazirmatn" | "naskh" | "sans-arabic";
export type FontSize = "sm" | "md" | "lg";

export default function SettingsPanel({
  theme, setTheme,
  fontFamily, setFontFamily,
  fontSize, setFontSize,
}: {
  theme: Theme; setTheme: (t: Theme) => void;
  fontFamily: FontFamily; setFontFamily: (f: FontFamily) => void;
  fontSize: FontSize; setFontSize: (s: FontSize) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="settings-wrap">
      <button
        className="icon-btn"
        title="تنظیمات پوسته و قلم"
        aria-label="تنظیمات"
        onClick={() => setOpen((o) => !o)}
      >
        ⚙︎
      </button>
      {open && (
        <div className="settings-panel">
          <div className="settings-group">
            <div className="settings-label">پوسته</div>
            <div className="segmented">
              <button className={theme === "light" ? "seg active" : "seg"} onClick={() => setTheme("light")}>روشن</button>
              <button className={theme === "dark" ? "seg active" : "seg"} onClick={() => setTheme("dark")}>تیره</button>
              <button className={theme === "auto" ? "seg active" : "seg"} onClick={() => setTheme("auto")}>خودکار</button>
            </div>
          </div>
          <div className="settings-group">
            <div className="settings-label">قلم</div>
            <div className="segmented">
              <button className={fontFamily === "vazirmatn" ? "seg active" : "seg"} onClick={() => setFontFamily("vazirmatn")}>وزیرمتن</button>
              <button className={fontFamily === "naskh" ? "seg active" : "seg"} onClick={() => setFontFamily("naskh")}>نسخ</button>
              <button className={fontFamily === "sans-arabic" ? "seg active" : "seg"} onClick={() => setFontFamily("sans-arabic")}>ساده</button>
            </div>
          </div>
          <div className="settings-group">
            <div className="settings-label">اندازهٔ قلم</div>
            <div className="segmented">
              <button className={fontSize === "sm" ? "seg active" : "seg"} onClick={() => setFontSize("sm")}>کوچک</button>
              <button className={fontSize === "md" ? "seg active" : "seg"} onClick={() => setFontSize("md")}>متوسط</button>
              <button className={fontSize === "lg" ? "seg active" : "seg"} onClick={() => setFontSize("lg")}>بزرگ</button>
            </div>
          </div>
        </div>
      )}
=======
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
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
    </div>
  );
}
