"use client";

import { useEffect, useState } from "react";
import { MarketNow, fetchMarket, formatToman } from "@/lib/market";
import { toFa } from "@/lib/calendar";

function RateRow({ label, toman, change, rising, prevToman }: { label: string; toman: number; change: number; rising: boolean; prevToman: number }) {
  const cls = rising ? "rate-delta up" : change < 0 ? "rate-delta down" : "rate-delta flat";
  const arrow = rising ? "▲" : change < 0 ? "▼" : "•";
  const moved = prevToman !== 0 && prevToman !== toman;
  const dir = prevToman !== 0 && toman > prevToman ? "flash-up" : "flash-down";
  return (
    <div className={moved ? `rate-row ${dir}` : "rate-row"}>
      <span className="rate-label">{label}</span>
      <span className="rate-main">{toFa(formatToman(toman))}<span className="rate-unit">تومان</span></span>
      {change !== 0 && <span className={cls}>{arrow} {toFa(formatToman(Math.abs(change)))}</span>}
    </div>
  );
}

function secondsAgo(ts: number): string {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 5) return "همین حالا";
  return `${toFa(s)} ثانیه پیش`;
}

export default function MarketCard() {
  const [data, setData] = useState<MarketNow | null>(null);
  const [prev, setPrev] = useState<MarketNow | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0); // re-render every 5s only for the "seconds ago" label

  useEffect(() => {
    const load = () => {
      fetchMarket()
        .then((m) => {
          setData((d) => {
            if (d && d.fetchedAt !== m.fetchedAt) setPrev(d);
            return m;
          });
          setError(false);
          setLoading(false);
        })
        .catch(() => { setError(true); setLoading(false); });
    };
    load();
    const id = window.setInterval(load, 30 * 1000); // refresh every 30s
    const tickId = window.setInterval(() => setTick((n) => n + 1), 5000); // "x seconds ago"
    return () => { window.clearInterval(id); window.clearInterval(tickId); };
  }, []);

  return <div className="card market">
    <div className="card-head">
      <span className="card-title">قیمت لحظه‌ای</span>
      {data && <span className="live-badge"><span className="live-dot" aria-hidden="true" />زنده · {secondsAgo(data.fetchedAt)}</span>}
    </div>
    {loading && <div className="muted">در حال دریافت…</div>}
    {error && !data && <div className="muted">دریافت قیمت‌ها ممکن نشد. اتصال اینترنت را بررسی کن.</div>}
    {error && data && <div className="muted small-inline">آخرین به‌روزرسانی ناموفق بود؛ اعداد بالا حفظ شد.</div>}
    {data && <>
      <RateRow label="دلار آمریکا" toman={data.usdToman.toman} change={data.usdToman.change} rising={data.usdToman.rising} prevToman={prev?.usdToman.toman ?? 0} />
      <RateRow label="طلای ۱۸ عیار" toman={data.gold18Toman.toman} change={data.gold18Toman.change} rising={data.gold18Toman.rising} prevToman={prev?.gold18Toman.toman ?? 0} />
      <RateRow label="سکه امامی" toman={data.emamiCoinToman.toman} change={data.emamiCoinToman.change} rising={data.emamiCoinToman.rising} prevToman={prev?.emamiCoinToman.toman ?? 0} />
      <div className="muted small-inline">به‌روزرسانی خودکار هر ۳۰ ثانیه · قیمت‌ها اطلاع‌رسانی است و مبنای معامله نیست.</div>
    </>}
  </div>;
}
