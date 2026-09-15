import { NextResponse } from "next/server";

const SYMBOLS = ["BTCUSDT", "ETHUSDT"] as const;
const BINANCE_HOSTS = [
  "https://api.binance.com",
  "https://api1.binance.com",
  "https://api2.binance.com",
  "https://api3.binance.com",
];

type PriceResult = { symbol: "BTCUSDT" | "ETHUSDT"; price: number };

type BinancePrice = { symbol?: string; price?: string };

export const dynamic = "force-dynamic";

async function fetchBinanceSymbol(symbol: string): Promise<PriceResult> {
  let lastError: unknown;
  for (const host of BINANCE_HOSTS) {
    try {
      const res = await fetch(`${host}/api/v3/ticker/price?symbol=${symbol}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(3500),
      });
      if (!res.ok) throw new Error(`binance ${res.status}`);
      const data = (await res.json()) as BinancePrice;
      const price = Number(data.price);
      if (!Number.isFinite(price) || price <= 0) throw new Error("invalid binance price");
      return { symbol: symbol as PriceResult["symbol"], price };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error("binance unavailable");
}

async function fetchCoinbaseSymbol(symbol: PriceResult["symbol"]): Promise<PriceResult> {
  const pair = symbol === "BTCUSDT" ? "BTC-USD" : "ETH-USD";
  const res = await fetch(`https://api.coinbase.com/v2/prices/${pair}/spot`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(3500),
  });
  if (!res.ok) throw new Error(`coinbase ${res.status}`);
  const data = (await res.json()) as { data?: { amount?: string } };
  const price = Number(data.data?.amount);
  if (!Number.isFinite(price) || price <= 0) throw new Error("invalid coinbase price");
  return { symbol, price };
}

async function fetchCoinGecko(): Promise<PriceResult[]> {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd",
    { cache: "no-store", headers: { Accept: "application/json" }, signal: AbortSignal.timeout(3500) }
  );
  if (!res.ok) throw new Error(`coingecko ${res.status}`);
  const data = (await res.json()) as { bitcoin?: { usd?: number }; ethereum?: { usd?: number } };
  const btc = Number(data.bitcoin?.usd);
  const eth = Number(data.ethereum?.usd);
  if (!Number.isFinite(btc) || !Number.isFinite(eth) || btc <= 0 || eth <= 0) {
    throw new Error("invalid coingecko prices");
  }
  return [
    { symbol: "BTCUSDT", price: btc },
    { symbol: "ETHUSDT", price: eth },
  ];
}

export async function GET() {
  const prices: Partial<Record<PriceResult["symbol"], PriceResult>> = {};

  // Try Binance first, independently for each symbol. One failed symbol must not hide the other.
  const binanceResults = await Promise.allSettled(SYMBOLS.map(fetchBinanceSymbol));
  for (const result of binanceResults) {
    if (result.status === "fulfilled") prices[result.value.symbol] = result.value;
  }

  // Coinbase is a second independent live source.
  for (const symbol of SYMBOLS) {
    if (prices[symbol]) continue;
    try {
      prices[symbol] = await fetchCoinbaseSymbol(symbol);
    } catch {
      // Continue to the final fallback.
    }
  }

  // CoinGecko provides both prices in one fallback request.
  if (!prices.BTCUSDT || !prices.ETHUSDT) {
    try {
      const fallback = await fetchCoinGecko();
      for (const item of fallback) {
        if (!prices[item.symbol]) prices[item.symbol] = item;
      }
    } catch {
      // Return whatever was successfully obtained below.
    }
  }

  const result = SYMBOLS
    .map((symbol) => prices[symbol])
    .filter((item): item is PriceResult => Boolean(item));

  if (result.length === 0) {
    return NextResponse.json({ error: "crypto_feed_failed" }, { status: 502 });
  }

  return NextResponse.json(
    { prices: result, fetchedAt: Date.now() },
    { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
  );
}
