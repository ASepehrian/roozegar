// Source: roozegar live market rates (قیمت لحظه‌ای)
// Why: tgju.org's public JSON feed needs no API key and no account, which
//      keeps the "no keys, no tracking" promise of the project. The request
//      is made from the browser so the server stays stateless. CORS is open.

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

interface TgjuEntry {
  p?: string;
  h?: string;
  l?: string;
  d?: string;
  dp?: number;
  dt?: string;
  ts?: string;
}

interface TgjuResponse {
  current?: Record<string, TgjuEntry>;
}

const ENDPOINT = "https://call1.tgju.org/ajax.json";

const KEYS = {
  usdToman: "price_dollar_rl",
  gold18Toman: "geram18",
  emamiCoinToman: "sekee",
} as const;

function num(v: string | undefined): number {
  if (!v) return NaN;
  return parseInt(v.replace(/,/g, ""), 10);
}

/** Feed prices are Rial; the site shows Toman. */
function toRate(entry: TgjuEntry | undefined): MarketRate | null {
  if (!entry) return null;
  const rial = num(entry.p);
  if (!Number.isFinite(rial)) return null;
  const deltaRial = num(entry.d);
  const toman = rial / 10;
  const change = Number.isFinite(deltaRial) ? deltaRial / 10 : 0;
  return {
    toman,
    change,
    changePercent: typeof entry.dp === "number" ? entry.dp : 0,
    rising: entry.dt === "high" || change > 0,
  };
}

export async function fetchMarket(signal?: AbortSignal): Promise<MarketNow> {
  const res = await fetch(ENDPOINT, { signal });
  if (!res.ok) throw new Error(`market request failed: ${res.status}`);
  const data: TgjuResponse = await res.json();
  const current = data.current;
  const usdToman = toRate(current?.[KEYS.usdToman]);
  const gold18Toman = toRate(current?.[KEYS.gold18Toman]);
  const emamiCoinToman = toRate(current?.[KEYS.emamiCoinToman]);
  if (!usdToman || !gold18Toman || !emamiCoinToman) {
    throw new Error("market response missing rate entries");
  }
  return { usdToman, gold18Toman, emamiCoinToman, fetchedAt: Date.now() };
}

export function formatToman(v: number): string {
  return Math.round(v).toLocaleString("en-US");
}
