import { useEffect, useMemo, useState } from 'react';
import { fetchMatchesByDate, hlMatchToGame, hlTeamToTeam, type HLMatch } from './api';
import type { Team } from './types';
import Header from './components/Header';
import MatchCard from './components/MatchCard';
import HlsPlayer from './components/HlsPlayer';
import Footer from './components/Footer';

function getGmtTime(): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'GMT',
    }).format(new Date());
  } catch {
    return new Date().toLocaleTimeString();
  }
}

function isMatchLive(m: HLMatch): boolean {
  const desc = m.state?.description?.toLowerCase() || '';
  return desc === 'in progress' || desc === 'live' || desc === 'halftime';
}

export default function App() {
  const [allMatches, setAllMatches] = useState<HLMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMatch, setActiveMatch] = useState<{
    title: string;
    subtitle: string;
    stadium?: string;
    date?: string;
    competition: string;
    homeLogo?: string;
    awayLogo?: string;
  } | null>(null);
  const [time, setTime] = useState(getGmtTime());

  // Fetch matches
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date();
      const dates: string[] = [];
      for (let i = -1; i <= 3; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
      }

      const allResults: HLMatch[] = [];
      const seen = new Set<number>();

      for (const date of dates) {
        const matches = await fetchMatchesByDate(date);
        for (const m of matches) {
          if (!seen.has(m.id)) {
            seen.add(m.id);
            allResults.push(m);
          }
        }
      }

      // Fallback to worldcup26.ir
      if (allResults.length === 0) {
        const { fetchGames, fetchTeams } = await import('./api');
        const [games, teams] = await Promise.all([fetchGames(), fetchTeams()]);
        for (const g of games) {
          if (seen.has(parseInt(g.id))) continue;
          seen.add(parseInt(g.id));
          const home = teams.find((t) => t.id === g.home_team_id);
          const away = teams.find((t) => t.id === g.away_team_id);
          if (home && away) {
            allResults.push({
              id: parseInt(g.id) || Math.random(),
              round: g.matchday,
              date: g.local_date,
              homeTeam: { id: parseInt(home.id), name: home.name_en, logo: home.flag },
              awayTeam: { id: parseInt(away.id), name: away.name_en, logo: away.flag },
              league: { id: 0, name: 'FIFA World Cup 2026', logo: '' },
              state: {
                description: g.finished === 'TRUE' ? 'Finished' : (g.time_elapsed === 'notstarted' ? 'Not Started' : 'In Progress'),
                score: { home: parseInt(g.home_score) || 0, away: parseInt(g.away_score) || 0 },
              },
            });
          }
        }
      }

      setAllMatches(allResults);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('تعذر تحميل البيانات. حاول مرة أخرى.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTime(getGmtTime()), 30000);
    return () => clearInterval(id);
  }, []);

  // Sort: live first, then by date
  const sortedMatches = useMemo(() => {
    return [...allMatches].sort((a, b) => {
      const aLive = isMatchLive(a);
      const bLive = isMatchLive(b);
      if (aLive && !bLive) return -1;
      if (!aLive && bLive) return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [allMatches]);

  const liveCount = useMemo(() => allMatches.filter(isMatchLive).length, [allMatches]);

  const openMatch = (m: HLMatch) => {
    setActiveMatch({
      title: `${m.homeTeam.name} ضد ${m.awayTeam.name}`,
      subtitle: m.league.name + (m.round ? ` - ${m.round}` : ''),
      date: new Date(m.date).toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
      competition: m.league.name,
      homeLogo: m.homeTeam.logo,
      awayLogo: m.awayTeam.logo,
    });
    document.body.style.overflow = 'hidden';
  };

  const closeMatch = () => {
    setActiveMatch(null);
    document.body.style.overflow = '';
  };

  const convertToCardProps = (m: HLMatch) => {
    const game = hlMatchToGame(m);
    const teams = hlTeamToTeam(m);
    return { game, teams: [teams.home, teams.away] };
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 text-slate-900">
      <Header currentTime={time} />

      {/* Light header with GMT time */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  كورة <span className="text-emerald-600">لايف</span>
                </h1>
                <p className="text-slate-500 text-xs mt-0.5">بث مباشر لجميع المباريات - beIN Sports MAX</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-slate-600">آخر تحديث (GMT):</span>
              <span className="text-slate-900 font-mono font-bold">{time}</span>
              {liveCount > 0 && (
                <span className="mr-2 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded">
                  {liveCount} جارية الآن
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* All matches in one list */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse h-20" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-700 font-semibold">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white text-sm font-medium transition"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : sortedMatches.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <span className="text-3xl">⚽</span>
            </div>
            <h3 className="text-slate-900 font-bold text-lg mb-1">لا توجد مباريات حالياً</h3>
            <p className="text-slate-500 text-sm">جرب العودة لاحقاً</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedMatches.map((m) => {
              const { game, teams } = convertToCardProps(m);
              return (
                <MatchCard
                  key={m.id}
                  game={game}
                  teams={teams as Team[]}
                  onClick={() => openMatch(m)}
                />
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {/* Video modal */}
      {activeMatch && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={closeMatch}
        >
          <div
            className="w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-gradient-to-r from-slate-900 to-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                {activeMatch.homeLogo && (
                  <img
                    src={activeMatch.homeLogo}
                    className="w-8 h-8 rounded-full ring-1 ring-white/20 object-contain bg-white/5"
                    alt=""
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <div className="text-white font-bold text-sm sm:text-base truncate min-w-0">
                  {activeMatch.title}
                </div>
                {activeMatch.awayLogo && (
                  <img
                    src={activeMatch.awayLogo}
                    className="w-8 h-8 rounded-full ring-1 ring-white/20 object-contain bg-white/5"
                    alt=""
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
              <button
                onClick={closeMatch}
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="p-2 sm:p-4 bg-black">
              <HlsPlayer matchTitle={activeMatch.title} />
            </div>

            <div className="p-4 bg-slate-900 border-t border-white/5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">البطولة</p>
                  <p className="text-white text-sm font-semibold truncate">{activeMatch.competition}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">التاريخ</p>
                  <p className="text-white text-sm font-semibold truncate">{activeMatch.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">الجولة</p>
                  <p className="text-emerald-400 text-sm font-bold truncate">{activeMatch.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}