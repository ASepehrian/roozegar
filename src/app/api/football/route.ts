import { NextResponse } from "next/server";

const LEAGUES = {
  eng: { code: "eng.1", name: "لیگ برتر انگلیس" },
  esp: { code: "esp.1", name: "لالیگا اسپانیا" },
  ita: { code: "ita.1", name: "سری آ ایتالیا" },
} as const;

type LeagueKey = keyof typeof LEAGUES;

type EspnEvent = {
  id: string;
  date: string;
  name?: string;
  competitions?: Array<{
    status?: { type?: { state?: string; shortDetail?: string; detail?: string } };
    competitors?: Array<{
      homeAway?: "home" | "away";
      team?: { displayName?: string; shortDisplayName?: string; logo?: string };
      score?: string;
    }>;
  }>;
};

function yyyymmdd(date: Date) {
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

async function fetchDay(code: string, date: Date): Promise<EspnEvent[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${code}/scoreboard?dates=${yyyymmdd(date)}&limit=100`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  const json = (await res.json()) as { events?: EspnEvent[] };
  return json.events ?? [];
}

export async function GET(request: Request) {
  const league = new URL(request.url).searchParams.get("league") as LeagueKey | null;
  const selected = league && league in LEAGUES ? league : "eng";
  const config = LEAGUES[selected];
  const now = new Date();

  const dates = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    return d;
  });

  try {
    const groups = await Promise.all(dates.map((date) => fetchDay(config.code, date)));
    const events = groups.flat().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const seen = new Set<string>();
    const matches = events.flatMap((event) => {
      if (seen.has(event.id)) return [];
      seen.add(event.id);
      const competition = event.competitions?.[0];
      const competitors = competition?.competitors ?? [];
      const home = competitors.find((c) => c.homeAway === "home");
      const away = competitors.find((c) => c.homeAway === "away");
      if (!home?.team || !away?.team) return [];
      const state = competition?.status?.type?.state ?? "pre";
      const detail = competition?.status?.type?.shortDetail || competition?.status?.type?.detail || "";
      return [{
        id: event.id,
        date: event.date,
        state,
        detail,
        home: { name: home.team.displayName ?? home.team.shortDisplayName ?? "", logo: home.team.logo ?? null, score: home.score ?? null },
        away: { name: away.team.displayName ?? away.team.shortDisplayName ?? "", logo: away.team.logo ?? null, score: away.score ?? null },
      }];
    });

    const completed = matches.filter((m) => m.state === "post").slice(0, 6);
    const live = matches.filter((m) => m.state === "in").slice(0, 2);
    const upcoming = matches.filter((m) => m.state === "pre").slice(0, 2);

    return NextResponse.json({ league: selected, name: config.name, matches: [...live, ...completed, ...upcoming] }, { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } });
  } catch {
    return NextResponse.json({ league: selected, name: config.name, matches: [], error: true }, { status: 200 });
  }
}
