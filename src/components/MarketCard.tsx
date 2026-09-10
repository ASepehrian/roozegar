"use client";

import { useEffect, useState } from "react";
import { MarketNow, fetchMarket, formatToman } from "@/lib/market";
import { toFa } from "@/lib/calendar";

function RateRow({ label, toman, change, rising }: { label: string; toman: number; change: number; rising: boolean }) {
  const cls = rising ? "rate-delta up" : change < 0 ? "rate-delta down" : "rate-delta flat";
  const arrow = rising ? "▲" : change < 0 ? "▼" : "•";
  return (
    <div className="rate-row">
      <span className="rate-label">{label}</span>
      <span className="rate-main">{toFa(formatToman(toman))}<span className="rate-unit">تومان</span></span>
      {change !== 0 && <span className={cls}>{arrow} {toFa(formatToman(Math.abs(change)))}</span>}
    </div>
  );
}

export default function MarketCard() {
  const [data, setData] = useState<MarketNow | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = () => {
      fetchMarket()
        .then((m) => { if (alive) { setData(m); setError(false); setLoading(false); } })
        .catch(() => { if (alive) { setError(true); setLoading(false); } });
    };
    load();
    const id = window.setInterval(load, 5 * 60 * 1000); // refresh every 5 min
    return () => { alive = false; window.clearInterval(id); };
  }, []);

  return <div className="card market">
    <div className="card-head"><span className="card-title">قیمت لحظه‌ای</span><span className="muted small-inline">بازار تهران</span></div>
    {loading && <div className="muted">در حال دریافت…</div>}
    {error && <div className="muted">دریافت قیمت‌ها ممکن نشد. اتصال اینترنت را بررسی کن.</div>}
    {data && <>
      <RateRow label="دلار آمریکا" toman={data.usdToman.toman} change={data.usdToman.change} rising={data.usdToman.rising} />
      <RateRow label="طلای ۱۸ عیار" toman={data.gold18Toman.toman} change={data.gold18Toman.change} rising={data.gold18Toman.rising} />
      <RateRow label="سکه امامی" toman={data.emamiCoinToman.toman} change={data.emamiCoinToman.change} rising={data.emamiCoinToman.rising} />
      <div className="muted small-inline">به‌روزرسانی خودکار هر ۵ دقیقه · قیمت‌ها اطلاع‌رسانی است و مبنای معامله نیست.</div>
    </>}
  </div>;
}
