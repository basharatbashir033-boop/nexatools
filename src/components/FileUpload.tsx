import { useState, useCallback, type DragEvent, type ChangeEvent, type ReactNode } from 'react';
import { Upload, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface FileUploadProps { accept?: string; multiple?: boolean; onFiles: (files: File[]) => void; files?: File[]; children?: ReactNode; }

export default function FileUpload({ accept, multiple = false, onFiles, files = [], children }: FileUploadProps) {
  const { t } = useApp();
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault(); setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    onFiles(multiple ? [...files, ...dropped] : dropped.slice(0, 1));
  }, [files, multiple, onFiles]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    onFiles(multiple ? [...files, ...selected] : selected.slice(0, 1));
    e.target.value = '';
  }, [files, multiple, onFiles]);

  const removeFile = (index: number) => onFiles(files.filter((_, i) => i !== index));

  return (
    <div>
      <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}
        className={`upload-zone ${dragging ? 'upload-zone-active' : ''}`}>
        <input type="file" accept={accept} multiple={multiple} onChange={handleChange} className="hidden" id="file-upload" capture="environment" />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <Upload className="w-10 h-10 text-primary-400" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('uploadFile')}</p>
          <p className="text-xs text-gray-400">{t('uploadHint')}</p>
        </label>
        {children}
      </div>
      {files.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-surface-800 rounded-lg px-3 py-2">
              <span className="text-xs text-gray-600 dark:text-gray-300 truncate flex-1">{file.name}</span>
              <span className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
              <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
      <p className="text-[10px] text-gray-400 mt-2 text-center">{t('trustMessage')}</p>
    </div>
  );
}
