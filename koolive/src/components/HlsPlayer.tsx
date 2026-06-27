import { useState } from 'react';

interface HlsPlayerProps {
  onClose?: () => void;
  matchTitle?: string;
}

// beIN Sports 1-5 from kora-sia.com (verified working)
const BEIN_CHANNELS = [
  {
    name: 'beIN SPORTS 1',
    ar: 'beIN 1',
    baseUrl: 'https://a.kora-sia.com/albaplayer/bein-1/',
    servers: 4,
    serverLabels: ['رئيسي', 'جوال', 'English', 'Spanish'],
    logo: '🟡',
  },
  {
    name: 'beIN SPORTS 2',
    ar: 'beIN 2',
    baseUrl: 'https://a.kora-sia.com/albaplayer/bein-2/',
    servers: 4,
    serverLabels: ['رئيسي', 'جوال', 'English', 'Spanish'],
    logo: '🟡',
  },
  {
    name: 'beIN SPORTS 3',
    ar: 'beIN 3',
    baseUrl: 'https://a.kora-sia.com/albaplayer/bein-3/',
    servers: 4,
    serverLabels: ['رئيسي', 'جوال', 'English', 'Spanish'],
    logo: '🟡',
  },
  {
    name: 'beIN SPORTS 4',
    ar: 'beIN 4',
    baseUrl: 'https://a.kora-sia.com/albaplayer/bein-4/',
    servers: 4,
    serverLabels: ['رئيسي', 'جوال', 'English', 'Spanish'],
    logo: '🟡',
  },
  {
    name: 'beIN SPORTS 5',
    ar: 'beIN 5',
    baseUrl: 'https://a.kora-sia.com/albaplayer/bein-5/',
    servers: 4,
    serverLabels: ['رئيسي', 'جوال', 'English', 'Spanish'],
    logo: '🟡',
  },
];

// beIN MAX from poiy.online - DEFAULT
const BEIN_MAX = [
  {
    name: 'beIN SPORTS MAX 1',
    ar: 'beIN MAX 1',
    baseUrl: 'https://new.poiy.online/albaplayer/max1/',
    servers: 3,
    serverLabels: ['S1', 'S2', 'S3'],
    logo: '🟠',
  },
  {
    name: 'beIN SPORTS MAX 2',
    ar: 'beIN MAX 2',
    baseUrl: 'https://new.poiy.online/albaplayer/max2/',
    servers: 3,
    serverLabels: ['S1', 'S2', 'S3'],
    logo: '🟠',
  },
];

// Other embed sites
const EMBED_SITES = [
  { name: 'Koora.cc', url: 'https://koora.cc', logo: '🟢' },
  { name: 'Koorasoccer', url: 'https://koorasoccer.com', logo: '⚽' },
  { name: 'Moujaz Koora', url: 'https://moujazkoora.com', logo: '🔴' },
];

type Source = {
  type: 'bein' | 'max' | 'embed';
  id: string;
  name: string;
  url: string;
  logo: string;
  baseUrl: string;
  servers: number;
  serverLabels: string[];
};

export default function HlsPlayer({ onClose, matchTitle }: HlsPlayerProps) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [serverIndex, setServerIndex] = useState(0);

  const allSources: Source[] = [
    // beIN MAX first (default)
    ...BEIN_MAX.map((c) => ({
      type: 'max' as const,
      id: c.name,
      name: c.ar,
      url: `${c.baseUrl}?serv=1`,
      logo: c.logo,
      baseUrl: c.baseUrl,
      servers: c.servers,
      serverLabels: c.serverLabels,
    })),
    // beIN 1-5
    ...BEIN_CHANNELS.map((c) => ({
      type: 'bein' as const,
      id: c.name,
      name: c.ar,
      url: `${c.baseUrl}?serv=1`,
      logo: c.logo,
      baseUrl: c.baseUrl,
      servers: c.servers,
      serverLabels: c.serverLabels,
    })),
    // Other embed sites
    ...EMBED_SITES.map((s) => ({
      type: 'embed' as const,
      id: s.name,
      name: s.name,
      url: s.url,
      logo: s.logo,
      baseUrl: s.url,
      servers: 0,
      serverLabels: [],
    })),
  ];

  const currentSource = allSources[sourceIndex];
  const currentPlayerUrl = currentSource.type !== 'embed' && serverIndex < currentSource.servers
    ? `${currentSource.baseUrl}?serv=${serverIndex + 1}`
    : currentSource.url;

  const handleSourceChange = (idx: number) => {
    setSourceIndex(idx);
    setServerIndex(0);
    setShowAlternatives(false);
  };

  return (
    <div
      className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10"
      style={{ minHeight: '400px' }}
    >
      <iframe
        key={`${currentSource.id}-${serverIndex}`}
        src={currentPlayerUrl}
        className="w-full aspect-video bg-black"
        style={{ minHeight: '400px', border: 0 }}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture; accelerometer; gyroscope"
        allowFullScreen
        referrerPolicy="no-referrer"
        title={matchTitle || 'Live Stream'}
      />

      {/* Header overlay */}
      <div className="absolute top-0 inset-x-0 p-3 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 backdrop-blur text-white rounded-md text-xs font-bold border border-white/10">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            مباشر
          </span>
          {matchTitle && (
            <span className="text-white text-sm font-medium drop-shadow-lg truncate max-w-[200px] sm:max-w-md">
              {matchTitle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          {currentSource.servers > 0 && (
            <div className="flex items-center gap-1 bg-black/70 backdrop-blur rounded-lg p-0.5">
              {Array.from({ length: currentSource.servers }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setServerIndex(idx)}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                    serverIndex === idx
                      ? 'bg-white text-slate-900'
                      : 'text-white hover:bg-white/20'
                  }`}
                  title={currentSource.serverLabels[idx] || `سيرفر ${idx + 1}`}
                >
                  {currentSource.serverLabels[idx] || idx + 1}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowAlternatives(true)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition backdrop-blur"
            title="تغيير القناة"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition backdrop-blur"
              title="إغلاق"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Source indicator */}
      <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur rounded-lg flex items-center gap-2 pointer-events-none">
        <span className="text-base">{currentSource.logo}</span>
        <span className="text-white text-xs font-medium">{currentSource.name}</span>
        {currentSource.servers > 0 && (
          <span className="text-slate-400 text-[10px]">S{serverIndex + 1}</span>
        )}
      </div>

      {/* Source picker modal */}
      {showAlternatives && (
        <div
          className="absolute inset-0 z-20 bg-black/95 backdrop-blur flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowAlternatives(false)}
        >
          <div
            className="bg-slate-900 rounded-2xl p-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4 sticky top-0 bg-slate-900 pb-3 border-b border-white/10 z-10">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                📺
              </div>
              <div>
                <h3 className="text-white font-bold">اختر قناة beIN</h3>
                <p className="text-slate-400 text-xs">جرب قنوات مختلفة إذا لم يعمل البث</p>
              </div>
            </div>

            {/* beIN SPORTS MAX (DEFAULT) */}
            <div className="mb-4">
              <h4 className="text-orange-400 text-xs font-bold mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-orange-500/20 flex items-center justify-center text-[8px] font-extrabold text-orange-300">MAX</span>
                beIN SPORTS MAX (poiy.online) - الافتراضي
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {BEIN_MAX.map((c, idx) => (
                  <button
                    key={c.name}
                    onClick={() => handleSourceChange(idx)}
                    className={`px-3 py-2.5 rounded-lg flex items-center gap-2 transition text-right ${
                      sourceIndex === idx
                        ? 'bg-orange-500/20 border border-orange-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 border border-transparent'
                    }`}
                  >
                    <span className="text-xl">{c.logo}</span>
                    <span className={`text-xs font-bold flex-1 ${sourceIndex === idx ? 'text-orange-300' : 'text-white'}`}>
                      {c.ar}
                    </span>
                    {sourceIndex === idx && <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />}
                  </button>
                ))}
              </div>
              <p className="text-slate-500 text-[10px] mt-2">3 سيرفرات لكل قناة: S1, S2, S3</p>
            </div>

            {/* beIN 1-5 from kora-sia.com */}
            <div className="mb-4">
              <h4 className="text-amber-400 text-xs font-bold mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-amber-500/20 flex items-center justify-center text-[8px] font-extrabold text-amber-300">beIN</span>
                beIN SPORTS 1-5 (kora-sia.com)
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {BEIN_CHANNELS.map((c, idx) => {
                  const sourceId = BEIN_MAX.length + idx;
                  return (
                    <button
                      key={c.name}
                      onClick={() => handleSourceChange(sourceId)}
                      className={`px-3 py-2.5 rounded-lg flex flex-col items-center gap-1 transition ${
                        sourceIndex === sourceId
                          ? 'bg-amber-500/20 border border-amber-500/40'
                          : 'bg-slate-800 hover:bg-slate-700 border border-transparent'
                      }`}
                    >
                      <span className="text-xl">{c.logo}</span>
                      <span className={`text-xs font-bold ${sourceIndex === sourceId ? 'text-amber-300' : 'text-white'}`}>
                        {c.ar}
                      </span>
                      {sourceIndex === sourceId && <span className="w-1 h-1 bg-amber-400 rounded-full" />}
                    </button>
                  );
                })}
              </div>
              <p className="text-slate-500 text-[10px] mt-2">4 سيرفرات لكل قناة: رئيسي، جوال، English، Spanish</p>
            </div>

            {/* Embed sites */}
            <div className="mb-4">
              <h4 className="text-slate-500 text-xs font-bold mb-2">مواقع بث بديلة</h4>
              <div className="space-y-2">
                {EMBED_SITES.map((s, idx) => {
                  const sourceId = BEIN_MAX.length + BEIN_CHANNELS.length + idx;
                  return (
                    <button
                      key={s.name}
                      onClick={() => handleSourceChange(sourceId)}
                      className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-2 transition text-right ${
                        sourceIndex === sourceId
                          ? 'bg-slate-700 border border-white/20'
                          : 'bg-slate-800 hover:bg-slate-700 border border-transparent'
                      }`}
                    >
                      <span className="text-xl">{s.logo}</span>
                      <span className={`text-sm font-bold flex-1 ${sourceIndex === sourceId ? 'text-white' : 'text-slate-300'}`}>
                        {s.name}
                      </span>
                      {sourceIndex === sourceId && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setShowAlternatives(false)}
              className="w-full mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}