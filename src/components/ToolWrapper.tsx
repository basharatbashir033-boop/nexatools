import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Info, List, MessageSquare, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getToolBySlug, getRelatedTools } from '../data/tools';
import ToolCard from './ToolCard';

interface ToolWrapperProps { slug: string; children: ReactNode; }

export default function ToolWrapper({ slug, children }: ToolWrapperProps) {
  const { t, lang } = useApp();
  const tool = getToolBySlug(slug);
  const [activeTab, setActiveTab] = useState<'tool' | 'about' | 'faq'>('tool');

  if (!tool) return <div className="max-w-4xl mx-auto px-4 py-16 text-center">{t('notFoundTitle')}</div>;
  const related = getRelatedTools(tool);
  const catLabel = tool.category === 'image' ? t('imageTools') : tool.category === 'pdf' ? t('pdfTools') : tool.category === 'text' ? t('textTools') : t('otherTools');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary-400">{t('breadcrumbHome')}</Link><ChevronRight className="w-3 h-3" />
        <Link to={`/category/${tool.category}`} className="hover:text-primary-400">{catLabel}</Link><ChevronRight className="w-3 h-3" />
        <span className="text-gray-800 dark:text-gray-200">{lang === 'ur' ? tool.nameUrdu : tool.name}</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: tool.color + '15' }}>
              <tool.icon className="w-7 h-7" style={{ color: tool.color }} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{lang === 'ur' ? tool.nameUrdu : tool.name}</h1>
              <p className="text-sm text-gray-500">{lang === 'ur' ? tool.descriptionUrdu : tool.description}</p>
            </div>
          </div>
          <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-surface-800 rounded-xl p-1 w-fit">
            {(['tool', 'about', 'faq'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-white dark:bg-surface-900 shadow text-primary-400' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab === 'tool' ? (lang === 'ur' ? tool.nameUrdu : tool.name) : tab === 'about' ? t('seoDescription') : t('faq')}
              </button>
            ))}
          </div>
          {activeTab === 'tool' && (
            <>
              {children}
              <div className="mt-8 bg-gray-50 dark:bg-surface-800 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-primary-400" /> {t('howToUse')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {tool.howTo.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-lg bg-primary-400 text-white flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 bg-gray-50 dark:bg-surface-800 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><List className="w-5 h-5 text-primary-400" /> {t('features')}</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tool.features.map((f, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {f}</li>)}
                </ul>
              </div>
            </>
          )}
          {activeTab === 'about' && <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{tool.seoDescription}</p>}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              {tool.faq.map((item, i) => (
                <details key={i} className="bg-gray-50 dark:bg-surface-800 rounded-xl p-4 group">
                  <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-900 dark:text-white">
                    <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary-400" /> {item.q}</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 pl-6">{item.a}</p>
                </details>
              ))}
            </div>
          )}
          <div className="mt-10">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('relatedTools')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{related.map(r => <ToolCard key={r.id} tool={r} />)}</div>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="bg-gray-50 dark:bg-surface-800 rounded-2xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('relatedTools')}</h4>
            <div className="flex flex-col gap-2">
              {related.map(r => (
                <Link key={r.id} to={`/tool/${r.slug}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white dark:hover:bg-surface-900 transition-colors">
                  <r.icon className="w-4 h-4" style={{ color: r.color }} />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{lang === 'ur' ? r.nameUrdu : r.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
