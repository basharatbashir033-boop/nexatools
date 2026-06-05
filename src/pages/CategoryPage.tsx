import { useParams, Link } from 'react-router-dom';
import ToolCard from '../components/ToolCard';
import { getToolsByCategory, type ToolCategory } from '../data/tools';
import { useApp } from '../contexts/AppContext';
import { ChevronRight } from 'lucide-react';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { t } = useApp();
  const validCats: ToolCategory[] = ['image','pdf','text','other'];
  const cat = validCats.includes(category as ToolCategory) ? (category as ToolCategory) : null;
  if (!cat) return <div className="max-w-4xl mx-auto px-4 py-16 text-center">{t('notFoundTitle')}</div>;
  const catTools = getToolsByCategory(cat);
  const title = cat === 'image' ? t('imageTools') : cat === 'pdf' ? t('pdfTools') : cat === 'text' ? t('textTools') : t('otherTools');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6"><Link to="/" className="hover:text-primary-400">{t('breadcrumbHome')}</Link><ChevronRight className="w-3 h-3" /><span className="text-gray-800 dark:text-gray-200">{title}</span></nav>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
      <p className="text-gray-500 mb-8">{catTools.length} tools available</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">{catTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}</div>
    </div>
  );
}
