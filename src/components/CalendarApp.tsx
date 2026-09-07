"use client";

import { useEffect, useMemo, useState } from "react";
import GirihDivider from "./GirihDivider";
import {
  CalendarId,
  GREGORIAN_MONTHS,
  calOf,
  calToGregorian,
  daysInGregorianMonth,
  dayOfPersianYear,
  daysUntilNextNowruz,
  monthGrid,
  monthNamesFor,
  tehranNow,
  toFa,
  weekdayOf,
} from "@/lib/calendar";

interface DayCellData {
  day: number;
  y: number;
  m: number;
  outside: boolean;
  isToday: boolean;
  gLabel: string | null;
}

export default function CalendarApp() {
  const [dark, setDark] = useState(false);
  const [tick, setTick] = useState(0);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [selected, setSelected] = useState<{ y: number; m: number; d: number } | null>(null);

  const [convCal, setConvCal] = useState<CalendarId>("persian");
  const [convY, setConvY] = useState<number | null>(null);
  const [convM, setConvM] = useState<number | null>(null);
  const [convD, setConvD] = useState<number | null>(null);
  const [convResult, setConvResult] = useState<null | { p: string; g: string; h: string }>(null);

  // live clock, ticking once a second
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("roozegar-theme") : null;
    if (saved) setDark(saved === "dark");
    else if (typeof window !== "undefined") {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("roozegar-theme", dark ? "dark" : "light");
    } catch {
      // ignore storage failures (private browsing etc.)
    }
  }, [dark]);

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

  const viewYear = view?.y ?? todayPersian.y;
  const viewMonth = view?.m ?? todayPersian.m;

  useEffect(() => {
    if (!view) setView({ y: todayPersian.y, m: todayPersian.m });
    if (convY === null) setConvY(todayPersian.y);
    if (convM === null) setConvM(todayPersian.m);
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
      });
    }
    for (let d = 1; d <= grid.daysInMonth; d++) {
      const gDate = new Date(grid.first.getTime() + (d - 1) * 86400000);
      const gInfo = { m: gDate.getUTCMonth() + 1, d: gDate.getUTCDate() };
      const isToday = viewYear === todayPersian.y && viewMonth === todayPersian.m && d === todayPersian.d;
      result.push({
        day: d,
        y: viewYear,
        m: viewMonth,
        outside: false,
        isToday,
        gLabel: `${gInfo.d} ${GREGORIAN_MONTHS[gInfo.m - 1].slice(0, 3)}`,
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
      result.push({ day: t, y: ny, m: nm, outside: true, isToday: false, gLabel: null });
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

  // ---- converter ----
  const convMonthNames = monthNamesFor(convCal);
  const convMaxDay = useMemo(() => {
    if (convY === null || convM === null) return 31;
    if (convCal === "gregorian") return daysInGregorianMonth(convY, convM);
    try {
      return monthGrid(convCal, convY, convM, 12).daysInMonth;
    } catch {
      return 30;
    }
  }, [convCal, convY, convM]);

  useEffect(() => {
    if (convD !== null && convD > convMaxDay) setConvD(convMaxDay);
    if (convD === null) setConvD(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convMaxDay]);

  function defaultYearFor(calId: CalendarId) {
    if (calId === "persian") return todayPersian.y;
    if (calId === "islamic-civil") return todayHijri.y;
    return todayGregorian.y;
  }
  function defaultMonthFor(calId: CalendarId) {
    if (calId === "persian") return todayPersian.m;
    if (calId === "islamic-civil") return todayHijri.m;
    return todayGregorian.m;
  }
  function handleConvCalChange(calId: CalendarId) {
    setConvCal(calId);
    setConvY(defaultYearFor(calId));
    setConvM(defaultMonthFor(calId));
  }
  function runConvert() {
    if (convY === null || convM === null || convD === null) return;
    const gdate = calToGregorian(convCal, convY, convM, convD);
    const pp = calOf(gdate, "persian");
    const gg = calOf(gdate, "gregorian");
    const hh = calOf(gdate, "islamic-civil");
    setConvResult({
      p: `${toFa(pp.d)} ${monthNamesFor("persian")[pp.m - 1]} ${toFa(pp.y)}`,
      g: `${gg.d} ${GREGORIAN_MONTHS[gg.m - 1]} ${gg.y}`,
      h: `${toFa(hh.d)} ${monthNamesFor("islamic-civil")[hh.m - 1]} ${toFa(hh.y)}`,
    });
  }

  return (
    <div className="app">
      <header>
        <div className="brand">
          <span className="brand-mark">روزگار</span>
          <span className="brand-sub">تقویم فارسی</span>
        </div>
        <div className="header-actions">
          <button
            className="icon-btn"
            title="پوسته تیره/روشن"
            aria-label="تغییر پوسته"
            onClick={() => setDark((d) => !d)}
          >
            {dark ? "◑" : "◐"}
          </button>
        </div>
      </header>

      <GirihDivider />

      <section className="hero">
        <div className="hero-weekday">{weekday}</div>
        <div className="hero-date">
          {toFa(todayPersian.d)} {monthNamesFor("persian")[todayPersian.m - 1]} {toFa(todayPersian.y)}
        </div>
        <div className="hero-row">
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
            {!cell.outside && cell.gLabel && <div className="g">{cell.gLabel}</div>}
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

      <div className="section-title">تبدیل تاریخ</div>
      <div className="card">
        <div className="conv-row">
          <div className="field">
            <label htmlFor="convCal">تقویم ورودی</label>
            <select
              id="convCal"
              value={convCal}
              onChange={(e) => handleConvCalChange(e.target.value as CalendarId)}
            >
              <option value="persian">شمسی</option>
              <option value="gregorian">میلادی</option>
              <option value="islamic-civil">قمری</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="convDay">روز</label>
            <select id="convDay" value={convD ?? 1} onChange={(e) => setConvD(parseInt(e.target.value, 10))}>
              {Array.from({ length: convMaxDay }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{toFa(d)}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="convMonth">ماه</label>
            <select id="convMonth" value={convM ?? 1} onChange={(e) => setConvM(parseInt(e.target.value, 10))}>
              {convMonthNames.map((name, idx) => (
                <option key={name} value={idx + 1}>{name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="convYear">سال</label>
            <input
              id="convYear"
              type="number"
              value={convY ?? ""}
              onChange={(e) => setConvY(parseInt(e.target.value, 10) || 0)}
            />
          </div>
          <button className="btn-primary" onClick={runConvert}>تبدیل کن</button>
        </div>
        {convResult && (
          <div className="conv-result">
            <div className="cell"><div className="lbl">شمسی</div><div className="val">{convResult.p}</div></div>
            <div className="cell"><div className="lbl">میلادی</div><div className="val">{convResult.g}</div></div>
            <div className="cell"><div className="lbl">قمری</div><div className="val">{convResult.h}</div></div>
          </div>
        )}
      </div>

      <footer>روزگار · یک تقویم ساده و بدون ردیابی، برای دیدن روزها</footer>
    </div>
  );
}
