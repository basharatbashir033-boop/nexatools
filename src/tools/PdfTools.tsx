import { useState, useCallback } from 'react';
import FileUpload from '../components/FileUpload';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';

function DownloadBtn({ blob, name }: { blob: Blob; name: string }) {
  const { showToast } = useToast();
  const handleDownload = () => {
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
    showToast('Downloaded!', 'success');
    try { const confetti = require('canvas-confetti'); confetti.default({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch {}
  };
  return <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
    Download
  </button>;
}

export function PdfToWord() {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');

  const handleConvert = useCallback(async () => {
    if (!files.length) return; setProcessing(true);
    try {
      const arrayBuffer = await files[0].arrayBuffer();
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let textContent = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i); const content = await page.getTextContent();
        textContent += content.items.map((item: any) => item.str).join(' ') + '\n\n';
      }
      const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Document</title></head><body>${textContent.split('\n').map(p => `<p>${p}</p>`).join('')}</body></html>`;
      const blob = new Blob([html], { type: 'application/msword' }); setResultBlob(blob); setResultName(files[0].name.replace(/\.pdf$/i, '.doc'));
      setResult(`Extracted text from ${pdf.numPages} page(s)`);
    } catch (e) { setResult('Error: ' + (e as Error).message); }
    setProcessing(false);
  }, [files]);

  return (<div><FileUpload accept=".pdf" onFiles={setFiles} files={files} />
    {files.length > 0 && <button onClick={handleConvert} disabled={processing} className="btn-primary mt-4 w-full">{processing ? t('processing') : 'Convert to Word'}</button>}
    {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
    {resultBlob && <div className="mt-4"><DownloadBtn blob={resultBlob} name={resultName} /></div>}
  </div>);
}

export function WordToPdf() {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');

 const handleConvert = useCallback(async () => {
  if (!files.length) return; setProcessing(true);
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await files[0].arrayBuffer();
    const { value: text } = await mammoth.extractRawText({ arrayBuffer });
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(text, 180);
    pdf.setFontSize(12); let y = 20;
    lines.forEach((line: string) => {
      if (y > 270) { pdf.addPage(); y = 20; }
      pdf.text(line, 15, y); y += 7;
    });
    const blob = pdf.output('blob');
    setResultBlob(blob);
    setResultName(files[0].name.replace(/\.\w+$/, '.pdf'));
  } catch (e) { setResult('Error: ' + (e as Error).message); }
  setProcessing(false);
}, [files]);

  return (<div><FileUpload accept=".doc,.docx,.txt" onFiles={setFiles} files={files} />
    {files.length > 0 && <button onClick={handleConvert} disabled={processing} className="btn-primary mt-4 w-full">{processing ? t('processing') : 'Convert to PDF'}</button>}
    {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
    {resultBlob && <div className="mt-4"><DownloadBtn blob={resultBlob} name={resultName} /></div>}
  </div>);
}

export function PdfToJpg() {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [pageImages, setPageImages] = useState<string[]>([]);

  const handleConvert = useCallback(async () => {
    if (!files.length) return; setProcessing(true);
    try {
      const arrayBuffer = await files[0].arrayBuffer();
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const images: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i); const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas'); canvas.width = viewport.width; canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!; await page.render({ canvasContext: ctx, viewport }).promise;
        images.push(canvas.toDataURL('image/jpeg', 0.9));
      }
      setPageImages(images); setResult(`Converted ${pdf.numPages} page(s)`);
    } catch (e) { setResult('Error: ' + (e as Error).message); }
    setProcessing(false);
  }, [files]);

  return (<div><FileUpload accept=".pdf" onFiles={setFiles} files={files} />
    {files.length > 0 && <button onClick={handleConvert} disabled={processing} className="btn-primary mt-4 w-full">{processing ? t('processing') : 'Convert to JPG'}</button>}
    {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
    {pageImages.length > 0 && <div className="mt-4 grid grid-cols-2 gap-4">{pageImages.map((src, i) => (
      <div key={i} className="relative"><img src={src} alt={`Page ${i+1}`} className="rounded-xl w-full" /><a href={src} download={`page_${i+1}.jpg`} className="absolute bottom-2 right-2 bg-white/90 dark:bg-surface-800/90 px-3 py-1 rounded-lg text-xs font-medium">Download Page {i+1}</a></div>
    ))}</div>}
  </div>);
}

export function JpgToPdf() {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');

  const handleConvert = useCallback(async () => {
    if (!files.length) return; setProcessing(true);
    try {
      const { jsPDF } = await import('jspdf'); const pdf = new jsPDF();
      for (let i = 0; i < files.length; i++) {
        if (i > 0) pdf.addPage();
        const dataUrl = await new Promise<string>(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result as string); reader.readAsDataURL(files[i]); });
        const img = new Image(); img.src = dataUrl; await new Promise(r => { img.onload = r; });
        const w = pdf.internal.pageSize.getWidth(); const h = (img.height / img.width) * w;
        pdf.addImage(dataUrl, 'JPEG', 0, 0, w, Math.min(h, pdf.internal.pageSize.getHeight()));
      }
      const blob = pdf.output('blob'); setResultBlob(blob); setResultName('images.pdf'); setResult(`PDF created with ${files.length} page(s)`);
    } catch (e) { setResult('Error: ' + (e as Error).message); }
    setProcessing(false);
  }, [files]);

  return (<div><FileUpload accept="image/jpeg,image/jpg" multiple onFiles={setFiles} files={files} />
    {files.length > 0 && <button onClick={handleConvert} disabled={processing} className="btn-primary mt-4 w-full">{processing ? t('processing') : 'Convert to PDF'}</button>}
    {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
    {resultBlob && <div className="mt-4"><DownloadBtn blob={resultBlob} name={resultName} /></div>}
  </div>);
}

export function MergePdf() {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');

  const handleMerge = useCallback(async () => {
    if (files.length < 2) return; setProcessing(true);
    try {
      const { PDFDocument } = await import('pdf-lib'); const mergedPdf = await PDFDocument.create();
      for (const file of files) { const bytes = await file.arrayBuffer(); const pdf = await PDFDocument.load(bytes); const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices()); pages.forEach(page => mergedPdf.addPage(page)); }
      const bytes = await mergedPdf.save(); const blob = new Blob([bytes], { type: 'application/pdf' });
      setResultBlob(blob); setResultName('merged.pdf'); setResult(`Merged ${files.length} PDF files`);
    } catch (e) { setResult('Error: ' + (e as Error).message); }
    setProcessing(false);
  }, [files]);

  return (<div><FileUpload accept=".pdf" multiple onFiles={setFiles} files={files} />
    <p className="text-xs text-gray-400 mt-2">Upload at least 2 PDF files to merge</p>
    {files.length >= 2 && <button onClick={handleMerge} disabled={processing} className="btn-primary mt-4 w-full">{processing ? t('processing') : `Merge ${files.length} PDFs`}</button>}
    {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
    {resultBlob && <div className="mt-4"><DownloadBtn blob={resultBlob} name={resultName} /></div>}
  </div>);
}

export function SplitPdf() {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [splitMode, setSplitMode] = useState<'every' | 'range'>('every');
  const [rangeFrom, setRangeFrom] = useState(1); const [rangeTo, setRangeTo] = useState(1);
  const [splits, setSplits] = useState<{ name: string; blob: Blob }[]>([]);

  const handleSplit = useCallback(async () => {
    if (!files.length) return; setProcessing(true);
    try {
      const { PDFDocument } = await import('pdf-lib'); const bytes = await files[0].arrayBuffer(); const pdf = await PDFDocument.load(bytes);
      const totalPages = pdf.getPageCount(); const results: { name: string; blob: Blob }[] = [];
      if (splitMode === 'every') {
        for (let i = 0; i < totalPages; i++) { const newPdf = await PDFDocument.create(); const [page] = await newPdf.copyPages(pdf, [i]); newPdf.addPage(page); const pageBytes = await newPdf.save(); results.push({ name: `page_${i+1}.pdf`, blob: new Blob([pageBytes], { type: 'application/pdf' }) }); }
      } else {
        const from = Math.max(1, rangeFrom) - 1; const to = Math.min(totalPages, rangeTo);
        const newPdf = await PDFDocument.create(); const indices = []; for (let i = from; i < to; i++) indices.push(i);
        const pages = await newPdf.copyPages(pdf, indices); pages.forEach(p => newPdf.addPage(p));
        const pageBytes = await newPdf.save(); results.push({ name: `pages_${rangeFrom}-${rangeTo}.pdf`, blob: new Blob([pageBytes], { type: 'application/pdf' }) });
      }
      setSplits(results); setResult(`Split into ${results.length} file(s) (${totalPages} total pages)`);
    } catch (e) { setResult('Error: ' + (e as Error).message); }
    setProcessing(false);
  }, [files, splitMode, rangeFrom, rangeTo]);

  return (<div><FileUpload accept=".pdf" onFiles={setFiles} files={files} />
    {files.length > 0 && (
      <div className="mt-4 space-y-3">
        <div className="flex gap-2">
          <button onClick={() => setSplitMode('every')} className={`px-4 py-2 rounded-lg text-sm ${splitMode === 'every' ? 'bg-primary-400 text-white' : 'bg-gray-100 dark:bg-surface-800'}`}>Split every page</button>
          <button onClick={() => setSplitMode('range')} className={`px-4 py-2 rounded-lg text-sm ${splitMode === 'range' ? 'bg-primary-400 text-white' : 'bg-gray-100 dark:bg-surface-800'}`}>By page range</button>
        </div>
        {splitMode === 'range' && <div className="flex gap-3"><input type="number" min={1} value={rangeFrom} onChange={e => setRangeFrom(+e.target.value)} className="input-field" placeholder="From" /><input type="number" min={1} value={rangeTo} onChange={e => setRangeTo(+e.target.value)} className="input-field" placeholder="To" /></div>}
        <button onClick={handleSplit} disabled={processing} className="btn-primary w-full">{processing ? t('processing') : 'Split PDF'}</button>
      </div>
    )}
    {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
    {splits.length > 0 && <div className="mt-4 space-y-2">{splits.map((s, i) => (
      <a key={i} href={URL.createObjectURL(s.blob)} download={s.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-surface-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
        <span className="text-sm font-medium">{s.name}</span><span className="text-xs text-primary-400">Download</span>
      </a>
    ))}</div>}
  </div>);
}

export function CompressPdf() {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');

  const handleCompress = useCallback(async () => {
    if (!files.length) return; setProcessing(true);
    try {
      const { PDFDocument } = await import('pdf-lib'); const bytes = await files[0].arrayBuffer(); const pdf = await PDFDocument.load(bytes);
      const compressedBytes = await pdf.save({ useObjectStreams: true, addDefaultPage: false });
      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const reduction = Math.round((1 - blob.size / files[0].size) * 100);
      setResultBlob(blob); setResultName(`compressed_${files[0].name}`);
      setResult(`Original: ${(files[0].size / 1024).toFixed(1)} KB → Compressed: ${(blob.size / 1024).toFixed(1)} KB (${reduction}% reduction)`);
    } catch (e) { setResult('Error: ' + (e as Error).message); }
    setProcessing(false);
  }, [files]);

  return (<div><FileUpload accept=".pdf" onFiles={setFiles} files={files} />
    {files.length > 0 && <button onClick={handleCompress} disabled={processing} className="btn-primary mt-4 w-full">{processing ? t('processing') : 'Compress PDF'}</button>}
    {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
    {resultBlob && <div className="mt-4"><DownloadBtn blob={resultBlob} name={resultName} /></div>}
  </div>);
}

export function TextToPdf() {
  const { t } = useApp();
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(12);

  const handleConvert = useCallback(async () => {
    if (!text) return; setProcessing(true);
    try {
      const { jsPDF } = await import('jspdf'); const pdf = new jsPDF(); pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, 180); let y = 20;
      lines.forEach((line: string) => { if (y > 270) { pdf.addPage(); y = 20; } pdf.text(line, 15, y); y += fontSize * 0.5; });
      const blob = pdf.output('blob'); setResultBlob(blob); setResultName('document.pdf'); setResult('PDF created');
    } catch (e) { setResult('Error: ' + (e as Error).message); }
    setProcessing(false);
  }, [text, fontSize]);

  return (<div>
    <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter or paste your text here..." rows={10} className="input-field resize-y" />
    <div className="mt-3 flex items-center gap-3"><label className="text-sm text-gray-600 dark:text-gray-400">Font size:</label><input type="number" min={8} max={24} value={fontSize} onChange={e => setFontSize(+e.target.value)} className="input-field w-20" /></div>
    <button onClick={handleConvert} disabled={processing} className="btn-primary mt-4 w-full">{processing ? t('processing') : 'Create PDF'}</button>
    {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
    {resultBlob && <div className="mt-4"><DownloadBtn blob={resultBlob} name={resultName} /></div>}
  </div>);
}
