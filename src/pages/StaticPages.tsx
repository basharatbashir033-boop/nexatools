import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { getToolsByCategory } from '../data/tools';
import { ChevronRight, Mail, Phone, MapPin, Shield, Lock, Zap, Send } from 'lucide-react';

export function AboutPage() {
  const { t } = useApp();
  return (<div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
    <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6"><Link to="/" className="hover:text-primary-400">{t('breadcrumbHome')}</Link><ChevronRight className="w-3 h-3" /><span className="text-gray-800 dark:text-gray-200">{t('aboutUs')}</span></nav>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('aboutTitle')}</h1>
    <div className="prose dark:prose-invert max-w-none space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      <p>{t('aboutDescription')}</p>
      <p>NexaTools was built with a simple mission: make powerful online tools accessible to everyone, everywhere, without barriers. No login walls, no paywalls, no watermarks on your files.</p>
      <p>Every tool processes files directly in your browser using modern web technologies. This means your files never leave your device, ensuring complete privacy and instant processing speeds.</p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Our Values</h3>
      <ul className="space-y-2">
        <li className="flex items-start gap-2"><Shield className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" /> Privacy first - files never uploaded to servers</li>
        <li className="flex items-start gap-2"><Zap className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" /> Instant processing - no waiting for uploads/downloads</li>
        <li className="flex items-start gap-2"><Lock className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" /> Zero barriers - no login, no signup, no limits</li>
      </ul>
    </div>
  </div>);
}

export function PrivacyPage() {
  const { t } = useApp();
  return (<div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
    <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6"><Link to="/" className="hover:text-primary-400">{t('breadcrumbHome')}</Link><ChevronRight className="w-3 h-3" /><span className="text-gray-800 dark:text-gray-200">{t('privacyPolicy')}</span></nav>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('privacyTitle')}</h1>
    <div className="prose dark:prose-invert max-w-none space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      <p><strong>Last updated:</strong> January 1, 2026</p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Collection</h3><p>NexaTools does not collect, store, or process any personal data on our servers. All file processing happens directly in your web browser.</p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">File Processing</h3><p>When you use our tools, your files are processed entirely within your browser. Files are never uploaded to any server.</p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cookies</h3><p>We use minimal cookies only for essential site functionality such as language preference and theme selection. No tracking cookies are used.</p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact</h3><p>For privacy-related inquiries, please contact us through our Contact page.</p>
    </div>
  </div>);
}

export function TermsPage() {
  const { t } = useApp();
  return (<div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
    <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6"><Link to="/" className="hover:text-primary-400">{t('breadcrumbHome')}</Link><ChevronRight className="w-3 h-3" /><span className="text-gray-800 dark:text-gray-200">{t('termsOfService')}</span></nav>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('termsTitle')}</h1>
    <div className="prose dark:prose-invert max-w-none space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      <p><strong>Effective date:</strong> January 1, 2026</p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Use of Service</h3><p>NexaTools provides free online tools for personal and commercial use. You may use our tools for any lawful purpose without restriction.</p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Warranty</h3><p>The tools are provided "as is" without warranty of any kind. We do not guarantee the accuracy of results.</p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Intellectual Property</h3><p>You retain full ownership of all files you process using our tools. We do not claim any rights to your content.</p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Limitation of Liability</h3><p>NexaTools shall not be liable for any damages arising from the use of our tools.</p>
    </div>
  </div>);
}

export function ContactPage() {
  const { t } = useApp(); const { showToast } = useToast();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [message, setMessage] = useState('');
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!name || !email || !message) { showToast('Please fill in all fields', 'error'); return; } showToast(t('success')); setName(''); setEmail(''); setMessage(''); };
  return (<div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
    <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6"><Link to="/" className="hover:text-primary-400">{t('breadcrumbHome')}</Link><ChevronRight className="w-3 h-3" /><span className="text-gray-800 dark:text-gray-200">{t('contactUs')}</span></nav>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('contactTitle')}</h1><p className="text-gray-500 mb-8">{t('contactDescription')}</p>
    <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{t('nameField')}</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" /></div>
        <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{t('emailField')}</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" /></div>
        <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{t('messageField')}</label><textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} className="input-field resize-y" /></div>
        <button type="submit" className="btn-primary flex items-center gap-2"><Send className="w-4 h-4" /> {t('send')}</button>
      </form>
      <div className="bg-gray-50 dark:bg-surface-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"><Mail className="w-4 h-4 text-primary-400" /> contact@info.nexatools85@gmail.com</div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"><Phone className="w-4 h-4 text-primary-400" /> +92-0316-5152068</div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"><MapPin className="w-4 h-4 text-primary-400" /> Lahore, Pakistan</div>
      </div>
    </div>
  </div>);
}

export function SitemapPage() {
  const { t, lang } = useApp();
  const sections = [
    { title: t('imageTools'), tools: getToolsByCategory('image') },
    { title: t('pdfTools'), tools: getToolsByCategory('pdf') },
    { title: t('textTools'), tools: getToolsByCategory('text') },
    { title: t('otherTools'), tools: getToolsByCategory('other') },
  ];
  return (<div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
    <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6"><Link to="/" className="hover:text-primary-400">{t('breadcrumbHome')}</Link><ChevronRight className="w-3 h-3" /><span className="text-gray-800 dark:text-gray-200">{t('sitemap')}</span></nav>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('sitemapTitle')}</h1>
    {sections.map(section => (
      <div key={section.title} className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{section.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{section.tools.map((tool: any) => (
          <Link key={tool.id} to={`/tool/${tool.slug}`} className="text-sm text-primary-400 hover:text-primary-500 py-1">{lang === 'ur' ? tool.nameUrdu : tool.name}</Link>
        ))}</div>
      </div>
    ))}
    <div className="mb-8"><h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Pages</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Link to="/about" className="text-sm text-primary-400 hover:text-primary-500 py-1">{t('aboutUs')}</Link>
        <Link to="/blog" className="text-sm text-primary-400 hover:text-primary-500 py-1">{t('blog')}</Link>
        <Link to="/privacy" className="text-sm text-primary-400 hover:text-primary-500 py-1">{t('privacyPolicy')}</Link>
        <Link to="/terms" className="text-sm text-primary-400 hover:text-primary-500 py-1">{t('termsOfService')}</Link>
        <Link to="/contact" className="text-sm text-primary-400 hover:text-primary-500 py-1">{t('contactUs')}</Link>
      </div>
    </div>
  </div>);
}

export function NotFoundPage() {
  const { t } = useApp();
  return (<div className="max-w-4xl mx-auto px-4 py-20 text-center">
    <div className="text-8xl font-bold text-primary-400/20 mb-4">404</div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('notFoundTitle')}</h1>
    <p className="text-gray-500 mb-8">{t('notFoundDescription')}</p>
    <Link to="/" className="btn-primary">{t('goHome')}</Link>
  </div>);
}
