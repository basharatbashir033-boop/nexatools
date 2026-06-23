import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Moon, Sun, Globe, Menu, X, ChevronUp, Zap, Shield, Lock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { tools } from '../data/tools';

const imageSlugs = ['image-compressor','image-resizer','image-cropper','remove-background','jpg-to-png','png-to-jpg'];
const pdfSlugs = ['pdf-to-word','word-to-pdf','merge-pdf','split-pdf','compress-pdf','jpg-to-pdf'];

export default function Layout() {
  const { dark, toggleDark, lang, toggleLang, t, dir } = useApp();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => { setMobileOpen(false); window.scrollTo(0, 0); }, [location.pathname]);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/category/image', label: t('imageTools') }, { to: '/category/pdf', label: t('pdfTools') },
    { to: '/category/text', label: t('textTools') }, { to: '/category/other', label: t('otherTools') },
    { to: '/blog', label: t('blog') },
  ];

  return (
    <div dir={dir} className="min-h-screen flex flex-col">
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isHome ? 'bg-white/10 dark:bg-transparent backdrop-blur-sm' :'bg-white/90 dark:bg-surface-900/90 backdrop-blur-md shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-1 shrink-0">
              <Zap className="w-7 h-7 text-primary-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Nexa</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Tools</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map(link => <Link key={link.to} to={link.to} className={`text-sm font-medium transition-colors hover:text-primary-400 ${isHome ? 'text-white/90 hover:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{link.label}</Link>)}
            </nav>
            <div className="flex items-center gap-2">
              <span className={`hidden sm:inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${isHome ? 'bg-white/20 text-white' : 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300'}`}><Shield className="w-3 h-3" /> {t('noLogin')}</span>
              <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle dark mode">
                {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <button onClick={toggleLang} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1" aria-label="Toggle language">
                <Globe className="w-5 h-5 text-primary-400" /><span className="text-xs font-medium">{lang === 'en' ? 'اردو' : 'EN'}</span>
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {mobileOpen && (
            <nav className="lg:hidden pb-4 border-t border-gray-100 dark:border-gray-700 pt-3 flex flex-col gap-2 animate-fade-in">
              {navLinks.map(link => <Link key={link.to} to={link.to} className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-700 dark:text-gray-300">{link.label}</Link>)}
            </nav>
          )}
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="bg-surface-900 dark:bg-surface-950 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-1 mb-4"><Zap className="w-6 h-6 text-primary-400" /><span className="text-lg font-bold text-white">Nexa</span><span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Tools</span></Link>
              <p className="text-sm text-gray-400 mb-4">{t('tagline')}<br />{t('noLogin')}</p>
              <div className="flex gap-3">{['F','T','I','Y'].map(s => <a key={s} href="#" className="w-9 h-9 rounded-lg bg-surface-800 hover:bg-primary-400 flex items-center justify-center transition-colors text-gray-400 hover:text-white text-xs font-bold">{s}</a>)}</div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t('imageTools')}</h4>
              <div className="flex flex-col gap-2">{imageSlugs.map(slug => { const tool = tools.find(tl => tl.slug === slug); return tool ? <Link key={slug} to={`/tool/${slug}`} className="text-sm text-gray-400 hover:text-primary-300 transition-colors">{lang === 'ur' ? tool.nameUrdu : tool.name}</Link> : null; })}</div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t('pdfTools')}</h4>
              <div className="flex flex-col gap-2">{pdfSlugs.map(slug => { const tool = tools.find(tl => tl.slug === slug); return tool ? <Link key={slug} to={`/tool/${slug}`} className="text-sm text-gray-400 hover:text-primary-300 transition-colors">{lang === 'ur' ? tool.nameUrdu : tool.name}</Link> : null; })}</div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t('quickLinks')}</h4>
              <div className="flex flex-col gap-2">
                <Link to="/about" className="text-sm text-gray-400 hover:text-primary-300">{t('aboutUs')}</Link>
                <Link to="/blog" className="text-sm text-gray-400 hover:text-primary-300">{t('blog')}</Link>
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-primary-300">{t('privacyPolicy')}</Link>
                <Link to="/terms" className="text-sm text-gray-400 hover:text-primary-300">{t('termsOfService')}</Link>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-primary-300">{t('contactUs')}</Link>
                <Link to="/sitemap" className="text-sm text-gray-400 hover:text-primary-300">{t('sitemap')}</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-500">{t('copyright')}</p>
              <p className="text-xs text-gray-500">{t('filesDeleted')}</p>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-gray-400"><Lock className="w-3.5 h-3.5 text-green-400" /> {t('sslEncrypted')}</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400"><Shield className="w-3.5 h-3.5 text-blue-400" /> {t('neverStore')}</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400"><Zap className="w-3.5 h-3.5 text-yellow-400" /> 26+ {t('freeTools')}</span>
            </div>
          </div>
        </div>
      </footer>
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-20 lg:bottom-6 right-6 z-50 p-3 bg-primary-400 text-white rounded-full shadow-lg hover:bg-primary-500 transition-all animate-fade-in" aria-label={t('scrollToTop')}><ChevronUp className="w-5 h-5" /></button>
      )}
    </div>
  );
}
