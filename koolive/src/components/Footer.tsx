interface FooterLink {
  label: string;
  href: string;
}

const FOOTER_SECTIONS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'أهم البطولات',
    links: [
      { label: 'كأس العالم 2026', href: 'https://www.samokoora.com' },
      { label: 'دوري أبطال أوروبا', href: 'https://www.samokoora.com' },
      { label: 'الدوري الإنجليزي', href: 'https://www.samokoora.com' },
      { label: 'الدوري الإسباني', href: 'https://www.samokoora.com' },
      { label: 'الدوري الإيطالي', href: 'https://www.samokoora.com' },
      { label: 'الدوري الألماني', href: 'https://www.samokoora.com' },
      { label: 'الدوري الفرنسي', href: 'https://www.samokoora.com' },
      { label: 'دوري أبطال آسيا', href: 'https://www.samokoora.com' },
      { label: 'كأس العرب', href: 'https://www.samokoora.com' },
      { label: 'كأس أمم أفريقيا', href: 'https://www.samokoora.com' },
    ],
  },
  {
    title: 'القنوات الناقلة',
    links: [
      { label: 'beIN SPORTS HD', href: 'https://www.samokoora.com' },
      { label: 'beIN SPORTS MAX', href: 'https://www.samokoora.com' },
      { label: 'SSC الرياضية', href: 'https://www.samokoora.com' },
      { label: 'Alkass One HD', href: 'https://www.samokoora.com' },
      { label: 'Abu Dhabi Sports', href: 'https://www.samokoora.com' },
      { label: 'Dubai Sports', href: 'https://www.samokoora.com' },
      { label: 'Saudi Sports', href: 'https://www.samokoora.com' },
      { label: 'Sharjah Sports', href: 'https://www.samokoora.com' },
    ],
  },
  {
    title: 'المنتخبات العربية',
    links: [
      { label: 'المنتخب المغربي', href: 'https://www.samokoora.com' },
      { label: 'المنتخب المصري', href: 'https://www.samokoora.com' },
      { label: 'المنتخب السعودي', href: 'https://www.samokoora.com' },
      { label: 'المنتخب التونسي', href: 'https://www.samokoora.com' },
      { label: 'المنتخب الجزائري', href: 'https://www.samokoora.com' },
      { label: 'المنتخب القطري', href: 'https://www.samokoora.com' },
      { label: 'المنتخب الإماراتي', href: 'https://www.samokoora.com' },
      { label: 'المنتخب العراقي', href: 'https://www.samokoora.com' },
      { label: 'المنتخب الأردني', href: 'https://www.samokoora.com' },
    ],
  },
  {
    title: 'روابط مهمة',
    links: [
      { label: 'مباريات اليوم', href: 'https://www.samokoora.com' },
      { label: 'مباريات الغد', href: 'https://www.samokoora.com' },
      { label: 'نتائج المباريات', href: 'https://www.samokoora.com' },
      { label: 'ترتيب الدوري الإنجليزي', href: 'https://www.samokoora.com' },
      { label: 'ترتيب الدوري الإسباني', href: 'https://www.samokoora.com' },
      { label: 'أخبار الانتقالات', href: 'https://www.samokoora.com' },
      { label: 'أخبار كرة القدم', href: 'https://www.samokoora.com' },
      { label: 'تطبيق كورة لايف', href: 'https://www.samokoora.com' },
      { label: 'اتصل بنا', href: 'https://www.samokoora.com' },
      { label: 'سياسة الخصوصية', href: 'https://www.samokoora.com' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 text-slate-300">
      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full" />
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-emerald-400 transition" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Social + Copyright */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">كورة لايف - Koora Live</p>
              <p className="text-slate-500 text-xs">موقعك الأول لمتابعة كرة القدم مباشرة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a href="https://www.samokoora.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-500 flex items-center justify-center transition" title="Facebook">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
            </a>
            <a href="https://www.samokoora.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-500 flex items-center justify-center transition" title="Twitter / X">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.samokoora.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-500 flex items-center justify-center transition" title="YouTube">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582 6.186a2.506 2.506 0 0 0-1.768-1.768C18.254 4 12 4 12 4s-6.254 0-7.814.418a2.506 2.506 0 0 0-1.768 1.768C2 7.746 2 12 2 12s0 4.254.418 5.814a2.506 2.506 0 0 0 1.768 1.768C5.746 20 12 20 12 20s6.254 0 7.814-.418a2.506 2.506 0 0 0 1.768-1.768C22 16.254 22 12 22 12s0-4.254-.418-5.814zM10 15.464V8.536L16 12l-6 3.464z"/></svg>
            </a>
            <a href="https://www.samokoora.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-500 flex items-center justify-center transition" title="Telegram">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            <a href="https://www.samokoora.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-500 flex items-center justify-center transition" title="WhatsApp">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            </a>
          </div>
        </div>

        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <p>© 2026 كورة لايف - Koora Live. جميع الحقوق محفوظة.</p>
            <p className="flex items-center gap-1.5">
              <span>البث المباشر لأهم المباريات</span>
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}