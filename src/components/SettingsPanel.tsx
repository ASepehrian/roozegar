"use client";

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
    </div>
  );
}
