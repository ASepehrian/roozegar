"use client";

import { useEffect, useState } from "react";
import { toFa } from "@/lib/calendar";

type League = "eng" | "esp" | "ita";
type Match = {
  id: string;
  date: string;
  state: "pre" | "in" | "post";
  detail: string;
  home: { name: string; logo: string | null; score: string | null };
  away: { name: string; logo: string | null; score: string | null };
};

type ResponseData = { league: League; name: string; matches: Match[]; error?: boolean };

const LEAGUES: Array<{ id: League; label: string; icon: string }> = [
  { id: "eng", label: "لیگ برتر انگلیس", icon: "⚽" },
  { id: "esp", label: "لالیگا اسپانیا", icon: "🇪🇸" },
  { id: "ita", label: "سری آ ایتالیا", icon: "🇮🇹" },
];

function MatchRow({ match }: { match: Match }) {
  const time = new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tehran" }).format(new Date(match.date));
  const status = match.state === "post" ? "پایان" : match.state === "in" ? match.detail || "زنده" : time;
  return <div className="football-match">
    <div className="football-team away"><span>{match.away.name}</span>{match.away.logo && <img src={match.away.logo} alt="" loading="lazy" />}</div>
    <div className="football-score">{match.state === "pre" ? <span className="football-time">{status}</span> : <strong>{toFa(Number(match.home.score ?? 0))} - {toFa(Number(match.away.score ?? 0))}</strong>}<small className={match.state === "in" ? "live" : ""}>{status}</small></div>
    <div className="football-team home"><img src={match.home.logo ?? ""} alt="" loading="lazy" /><span>{match.home.name}</span></div>
  </div>;
}

export default function FootballResults() {
  const [league, setLeague] = useState<League>("eng");
  const [data, setData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/football?league=${league}`)
      .then((res) => res.json() as Promise<ResponseData>)
      .then((next) => { if (!cancelled) setData(next); })
      .catch(() => { if (!cancelled) setData({ league, name: "", matches: [], error: true }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [league]);

  return <section className="football-card" aria-label="نتایج لیگ‌های اروپایی">
    <div className="football-head"><div><span className="football-ball">⚽</span><h2>نتایج لیگ‌های اروپایی</h2></div><span className="football-more">مشاهده همه ›</span></div>
    <div className="football-tabs" role="tablist" aria-label="انتخاب لیگ">{LEAGUES.map((item) => <button key={item.id} role="tab" aria-selected={league === item.id} className={league === item.id ? "football-tab active" : "football-tab"} onClick={() => setLeague(item.id)}><span>{item.icon}</span>{item.label}</button>)}</div>
    <div className="football-league-title"><strong>{data?.name || LEAGUES.find((x) => x.id === league)?.label}</strong><span>⌄</span></div>
    <div className="football-list">{loading ? <div className="football-empty">در حال دریافت نتایج…</div> : data?.matches?.length ? data.matches.slice(0, 6).map((match) => <MatchRow key={match.id} match={match} />) : <div className="football-empty">نتیجه‌ای برای نمایش پیدا نشد.</div>}</div>
    <div className="football-footer">مشاهده جدول کامل {data?.name || "لیگ"} <span>‹</span></div>
  </section>;
}
