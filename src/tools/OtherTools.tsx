import { useState, useCallback, useRef, useEffect } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';

export function QrCodeGenerator() {
  const { t } = useApp(); const { showToast } = useToast();
  const [data, setData] = useState('https://nexatools.com');
  const [size, setSize] = useState(256); const [fgColor, setFgColor] = useState('#000000'); const [bgColor, setBgColor] = useState('#ffffff');
  const [qrUrl, setQrUrl] = useState(''); const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = useCallback(async () => {
    if (!data) return;
    try { const QRCode = (await import('qrcode')).default; const canvas = canvasRef.current; if (canvas) { await QRCode.toCanvas(canvas, data, { width: size, margin: 2, color: { dark: fgColor, light: bgColor } }); setQrUrl(canvas.toDataURL('image/png')); } } catch { showToast('Error generating QR code', 'error'); }
  }, [data, size, fgColor, bgColor, showToast]);

  useEffect(() => { generateQR(); }, [generateQR]);

  return (
    <div>
      <div className="space-y-3">
        <input type="text" value={data} onChange={e => setData(e.target.value)} className="input-field" placeholder="Enter URL or text" />
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-500">Size (px)</label><select value={size} onChange={e => setSize(+e.target.value)} className="input-field mt-1">{[128,256,512,1024].map(s => <option key={s} value={s}>{s}px</option>)}</select></div>
          <div className="flex gap-3">
            <div><label className="text-xs text-gray-500">Foreground</label><input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer mt-1" /></div>
            <div><label className="text-xs text-gray-500">Background</label><input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer mt-1" /></div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center"><canvas ref={canvasRef} className="mx-auto rounded-xl" /></div>
      {qrUrl && <div className="mt-4 flex justify-center gap-2"><a href={qrUrl} download="qrcode.png" className="btn-primary text-sm">Download PNG</a><button onClick={() => { navigator.clipboard.writeText(data); showToast(t('copied')); }} className="btn-secondary flex items-center gap-2 text-sm"><Copy className="w-4 h-4" /> Copy Data</button></div>}
    </div>
  );
}

export function PasswordGenerator() {
  const { t } = useApp(); const { showToast } = useToast();
  const [length, setLength] = useState(16); const [useUpper, setUseUpper] = useState(true); const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true); const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState(''); const [count, setCount] = useState(1); const [passwords, setPasswords] = useState<string[]>([]);

  const generate = useCallback(() => {
    let chars = ''; if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) chars += '0123456789'; if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { showToast('Select at least one type', 'error'); return; }
    const result: string[] = [];
    for (let c = 0; c < count; c++) { let pw = ''; for (let i = 0; i < length; i++) pw += chars[Math.floor(Math.random() * chars.length)]; result.push(pw); }
    setPasswords(result); setPassword(result[0]);
  }, [length, useUpper, useLower, useNumbers, useSymbols, count, showToast]);

  const getStrength = (pw: string) => { let s = 0; if (pw.length >= 12) s += 25; if (pw.length >= 16) s += 25; if (/[A-Z]/.test(pw)) s += 15; if (/[a-z]/.test(pw)) s += 15; if (/[0-9]/.test(pw)) s += 10; if (/[^A-Za-z0-9]/.test(pw)) s += 10; return Math.min(100, s); };
  const strength = password ? getStrength(password) : 0;
  const sLabel = strength > 80 ? 'Strong' : strength > 50 ? 'Medium' : 'Weak';
  const sColor = strength > 80 ? 'bg-green-500' : strength > 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div>
      <div className="space-y-4">
        <div><label className="text-sm text-gray-600 dark:text-gray-400">Length: {length}</label><input type="range" min={4} max={128} value={length} onChange={e => setLength(+e.target.value)} className="w-full accent-primary-400" /></div>
        <div className="grid grid-cols-2 gap-2">
          {[{l:'Uppercase (A-Z)',v:useUpper,s:setUseUpper},{l:'Lowercase (a-z)',v:useLower,s:setUseLower},{l:'Numbers (0-9)',v:useNumbers,s:setUseNumbers},{l:'Symbols (!@#$)',v:useSymbols,s:setUseSymbols}].map(o => (
            <label key={o.l} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer"><input type="checkbox" checked={o.v} onChange={e => o.s(e.target.checked)} className="accent-primary-400" />{o.l}</label>
          ))}
        </div>
        <div><label className="text-sm text-gray-600 dark:text-gray-400">Count</label><input type="number" min={1} max={20} value={count} onChange={e => setCount(+e.target.value)} className="input-field w-20" /></div>
        <button onClick={generate} className="btn-primary w-full flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Generate Passwords</button>
      </div>
      {passwords.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="p-4 bg-gray-50 dark:bg-surface-800 rounded-xl"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Strength: {sLabel}</span><span className="text-xs text-gray-400">{strength}%</span></div><div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className={`${sColor} h-2 rounded-full transition-all`} style={{ width: `${strength}%` }} /></div></div>
          {passwords.map((pw, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-surface-800 rounded-xl"><code className="text-sm font-mono flex-1 break-all">{pw}</code><button onClick={() => { navigator.clipboard.writeText(pw); showToast(t('copied')); }} className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"><Copy className="w-4 h-4 text-primary-400" /></button></div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ColorPicker() {
  const { t } = useApp(); const { showToast } = useToast();
  const [hex, setHex] = useState('#6c63ff'); const [history, setHistory] = useState<string[]>([]);
  const hexToRgb = (h: string) => ({ r: parseInt(h.slice(1,3),16), g: parseInt(h.slice(3,5),16), b: parseInt(h.slice(5,7),16) });
  const rgbToHsl = (r: number, g: number, b: number) => { r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h=0,s=0;const l=(max+min)/2;if(max!==min){const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6;break;}}return{h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)}; };
  const rgb = hexToRgb(hex); const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const addToHistory = () => setHistory(prev => [hex, ...prev.filter(c => c !== hex)].slice(0, 12));
  const getShades = (h: string) => { const {r,g,b} = hexToRgb(h); const shades: string[] = []; for (let i=0.1;i<=0.9;i+=0.1) { shades.push(`#${Math.round(r*i).toString(16).padStart(2,'0')}${Math.round(g*i).toString(16).padStart(2,'0')}${Math.round(b*i).toString(16).padStart(2,'0')}`); } return shades; };
  const codes = [{label:'HEX',value:hex.toUpperCase()},{label:'RGB',value:`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`},{label:'HSL',value:`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}];

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <input type="color" value={hex} onChange={e => { setHex(e.target.value); addToHistory(); }} className="w-20 h-20 rounded-xl cursor-pointer border-0" />
        <div><input type="text" value={hex} onChange={e => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && setHex(e.target.value)} className="input-field font-mono" maxLength={7} /><div className="w-full h-8 rounded-lg mt-2 border border-gray-200 dark:border-gray-600" style={{ backgroundColor: hex }} /></div>
      </div>
      <div className="space-y-2">{codes.map(c => (
        <div key={c.label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-surface-800 rounded-xl">
          <span className="text-xs font-medium text-gray-500">{c.label}</span>
          <div className="flex items-center gap-2"><code className="text-sm font-mono">{c.value}</code><button onClick={() => { navigator.clipboard.writeText(c.value); showToast(t('copied')); }} className="p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"><Copy className="w-3.5 h-3.5 text-primary-400" /></button></div>
        </div>
      ))}</div>
      <div className="mt-4"><h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Shades</h4><div className="flex gap-1">{getShades(hex).map((shade, i) => (
        <button key={i} onClick={() => setHex(shade)} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform" style={{ backgroundColor: shade }} title={shade} />
      ))}</div></div>
      {history.length > 0 && <div className="mt-4"><h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Recent</h4><div className="flex gap-1 flex-wrap">{history.map((c, i) => (
        <button key={i} onClick={() => setHex(c)} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform" style={{ backgroundColor: c }} title={c} />
      ))}</div></div>}
    </div>
  );
}

const unitCategories: Record<string, { label: string; units?: Record<string, number>; special?: boolean }> = {
  length: { label: 'Length', units: { m:1,km:1000,cm:0.01,mm:0.001,mi:1609.344,yd:0.9144,ft:0.3048,'in':0.0254 } },
  weight: { label: 'Weight', units: { kg:1,g:0.001,mg:0.000001,lb:0.453592,oz:0.0283495,ton:1000 } },
  temperature: { label: 'Temperature', special: true },
  volume: { label: 'Volume', units: { L:1,mL:0.001,gal:3.78541,qt:0.946353,cup:0.236588 } },
  area: { label: 'Area', units: { 'm²':1,'km²':1000000,'cm²':0.0001,'ft²':0.092903,acre:4046.86 } },
  speed: { label: 'Speed', units: { 'm/s':1,'km/h':0.277778,'mi/h':0.44704,knot:0.514444 } },
  data: { label: 'Data', units: { B:1,KB:1024,MB:1048576,GB:1073741824 } },
  time: { label: 'Time', units: { s:1,min:60,h:3600,day:86400,week:604800,year:31536000 } },
};
type UnitCat = keyof typeof unitCategories;

export function UnitConverter() {
  const { t } = useApp();
  const [category, setCategory] = useState<UnitCat>('length');
  const [fromUnit, setFromUnit] = useState('m'); const [toUnit, setToUnit] = useState('km');
  const [value, setValue] = useState('1'); const [result, setResult] = useState('');

  const cat = unitCategories[category];
  const units = cat.units ? Object.keys(cat.units) : ['°C', '°F', 'K'];

  useEffect(() => { if (units.length >= 2) { setFromUnit(units[0]); setToUnit(units[1]); } }, [category]);

  const convert = useCallback(() => {
    const val = parseFloat(value); if (isNaN(val)) { setResult('Invalid number'); return; }
    if (category === 'temperature') {
      let celsius = val; if (fromUnit === '°F') celsius = (val - 32) * 5 / 9; else if (fromUnit === 'K') celsius = val - 273.15;
      let converted = celsius; if (toUnit === '°F') converted = celsius * 9 / 5 + 32; else if (toUnit === 'K') converted = celsius + 273.15;
      setResult(`${converted.toFixed(4)} ${toUnit}`);
    } else if (cat.units) {
      const fromFactor = cat.units[fromUnit]; const toFactor = cat.units[toUnit];
      if (fromFactor && toFactor) setResult(`${((val * fromFactor) / toFactor).toFixed(6)} ${toUnit}`);
    }
  }, [category, fromUnit, toUnit, value, cat.units]);

  return (
    <div>
      <div className="space-y-4">
        <select value={category} onChange={e => { setCategory(e.target.value as UnitCat); setValue('1'); setResult(''); }} className="input-field">
          {Object.entries(unitCategories).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-500">From</label><select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="input-field mt-1">{units.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
          <div><label className="text-xs text-gray-500">To</label><select value={toUnit} onChange={e => setToUnit(e.target.value)} className="input-field mt-1">{units.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
        </div>
        <div><label className="text-xs text-gray-500">Value</label><input type="number" value={value} onChange={e => setValue(e.target.value)} className="input-field mt-1" /></div>
        <button onClick={convert} className="btn-primary w-full">Convert</button>
      </div>
      {result && <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl"><p className="text-sm text-green-700 dark:text-green-300">{value} {fromUnit} = <span className="font-bold text-lg">{result}</span></p></div>}
    </div>
  );
}
