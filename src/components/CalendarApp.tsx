"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import GirihDivider from "./GirihDivider";
import DateTools from "./DateTools";
import MarketCard from "./MarketCard";
import PoemCard from "./PoemCard";
import PrayerTimesCard from "./PrayerTimesCard";
import SettingsPanel from "./SettingsPanel";
import WeatherCard from "./WeatherCard";
import ZodiacBadge from "./ZodiacBadge";
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
import { CATEGORY_LABELS, Occasion, OccasionCategory, isHolidayDay, occasionsOf } from "@/lib/events";
import { coupletOfDay } from "@/lib/poems";
import { CITIES, DEFAULT_CITY_ID } from "@/lib/cities";
import { PrayerMethod } from "@/lib/prayer";
import { FontFamily, FontSize, STORAGE_KEYS, ThemeMode, applyAppearance, readStored, store } from "@/lib/settings";
import { zodiacOfPersianMonth } from "@/lib/zodiac";

interface DayCell {
  day: number; y: number; m: number; outside: boolean; isToday: boolean;
  gLabel: string | null; hLabel: string | null; holiday: boolean; occasions: Occasion[];
}

const CATEGORIES: OccasionCategory[] = ["national", "religious", "official"];
const CITY_IDS = CITIES.map((c) => c.id);

export default function CalendarApp() {
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [selected, setSelected] = useState<{ y: number; m: number; d: number } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("auto");
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [fontFamily, setFontFamily] = useState<FontFamily>("vazir");
  const [categories, setCategories] = useState<Set<OccasionCategory>>(new Set(["national"]));
  const [prayerCity, setPrayerCity] = useState(DEFAULT_CITY_ID);
  const [prayerMethod, setPrayerMethod] = useState<PrayerMethod>("tehran");
  const [weatherCity, setWeatherCity] = useState(DEFAULT_CITY_ID);

  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
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
        const values = JSON.parse(raw) as unknown;
        if (Array.isArray(values)) setCategories(new Set(values.filter((v): v is OccasionCategory => CATEGORIES.includes(v as OccasionCategory))));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyAppearance(theme, fontSize, fontFamily);
    store(STORAGE_KEYS.theme, theme);
    store(STORAGE_KEYS.fontSize, fontSize);
    store(STORAGE_KEYS.fontFamily, fontFamily);
  }, [mounted, theme, fontSize, fontFamily]);

  useEffect(() => {
    if (theme !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => applyAppearance("auto", fontSize, fontFamily);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [theme, fontSize, fontFamily]);

  const clock = useMemo(() => tehranNow(), [tick]);
  const anchor = useMemo(() => new Date(clock.anchor.getTime()), [clock.anchor]);
  const today = useMemo(() => calOf(anchor, "persian"), [anchor]);
  const gregorian = useMemo(() => calOf(anchor, "gregorian"), [anchor]);
  const hijri = useMemo(() => calOf(anchor, "islamic-civil"), [anchor]);
  const zodiac = useMemo(() => zodiacOfPersianMonth(today.m), [today.m]);
  const couplet = useMemo(() => coupletOfDay(anchor), [anchor]);
  const occasions = useMemo(() => occasionsOf(anchor).filter((o) => categories.has(o.category)), [anchor, categories]);
  const nowruz = useMemo(() => daysUntilNextNowruz(anchor, today.y), [anchor, today.y]);

  const year = view?.y ?? today.y;
  const month = view?.m ?? today.m;
  const monthZodiac = zodiacOfPersianMonth(month);
  useEffect(() => { if (!view) setView({ y: today.y, m: today.m }); }, [view, today.y, today.m]);

  const grid = useMemo(() => monthGrid("persian", year, month), [year, month]);
  const cells = useMemo<DayCell[]>(() => {
    const out: DayCell[] = [];
    let pm = month - 1, py = year;
    if (pm < 1) { pm = 12; py--; }
    const prev = monthGrid("persian", py, pm);
    for (let i = 0; i < grid.startIndex; i++) out.push({ day: prev.daysInMonth - grid.startIndex + 1 + i, y: py, m: pm, outside: true, isToday: false, gLabel: null, hLabel: null, holiday: false, occasions: [] });
    for (let d = 1; d <= grid.daysInMonth; d++) {
      const date = new Date(grid.first.getTime() + (d - 1) * 86400000);
      const g = calOf(date, "gregorian"), h = calOf(date, "islamic-civil"), all = occasionsOf(date);
      out.push({ day: d, y: year, m: month, outside: false, isToday: year === today.y && month === today.m && d === today.d, gLabel: `${g.d} ${GREGORIAN_MONTHS[g.m - 1].slice(0, 3)}`, hLabel: `${toFa(h.d)} ${monthNamesFor("islamic-civil")[h.m - 1]}`, holiday: isHolidayDay(date, all), occasions: all.filter((o) => categories.has(o.category)) });
    }
    const trail = (7 - (out.length % 7)) % 7;
    let nm = month + 1, ny = year;
    if (nm > 12) { nm = 1; ny++; }
    for (let d = 1; d <= trail; d++) out.push({ day: d, y: ny, m: nm, outside: true, isToday: false, gLabel: null, hLabel: null, holiday: false, occasions: [] });
    return out;
  }, [grid, year, month, today, categories]);

  const selectedInfo = useMemo(() => {
    if (!selected) return null;
    const date = calToGregorian("persian", selected.y, selected.m, selected.d);
    return { g: calOf(date, "gregorian"), h: calOf(date, "islamic-civil"), dow: weekdayOf(date), zodiac: zodiacOfPersianMonth(selected.m), occasions: occasionsOf(date).filter((o) => categories.has(o.category)) };
  }, [selected, categories]);

  const toggleCategory = useCallback((c: OccasionCategory) => {
    setCategories((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      store(STORAGE_KEYS.categories, JSON.stringify([...next]));
      return next;
    });
  }, []);
  const prevMonth = () => setView({ y: month === 1 ? year - 1 : year, m: month === 1 ? 12 : month - 1 });
  const nextMonth = () => setView({ y: month === 12 ? year + 1 : year, m: month === 12 ? 1 : month + 1 });
  const todayButton = () => { setView({ y: today.y, m: today.m }); setSelected({ y: today.y, m: today.m, d: today.d }); };

  return <div className="app">
    <header>
      <div className="brand"><span className="brand-mark">روزگار</span><span className="brand-sub">تقویم فارسی</span></div>
      <div className="header-dates"><span>{toFa(today.d)} {monthNamesFor("persian")[today.m - 1]} {toFa(today.y)}</span><span className="dot">·</span><span>{gregorian.d} {GREGORIAN_MONTHS[gregorian.m - 1]} {gregorian.y}</span><span className="dot">·</span><span>{toFa(hijri.d)} {monthNamesFor("islamic-civil")[hijri.m - 1]} {toFa(hijri.y)}</span></div>
      <button className="icon-btn" title="تنظیمات" aria-label="تنظیمات" aria-expanded={settingsOpen} onClick={() => setSettingsOpen((v) => !v)}>⚙</button>
    </header>
    {settingsOpen && <SettingsPanel theme={theme} fontSize={fontSize} fontFamily={fontFamily} categories={categories} onTheme={setTheme} onFontSize={setFontSize} onFontFamily={setFontFamily} onToggleCategory={toggleCategory} />}
    <GirihDivider />
    <section className="hero">
      <div className="hero-weekday">{weekdayOf(anchor)}</div>
      <div className="hero-split">
        <div className="hero-date-block">
          <div className="hero-date">{toFa(today.d)} {monthNamesFor("persian")[today.m - 1]} <span className="hero-year">{toFa(today.y)}</span></div>
          <div className="hero-row"><span className="hero-zodiac"><ZodiacBadge zodiac={zodiac} size={22} /><span className="zname">{zodiac.name}</span></span><span>میلادی: <strong>{gregorian.d} {GREGORIAN_MONTHS[gregorian.m - 1]} {gregorian.y}</strong></span><span>قمری: <strong>{toFa(hijri.d)} {monthNamesFor("islamic-civil")[hijri.m - 1]} {toFa(hijri.y)}</strong></span></div>
        </div>
        <div className="hero-clock-block">
          <div className="hero-clock-label">ساعت تهران</div>
          <div className="hero-clock">{mounted ? `${clock.hh}:${clock.mm}:${clock.ss}` : "--:--:--"}</div>
          <div className="hero-extra"><div className="chip">روز {toFa(dayOfPersianYear(today))} سال {toFa(today.y)}</div><div className="chip gold">{nowruz.days <= 0 ? "نوروز مبارک" : `${toFa(nowruz.days)} روز تا نوروز ${toFa(nowruz.year)}`}</div></div>
        </div>
      </div>
      {occasions.length > 0 && <ul className="today-occasions">{occasions.map((o) => <li key={o.title} className={o.holiday ? "holiday" : ""}><span className={`cat cat-${o.category}`}>{CATEGORY_LABELS[o.category]}</span>{o.title}</li>)}</ul>}
    </section>
    <div className="two-col"><WeatherCard cityId={weatherCity} onCityChange={(id) => { setWeatherCity(id); store(STORAGE_KEYS.weatherCity, id); }} /><PoemCard couplet={couplet} /></div>
    <div className="cal-market-row">
      <div className="cal-side">
        <div className="section-title">تقویم ماهانه</div>
        <div className="cal-nav"><button onClick={prevMonth}>قبلی ›</button><div className="cal-title">{monthNamesFor("persian")[month - 1]} <span className="yr">{toFa(year)}</span><ZodiacBadge zodiac={monthZodiac} size={18} /></div><div className="nav-group"><button onClick={todayButton}>امروز</button><button onClick={nextMonth}>‹ بعدی</button></div></div>
        <div className="weekday-row"><div>ش</div><div>ی</div><div>د</div><div>س</div><div>چ</div><div>پ</div><div>ج</div></div>
        <div className="day-grid compact">{cells.map((cell, i) => <div key={`${cell.y}-${cell.m}-${cell.day}-${i}`} className={["day-cell", cell.outside ? "outside" : "", cell.isToday ? "today" : "", cell.holiday && !cell.outside ? "holiday" : "", selected && selected.y === cell.y && selected.m === cell.m && selected.d === cell.day ? "selected" : ""].join(" ").trim()} role="button" tabIndex={0} title={cell.occasions.map((o) => o.title).join(" · ") || undefined} onClick={() => cell.outside ? setView({ y: cell.y, m: cell.m }) : setSelected({ y: cell.y, m: cell.m, d: cell.day })} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cell.outside ? setView({ y: cell.y, m: cell.m }) : setSelected({ y: cell.y, m: cell.m, d: cell.day }); } }}><div className="d">{toFa(cell.day)}</div>{!cell.outside && <><div className="g">{cell.gLabel}</div><div className="h">{cell.hLabel}</div></>}{cell.occasions.length > 0 && <span className="event-dot" aria-hidden="true" />}</div>)}</div>
        <div className="selected-info">{selected && selectedInfo ? <><div>{selectedInfo.dow}، <strong>{toFa(selected.d)} {monthNamesFor("persian")[selected.m - 1]} {toFa(selected.y)}</strong> — میلادی: <strong>{selectedInfo.g.d} {GREGORIAN_MONTHS[selectedInfo.g.m - 1]} {selectedInfo.g.y}</strong> — قمری: <strong>{toFa(selectedInfo.h.d)} {monthNamesFor("islamic-civil")[selectedInfo.h.m - 1]} {toFa(selectedInfo.h.y)}</strong></div><ZodiacBadge zodiac={selectedInfo.zodiac} size={20} />{selectedInfo.occasions.length > 0 && <ul className="today-occasions">{selectedInfo.occasions.map((o) => <li key={o.title}><span className={`cat cat-${o.category}`}>{CATEGORY_LABELS[o.category]}</span>{o.title}</li>)}</ul>}</> : "روی یک روز کلیک کن تا جزئیاتش را ببینی."}</div>
      </div>
      <div className="market-side">
        <MarketCard />
      </div>
    </div>
    <div className="section-title">ابزارهای تاریخ</div><DateTools anchor={anchor} />
    <div className="section-title">اوقات شرعی</div><PrayerTimesCard anchor={anchor} cityId={prayerCity} method={prayerMethod} onCityChange={(id) => { setPrayerCity(id); store(STORAGE_KEYS.prayerCity, id); }} onMethodChange={(m) => { setPrayerMethod(m); store(STORAGE_KEYS.prayerMethod, m); }} />
    <footer>روزگار · یک تقویم ساده و بدون ردیابی، برای دیدن روزها</footer>
  </div>;
}
