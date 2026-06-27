interface HeaderProps {
  currentTime: string;
}

export default function Header({ currentTime }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">التوقيت:</span>
          <span className="font-mono font-bold text-white">{currentTime}</span>
          <span className="text-slate-500 text-[10px]">GMT</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-400 text-[11px]">
          <span>كأس العالم 2026</span>
          <span className="text-slate-600">|</span>
          <span>أمريكا - كندا - المكسيك</span>
        </div>
      </div>
    </header>
  );
}