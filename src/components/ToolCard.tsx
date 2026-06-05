import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { ToolDef } from '../data/tools';

export default function ToolCard({ tool }: { tool: ToolDef }) {
  const { t, lang } = useApp();
  const Icon = tool.icon;
  return (
    <Link to={`/tool/${tool.slug}`} className="tool-card group block">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: tool.color + '15' }}>
          <Icon className="w-6 h-6" style={{ color: tool.color }} />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{lang === 'ur' ? tool.nameUrdu : tool.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{lang === 'ur' ? tool.descriptionUrdu : tool.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400 fill-yellow-400/50'}`} />)}
          <span className="text-[10px] text-gray-400 ml-1">4.8</span>
        </div>
        <span className="text-xs font-medium text-primary-400 group-hover:text-primary-500 transition-colors">{t('useTool')}</span>
      </div>
    </Link>
  );
}
