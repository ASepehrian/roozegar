import { NextResponse } from "next/server";

const SYMBOLS = ["BTCUSDT", "ETHUSDT"] as const;
const BINANCE_HOSTS = [
  "https://api.binance.com",
  "https://api1.binance.com",
  "https://api2.binance.com",
  "https://api3.binance.com",
];

type BinancePrice = { symbol?: string; price?: string };

export const dynamic = "force-dynamic";

async function fetchSymbol(symbol: string): Promise<{ symbol: string; price: number }> {
  let lastError: unknown;
  for (const host of BINANCE_HOSTS) {
    try {
      const res = await fetch(`${host}/api/v3/ticker/price?symbol=${symbol}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error(`price request failed: ${res.status}`);
      const data = (await res.json()) as BinancePrice;
      const price = Number(data.price);
      if (!Number.isFinite(price) || price <= 0) throw new Error("invalid price");
      return { symbol, price };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error("all price sources failed");
}

export async function GET() {
  try {
    const prices = await Promise.all(SYMBOLS.map(fetchSymbol));
    return NextResponse.json(
      { prices, fetchedAt: Date.now() },
      { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
    );
  } catch {
    return NextResponse.json({ error: "crypto_feed_failed" }, { status: 502 });
  }
}
