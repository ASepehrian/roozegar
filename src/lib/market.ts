// Source: roozegar live market rates (قیمت لحظه‌ای)
// Why: the tgju.org public feed serves no CORS headers, so the browser
//      calls our own /api/market route (see src/app/api/market/route.ts)
//      which proxies the same public feed server-side. No API key, no
//      account, and the server stays stateless.

export interface MarketRate {
  /** Price in Toman (value from the feed is Rial; divided by 10). */
  toman: number;
  /** Change vs previous close, in Toman. */
  change: number;
  /** Change vs previous close, in percent. */
  changePercent: number;
  /** true = upward move. */
  rising: boolean;
}

export interface MarketNow {
  usdToman: MarketRate;
  gold18Toman: MarketRate;
  emamiCoinToman: MarketRate;
  fetchedAt: number;
}

const ENDPOINT = "/api/market";

export async function fetchMarket(signal?: AbortSignal): Promise<MarketNow> {
  const res = await fetch(ENDPOINT, { signal, cache: "no-store" });
  if (!res.ok) throw new Error(`market request failed: ${res.status}`);
  const data = await res.json();
  if (!data?.usdToman || !data?.gold18Toman || !data?.emamiCoinToman) {
    throw new Error("market response missing rate entries");
  }
  return data as MarketNow;
}

export function formatToman(v: number): string {
  return Math.round(v).toLocaleString("en-US");
}

