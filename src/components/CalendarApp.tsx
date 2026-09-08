"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import GirihDivider from "./GirihDivider";
<<<<<<< HEAD
import ZodiacBadge from "./ZodiacBadge";
import DateTools from "./DateTools";
import PrayerTimesCard from "./PrayerTimesCard";
import WeatherCard from "./WeatherCard";
import QuoteCard from "./QuoteCard";
import SettingsPanel, { FontFamily, FontSize, Theme } from "./SettingsPanel";
=======
import DateTools from "./DateTools";
import PoemCard from "./PoemCard";
import PrayerTimesCard from "./PrayerTimesCard";
import SettingsPanel from "./SettingsPanel";
import WeatherCard from "./WeatherCard";
import ZodiacBadge from "./ZodiacBadge";
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
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
<<<<<<< HEAD
import { zodiacForPersianMonth } from "@/lib/zodiac";
import { Occasion, occasionsForGregorianDate } from "@/lib/occasions";
import { couplerOfTheDay } from "@/lib/quotes";
=======
import { CATEGORY_LABELS, Occasion, OccasionCategory, isHolidayDay, occasionsOf } from "@/lib/events";
import { coupletOfDay } from "@/lib/poems";
import { DEFAULT_CITY_ID, CITIES } from "@/lib/cities";
import { PrayerMethod } from "@/lib/prayer";
import {
  FontFamily,
  FontSize,
  STORAGE_KEYS,
  ThemeMode,
  applyAppearance,
  readStored,
  store,
} from "@/lib/settings";
import { zodiacOfPersianMonth } from "@/lib/zodiac";
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df

interface DayCellData {
  day: number;
  y: number;
  m: number;
  outside: boolean;
  isToday: boolean;
  gLabel: string | null;
  hLabel: string | null;
<<<<<<< HEAD
=======
  holiday: boolean;
  occasions: Occasion[];
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
}

const ALL_CATEGORIES: OccasionCategory[] = ["national", "religious", "official"];
const CITY_IDS = CITIES.map((c) => c.id);

export default function CalendarApp() {
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [selected, setSelected] = useState<{ y: number; m: number; d: number } | null>(null);
<<<<<<< HEAD
  const [showReligious, setShowReligious] = useState(false);

  const [theme, setTheme] = useState<Theme>("auto");
  const [fontFamily, setFontFamily] = useState<FontFamily>("vazirmatn");
  const [fontSize, setFontSize] = useState<FontSize>("md");
=======
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [theme, setTheme] = useState<ThemeMode>("auto");
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [fontFamily, setFontFamily] = useState<FontFamily>("vazir");
  const [categories, setCategories] = useState<Set<OccasionCategory>>(new Set(["national"]));
  const [prayerCity, setPrayerCity] = useState(DEFAULT_CITY_ID);
  const [prayerMethod, setPrayerMethod] = useState<PrayerMethod>("tehran");
  const [weatherCity, setWeatherCity] = useState(DEFAULT_CITY_ID);
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df

  // live clock, ticking once a second — also naturally rolls the date over
  // at Tehran midnight since `now`/`todayPersian` below are re-derived each tick.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // ---- settings: load from localStorage once, then keep in sync ----
  useEffect(() => {
<<<<<<< HEAD
    try {
      const t = localStorage.getItem("roozegar-theme") as Theme | null;
      const f = localStorage.getItem("roozegar-font") as FontFamily | null;
      const s = localStorage.getItem("roozegar-size") as FontSize | null;
      if (t) setTheme(t);
      if (f) setFontFamily(f);
      if (s) setFontSize(s);
    } catch {
      // ignore
=======
    setMounted(true);
    setTheme(readStored(STORAGE_KEYS.theme, ["auto", "light", "dark"] as const, "auto"));
    setFontSize(readStored(STORAGE_KEYS.fontSize, ["sm", "md", "lg"] as const, "md"));
    setFontFamily(readStored(STORAGE_KEYS.fontFamily, ["vazir", "naskh", "markazi"] as const, "vazir"));
    setPrayerCity(readStored(STORAGE_KEYS.prayerCity, CITY_IDS, DEFAULT_CITY_ID));
    setWeatherCity(readStored(STORAGE_KEYS.weatherCity, CITY_IDS, DEFAULT_CITY_ID));
    setPrayerMethod(readStored(STORAGE_KEYS.prayerMethod, ["tehran", "mwl"] as const, "tehran"));
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.categories);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((c): c is OccasionCategory =>
            ALL_CATEGORIES.includes(c as OccasionCategory)
          );
          setCategories(new Set(valid));
        }
      }
    } catch {
      // ignore malformed storage
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
    }
  }, []);

  useEffect(() => {
<<<<<<< HEAD
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
=======
    if (!mounted) return;
    applyAppearance(theme, fontSize, fontFamily);
    store(STORAGE_KEYS.theme, theme);
    store(STORAGE_KEYS.fontSize, fontSize);
    store(STORAGE_KEYS.fontFamily, fontFamily);
  }, [mounted, theme, fontSize, fontFamily]);
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df

  // "auto" follows the OS while it is selected
  useEffect(() => {
    if (theme !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyAppearance("auto", fontSize, fontFamily);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme, fontSize, fontFamily]);

  const clock = useMemo(() => tehranNow(), [tick]);
  // Anchored on the Tehran calendar day: only changes at Tehran midnight, so
  // every day-derived value below survives the per-second clock ticks.
  const anchorMs = clock.anchor.getTime();
  const anchor = useMemo(() => new Date(anchorMs), [anchorMs]);

  const todayPersian = useMemo(() => calOf(anchor, "persian"), [anchor]);
  const todayGregorian = useMemo(() => calOf(anchor, "gregorian"), [anchor]);
  const todayHijri = useMemo(() => calOf(anchor, "islamic-civil"), [anchor]);
  const weekday = useMemo(() => weekdayOf(anchor), [anchor]);
  const dayOfYear = useMemo(() => dayOfPersianYear(todayPersian), [todayPersian]);
  const nowruz = useMemo(() => daysUntilNextNowruz(anchor, todayPersian.y), [anchor, todayPersian]);
  const todayZodiac = useMemo(() => zodiacOfPersianMonth(todayPersian.m), [todayPersian]);
  const couplet = useMemo(() => coupletOfDay(anchor), [anchor]);
  const todayOccasions = useMemo(
    () => occasionsOf(anchor).filter((o) => categories.has(o.category)),
    [anchor, categories]
  );
  const zodiac = useMemo(() => zodiacForPersianMonth(todayPersian.m), [todayPersian]);
  const todaysOccasions = useMemo(() => occasionsForGregorianDate(now.anchor), [now]);
  const couplet = useMemo(() => couplerOfTheDay(now.anchor), [now]);

  const viewYear = view?.y ?? todayPersian.y;
  const viewMonth = view?.m ?? todayPersian.m;
  const viewZodiac = zodiacOfPersianMonth(viewMonth);

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
<<<<<<< HEAD
=======
        holiday: false,
        occasions: [],
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
      });
    }
    for (let d = 1; d <= grid.daysInMonth; d++) {
      const gDate = new Date(grid.first.getTime() + (d - 1) * 86400000);
<<<<<<< HEAD
      const gInfo = { m: gDate.getUTCMonth() + 1, d: gDate.getUTCDate() };
      const hInfo = calOf(gDate, "islamic-civil");
      const isToday = viewYear === todayPersian.y && viewMonth === todayPersian.m && d === todayPersian.d;
=======
      const g = calOf(gDate, "gregorian");
      const h = calOf(gDate, "islamic-civil");
      const all = occasionsOf(gDate);
      const isToday =
        viewYear === todayPersian.y && viewMonth === todayPersian.m && d === todayPersian.d;
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
      result.push({
        day: d,
        y: viewYear,
        m: viewMonth,
        outside: false,
        isToday,
<<<<<<< HEAD
        gLabel: `${gInfo.d} ${GREGORIAN_MONTHS[gInfo.m - 1].slice(0, 3)}`,
        hLabel: `${toFa(hInfo.d)}`,
=======
        gLabel: `${g.d} ${GREGORIAN_MONTHS[g.m - 1].slice(0, 3)}`,
        hLabel: `${toFa(h.d)} ${monthNamesFor("islamic-civil")[h.m - 1]}`,
        holiday: isHolidayDay(gDate, all),
        occasions: all.filter((o) => categories.has(o.category)),
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
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
<<<<<<< HEAD
      result.push({ day: t, y: ny, m: nm, outside: true, isToday: false, gLabel: null, hLabel: null });
=======
      result.push({
        day: t,
        y: ny,
        m: nm,
        outside: true,
        isToday: false,
        gLabel: null,
        hLabel: null,
        holiday: false,
        occasions: [],
      });
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
    }
    return result;
  }, [grid, viewYear, viewMonth, todayPersian, categories]);

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
  function goToday() {
    setView({ y: todayPersian.y, m: todayPersian.m });
    setSelected({ y: todayPersian.y, m: todayPersian.m, d: todayPersian.d });
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
    return {
      dow: weekdayOf(gdate),
      g: calOf(gdate, "gregorian"),
      h: calOf(gdate, "islamic-civil"),
      zodiac: zodiacOfPersianMonth(selected.m),
      occasions: occasionsOf(gdate).filter((o) => categories.has(o.category)),
    };
  }, [selected, categories]);

<<<<<<< HEAD
  const visibleOccasions: Occasion[] = todaysOccasions.filter(
    (o) => o.bucket === "cultural" || showReligious
  );
=======
  const toggleCategory = useCallback((c: OccasionCategory) => {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      store(STORAGE_KEYS.categories, JSON.stringify([...next]));
      return next;
    });
  }, []);
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df

  return (
    <div className="app">
      <header>
        <div className="brand">
          <span className="brand-mark">روزگار</span>
          <span className="brand-sub">تقویم فارسی</span>
        </div>
        <div className="header-dates">
          <span>{toFa(todayPersian.d)} {monthNamesFor("persian")[todayPersian.m - 1]} {toFa(todayPersian.y)}</span>
          <span className="dot">·</span>
          <span>{todayGregorian.d} {GREGORIAN_MONTHS[todayGregorian.m - 1]} {todayGregorian.y}</span>
          <span className="dot">·</span>
          <span>{toFa(todayHijri.d)} {monthNamesFor("islamic-civil")[todayHijri.m - 1]} {toFa(todayHijri.y)}</span>
        </div>
        <div className="header-actions">
<<<<<<< HEAD
          <SettingsPanel
            theme={theme}
            setTheme={setTheme}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
=======
          <button
            className="icon-btn"
            title="تنظیمات"
            aria-label="تنظیمات"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((o) => !o)}
          >
            ⚙
          </button>
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
        </div>
      </header>

      {settingsOpen && (
        <SettingsPanel
          theme={theme}
          fontSize={fontSize}
          fontFamily={fontFamily}
          categories={categories}
          onTheme={setTheme}
          onFontSize={setFontSize}
          onFontFamily={setFontFamily}
          onToggleCategory={toggleCategory}
        />
      )}

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
            ساعت تهران{" "}
            <span className="clock" suppressHydrationWarning>
              {mounted ? `${clock.hh}:${clock.mm}:${clock.ss}` : "--:--:--"}
            </span>
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
          <div className="chip zodiac-chip">
            <ZodiacBadge zodiac={todayZodiac} size={22} />
          </div>
        </div>
<<<<<<< HEAD

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
=======
        {todayOccasions.length > 0 && (
          <ul className="today-occasions">
            {todayOccasions.map((o) => (
              <li key={o.title} className={o.holiday ? "holiday" : ""}>
                <span className={`cat cat-${o.category}`}>{CATEGORY_LABELS[o.category]}</span>
                {o.title}
              </li>
            ))}
          </ul>
        )}
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
      </section>

      <div className="two-col">
        <WeatherCard
          cityId={weatherCity}
          onCityChange={(id) => {
            setWeatherCity(id);
            store(STORAGE_KEYS.weatherCity, id);
          }}
        />
        <PoemCard couplet={couplet} />
      </div>

      <div className="section-title">تقویم ماهانه</div>
      <div className="cal-nav">
        <button onClick={goPrevMonth} aria-label="ماه قبل">قبلی ›</button>
        <div className="cal-title">
          {monthNamesFor("persian")[viewMonth - 1]} <span className="yr">{toFa(viewYear)}</span>
          <span className="cal-zodiac">
            <ZodiacBadge zodiac={viewZodiac} size={18} />
          </span>
        </div>
        <div className="nav-group">
          <button onClick={goToday}>امروز</button>
          <button onClick={goNextMonth} aria-label="ماه بعد">‹ بعدی</button>
        </div>
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
              cell.holiday && !cell.outside ? "holiday" : "",
              selected && !cell.outside && selected.y === cell.y && selected.m === cell.m && selected.d === cell.day
                ? "selected"
                : "",
            ].join(" ").trim()}
            role="button"
            tabIndex={0}
            title={cell.occasions.map((o) => o.title).join(" · ") || undefined}
            onClick={() => selectCell(cell)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectCell(cell);
              }
            }}
          >
<<<<<<< HEAD
            <div>{toFa(cell.day)}</div>
            {!cell.outside && cell.gLabel && (
              <div className="g">
                <span>{cell.gLabel}</span>
                {cell.hLabel && <span className="hij"> · {cell.hLabel}ق</span>}
              </div>
            )}
=======
            <div className="d">{toFa(cell.day)}</div>
            {!cell.outside && cell.gLabel && <div className="g">{cell.gLabel}</div>}
            {!cell.outside && cell.hLabel && <div className="h">{cell.hLabel}</div>}
            {cell.occasions.length > 0 && <span className="event-dot" aria-hidden="true" />}
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
          </div>
        ))}
      </div>
      <div className="selected-info">
        {selected && selectedInfo ? (
          <>
            <div>
              {selectedInfo.dow}، <strong>{toFa(selected.d)} {monthNamesFor("persian")[selected.m - 1]} {toFa(selected.y)}</strong>
              {" — میلادی: "}
              <strong>{selectedInfo.g.d} {GREGORIAN_MONTHS[selectedInfo.g.m - 1]} {selectedInfo.g.y}</strong>
              {" — قمری: "}
              <strong>{toFa(selectedInfo.h.d)} {monthNamesFor("islamic-civil")[selectedInfo.h.m - 1]} {toFa(selectedInfo.h.y)}</strong>
            </div>
            <div className="selected-extra">
              <ZodiacBadge zodiac={selectedInfo.zodiac} size={20} />
            </div>
            {selectedInfo.occasions.length > 0 && (
              <ul className="today-occasions">
                {selectedInfo.occasions.map((o) => (
                  <li key={o.title} className={o.holiday ? "holiday" : ""}>
                    <span className={`cat cat-${o.category}`}>{CATEGORY_LABELS[o.category]}</span>
                    {o.title}
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          "روی یک روز کلیک کن تا جزئیاتش را ببینی."
        )}
      </div>

      <div className="section-title">ابزارهای تاریخ</div>
<<<<<<< HEAD
      <DateTools />

      <div className="section-title">اوقات شرعی</div>
      <PrayerTimesCard />

      <div className="section-title">آب‌وهوا و شعر روز</div>
      <div className="widgets-row">
        <WeatherCard />
        <QuoteCard couplet={couplet} />
      </div>
=======
      <DateTools anchor={anchor} />

      <div className="section-title">اوقات شرعی</div>
      <PrayerTimesCard
        anchor={anchor}
        cityId={prayerCity}
        method={prayerMethod}
        onCityChange={(id) => {
          setPrayerCity(id);
          store(STORAGE_KEYS.prayerCity, id);
        }}
        onMethodChange={(m) => {
          setPrayerMethod(m);
          store(STORAGE_KEYS.prayerMethod, m);
        }}
      />
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df

      <footer>روزگار · یک تقویم ساده و بدون ردیابی، برای دیدن روزها</footer>
    </div>
  );
}
