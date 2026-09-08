"use client";

import { useEffect, useMemo, useState } from "react";
import GirihDivider from "./GirihDivider";
import ZodiacBadge from "./ZodiacBadge";
import DateTools from "./DateTools";
import PrayerTimesCard from "./PrayerTimesCard";
import WeatherCard from "./WeatherCard";
import QuoteCard from "./QuoteCard";
import SettingsPanel, { FontFamily, FontSize, Theme } from "./SettingsPanel";
import {
  GREGORIAN_MONTHS,
  calOf,
  calToGregorian,
  dayOfPersianYear,
  daysUntilNextNowruz,
  monthGrid,
  monthNamesFor,
  tehranNow,
  toFa,
  weekdayOf,
} from "@/lib/calendar";
import { zodiacForPersianMonth } from "@/lib/zodiac";
import { Occasion, occasionsForGregorianDate } from "@/lib/occasions";
import { couplerOfTheDay } from "@/lib/quotes";

interface DayCellData {
  day: number;
  y: number;
  m: number;
  outside: boolean;
  isToday: boolean;
  gLabel: string | null;
  hLabel: string | null;
}

export default function CalendarApp() {
  const [tick, setTick] = useState(0);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [selected, setSelected] = useState<{ y: number; m: number; d: number } | null>(null);
  const [showReligious, setShowReligious] = useState(false);

  const [theme, setTheme] = useState<Theme>("auto");
  const [fontFamily, setFontFamily] = useState<FontFamily>("vazirmatn");
  const [fontSize, setFontSize] = useState<FontSize>("md");

  // live clock, ticking once a second — also naturally rolls the date over
  // at Tehran midnight since `now`/`todayPersian` below are re-derived each tick.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // ---- settings: load from localStorage once, then keep in sync ----
  useEffect(() => {
    try {
      const t = localStorage.getItem("roozegar-theme") as Theme | null;
      const f = localStorage.getItem("roozegar-font") as FontFamily | null;
      const s = localStorage.getItem("roozegar-size") as FontSize | null;
      if (t) setTheme(t);
      if (f) setFontFamily(f);
      if (s) setFontSize(s);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    function resolveDark() {
      if (theme === "auto") return window.matchMedia("(prefers-color-scheme: dark)").matches;
      return theme === "dark";
    }
    function apply() {
      document.documentElement.classList.toggle("dark", resolveDark());
    }
    apply();
    try {
      localStorage.setItem("roozegar-theme", theme);
    } catch {
      // ignore
    }
    if (theme !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-font", fontFamily);
    try {
      localStorage.setItem("roozegar-font", fontFamily);
    } catch {
      // ignore
    }
  }, [fontFamily]);

  useEffect(() => {
    document.documentElement.setAttribute("data-size", fontSize);
    try {
      localStorage.setItem("roozegar-size", fontSize);
    } catch {
      // ignore
    }
  }, [fontSize]);

  const now = useMemo(() => tehranNow(), [tick]);
  const todayPersian = useMemo(() => calOf(now.anchor, "persian"), [now]);
  const todayGregorian = useMemo(() => calOf(now.anchor, "gregorian"), [now]);
  const todayHijri = useMemo(() => calOf(now.anchor, "islamic-civil"), [now]);
  const weekday = useMemo(() => weekdayOf(now.anchor), [now]);
  const dayOfYear = useMemo(() => dayOfPersianYear(todayPersian), [todayPersian]);
  const nowruz = useMemo(
    () => daysUntilNextNowruz(now.anchor, todayPersian.y),
    [now, todayPersian]
  );
  const zodiac = useMemo(() => zodiacForPersianMonth(todayPersian.m), [todayPersian]);
  const todaysOccasions = useMemo(() => occasionsForGregorianDate(now.anchor), [now]);
  const couplet = useMemo(() => couplerOfTheDay(now.anchor), [now]);

  const viewYear = view?.y ?? todayPersian.y;
  const viewMonth = view?.m ?? todayPersian.m;

  useEffect(() => {
    if (!view) setView({ y: todayPersian.y, m: todayPersian.m });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayPersian.y, todayPersian.m]);

  const grid = useMemo(() => monthGrid("persian", viewYear, viewMonth), [viewYear, viewMonth]);

  const cells: DayCellData[] = useMemo(() => {
    const result: DayCellData[] = [];
    let pm = viewMonth - 1;
    let py = viewYear;
    if (pm < 1) {
      pm = 12;
      py = viewYear - 1;
    }
    const prevGrid = monthGrid("persian", py, pm);
    for (let i = 0; i < grid.startIndex; i++) {
      result.push({
        day: prevGrid.daysInMonth - grid.startIndex + 1 + i,
        y: py,
        m: pm,
        outside: true,
        isToday: false,
        gLabel: null,
        hLabel: null,
      });
    }
    for (let d = 1; d <= grid.daysInMonth; d++) {
      const gDate = new Date(grid.first.getTime() + (d - 1) * 86400000);
      const gInfo = { m: gDate.getUTCMonth() + 1, d: gDate.getUTCDate() };
      const hInfo = calOf(gDate, "islamic-civil");
      const isToday = viewYear === todayPersian.y && viewMonth === todayPersian.m && d === todayPersian.d;
      result.push({
        day: d,
        y: viewYear,
        m: viewMonth,
        outside: false,
        isToday,
        gLabel: `${gInfo.d} ${GREGORIAN_MONTHS[gInfo.m - 1].slice(0, 3)}`,
        hLabel: `${toFa(hInfo.d)}`,
      });
    }
    const trailCount = (7 - (result.length % 7)) % 7;
    let nm = viewMonth + 1;
    let ny = viewYear;
    if (nm > 12) {
      nm = 1;
      ny = viewYear + 1;
    }
    for (let t = 1; t <= trailCount; t++) {
      result.push({ day: t, y: ny, m: nm, outside: true, isToday: false, gLabel: null, hLabel: null });
    }
    return result;
  }, [grid, viewYear, viewMonth, todayPersian]);

  function goPrevMonth() {
    let m = viewMonth - 1;
    let y = viewYear;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    setView({ y, m });
  }
  function goNextMonth() {
    let m = viewMonth + 1;
    let y = viewYear;
    if (m > 12) {
      m = 1;
      y += 1;
    }
    setView({ y, m });
  }
  function selectCell(cell: DayCellData) {
    if (cell.outside) {
      setView({ y: cell.y, m: cell.m });
      return;
    }
    setSelected({ y: cell.y, m: cell.m, d: cell.day });
  }

  const selectedInfo = useMemo(() => {
    if (!selected) return null;
    const gdate = calToGregorian("persian", selected.y, selected.m, selected.d);
    const g = calOf(gdate, "gregorian");
    const h = calOf(gdate, "islamic-civil");
    const dow = weekdayOf(gdate);
    return { dow, g, h };
  }, [selected]);

  const visibleOccasions: Occasion[] = todaysOccasions.filter(
    (o) => o.bucket === "cultural" || showReligious
  );

  return (
    <div className="app">
      <header>
        <div className="brand">
          <span className="brand-mark">روزگار</span>
          <span className="brand-sub">تقویم فارسی</span>
        </div>
        <div className="header-actions">
          <SettingsPanel
            theme={theme}
            setTheme={setTheme}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        </div>
      </header>

      <GirihDivider />

      <section className="hero">
        <div className="hero-weekday">{weekday}</div>
        <div className="hero-date">
          {toFa(todayPersian.d)} {monthNamesFor("persian")[todayPersian.m - 1]} {toFa(todayPersian.y)}
        </div>
        <div className="hero-row">
          <span className="hero-zodiac">
            <ZodiacBadge sign={zodiac} size={22} />
            <span className="zname">{zodiac.name}</span>
          </span>
          <span>
            ساعت تهران <span className="clock">{now.hh}:{now.mm}:{now.ss}</span>
          </span>
          <span>
            میلادی: <strong>{todayGregorian.d} {GREGORIAN_MONTHS[todayGregorian.m - 1]} {todayGregorian.y}</strong>
          </span>
          <span>
            قمری: <strong>{toFa(todayHijri.d)} {monthNamesFor("islamic-civil")[todayHijri.m - 1]} {toFa(todayHijri.y)}</strong>
          </span>
        </div>
        <div className="hero-extra">
          <div className="chip">روز {toFa(dayOfYear)} سال {toFa(todayPersian.y)}</div>
          <div className="chip gold">
            {nowruz.days <= 0 ? "نوروز مبارک" : `${toFa(nowruz.days)} روز تا نوروز ${toFa(nowruz.year)}`}
          </div>
        </div>

        <div className="occasions">
          {visibleOccasions.length > 0 ? (
            visibleOccasions.map((o, i) => (
              <div key={i} className={"occasion-row" + (o.holiday ? " holiday" : "")}>
                <span className="occasion-dot" />
                <span>{o.title}{o.holiday ? " (تعطیل)" : ""}</span>
              </div>
            ))
          ) : (
            <div className="occasions-empty">مناسبت ثبت‌شده‌ای برای امروز نیست.</div>
          )}
          <button className="occasions-toggle" onClick={() => setShowReligious((s) => !s)}>
            {showReligious ? "پنهان‌کردن مناسبت‌های مذهبی و دولتی" : "نمایش مناسبت‌های مذهبی و دولتی"}
          </button>
        </div>
      </section>

      <div className="section-title">تقویم ماهانه</div>
      <div className="cal-nav">
        <button onClick={goPrevMonth} aria-label="ماه قبل">قبلی ›</button>
        <div className="cal-title">
          {monthNamesFor("persian")[viewMonth - 1]} <span className="yr">{toFa(viewYear)}</span>
        </div>
        <button onClick={goNextMonth} aria-label="ماه بعد">‹ بعدی</button>
      </div>
      <div className="weekday-row">
        <div>ش</div><div>ی</div><div>د</div><div>س</div><div>چ</div><div>پ</div><div>ج</div>
      </div>
      <div className="day-grid">
        {cells.map((cell, i) => (
          <div
            key={i}
            className={[
              "day-cell",
              cell.outside ? "outside" : "",
              cell.isToday ? "today" : "",
              selected && !cell.outside && selected.y === cell.y && selected.m === cell.m && selected.d === cell.day
                ? "selected"
                : "",
            ].join(" ").trim()}
            role="button"
            tabIndex={0}
            onClick={() => selectCell(cell)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectCell(cell);
              }
            }}
          >
            <div>{toFa(cell.day)}</div>
            {!cell.outside && cell.gLabel && (
              <div className="g">
                <span>{cell.gLabel}</span>
                {cell.hLabel && <span className="hij"> · {cell.hLabel}ق</span>}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="selected-info">
        {selected && selectedInfo ? (
          <>
            {selectedInfo.dow}، <strong>{toFa(selected.d)} {monthNamesFor("persian")[selected.m - 1]} {toFa(selected.y)}</strong>
            {" — میلادی: "}
            <strong>{selectedInfo.g.d} {GREGORIAN_MONTHS[selectedInfo.g.m - 1]} {selectedInfo.g.y}</strong>
            {" — قمری: "}
            <strong>{toFa(selectedInfo.h.d)} {monthNamesFor("islamic-civil")[selectedInfo.h.m - 1]} {toFa(selectedInfo.h.y)}</strong>
          </>
        ) : (
          "روی یک روز کلیک کن تا جزئیاتش را ببینی."
        )}
      </div>

      <div className="section-title">ابزارهای تاریخ</div>
      <DateTools />

      <div className="section-title">اوقات شرعی</div>
      <PrayerTimesCard />

      <div className="section-title">آب‌وهوا و شعر روز</div>
      <div className="widgets-row">
        <WeatherCard />
        <QuoteCard couplet={couplet} />
      </div>

      <footer>روزگار · یک تقویم ساده و بدون ردیابی، برای دیدن روزها</footer>
    </div>
  );
}
