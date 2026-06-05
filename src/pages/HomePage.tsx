import { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import ToolCard from '../components/ToolCard';
import { tools, type ToolCategory } from '../data/tools';
import { useApp } from '../contexts/AppContext';

export default function HomePage() {
  const { t } = useApp();
  const [active, setActive] = useState<ToolCategory | 'all'>('all');
  const filtered = useMemo(() => active === 'all' ? tools : tools.filter(t => t.category === active), [active]);

  const catKeys: { key: ToolCategory | 'all'; label: string }[] = [
    { key: 'all', label: t('allTools') }, { key: 'image', label: t('imageTools') },
    { key: 'pdf', label: t('pdfTools') }, { key: 'text', label: t('textTools') },
    { key: 'other', label: t('otherTools') },
  ];

  return (
    <>
      <Hero />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {catKeys.map(cat => (
            <button key={cat.key} onClick={() => setActive(cat.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${active === cat.key ? 'bg-primary-400 text-white shadow-lg shadow-primary-400/30' : 'bg-white dark:bg-surface-800 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-100 dark:border-gray-700'}`}>
              {cat.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((tool, i) => (
            <div key={tool.id}>
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
