import { NextResponse } from "next/server";

const LEAGUES = {
  eng: { code: "eng.1", name: "لیگ برتر انگلیس" },
  esp: { code: "esp.1", name: "لالیگا اسپانیا" },
  ita: { code: "ita.1", name: "سری آ ایتالیا" },
} as const;

type LeagueKey = keyof typeof LEAGUES;

type EspnStat = { name?: string; abbreviation?: string; value?: number; displayValue?: string };
type EspnEntry = {
  team?: { displayName?: string; shortDisplayName?: string; logos?: Array<{ href?: string }> };
  stats?: EspnStat[];
  note?: { rank?: number };
};

function stat(entry: EspnEntry, names: string[], fallback = 0) {
  const item = entry.stats?.find((s) => names.includes(s.name || "") || names.includes(s.abbreviation || ""));
  return typeof item?.value === "number" ? item.value : Number(item?.displayValue ?? fallback) || fallback;
}

export async function GET(request: Request) {
  const league = new URL(request.url).searchParams.get("league") as LeagueKey | null;
  const selected = league && league in LEAGUES ? league : "eng";
  const config = LEAGUES[selected];

  try {
    const url = `https://site.api.espn.com/apis/v2/sports/soccer/${config.code}/standings`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("Standings request failed");
    const json = (await res.json()) as { children?: Array<{ standings?: { entries?: EspnEntry[] } }> };
    const entries = json.children?.[0]?.standings?.entries ?? [];
    const standings = entries.map((entry, index) => {
      const wins = stat(entry, ["wins", "W"]);
      const draws = stat(entry, ["ties", "draws", "D"]);
      const losses = stat(entry, ["losses", "L"]);
      return {
        rank: stat(entry, ["rank", "RK"], index + 1),
        team: entry.team?.displayName ?? entry.team?.shortDisplayName ?? "",
        logo: entry.team?.logos?.[0]?.href ?? null,
        played: stat(entry, ["gamesPlayed", "GP", "played"]),
        wins,
        draws,
        losses,
        goalDifference: stat(entry, ["pointDifferential", "goalDifference", "GD"]),
        points: stat(entry, ["points", "PTS"]),
      };
    });

    return NextResponse.json({ league: selected, name: config.name, standings }, { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } });
  } catch {
    return NextResponse.json({ league: selected, name: config.name, standings: [], error: true }, { status: 200 });
  }
}
