// Source: roozegar live market rates proxy route
// The browser cannot reliably call the public TGJU feed directly because of CORS,
// so this server route fetches it and returns the three rates used by the card.

import { NextResponse } from "next/server";

const FEEDS = [
  "https://call1.tgju.org/ajax.json",
  "https://call5.tgju.org/ajax.json",
  "https://call3.tgju.org/ajax.json",
];

const KEYS = {
  usdToman: "price_dollar_rl",
  gold18Toman: "geram18",
  emamiCoinToman: "sekee",
} as const;

type FeedData = { current?: Record<string, Record<string, unknown>> };

function toNumber(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : NaN;
  if (typeof v !== "string") return NaN;
  const normalized = v
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٬,]/g, "")
    .replace(/٪/g, "")
    .trim();
  return Number(normalized);
}

function rate(entry: Record<string, unknown> | undefined) {
  if (!entry) return null;
  const rial = toNumber(entry.p);
  if (!Number.isFinite(rial) || rial <= 0) return null;
  const deltaRial = toNumber(entry.d);
  const percent = toNumber(entry.dp);
  return {
    toman: rial / 10,
    change: Number.isFinite(deltaRial) ? deltaRial / 10 : 0,
    changePercent: Number.isFinite(percent) ? percent : 0,
    rising: entry.dt === "high" || (Number.isFinite(deltaRial) && deltaRial > 0),
  };
}

async function fetchFeed(url: string): Promise<FeedData> {
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json", "User-Agent": "qolet.ir live market" },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`market feed failed: ${res.status}`);
  return (await res.json()) as FeedData;
}

export const dynamic = "force-dynamic";

export async function GET() {
  let lastError: unknown;
  for (const feed of FEEDS) {
    try {
      const data = await fetchFeed(feed);
      const current = data.current;
      const usdToman = rate(current?.[KEYS.usdToman]);
      const gold18Toman = rate(current?.[KEYS.gold18Toman]);
      const emamiCoinToman = rate(current?.[KEYS.emamiCoinToman]);
      if (!usdToman || !gold18Toman || !emamiCoinToman) throw new Error("feed_incomplete");

      return NextResponse.json(
        { usdToman, gold18Toman, emamiCoinToman, fetchedAt: Date.now() },
        { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
      );
    } catch (error) {
      lastError = error;
    }
  }

  return NextResponse.json(
    { error: "market_feed_failed" },
    { status: 502, headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
  );
}
