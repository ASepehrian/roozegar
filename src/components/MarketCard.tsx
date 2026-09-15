"use client";

import { useEffect, useState } from "react";
import { MarketNow, fetchMarket, formatCryptoPrice, formatToman } from "@/lib/market";
import { toFa } from "@/lib/calendar";
import FootballResults from "./FootballResults";

type CryptoState = { BTCUSDT: { price: number }; ETHUSDT: { price: number } };

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

function CryptoRow({ symbol, price }: { symbol: string; price?: number }) {
  return (
    <div className="rate-row crypto-rate-row">
      <span className="rate-label">{symbol}</span>
      <span className="rate-main">
        {price !== undefined ? formatCryptoPrice(price) : "—"}
        <span className="rate-unit">USDT</span>
      </span>
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
  const [crypto, setCrypto] = useState<CryptoState | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);

  useEffect(() => {
    let marketBusy = false;

    const loadMarket = () => {
      if (marketBusy) return;
      marketBusy = true;
      fetchMarket()
        .then((m) => {
          setData((d) => {
            if (d && d.fetchedAt !== m.fetchedAt) setPrev(d);
            return m;
          });
          setError(false);
          setLoading(false);
        })
        .catch(() => setError(true))
        .finally(() => { marketBusy = false; });
    };

    // USD/gold/coin source is REST-based, so refresh it every second.
    loadMarket();
    const marketId = window.setInterval(loadMarket, 1000);

    // BTC/ETH use Binance public WebSocket streams: updates arrive as trades happen,
    // rather than waiting for a polling interval. Reconnect automatically if needed.
    let socket: WebSocket | null = null;
    let reconnectId: number | undefined;
    let stopped = false;

    const connectCrypto = () => {
      if (stopped) return;
      socket = new WebSocket("wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker");
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as { data?: { s?: string; c?: string } };
          const ticker = message.data;
          if (!ticker?.s || !ticker.c) return;
          const price = Number(ticker.c);
          if (!Number.isFinite(price) || price <= 0) return;
          setCrypto((current) => ({
            BTCUSDT: { price: ticker.s === "BTCUSDT" ? price : current?.BTCUSDT.price ?? price },
            ETHUSDT: { price: ticker.s === "ETHUSDT" ? price : current?.ETHUSDT.price ?? price },
          }));
        } catch {
          // Ignore malformed stream messages.
        }
      };
      socket.onclose = () => {
        if (!stopped) reconnectId = window.setTimeout(connectCrypto, 1500);
      };
      socket.onerror = () => socket?.close();
    };

    connectCrypto();
    const tickId = window.setInterval(() => setTick((n) => n + 1), 1000);

    return () => {
      stopped = true;
      window.clearInterval(marketId);
      window.clearInterval(tickId);
      if (reconnectId !== undefined) window.clearTimeout(reconnectId);
      socket?.close();
    };
  }, []);

  return <div className="market-stack">
    <div className="card market">
      <div className="card-head">
        <span className="card-title">قیمت لحظه‌ای</span>
        {data && <span className="live-badge"><span className="live-dot" aria-hidden="true" />زنده · {secondsAgo(data.fetchedAt)}</span>}
      </div>
      {loading && <div className="muted">در حال دریافت…</div>}
      {error && !data && <div className="muted">دریافت قیمت‌ها ممکن نشد. اتصال اینترنت را بررسی کن.</div>}
      {error && data && <div className="muted small-inline">آخرین به‌روزرسانی ناموفق بود؛ اعداد قبلی حفظ شد.</div>}
      {data && <>
        <RateRow label="دلار آمریکا" toman={data.usdToman.toman} change={data.usdToman.change} rising={data.usdToman.rising} prevToman={prev?.usdToman.toman ?? 0} />
        <RateRow label="طلای ۱۸ عیار" toman={data.gold18Toman.toman} change={data.gold18Toman.change} rising={data.gold18Toman.rising} prevToman={prev?.gold18Toman.toman ?? 0} />
        <RateRow label="سکه امامی" toman={data.emamiCoinToman.toman} change={data.emamiCoinToman.change} rising={data.emamiCoinToman.rising} prevToman={prev?.emamiCoinToman.toman ?? 0} />
      </>}
      <CryptoRow symbol="BTC / USDT" price={crypto?.BTCUSDT.price} />
      <CryptoRow symbol="ETH / USDT" price={crypto?.ETHUSDT.price} />
      <div className="muted small-inline">دلار، طلا و سکه هر ۱ ثانیه بررسی می‌شوند · BTC/ETH به‌صورت لحظه‌ای از WebSocket · نمایش قیمت‌ها اطلاع‌رسانی است.</div>
    </div>
    <FootballResults />
  </div>;
}
