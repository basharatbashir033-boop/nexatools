import { useState, useMemo } from 'react';
import { Search, Star, Users, FileText, Zap } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { tools } from '../data/tools';
import { Link } from 'react-router-dom';

export default function Hero() {
  const { t, lang } = useApp();
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return tools.filter(tool => tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q) || tool.nameUrdu.includes(q)).slice(0, 8);
  }, [search]);

  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[FileText, Zap, Star, Users].map((Icon, i) => (
          <div key={i} className="absolute text-white/10 animate-float" style={{ left: `${15 + i * 22}%`, top: `${20 + (i % 3) * 25}%`, animationDelay: `${i * 1.5}s` }}>
            <Icon className="w-12 h-12" />
          </div>
        ))}
      </div>
      <div className="relative max-w-4xl mx-auto px-4 py-20 sm:py-28 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">{t('heroTitle')}</h1>
        <p className="text-lg sm:text-xl text-white/70 mb-8 animate-fade-in">{t('heroSubtitle')}</p>
        <div className="relative max-w-xl mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 dark:bg-surface-800/95 text-gray-800 dark:text-gray-100 placeholder-gray-400 shadow-xl focus:ring-2 focus:ring-primary-400 outline-none transition-all"
          />
          {filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-10">
              {filtered.map(tool => (
                <Link key={tool.id} to={`/tool/${tool.slug}`} onClick={() => setSearch('')} className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  <tool.icon className="w-5 h-5" style={{ color: tool.color }} />
                  <div><p className="text-sm font-medium text-gray-800 dark:text-gray-100">{lang === 'ur' ? tool.nameUrdu : tool.name}</p><p className="text-xs text-gray-500">{lang === 'ur' ? tool.descriptionUrdu : tool.description}</p></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
