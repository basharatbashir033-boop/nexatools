import { Link, useParams } from 'react-router-dom';
import { blogPosts, getBlogBySlug } from '../data/blogs';
import { useApp } from '../contexts/AppContext';
import { Calendar, ArrowLeft, ChevronRight } from 'lucide-react';

export function BlogHome() {
  const { t, lang } = useApp();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6"><Link to="/" className="hover:text-primary-400">{t('breadcrumbHome')}</Link><ChevronRight className="w-3 h-3" /><span className="text-gray-800 dark:text-gray-200">{t('blog')}</span></nav>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('blog')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map(post => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="tool-card group block">
            <div className="w-full h-40 rounded-xl bg-gradient-to-br from-primary-400/20 to-accent-400/20 mb-4 flex items-center justify-center"><span className="text-4xl">📝</span></div>
            <h2 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-400 transition-colors">{lang === 'ur' ? post.titleUrdu : post.title}</h2>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{lang === 'ur' ? post.excerptUrdu : post.excerpt}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400"><Calendar className="w-3 h-3" /> {post.date}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useApp();
  const post = getBlogBySlug(slug || '');
  if (!post) return <div className="max-w-4xl mx-auto px-4 py-16 text-center">{t('notFoundTitle')}</div>;
  const content = lang === 'ur' ? post.contentUrdu : post.content;
  const title = lang === 'ur' ? post.titleUrdu : post.title;

  const renderContent = (text: string) => text.split('\n').map((line, i) => {
    if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">{line.slice(2)}</h1>;
    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3">{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">{line.slice(4)}</h3>;
    if (line.startsWith('- ')) return <li key={i} className="text-sm text-gray-600 dark:text-gray-300 ml-4">{line.slice(2)}</li>;
    if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-gray-900 dark:text-white mt-2">{line.slice(2,-2)}</p>;
    if (line.trim() === '') return <br key={i} />;
    return <p key={i} className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-2">{line}</p>;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6"><Link to="/" className="hover:text-primary-400">{t('breadcrumbHome')}</Link><ChevronRight className="w-3 h-3" /><Link to="/blog" className="hover:text-primary-400">{t('blog')}</Link><ChevronRight className="w-3 h-3" /><span className="text-gray-800 dark:text-gray-200 truncate max-w-[200px]">{title}</span></nav>
      <article>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8"><Calendar className="w-4 h-4" /> {t('publishedOn')} {post.date}</div>
        <div className="prose dark:prose-invert max-w-none">{renderContent(content)}</div>
      </article>
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-500 mt-8"><ArrowLeft className="w-4 h-4" /> {t('backToTools')}</Link>
    </div>
  );
}
