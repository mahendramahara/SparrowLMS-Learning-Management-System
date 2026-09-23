import { useState, useRef } from 'react';
import {
  UploadCloud,
  File,
  Video,
  CheckCircle2,
  X,
  Link as LinkIcon,
  RotateCcw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadMedia } from '../../../services/upload.api';

export default function CourseFileUploadDropzone({
  accept = 'video/*',
  type = 'video',
  uploadType = 'resource',
  fileInfo,
  onFileChange,
  urlValue,
  onUrlChange,
}) {
  const [stagedFile, setStagedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [inputMode, setInputMode] = useState(urlValue ? 'url' : 'file');
  const fileInputRef = useRef(null);

  const isVideo = type === 'video';

  const handleDragOver = e => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) stageFile(files[0]);
  };

  const handleFileSelect = e => {
    const files = e.target.files;
    if (files && files.length > 0) stageFile(files[0]);
  };

  const stageFile = file => {
    setStagedFile({
      raw: file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || (isVideo ? 'video/mp4' : 'application/pdf'),
    });
  };

  const handleStartUpload = async () => {
    if (!stagedFile?.raw) return;

    setIsUploading(true);
    setUploadProgress(5);

    try {
      const response = await uploadMedia(stagedFile.raw, uploadType, percent => {
        setUploadProgress(percent);
      });

      if (response?.success && response.data) {
        const asset = {
          id: response.data.publicId || `asset_${Date.now()}`,
          name: response.data.name || stagedFile.name,
          size: response.data.size || stagedFile.size,
          type: response.data.type || stagedFile.type,
          status: 'ready',
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          assetUrl: response.data.url,
          publicId: response.data.publicId,
          resourceType: response.data.resourceType,
        };

        onFileChange(asset);
        if (onUrlChange) onUrlChange(response.data.url);
        setStagedFile(null);
        toast.success(`${isVideo ? 'Video' : 'File'} uploaded successfully.`);
      } else {
        throw new Error('Upload response missing data');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClearStaged = () => {
    setStagedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveUploaded = () => {
    onFileChange(null);
    setStagedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
          {isVideo ? 'Lecture Video Asset' : 'Downloadable Resource Material'}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setInputMode('file')}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition ${
              inputMode === 'file' ? 'bg-blue-600 text-white shadow-sm' : 'hover:opacity-80'
            }`}
            style={inputMode !== 'file' ? { color: 'var(--text-muted)' } : undefined}
          >
            Direct Upload
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition ${
              inputMode === 'url' ? 'bg-blue-600 text-white shadow-sm' : 'hover:opacity-80'
            }`}
            style={inputMode !== 'url' ? { color: 'var(--text-muted)' } : undefined}
          >
            Cloud / CDN URL
          </button>
        </div>
      </div>

      {inputMode === 'file' ? (
        <div className="space-y-2">
          {fileInfo ? (
            <div
              className="flex items-center justify-between rounded-2xl p-3.5 border transition"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: isVideo ? 'rgba(37, 99, 235, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                    color: isVideo ? 'var(--color-primary-600)' : '#10b981',
                  }}
                >
                  {isVideo ? <Video className="h-4 w-4" /> : <File className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      {fileInfo.name}
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Uploaded
                    </span>
                  </div>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {fileInfo.size} · {fileInfo.uploadedAt || 'Ready'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-lg border transition hover:opacity-80 text-slate-400"
                  style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}
                  title="Replace file"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRemoveUploaded}
                  className="p-1.5 rounded-lg transition hover:bg-rose-500/10 text-slate-400 hover:text-rose-500"
                  title="Remove uploaded asset"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : stagedFile ? (
            <div
              className="rounded-2xl p-4 border space-y-3"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                    {isVideo ? <Video className="h-4 w-4" /> : <File className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      {stagedFile.name}
                    </p>
                    <p className="text-[10px] text-slate-400">{stagedFile.size} · Pending upload</p>
                  </div>
                </div>
                {!isUploading && (
                  <button
                    type="button"
                    onClick={handleClearStaged}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {isUploading ? (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-bold" style={{ color: 'var(--text-primary)' }}>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      Uploading to Cloudinary...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[10px] text-slate-400">Individual upload — no cross-file interference</span>
                  <button
                    type="button"
                    onClick={handleStartUpload}
                    className="inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    Upload Now
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center cursor-pointer transition ${
                isDragging ? 'border-blue-500 bg-blue-500/5' : 'hover:border-blue-500/50'
              }`}
              style={{
                borderColor: isDragging ? '#2563eb' : 'var(--border-subtle)',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
              />
              <UploadCloud className="h-5 w-5 mb-1 text-blue-500" />
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                {isVideo ? 'Select video (MP4, WebM, MOV)' : 'Select file (PDF, ZIP, DOC)'}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Drag and drop or click to browse — uploaded individually to Cloudinary
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative">
          <LinkIcon
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="url"
            placeholder={
              isVideo
                ? 'https://storage.googleapis.com/.../lesson.mp4'
                : 'https://example.com/starter-code.zip'
            }
            value={urlValue || ''}
            onChange={e => onUrlChange(e.target.value)}
            className="w-full rounded-xl border pl-9 pr-3 py-2 text-xs outline-none transition"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      )}
    </div>
  );
}
