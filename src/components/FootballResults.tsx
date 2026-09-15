"use client";

import { useEffect, useState } from "react";
import { toFa } from "@/lib/calendar";

type League = "eng" | "esp" | "ita";
type Match = {
  id: string; date: string; state: "pre" | "in" | "post"; detail: string;
  home: { name: string; logo: string | null; score: string | null };
  away: { name: string; logo: string | null; score: string | null };
};
type Standing = {
  rank: number; team: string; logo: string | null; played: number; wins: number;
  draws: number; losses: number; goalDifference: number; points: number;
};
type ResponseData = { league: League; name: string; matches: Match[]; error?: boolean };
type StandingsData = { league: League; name: string; standings: Standing[]; error?: boolean };

const LEAGUES: Array<{ id: League; label: string; icon: string }> = [
  { id: "eng", label: "لیگ برتر انگلیس", icon: "⚽" },
  { id: "esp", label: "لالیگا اسپانیا", icon: "🇪🇸" },
  { id: "ita", label: "سری آ ایتالیا", icon: "🇮🇹" },
];

function logoSrc(url: string | null) {
  return url ? `/api/football/logo?url=${encodeURIComponent(url)}` : null;
}

function Logo({ url, className }: { url: string | null; className?: string }) {
  const src = logoSrc(url);
  if (!src) return null;
  return <img className={className} src={src} alt="" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = "none"; }} />;
}

function MatchRow({ match }: { match: Match }) {
  const time = new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tehran" }).format(new Date(match.date));
  const status = match.state === "post" ? "پایان" : match.state === "in" ? match.detail || "زنده" : time;
  return <div className="football-match">
    <div className="football-team home"><span>{match.home.name}</span><Logo url={match.home.logo} /></div>
    <div className="football-score">{match.state === "pre" ? <span className="football-time">{status}</span> : <strong>{toFa(Number(match.home.score ?? 0))} - {toFa(Number(match.away.score ?? 0))}</strong>}<small className={match.state === "in" ? "live" : ""}>{status}</small></div>
    <div className="football-team away"><Logo url={match.away.logo} /><span>{match.away.name}</span></div>
  </div>;
}

export default function FootballResults() {
  const [league, setLeague] = useState<League>("eng");
  const [data, setData] = useState<ResponseData | null>(null);
  const [standings, setStandings] = useState<StandingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setShowTable(false);
    setStandings(null);
    fetch(`/api/football?league=${league}`)
      .then((res) => res.json() as Promise<ResponseData>)
      .then((next) => { if (!cancelled) setData(next); })
      .catch(() => { if (!cancelled) setData({ league, name: "", matches: [], error: true }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [league]);

  const openTable = () => {
    if (showTable) { setShowTable(false); return; }
    setShowTable(true);
    if (standings) return;
    setTableLoading(true);
    fetch(`/api/football/standings?league=${league}`)
      .then((res) => res.json() as Promise<StandingsData>)
      .then((next) => setStandings(next))
      .catch(() => setStandings({ league, name: data?.name || "", standings: [], error: true }))
      .finally(() => setTableLoading(false));
  };

  return <section className="football-card" aria-label="نتایج لیگ‌های اروپایی">
    <div className="football-head"><div><span className="football-ball">⚽</span><h2>نتایج لیگ‌های اروپایی</h2></div><button className="football-more" type="button" onClick={openTable}>{showTable ? "بستن جدول" : "مشاهده جدول کامل"} ›</button></div>
    <div className="football-tabs" role="tablist" aria-label="انتخاب لیگ">{LEAGUES.map((item) => <button key={item.id} type="button" role="tab" aria-selected={league === item.id} className={league === item.id ? "football-tab active" : "football-tab"} onClick={() => setLeague(item.id)}><span>{item.icon}</span>{item.label}</button>)}</div>
    <div className="football-league-title"><strong>{data?.name || LEAGUES.find((x) => x.id === league)?.label}</strong><span>⌄</span></div>
    <div className="football-list">{loading ? <div className="football-empty">در حال دریافت نتایج…</div> : data?.matches?.length ? data.matches.slice(0, 6).map((match) => <MatchRow key={match.id} match={match} />) : <div className="football-empty">نتیجه‌ای برای نمایش پیدا نشد.</div>}</div>
    <button className="football-footer" type="button" onClick={openTable}>{showTable ? "بستن جدول" : `مشاهده جدول کامل ${data?.name || "لیگ"}`} <span>{showTable ? "⌃" : "‹"}</span></button>
    {showTable && <div className="football-standings">
      {tableLoading ? <div className="football-empty">در حال دریافت جدول…</div> : standings?.standings?.length ? <div className="football-table-wrap"><table><thead><tr><th>#</th><th>تیم</th><th>بازی</th><th>برد</th><th>مساوی</th><th>باخت</th><th>تفاضل</th><th>امتیاز</th></tr></thead><tbody>{standings.standings.map((row) => <tr key={`${row.rank}-${row.team}`}><td>{toFa(row.rank)}</td><td><span className="football-table-team"><Logo url={row.logo} />{row.team}</span></td><td>{toFa(row.played)}</td><td>{toFa(row.wins)}</td><td>{toFa(row.draws)}</td><td>{toFa(row.losses)}</td><td>{toFa(row.goalDifference)}</td><td><strong>{toFa(row.points)}</strong></td></tr>)}</tbody></table></div> : <div className="football-empty">جدول این لیگ در دسترس نیست.</div>}
    </div>}
  </section>;
}
