import type { Game, Team } from '../types';

interface MatchCardProps {
  game: Game;
  teams: Team[];
  stadiumName?: string;
  onClick: () => void;
}

function getStatusInfo(game: Game) {
  if (game.finished === 'TRUE') {
    return { label: 'انتهت', color: 'text-slate-400', bg: 'bg-slate-700/40' };
  }
  if (game.time_elapsed === 'notstarted') {
    return { label: 'لم تبدأ', color: 'text-slate-300', bg: 'bg-slate-700/40' };
  }
  return { label: `جارية - ${game.time_elapsed}'`, color: 'text-slate-200', bg: 'bg-slate-700/40' };
}

function extractTime(dateStr: string): string {
  const parts = dateStr.split(' ');
  return parts[1] || '';
}

const BEIN_CHANNELS = [
  'beIN SPORTS MAX 1 HD',
  'beIN SPORTS MAX 2 HD',
  'beIN SPORTS MAX 3 HD',
  'beIN SPORTS MAX 4 HD',
  'beIN SPORTS MAX 5 HD',
];

const COMMENTATORS = [
  'تعليق: عصام الشوالي',
  'تعليق: رؤوف خليف',
  'تعليق: حفيظ دراجي',
  'تعليق: بلال علام',
  'تعليق: خالد الغول',
  'تعليق: محمد الشامسي',
  'تعليق: عدنان البلوشي',
  'تعليق: أحمد الطيب',
];

function pickById(id: string, arr: string[]): string {
  const num = parseInt(id, 10) || 0;
  return arr[num % arr.length];
}

export default function MatchCard({ game, teams, stadiumName, onClick }: MatchCardProps) {
  const homeTeam = teams.find((t) => t.id === game.home_team_id);
  const awayTeam = teams.find((t) => t.id === game.away_team_id);

  const status = getStatusInfo(game);
  const time = extractTime(game.local_date);
  const channel = pickById(game.id, BEIN_CHANNELS);
  const commentator = pickById(game.id + 'c', COMMENTATORS);

  const leagueLabel = game.type === 'group'
    ? `كأس العالم - المجموعة ${game.group}`
    : game.type === 'r16'
    ? 'دوري الـ 16 - كأس العالم'
    : game.type === 'qf'
    ? 'دوري ربع النهائي - كأس العالم'
    : game.type === 'sf'
    ? 'دوري نصف النهائي - كأس العالم'
    : game.type === 'f'
    ? 'النهائي - كأس العالم'
    : 'كأس العالم 2026';

  return (
    <button
      onClick={onClick}
      className="group w-full text-right bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5"
    >
      <div className="flex items-stretch">
        {/* Home team */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-5 px-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 p-1.5 ring-1 ring-white/10 group-hover:ring-white/30 transition-all overflow-hidden">
            {homeTeam ? (
              <img
                src={homeTeam.flag}
                alt={homeTeam.name_fa || homeTeam.name_en}
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-xs">
                {game.home_team_label?.slice(0, 3) || 'TBD'}
              </div>
            )}
          </div>
          <p className="text-white text-xs sm:text-sm font-semibold text-center leading-tight line-clamp-2">
            {homeTeam?.name_fa || homeTeam?.name_en || game.home_team_label || 'الفريق 1'}
          </p>
        </div>

        {/* Score / Time center */}
        <div className="flex flex-col items-center justify-center gap-1 px-3 py-5 min-w-[110px] sm:min-w-[140px]">
          {game.finished === 'TRUE' || game.time_elapsed !== 'notstarted' ? (
            <>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {game.home_score}
                </span>
                <span className="text-slate-500 text-xl font-light">-</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {game.away_score}
                </span>
              </div>
              <div className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${status.bg} ${status.color}`}>
                {status.label}
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-200 tracking-tight">
                {time}
              </div>
              <div className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${status.bg} ${status.color}`}>
                {status.label}
              </div>
            </>
          )}
        </div>

        {/* Away team */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-5 px-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 p-1.5 ring-1 ring-white/10 group-hover:ring-white/30 transition-all overflow-hidden">
            {awayTeam ? (
              <img
                src={awayTeam.flag}
                alt={awayTeam.name_fa || awayTeam.name_en}
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-xs">
                {game.away_team_label?.slice(0, 3) || 'TBD'}
              </div>
            )}
          </div>
          <p className="text-white text-xs sm:text-sm font-semibold text-center leading-tight line-clamp-2">
            {awayTeam?.name_fa || awayTeam?.name_en || game.away_team_label || 'الفريق 2'}
          </p>
        </div>
      </div>

      {/* Footer info */}
      <div className="border-t border-white/5 bg-black/30 px-4 py-2.5 space-y-1.5">
        <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-slate-400">
          <li className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 3L3 3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"/>
            </svg>
            <span className="text-slate-300 font-medium">{channel}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
            <span>{commentator}</span>
          </li>
          <li className="flex items-center gap-1.5 truncate max-w-full">
            <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span className="truncate">{stadiumName || 'ملعب كأس العالم'}</span>
          </li>
        </ul>
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
          <span className="text-[11px] text-slate-500 truncate">{leagueLabel}</span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium group-hover:text-white transition">
            شاهد البث
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </span>
        </div>
      </div>
    </button>
  );
}