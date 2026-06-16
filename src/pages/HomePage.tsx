import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://nexatoolsonline.com/"
    }]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Free Online Tools",
    "description": "Collection of 26+ free online tools for images, PDFs, text processing and more",
    "url": "https://nexatoolsonline.com/",
    "numberOfItems": tools.length,
    "itemListElement": tools.map((tool, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": tool.name,
      "description": tool.metaDescription,
      "url": `https://nexatoolsonline.com/tool/${tool.slug}`
    }))
  };

  return (
    <>
      <Helmet>
        <title>NexaTools – 26+ Free Online Tools | No Login Required</title>
        <meta name="description" content="NexaTools offers 26+ free online tools including image compressor, PDF to Word converter, background remover, QR code generator, word counter and more. No login. No watermark. Works on mobile and PC." />
        <link rel="canonical" href="https://nexatoolsonline.com/" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="NexaTools – 26+ Free Online Tools | No Login Required" />
        <meta property="og:description" content="26+ free online tools for images, PDFs, text and more. No login. No watermark. No limits." />
        <meta property="og:url" content="https://nexatoolsonline.com/" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
      </Helmet>

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
          {filtered.map((tool) => (
            <div key={tool.id}>
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>

        {/* SEO Content Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Free Online Tools — No Login, No Watermark
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-10">
            NexaTools gives you 26+ powerful browser-based tools completely free. Compress images, convert PDFs, generate QR codes, count words, and much more — all without creating an account.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🖼️ Image Tools</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Compress, resize, crop, convert, remove backgrounds and add watermarks to images. Supports JPG, PNG, and WebP formats.
              </p>
            </div>
            <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📄 PDF Tools</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Convert PDF to Word, merge, split, compress, and convert between PDF and image formats — all free and instant.
              </p>
            </div>
            <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">✍️ Text & Other Tools</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Word counter, Urdu typing tool, text to speech, case converter, password generator, QR code maker and more.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-surface-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose NexaTools?
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                '✅ 100% Free — No hidden fees ever',
                '🔒 No Login Required — Use instantly',
                '📱 Works on Mobile & Desktop',
                '🇵🇰 Supports English & Urdu',
                '⚡ Fast Browser-Based Processing',
                '🚫 No Watermarks on Output',
                '🔐 Your Files Never Leave Your Device',
                '🌙 Dark Mode Support',
              ].map((item, i) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-400">{item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: 'Are all NexaTools tools free?', a: 'Yes, all 26+ tools on NexaTools are completely free to use. No subscription, no credit card, no hidden charges.' },
                { q: 'Do I need to create an account?', a: 'No. All tools work without any login or registration. Just open the tool and start using it immediately.' },
                { q: 'Are my files safe and private?', a: 'Absolutely. All processing happens directly in your browser. Your files are never uploaded to our servers.' },
                { q: 'Does NexaTools work on mobile phones?', a: 'Yes, NexaTools is fully responsive and works on all smartphones and tablets, including Android and iPhone.' },
                { q: 'Is NexaTools available in Urdu?', a: 'Yes! NexaTools supports both English and Urdu languages, making it perfect for users in Pakistan.' },
              ].map((item, i) => (
                <details key={i} className="bg-white dark:bg-surface-900 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                  <summary className="font-medium text-gray-900 dark:text-white cursor-pointer">{item.q}</summary>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
