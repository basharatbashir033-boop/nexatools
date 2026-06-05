import { useState, useCallback } from 'react';
import FileUpload from '../components/FileUpload';
import { useApp } from '../contexts/AppContext';

export function ImageCompressor() {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');
  const [quality, setQuality] = useState(0.7);

  const handleCompress = useCallback(async () => {
    if (!files.length) return;
    setProcessing(true);
    try {
      const imageCompression = (await import('browser-image-compression')).default;
      const file = files[0];
      const compressed = await imageCompression(file, { maxSizeMB: (file.size / 1024 / 1024) * (1 - quality), initialQuality: quality, useWebWorker: true });
      setResultBlob(compressed);
      setResultName(`compressed_${file.name}`);
      setResult(`Original: ${(file.size / 1024).toFixed(1)} KB → Compressed: ${(compressed.size / 1024).toFixed(1)} KB`);
    } catch (e) { setResult('Error: ' + (e as Error).message); }
    setProcessing(false);
  }, [files, quality]);

  return (
    <div>
      <FileUpload accept="image/*" onFiles={setFiles} files={files} />
      {files.length > 0 && (
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Quality: {Math.round(quality * 100)}%</label>
          <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={e => setQuality(parseFloat(e.target.value))} className="w-full accent-primary-400" />
          <button onClick={handleCompress} disabled={processing} className="btn-primary mt-3 w-full">{processing ? t('processing') : 'Compress Image'}</button>
        </div>
      )}
      {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
      {resultBlob && <DownloadResult blob={resultBlob} name={resultName} />}
    </div>
  );
}

export function ImageResizer() {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);

  const onFiles = (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length) { const img = new Image(); img.onload = () => { setWidth(img.width); setHeight(img.height); }; img.src = URL.createObjectURL(newFiles[0]); }
  };

  const handleResize = useCallback(async () => {
    if (!files.length) return; setProcessing(true);
    try {
      const img = new Image(); img.src = URL.createObjectURL(files[0]); await new Promise(r => { img.onload = r; });
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d')!; ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => { if (blob) { setResultBlob(blob); setResultName(`resized_${files[0].name}`); setResult(`Resized to ${width}x${height}`); } }, 'image/png');
    } catch (e) { setResult('Error: ' + (e as Error).message); }
    setProcessing(false);
  }, [files, width, height]);

  return (
    <div>
      <FileUpload accept="image/*" onFiles={onFiles} files={files} />
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div><label className="text-xs font-medium text-gray-600 dark:text-gray-400">Width (px)</label><input type="number" value={width} onChange={e => setWidth(parseInt(e.target.value) || 0)} className="input-field mt-1" /></div>
          <div><label className="text-xs font-medium text-gray-600 dark:text-gray-400">Height (px)</label><input type="number" value={height} onChange={e => setHeight(parseInt(e.target.value) || 0)} className="input-field mt-1" /></div>
          <button onClick={handleResize} disabled={processing} className="btn-primary col-span-2">{processing ? t('processing') : 'Resize Image'}</button>
        </div>
      )}
      {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
      {resultBlob && <DownloadResult blob={resultBlob} name={resultName} />}
    </div>
  );
}

export function ImageCropper() {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');
  const [cropX, setCropX] = useState(0); const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(200); const [cropH, setCropH] = useState(200);
  const [imgUrl, setImgUrl] = useState('');

  const onFiles = (newFiles: File[]) => { setFiles(newFiles); if (newFiles.length) setImgUrl(URL.createObjectURL(newFiles[0])); };

  const handleCrop = useCallback(async () => {
    if (!files.length) return; setProcessing(true);
    try {
      const img = new Image(); img.src = imgUrl; await new Promise(r => { img.onload = r; });
      const canvas = document.createElement('canvas'); canvas.width = cropW; canvas.height = cropH;
      const ctx = canvas.getContext('2d')!; ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      canvas.toBlob(blob => { if (blob) { setResultBlob(blob); setResultName(`cropped_${files[0].name}`); setResult(`Cropped ${cropW}x${cropH}`); } }, 'image/png');
    } catch (e) { setResult('Error: ' + (e as Error).message); }
    setProcessing(false);
  }, [files, cropX, cropY, cropW, cropH, imgUrl]);

  return (
    <div>
      <FileUpload accept="image/*" onFiles={onFiles} files={files} />
      {imgUrl && (
        <div className="mt-4 space-y-3">
          <img src={imgUrl} alt="To crop" className="max-w-full rounded-xl" style={{ maxHeight: 300 }} />
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">X</label><input type="number" value={cropX} onChange={e => setCropX(+e.target.value)} className="input-field" /></div>
            <div><label className="text-xs text-gray-500">Y</label><input type="number" value={cropY} onChange={e => setCropY(+e.target.value)} className="input-field" /></div>
            <div><label className="text-xs text-gray-500">Width</label><input type="number" value={cropW} onChange={e => setCropW(+e.target.value)} className="input-field" /></div>
            <div><label className="text-xs text-gray-500">Height</label><input type="number" value={cropH} onChange={e => setCropH(+e.target.value)} className="input-field" /></div>
          </div>
          <button onClick={handleCrop} disabled={processing} className="btn-primary w-full">{processing ? t('processing') : 'Crop Image'}</button>
        </div>
      )}
      {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
      {resultBlob && <DownloadResult blob={resultBlob} name={resultName} />}
    </div>
  );
}

export function ImageToPdf() {
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

  return (
    <div>
      <FileUpload accept="image/*" multiple onFiles={setFiles} files={files} />
      {files.length > 0 && <button onClick={handleConvert} disabled={processing} className="btn-primary mt-4 w-full">{processing ? t('processing') : 'Convert to PDF'}</button>}
      {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
      {resultBlob && <DownloadResult blob={resultBlob} name={resultName} />}
    </div>
  );
}

export function JpgToPng() {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');

  const handleConvert = useCallback(async () => {
    if (!files.length) return; setProcessing(true);
    try {
      const img = new Image(); img.src = URL.createObjectURL(files[0]); await new Promise(r => { img.onload = r; });
      const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!; ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => { if (blob) { setResultBlob(blob); setResultName(files[0].name.replace(/\.\w+$/, '.png')); setResult('Converted to PNG'); } }, 'image/png');
    } catch (e) { setResult('Error: ' + (e as Error).message); }
    setProcessing(false);
  }, [files]);

  return (
    <div>
      <FileUpload accept="image/jpeg" multiple onFiles={setFiles} files={files} />
      {files.length > 0 && <button onClick={handleConvert} disabled={processing} className="btn-primary mt-4 w-full">{processing ? t('processing') : 'Convert to PNG'}</button>}
      {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
      {resultBlob && <DownloadResult blob={resultBlob} name={resultName} />}
    </div>
  );
}

export function PngToJpg() {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [quality, setQuality] = useState(0.9);

  const handleConvert = useCallback(async () => {
    if (!files.length) return; setProcessing(true);
    try {
      const img = new Image(); img.src = URL.createObjectURL(files[0]); await new Promise(r => { img.onload = r; });
      const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!; ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => { if (blob) { setResultBlob(blob); setResultName(files[0].name.replace(/\.\w+$/, '.jpg')); setResult('Converted to JPG'); } }, 'image/jpeg', quality);
    } catch (e) { setResult('Error: ' + (e as Error).message); }
    setProcessing(false);
  }, [files, bgColor, quality]);

  return (
    <div>
      <FileUpload accept="image/png" multiple onFiles={setFiles} files={files} />
      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3"><label className="text-sm text-gray-600 dark:text-gray-400">Background:</label><input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" /></div>
          <div><label className="text-sm text-gray-600 dark:text-gray-400">Quality: {Math.round(quality * 100)}%</label><input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={e => setQuality(+e.target.value)} className="w-full accent-primary-400" /></div>
          <button onClick={handleConvert} disabled={processing} className="btn-primary w-full">{processing ? t('processing') : 'Convert to JPG'}</button>
        </div>
      )}
      {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
      {resultBlob && <DownloadResult blob={resultBlob} name={resultName} />}
    </div>
  );
}

export function RemoveBackground() {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');
  const [tolerance, setTolerance] = useState(40);

  const handleRemove = useCallback(async () => {
    if (!files.length) return; setProcessing(true);
    try {
      const img = new Image(); img.src = URL.createObjectURL(files[0]); await new Promise(r => { img.onload = r; });
      const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!; ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); const data = imageData.data;
      const corners = [[0,0],[canvas.width-1,0],[0,canvas.height-1],[canvas.width-1,canvas.height-1]];
      let bgR=0,bgG=0,bgB=0,cnt=0;
      corners.forEach(([x,y]) => { const idx=(y*canvas.width+x)*4; bgR+=data[idx]; bgG+=data[idx+1]; bgB+=data[idx+2]; cnt++; });
      bgR=Math.round(bgR/cnt); bgG=Math.round(bgG/cnt); bgB=Math.round(bgB/cnt);
      for (let i=0;i<data.length;i+=4) { const diff=(Math.abs(data[i]-bgR)+Math.abs(data[i+1]-bgG)+Math.abs(data[i+2]-bgB))/3; data[i+3]=diff<tolerance?0:Math.min(255,Math.round(255*(diff-tolerance)/30)); }
      ctx.putImageData(imageData,0,0);
      canvas.toBlob(blob => { if(blob){setResultBlob(blob);setResultName(files[0].name.replace(/\.\w+$/,'_no-bg.png'));setResult('Background removed');} },'image/png');
    } catch (e) { setResult('Error: '+(e as Error).message); }
    setProcessing(false);
  }, [files, tolerance]);

  return (
    <div>
      <FileUpload accept="image/*" onFiles={setFiles} files={files} />
      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <div><label className="text-sm text-gray-600 dark:text-gray-400">Tolerance: {tolerance}</label><input type="range" min={10} max={100} value={tolerance} onChange={e => setTolerance(+e.target.value)} className="w-full accent-primary-400" /></div>
          <button onClick={handleRemove} disabled={processing} className="btn-primary w-full">{processing ? t('processing') : 'Remove Background'}</button>
        </div>
      )}
      {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
      {resultBlob && (
        <div className="mt-4" style={{ backgroundImage:'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'10\' height=\'10\' fill=\'%23ccc\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23ccc\'/%3E%3C/svg%3E")' }}>
          <img src={URL.createObjectURL(resultBlob)} alt="No BG" className="max-w-xs rounded-xl mx-auto" />
        </div>
      )}
      {resultBlob && <DownloadResult blob={resultBlob} name={resultName} />}
    </div>
  );
}

export function AddWatermark() {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');
  const [watermarkText, setWatermarkText] = useState('NexaTools');
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(48);
  const [position, setPosition] = useState<string>('center');

  const handleWatermark = useCallback(async () => {
    if (!files.length || !watermarkText) return; setProcessing(true);
    try {
      const img = new Image(); img.src = URL.createObjectURL(files[0]); await new Promise(r => { img.onload = r; });
      const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!; ctx.drawImage(img, 0, 0); ctx.globalAlpha = opacity;
      ctx.font = `${fontSize}px Poppins, sans-serif`; ctx.fillStyle = 'white'; ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 2;
      const metrics = ctx.measureText(watermarkText);
      let x = (canvas.width - metrics.width) / 2, y = canvas.height / 2;
      if (position === 'bottom-right') { x = canvas.width - metrics.width - 20; y = canvas.height - 20; }
      else if (position === 'bottom-left') { x = 20; y = canvas.height - 20; }
      else if (position === 'top-right') { x = canvas.width - metrics.width - 20; y = fontSize + 20; }
      else if (position === 'top-left') { x = 20; y = fontSize + 20; }
      ctx.strokeText(watermarkText, x, y); ctx.fillText(watermarkText, x, y); ctx.globalAlpha = 1;
      canvas.toBlob(blob => { if (blob) { setResultBlob(blob); setResultName(`watermarked_${files[0].name}`); setResult('Watermark added'); } }, 'image/png');
    } catch (e) { setResult('Error: ' + (e as Error).message); }
    setProcessing(false);
  }, [files, watermarkText, opacity, fontSize, position]);

  return (
    <div>
      <FileUpload accept="image/*" onFiles={setFiles} files={files} />
      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <input type="text" value={watermarkText} onChange={e => setWatermarkText(e.target.value)} placeholder="Watermark text" className="input-field" />
          <div><label className="text-sm text-gray-600 dark:text-gray-400">Opacity: {Math.round(opacity * 100)}%</label><input type="range" min={0.05} max={1} step={0.05} value={opacity} onChange={e => setOpacity(+e.target.value)} className="w-full accent-primary-400" /></div>
          <div><label className="text-sm text-gray-600 dark:text-gray-400">Font size: {fontSize}px</label><input type="range" min={12} max={120} value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full accent-primary-400" /></div>
          <div className="flex gap-2 flex-wrap">{['center','top-left','top-right','bottom-left','bottom-right'].map(pos => (
            <button key={pos} onClick={() => setPosition(pos)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${position === pos ? 'bg-primary-400 text-white' : 'bg-gray-100 dark:bg-surface-800 text-gray-600 dark:text-gray-400'}`}>{pos}</button>
          ))}</div>
          <button onClick={handleWatermark} disabled={processing} className="btn-primary w-full">{processing ? t('processing') : 'Add Watermark'}</button>
        </div>
      )}
      {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
      {resultBlob && <DownloadResult blob={resultBlob} name={resultName} />}
    </div>
  );
}

export function RotateFlipImage() {
  const { t } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');
  const [angle, setAngle] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [imgUrl, setImgUrl] = useState('');

  const onFiles = (newFiles: File[]) => { setFiles(newFiles); if (newFiles.length) setImgUrl(URL.createObjectURL(newFiles[0])); };

  const handleTransform = useCallback(async () => {
    if (!files.length) return; setProcessing(true);
    try {
      const img = new Image(); img.src = imgUrl; await new Promise(r => { img.onload = r; });
      const rad = (angle * Math.PI) / 180; const sin = Math.abs(Math.sin(rad)); const cos = Math.abs(Math.cos(rad));
      const canvas = document.createElement('canvas'); canvas.width = Math.round(img.width * cos + img.height * sin); canvas.height = Math.round(img.width * sin + img.height * cos);
      const ctx = canvas.getContext('2d')!; ctx.translate(canvas.width / 2, canvas.height / 2); ctx.rotate(rad); ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1); ctx.drawImage(img, -img.width / 2, -img.height / 2);
      canvas.toBlob(blob => { if (blob) { setResultBlob(blob); setResultName(`rotated_${files[0].name}`); setResult(`Rotated ${angle}°`); } }, 'image/png');
    } catch (e) { setResult('Error: ' + (e as Error).message); }
    setProcessing(false);
  }, [files, angle, flipH, flipV, imgUrl]);

  return (
    <div>
      <FileUpload accept="image/*" onFiles={onFiles} files={files} />
      {imgUrl && (
        <div className="mt-4 space-y-3">
          <img src={imgUrl} alt="Original" className="max-w-xs rounded-xl mx-auto" />
          <div><label className="text-sm text-gray-600 dark:text-gray-400">Angle: {angle}°</label><input type="range" min={0} max={360} value={angle} onChange={e => setAngle(+e.target.value)} className="w-full accent-primary-400" /></div>
          <div className="flex gap-3">{[90,180,270].map(a => <button key={a} onClick={() => setAngle(a)} className="px-4 py-2 bg-gray-100 dark:bg-surface-800 rounded-lg text-sm">{a}°</button>)}</div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><input type="checkbox" checked={flipH} onChange={e => setFlipH(e.target.checked)} className="accent-primary-400" /> Flip H</label>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><input type="checkbox" checked={flipV} onChange={e => setFlipV(e.target.checked)} className="accent-primary-400" /> Flip V</label>
          </div>
          <button onClick={handleTransform} disabled={processing} className="btn-primary w-full">{processing ? t('processing') : 'Apply Transform'}</button>
        </div>
      )}
      {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">{result}</div>}
      {resultBlob && <DownloadResult blob={resultBlob} name={resultName} />}
    </div>
  );
}

function DownloadResult({ blob, name }: { blob: Blob; name: string }) {
  const { showToast } = useApp();
  const handleDownload = () => {
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
    showToast('Downloaded!', 'success');
    try { const confetti = require('canvas-confetti'); confetti.default({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch {}
  };
  const handleShare = () => { window.open(`https://wa.me/?text=${encodeURIComponent('Check out this tool on NexaTools!')}`, '_blank'); };
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download
      </button>
      <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-surface-800 transition-colors">
        <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
        WhatsApp
      </button>
    </div>
  );
}
