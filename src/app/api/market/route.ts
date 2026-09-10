// Source: roozegar market rates proxy route
// Why: the tgju.org public feed serves no CORS headers, so a browser fetch
//      from the deployed site is blocked. This server-side route fetches
//      the same public feed (no API key, stateless) and returns only the
//      three rates the market card needs, as Toman.

import { NextResponse } from "next/server";

const FEED = "https://call1.tgju.org/ajax.json";
const KEYS = {
  usdToman: "price_dollar_rl",
  gold18Toman: "geram18",
  emamiCoinToman: "sekee",
} as const;

function num(v: unknown): number {
  if (typeof v !== "string") return NaN;
  return parseInt(v.replace(/,/g, ""), 10);
}

function rate(entry: Record<string, unknown> | undefined) {
  if (!entry) return null;
  const rial = num(entry.p);
  if (!Number.isFinite(rial)) return null;
  const deltaRial = num(entry.d);
  return {
    toman: rial / 10,
    change: Number.isFinite(deltaRial) ? deltaRial / 10 : 0,
    changePercent: typeof entry.dp === "number" ? entry.dp : 0,
    rising: entry.dt === "high" || (Number.isFinite(deltaRial) && deltaRial > 0),
  };
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(FEED, { next: { revalidate: 0 }, cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: "feed_unavailable" }, { status: 502 });
    }
    const data = (await res.json()) as { current?: Record<string, Record<string, unknown>> };
    const current = data.current;
    const usdToman = rate(current?.[KEYS.usdToman]);
    const gold18Toman = rate(current?.[KEYS.gold18Toman]);
    const emamiCoinToman = rate(current?.[KEYS.emamiCoinToman]);
    if (!usdToman || !gold18Toman || !emamiCoinToman) {
      return NextResponse.json({ error: "feed_incomplete" }, { status: 502 });
    }
    return NextResponse.json(
      { usdToman, gold18Toman, emamiCoinToman, fetchedAt: Date.now() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "feed_failed" }, { status: 502 });
  }
}
