import { useState, useCallback, useMemo, useEffect } from 'react';
import { Copy, Play, Pause, RotateCcw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';

const urduMap: Record<string, string> = {
  'a':'ا','b':'ب','c':'ک','d':'د','e':'ے','f':'ف','g':'گ','h':'ہ','i':'ی','j':'ج','k':'ک','l':'ل','m':'م',
  'n':'ن','o':'و','p':'پ','q':'ق','r':'ر','s':'س','t':'ت','u':'ں','v':'ط','w':'و','x':'خ','y':'ے','z':'ز',
  'A':'آ','B':'ب','C':'چ','D':'ڈ','E':'ع','F':'ف','G':'غ','H':'ح','I':'ی','J':'ض','K':'خ','L':'لا',
  'M':'م','N':'ں','O':'و','P':'پ','Q':'ق','R':'ڑ','S':'ش','T':'ٹ','U':'ء','V':'ظ','W':'و','X':'خ','Y':'ی','Z':'ذ',
  'sh':'ش','ch':'چ','kh':'خ','gh':'غ','zh':'ژ','th':'تھ','ph':'فھ','aa':'آ','ee':'یی','oo':'وو','ai':'ائ','au':'اؤ',
};

export function UrduTypingTool() {
  const { t } = useApp(); const { showToast } = useToast();
  const [input, setInput] = useState(''); const [urduText, setUrduText] = useState('');
  const convertToUrdu = (text: string) => { let result = ''; let i = 0; while (i < text.length) { if (i + 1 < text.length) { const two = text[i] + text[i+1]; if (urduMap[two]) { result += urduMap[two]; i += 2; continue; } } result += urduMap[text[i]] || text[i]; i++; } return result; };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { const val = e.target.value; setInput(val); setUrduText(convertToUrdu(val)); };
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Type in English (phonetic):</label>
      <textarea value={input} onChange={handleChange} rows={5} className="input-field resize-y" placeholder="Type here... e.g. mera nam" />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2 block">Urdu output:</label>
      <div className="p-4 bg-gray-50 dark:bg-surface-800 rounded-xl min-h-[80px] font-urdu text-lg leading-relaxed text-gray-800 dark:text-gray-200" dir="rtl">{urduText || 'اردو متن یہاں ظاہر ہوگا...'}</div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => { navigator.clipboard.writeText(urduText); showToast(t('copied')); }} className="btn-primary flex items-center gap-2 text-sm"><Copy className="w-4 h-4" /> {t('copyToClipboard')}</button>
        <button onClick={() => { setInput(''); setUrduText(''); }} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm hover:bg-gray-50 dark:hover:bg-surface-800 flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Clear</button>
      </div>
    </div>
  );
}

export function WordCounter() {
  const { t } = useApp(); const { showToast } = useToast();
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0; const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length; const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0; const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpace, sentences, paragraphs, readingTime };
  }, [text]);
  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={8} className="input-field resize-y" placeholder="Paste or type your text here..." />
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[{label:'Words',value:stats.words},{label:'Characters',value:stats.chars},{label:'No Spaces',value:stats.charsNoSpace},{label:'Sentences',value:stats.sentences},{label:'Paragraphs',value:stats.paragraphs},{label:'Reading (min)',value:stats.readingTime}].map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-surface-800 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-primary-400">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p></div>
        ))}
      </div>
      <button onClick={() => { navigator.clipboard.writeText(`Words: ${stats.words}, Characters: ${stats.chars}`); showToast(t('copied')); }} className="btn-primary mt-4 flex items-center gap-2 text-sm"><Copy className="w-4 h-4" /> Copy Stats</button>
    </div>
  );
}

export function TextToSpeech() {
  const { t } = useApp();
  const [text, setText] = useState(''); const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(1); const [pitch, setPitch] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(0); const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => { const v = window.speechSynthesis.getVoices(); if (v.length) setVoices(v); };
    loadVoices(); window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleSpeak = useCallback(() => {
    if (!text) return; window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text); utterance.rate = rate; utterance.pitch = pitch;
    if (voices[voiceIndex]) utterance.voice = voices[voiceIndex]; utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance); setSpeaking(true);
  }, [text, rate, pitch, voices, voiceIndex]);

  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={6} className="input-field resize-y" placeholder="Enter text to speak..." />
      <div className="mt-4 space-y-3">
        <div><label className="text-sm text-gray-600 dark:text-gray-400">Speed: {rate}x</label><input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} className="w-full accent-primary-400" /></div>
        <div><label className="text-sm text-gray-600 dark:text-gray-400">Pitch: {pitch}</label><input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={e => setPitch(+e.target.value)} className="w-full accent-primary-400" /></div>
        {voices.length > 0 && <select value={voiceIndex} onChange={e => setVoiceIndex(+e.target.value)} className="input-field">{voices.map((v, i) => <option key={i} value={i}>{v.name} ({v.lang})</option>)}</select>}
        <button onClick={speaking ? () => { window.speechSynthesis.cancel(); setSpeaking(false); } : handleSpeak} className="btn-primary flex items-center gap-2">
          {speaking ? <><Pause className="w-4 h-4" /> Stop</> : <><Play className="w-4 h-4" /> Speak</>}
        </button>
      </div>
    </div>
  );
}

export function CaseConverter() {
  const { t } = useApp(); const { showToast } = useToast();
  const [text, setText] = useState('');
  const convert = (type: string) => {
    let r = '';
    switch (type) {
      case 'upper': r = text.toUpperCase(); break; case 'lower': r = text.toLowerCase(); break;
      case 'title': r = text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()); break;
      case 'sentence': r = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase().replace(/([.!?]\s*)\w/g, c => c.toUpperCase()); break;
      case 'camel': r = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()); break;
      case 'snake': r = text.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, ''); break;
      case 'toggle': r = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''); break;
      case 'reverse': r = text.split('').reverse().join(''); break;
    }
    setText(r); showToast(t('success'));
  };
  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={6} className="input-field resize-y" placeholder="Enter your text..." />
      <div className="mt-3 flex flex-wrap gap-2">
        {[{l:'UPPERCASE',t:'upper'},{l:'lowercase',t:'lower'},{l:'Title Case',t:'title'},{l:'Sentence case',t:'sentence'},{l:'camelCase',t:'camel'},{l:'snake_case',t:'snake'},{l:'tOGGLE',t:'toggle'},{l:'Reverse',t:'reverse'}].map(b => (
          <button key={b.t} onClick={() => convert(b.t)} className="px-3 py-2 bg-gray-100 dark:bg-surface-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg text-sm font-medium transition-colors">{b.l}</button>
        ))}
      </div>
      <button onClick={() => { navigator.clipboard.writeText(text); showToast(t('copied')); }} className="btn-primary mt-3 flex items-center gap-2 text-sm"><Copy className="w-4 h-4" /> {t('copyToClipboard')}</button>
    </div>
  );
}

export function PlagiarismChecker() {
  const { t } = useApp(); const { showToast } = useToast();
  const [text, setText] = useState(''); const [result, setResult] = useState('');
  const [uniquePercent, setUniquePercent] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setText(content);
      showToast(t('success'));
    };
    reader.readAsText(file);
  };

  const checkPlagiarism = useCallback(() => {
    if (!text.trim()) return; setProcessing(true);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const commonPhrases = ['in addition to','as well as','on the other hand','it is important to note'];
    let uniqueCount = 0;
    sentences.forEach(sentence => {
      const lower = sentence.toLowerCase().trim();
      const hasCommon = commonPhrases.some(p => lower.includes(p));
      const stopWords = ['the','a','an','is','are','was','were','be','been','have','has','had','do','does'];
      const isGeneric = lower.split(' ').filter(w => stopWords.includes(w)).length > lower.split(' ').length * 0.6;
      if (!hasCommon && !isGeneric) uniqueCount++;
    });
    const percent = sentences.length > 0 ? Math.round((uniqueCount / sentences.length) * 100) : 100;
    setUniquePercent(percent); setResult(`Analysis: ${sentences.length} sentences checked. ${uniqueCount} appear unique.`);
    setProcessing(false); showToast(t('success'));
  }, [text, showToast, t]);

  return (
    <div>
      <div className="mb-3 flex gap-2 items-center">
        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2">
          📄 Upload File (TXT/DOC)
          <input type="file" accept=".txt,.doc,.docx" onChange={handleFileUpload} className="hidden" />
        </label>
        <span className="text-xs text-gray-400">or type below</span>
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={8} className="w-full border rounded-lg p-3 text-sm dark:bg-surface-800 dark:border-surface-600" placeholder="Paste your text here or upload a file..." />
      <button onClick={checkPlagiarism} disabled={processing || !text.trim()} className="mt-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
        {processing ? 'Checking...' : 'Check Plagiarism'}
      </button>
      {result && (
        <div className="mt-4 p-6 bg-gray-50 dark:bg-surface-800 rounded-xl">
          <div className="text-center mb-4">
            <div className={`text-4xl font-bold ${uniquePercent && uniquePercent > 70 ? 'text-green-500' : 'text-red-500'}`}>{uniquePercent}%</div>
            <p className="text-sm text-gray-500 mt-1">Content Originality Score</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{result}</p>
        </div>
      )}
    </div>
  );

  
