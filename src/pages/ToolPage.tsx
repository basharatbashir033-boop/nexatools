import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ToolWrapper from '../components/ToolWrapper';
import { getToolBySlug } from '../data/tools';
import {
  ImageCompressor, ImageResizer, ImageCropper, ImageToPdf, JpgToPng, PngToJpg,
  RemoveBackground, AddWatermark, RotateFlipImage, PdfToWord, WordToPdf, PdfToJpg,
  JpgToPdf, MergePdf, SplitPdf, CompressPdf, TextToPdf, UrduTypingTool, WordCounter,
  TextToSpeech, CaseConverter, PlagiarismChecker, QrCodeGenerator, PasswordGenerator,
  ColorPicker, UnitConverter
} from '../tools';

const toolComponents: Record<string, React.FC> = {
  'image-compressor': ImageCompressor, 'image-resizer': ImageResizer,
  'image-cropper': ImageCropper, 'image-to-pdf': ImageToPdf,
  'jpg-to-png': JpgToPng, 'png-to-jpg': PngToJpg,
  'remove-background': RemoveBackground, 'add-watermark': AddWatermark,
  'rotate-flip-image': RotateFlipImage, 'pdf-to-word': PdfToWord,
  'word-to-pdf': WordToPdf, 'pdf-to-jpg': PdfToJpg,
  'jpg-to-pdf': JpgToPdf, 'merge-pdf': MergePdf,
  'split-pdf': SplitPdf, 'compress-pdf': CompressPdf,
  'text-to-pdf': TextToPdf, 'urdu-typing-tool': UrduTypingTool,
  'word-counter': WordCounter, 'text-to-speech': TextToSpeech,
  'case-converter': CaseConverter, 'plagiarism-checker': PlagiarismChecker,
  'qr-code-generator': QrCodeGenerator, 'password-generator': PasswordGenerator,
  'color-picker': ColorPicker, 'unit-converter': UnitConverter,
};

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = getToolBySlug(slug || '');
  const ToolComponent = slug ? toolComponents[slug] : null;

  if (!tool || !ToolComponent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tool Not Found</h1>
        <p className="text-gray-500">The tool you are looking for does not exist.</p>
      </div>
    );
  }

  const canonicalUrl = `https://nexatoolsonline.com/tool/${slug}`;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.name,
    "url": canonicalUrl,
    "description": tool.metaDescription,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": tool.features.join(", "),
    "provider": {
      "@type": "Organization",
      "name": "NexaTools",
      "url": "https://nexatoolsonline.com"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": tool.faq.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to use ${tool.name}`,
    "description": tool.metaDescription,
    "step": tool.howTo.map((step, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "text": step
    }))
  };

  return (
    <>
      <Helmet>
        <title>{tool.metaTitle}</title>
        <meta name="description" content={tool.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={tool.metaTitle} />
        <meta property="og:description" content={tool.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NexaTools" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tool.metaTitle} />
        <meta name="twitter:description" content={tool.metaDescription} />

        {/* Schema */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
      </Helmet>

      <ToolWrapper slug={slug!}>
        <ToolComponent />
      </ToolWrapper>
    </>
  );
}
