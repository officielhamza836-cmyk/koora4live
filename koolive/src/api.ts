import type { Game, Team, Stadium } from './types';

// Highlightly API - Direct platform key
const HIGHLIGHTLY_KEY = 'e2d8ce9491ca8e6aa69e89ec4c1749d7';
const HIGHLIGHTLY_BASE = 'https://soccer.highlightly.net';
const WORLD_CUP_LEAGUE_ID = 1635; // World Cup 2026

// WorldCup26.ir - Free public API, no auth needed
const WC_API = 'https://worldcup26.ir';

export interface HLMatch {
  id: number;
  round: string;
  date: string;
  time?: string;
  homeTeam: {
    id: number;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
  };
  league: {
    id: number;
    name: string;
    logo: string;
  };
  state?: {
    description: string;
    score?: {
      home: number | null;
      away: number | null;
    };
    report?: string;
  };
  liveStatus?: string;
}

async function fetchJson<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status} for ${url}`);
  return res.json();
}

// ============ HIGHLIGHTLY (Primary) ============
async function fetchHighlightly<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${HIGHLIGHTLY_BASE}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));

  return fetchJson<T>(url.toString(), {
    'x-rapid-api': HIGHLIGHTLY_KEY,
  });
}

export async function fetchMatchesByDate(date: string): Promise<HLMatch[]> {
  try {
    const res = await fetchHighlightly<{ data: HLMatch[] }>('/matches', {
      leagueId: WORLD_CUP_LEAGUE_ID,
      date,
      timezone: 'Africa/Cairo',
      limit: 50,
    });
    return res.data || [];
  } catch (err) {
    console.warn('Highlightly fetch failed, falling back to worldcup26.ir:', err);
    return [];
  }
}

export async function fetchLiveMatches(): Promise<HLMatch[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const res = await fetchHighlightly<{ data: HLMatch[] }>('/matches', {
      leagueId: WORLD_CUP_LEAGUE_ID,
      date: today,
      timezone: 'Africa/Cairo',
      limit: 50,
    });
    return (res.data || []).filter((m) => {
      const desc = m.state?.description?.toLowerCase() || '';
      return desc === 'in progress' || desc === 'live' || desc === 'halftime';
    });
  } catch (err) {
    console.warn('Highlightly live fetch failed:', err);
    return [];
  }
}

// Convert Highlightly match to our internal Game format
export function hlMatchToGame(m: HLMatch): Game {
  return {
    _id: String(m.id),
    id: String(m.id),
    home_team_id: String(m.homeTeam.id),
    away_team_id: String(m.awayTeam.id),
    home_score: String(m.state?.score?.home ?? 0),
    away_score: String(m.state?.score?.away ?? 0),
    home_scorers: null,
    away_scorers: null,
    group: '',
    matchday: m.round,
    local_date: m.date,
    persian_date: m.date,
    stadium_id: '0',
    finished: m.state?.description === 'Finished' ? 'TRUE' : 'FALSE',
    time_elapsed: m.state?.description === 'In Progress' ? '45' : 'notstarted',
    type: 'group',
    home_team_name_en: m.homeTeam.name,
    home_team_name_fa: m.homeTeam.name,
    away_team_name_en: m.awayTeam.name,
    away_team_name_fa: m.awayTeam.name,
  };
}

export function hlTeamToTeam(m: HLMatch): { home: Team; away: Team } {
  return {
    home: {
      _id: String(m.homeTeam.id),
      id: String(m.homeTeam.id),
      name_en: m.homeTeam.name,
      name_fa: m.homeTeam.name,
      flag: m.homeTeam.logo,
      fifa_code: '',
      iso2: '',
      groups: '',
    },
    away: {
      _id: String(m.awayTeam.id),
      id: String(m.awayTeam.id),
      name_en: m.awayTeam.name,
      name_fa: m.awayTeam.name,
      flag: m.awayTeam.logo,
      fifa_code: '',
      iso2: '',
      groups: '',
    },
  };
}

// ============ WORLD CUP 26 (Fallback) ============
export async function fetchGames(): Promise<Game[]> {
  try {
    const data = await fetchJson<{ games: Game[] }>(`${WC_API}/get/games`);
    return data.games || [];
  } catch (err) {
    console.error('fetchGames error:', err);
    return [];
  }
}

export async function fetchTeams(): Promise<Team[]> {
  try {
    const data = await fetchJson<{ teams: Team[] }>(`${WC_API}/get/teams`);
    return data.teams || [];
  } catch (err) {
    console.error('fetchTeams error:', err);
    return [];
  }
}

export async function fetchStadiums(): Promise<Stadium[]> {
  try {
    const data = await fetchJson<{ stadiums: Stadium[] }>(`${WC_API}/get/stadiums`);
    return data.stadiums || [];
  } catch (err) {
    console.error('fetchStadiums error:', err);
    return [];
  }
}