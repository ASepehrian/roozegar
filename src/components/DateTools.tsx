"use client";

<<<<<<< HEAD
import { useState } from "react";
import DateFields, { DateValue } from "./DateFields";
import {
  GREGORIAN_MONTHS,
  calOf,
  calToGregorian,
  dateDiff,
  monthNamesFor,
  tehranNow,
  toFa,
} from "@/lib/calendar";

type Tab = "convert" | "diff" | "age";

function todayAsPersianValue(): DateValue {
  const now = tehranNow();
  const p = calOf(now.anchor, "persian");
  return { cal: "persian", y: p.y, m: p.m, d: p.d };
}

export default function DateTools() {
  const [tab, setTab] = useState<Tab>("convert");

  return (
    <div className="card">
      <div className="tab-row">
        <button className={tab === "convert" ? "tab active" : "tab"} onClick={() => setTab("convert")}>
          تبدیل تاریخ
        </button>
        <button className={tab === "diff" ? "tab active" : "tab"} onClick={() => setTab("diff")}>
          فاصلهٔ دو تاریخ
        </button>
        <button className={tab === "age" ? "tab active" : "tab"} onClick={() => setTab("age")}>
          محاسبهٔ سن
        </button>
      </div>
      {tab === "convert" && <ConvertTab />}
      {tab === "diff" && <DiffTab />}
      {tab === "age" && <AgeTab />}
    </div>
  );
}

function ConvertTab() {
  const [value, setValue] = useState<DateValue>(todayAsPersianValue());
  const [result, setResult] = useState<null | { p: string; g: string; h: string }>(null);

  function run() {
    const gdate = calToGregorian(value.cal, value.y, value.m, value.d);
    const pp = calOf(gdate, "persian");
    const gg = calOf(gdate, "gregorian");
    const hh = calOf(gdate, "islamic-civil");
    setResult({
      p: `${toFa(pp.d)} ${monthNamesFor("persian")[pp.m - 1]} ${toFa(pp.y)}`,
      g: `${gg.d} ${GREGORIAN_MONTHS[gg.m - 1]} ${gg.y}`,
      h: `${toFa(hh.d)} ${monthNamesFor("islamic-civil")[hh.m - 1]} ${toFa(hh.y)}`,
    });
  }

  return (
    <div>
      <DateFields value={value} onChange={setValue} idPrefix="conv" />
      <button className="btn-primary" style={{ marginTop: 10 }} onClick={run}>تبدیل کن</button>
      {result && (
        <div className="conv-result">
          <div className="cell"><div className="lbl">شمسی</div><div className="val">{result.p}</div></div>
          <div className="cell"><div className="lbl">میلادی</div><div className="val">{result.g}</div></div>
          <div className="cell"><div className="lbl">قمری</div><div className="val">{result.h}</div></div>
        </div>
      )}
    </div>
  );
}

function DiffTab() {
  const [a, setA] = useState<DateValue>(todayAsPersianValue());
  const [b, setB] = useState<DateValue>(todayAsPersianValue());
  const [result, setResult] = useState<null | ReturnType<typeof dateDiff>>(null);

  function run() {
    setResult(dateDiff(a.cal, a.y, a.m, a.d, b.cal, b.y, b.m, b.d));
  }

  return (
    <div>
      <div className="field" style={{ marginBottom: 6 }}>
        <label>تاریخ اول</label>
      </div>
      <DateFields value={a} onChange={setA} idPrefix="diffa" />
      <div className="field" style={{ margin: "14px 0 6px" }}>
        <label>تاریخ دوم</label>
      </div>
      <DateFields value={b} onChange={setB} idPrefix="diffb" />
      <button className="btn-primary" style={{ marginTop: 10 }} onClick={run}>محاسبه کن</button>
      {result && (
        <div className="conv-result">
          <div className="cell"><div className="lbl">مجموع روزها</div><div className="val">{toFa(result.totalDays)} روز</div></div>
          <div className="cell"><div className="lbl">به تفکیک</div><div className="val">
            {toFa(result.years)} سال و {toFa(result.months)} ماه و {toFa(result.days)} روز
          </div></div>
        </div>
      )}
    </div>
  );
}

function AgeTab() {
  const [birth, setBirth] = useState<DateValue>(todayAsPersianValue());
  const [result, setResult] = useState<null | ReturnType<typeof dateDiff>>(null);

  function run() {
    const now = tehranNow();
    const p = calOf(now.anchor, "persian");
    setResult(dateDiff(birth.cal, birth.y, birth.m, birth.d, "persian", p.y, p.m, p.d));
  }

  return (
    <div>
      <div className="field" style={{ marginBottom: 6 }}>
        <label>تاریخ تولد</label>
      </div>
      <DateFields value={birth} onChange={setBirth} idPrefix="age" />
      <button className="btn-primary" style={{ marginTop: 10 }} onClick={run}>سنم چقدره؟</button>
      {result && (
        <div className="conv-result">
          <div className="cell"><div className="lbl">سن</div><div className="val">
            {toFa(result.years)} سال، {toFa(result.months)} ماه و {toFa(result.days)} روز
          </div></div>
          <div className="cell"><div className="lbl">مجموع روزهای زندگی</div><div className="val">{toFa(result.totalDays)} روز</div></div>
        </div>
=======
import { useMemo, useState } from "react";
import DateFields, { CALENDAR_LABELS, DateValue } from "./DateFields";
import {
  CalendarId,
  GREGORIAN_MONTHS,
  YMD,
  calOf,
  calToGregorian,
  monthNamesFor,
  toFa,
  weekdayOf,
} from "@/lib/calendar";
import { ageOf, dateDiff } from "@/lib/datetools";
import { zodiacOfPersianMonth } from "@/lib/zodiac";
import ZodiacBadge from "./ZodiacBadge";

type Tab = "convert" | "diff" | "age";

const TAB_LABELS: Record<Tab, string> = {
  convert: "تبدیل تاریخ",
  diff: "فاصلهٔ دو تاریخ",
  age: "محاسبهٔ سن",
};

function faDate(cal: CalendarId, ymd: YMD): string {
  if (cal === "gregorian") return `${ymd.d} ${GREGORIAN_MONTHS[ymd.m - 1]} ${ymd.y}`;
  return `${toFa(ymd.d)} ${monthNamesFor(cal)[ymd.m - 1]} ${toFa(ymd.y)}`;
}

export default function DateTools({ anchor }: { anchor: Date }) {
  const today = useMemo(
    () => ({
      persian: calOf(anchor, "persian"),
      gregorian: calOf(anchor, "gregorian"),
      hijri: calOf(anchor, "islamic-civil"),
    }),
    [anchor]
  );
  const todayValue: DateValue = {
    cal: "persian",
    y: today.persian.y,
    m: today.persian.m,
    d: today.persian.d,
  };

  const [tab, setTab] = useState<Tab>("convert");
  const [conv, setConv] = useState<DateValue>(todayValue);
  const [from, setFrom] = useState<DateValue>(todayValue);
  const [to, setTo] = useState<DateValue>({ ...todayValue, m: 1, d: 1, y: todayValue.y + 1 });
  const [birth, setBirth] = useState<DateValue>({ ...todayValue, y: todayValue.y - 30 });

  const convResult = useMemo(() => {
    const g = calToGregorian(conv.cal, conv.y, conv.m, conv.d);
    return {
      weekday: weekdayOf(g),
      persian: calOf(g, "persian"),
      gregorian: calOf(g, "gregorian"),
      hijri: calOf(g, "islamic-civil"),
    };
  }, [conv]);

  const diffResult = useMemo(() => {
    const a = calToGregorian(from.cal, from.y, from.m, from.d);
    const b = calToGregorian(to.cal, to.y, to.m, to.d);
    return dateDiff(a, b, from.cal);
  }, [from, to]);

  const ageResult = useMemo(() => {
    const b = calToGregorian(birth.cal, birth.y, birth.m, birth.d);
    if (b.getTime() > anchor.getTime()) return null;
    return ageOf(b, anchor, birth.cal);
  }, [birth, anchor]);

  return (
    <div className="card">
      <div className="tabs" role="tablist">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? "tab active" : "tab"}
            onClick={() => setTab(t)}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "convert" && (
        <>
          <DateFields idPrefix="conv" value={conv} onChange={setConv} showCalendar />
          <div className="conv-result">
            <div className="cell">
              <div className="lbl">شمسی</div>
              <div className="val">{faDate("persian", convResult.persian)}</div>
            </div>
            <div className="cell">
              <div className="lbl">میلادی</div>
              <div className="val">{faDate("gregorian", convResult.gregorian)}</div>
            </div>
            <div className="cell">
              <div className="lbl">قمری</div>
              <div className="val">{faDate("islamic-civil", convResult.hijri)}</div>
            </div>
          </div>
          <div className="tool-note">
            <span>{convResult.weekday}</span>
            <ZodiacBadge zodiac={zodiacOfPersianMonth(convResult.persian.m)} size={20} />
          </div>
        </>
      )}

      {tab === "diff" && (
        <>
          <DateFields idPrefix="from" value={from} onChange={setFrom} showCalendar label="از تاریخ" />
          <DateFields
            idPrefix="to"
            value={to}
            onChange={(v) => setTo({ ...v, cal: from.cal })}
            label="تا تاریخ"
          />
          <div className="conv-result">
            <div className="cell">
              <div className="lbl">فاصله</div>
              <div className="val">{toFa(diffResult.days)} روز</div>
            </div>
            <div className="cell">
              <div className="lbl">هفته</div>
              <div className="val">
                {toFa(diffResult.weeks)} هفته و {toFa(diffResult.remainderDays)} روز
              </div>
            </div>
            <div className="cell">
              <div className="lbl">تقویمی ({CALENDAR_LABELS[from.cal]})</div>
              <div className="val">
                {toFa(diffResult.years)} سال، {toFa(diffResult.months)} ماه و {toFa(diffResult.monthDays)} روز
              </div>
            </div>
          </div>
          <div className="tool-note">
            {diffResult.days === 0
              ? "هر دو تاریخ یکی هستند."
              : diffResult.future
                ? "تاریخ دوم بعد از تاریخ اول است."
                : "تاریخ دوم قبل از تاریخ اول است."}
          </div>
        </>
      )}

      {tab === "age" && (
        <>
          <DateFields idPrefix="birth" value={birth} onChange={setBirth} showCalendar label="تاریخ تولد" />
          {ageResult ? (
            <>
              <div className="conv-result">
                <div className="cell">
                  <div className="lbl">سن</div>
                  <div className="val">
                    {toFa(ageResult.years)} سال، {toFa(ageResult.months)} ماه و {toFa(ageResult.days)} روز
                  </div>
                </div>
                <div className="cell">
                  <div className="lbl">مجموع روزها</div>
                  <div className="val">{toFa(ageResult.totalDays)} روز</div>
                </div>
                <div className="cell">
                  <div className="lbl">تولد بعدی</div>
                  <div className="val">
                    {ageResult.nextBirthdayInDays === 0
                      ? "امروز است، مبارک!"
                      : `${toFa(ageResult.nextBirthdayInDays)} روز تا ${toFa(ageResult.nextBirthdayAge)} سالگی`}
                  </div>
                </div>
              </div>
              <div className="tool-note">
                <span>برج تولد:</span>
                <ZodiacBadge
                  zodiac={zodiacOfPersianMonth(
                    calOf(calToGregorian(birth.cal, birth.y, birth.m, birth.d), "persian").m
                  )}
                  size={20}
                />
              </div>
            </>
          ) : (
            <div className="tool-note">تاریخ تولد نمی‌تواند در آینده باشد.</div>
          )}
        </>
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
      )}
    </div>
  );
}
