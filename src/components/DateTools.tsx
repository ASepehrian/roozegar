"use client";

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
      )}
    </div>
  );
}
