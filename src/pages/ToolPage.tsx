import { useParams } from 'react-router-dom';
import ToolWrapper from '../components/ToolWrapper';
import { getToolBySlug } from '../data/tools';
import { ImageCompressor, ImageResizer, ImageCropper, ImageToPdf, JpgToPng, PngToJpg, RemoveBackground, AddWatermark, RotateFlipImage, PdfToWord, WordToPdf, PdfToJpg, JpgToPdf, MergePdf, SplitPdf, CompressPdf, TextToPdf, UrduTypingTool, WordCounter, TextToSpeech, CaseConverter, PlagiarismChecker, QrCodeGenerator, PasswordGenerator, ColorPicker, UnitConverter } from '../tools';

const toolComponents: Record<string, React.FC> = {
  'image-compressor':ImageCompressor,'image-resizer':ImageResizer,'image-cropper':ImageCropper,'image-to-pdf':ImageToPdf,
  'jpg-to-png':JpgToPng,'png-to-jpg':PngToJpg,'remove-background':RemoveBackground,'add-watermark':AddWatermark,'rotate-flip-image':RotateFlipImage,
  'pdf-to-word':PdfToWord,'word-to-pdf':WordToPdf,'pdf-to-jpg':PdfToJpg,'jpg-to-pdf':JpgToPdf,'merge-pdf':MergePdf,'split-pdf':SplitPdf,'compress-pdf':CompressPdf,'text-to-pdf':TextToPdf,
  'urdu-typing-tool':UrduTypingTool,'word-counter':WordCounter,'text-to-speech':TextToSpeech,'case-converter':CaseConverter,'plagiarism-checker':PlagiarismChecker,
  'qr-code-generator':QrCodeGenerator,'password-generator':PasswordGenerator,'color-picker':ColorPicker,'unit-converter':UnitConverter,
};

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = getToolBySlug(slug || '');
  const ToolComponent = slug ? toolComponents[slug] : null;
  if (!tool || !ToolComponent) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tool Not Found</h1><p className="text-gray-500">The tool you are looking for does not exist.</p></div>;
  return <ToolWrapper slug={slug!}><ToolComponent /></ToolWrapper>;
}
