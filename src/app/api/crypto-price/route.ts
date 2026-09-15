import { NextResponse } from "next/server";

const SYMBOLS = ["BTCUSDT", "ETHUSDT"] as const;

type BinancePrice = { symbol?: string; price?: string };

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const prices = await Promise.all(
      SYMBOLS.map(async (symbol) => {
        const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`price request failed: ${res.status}`);
        const data = (await res.json()) as BinancePrice;
        const price = Number(data.price);
        if (!Number.isFinite(price)) throw new Error("invalid price");
        return { symbol, price };
      })
    );

    return NextResponse.json(
      { prices, fetchedAt: Date.now() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "crypto_feed_failed" }, { status: 502 });
  }
}
