import { useState } from 'react';
import { Video, FileText, Trash2, Eye, ChevronDown, ChevronUp, Paperclip, Clock } from 'lucide-react';
import CourseFileUploadDropzone from './CourseFileUploadDropzone';

export default function CourseVideoLessonItem({
  chapterIndex,
  lessonIndex,
  lesson,
  onChange,
  onRemove,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const lessonType = lesson.type || 'video';

  return (
    <div
      className="rounded-2xl border transition-all"
      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold"
            style={{
              backgroundColor: 'rgba(37, 99, 235, 0.12)',
              color: 'var(--color-primary-600)',
            }}
          >
            {chapterIndex + 1}.{lessonIndex + 1}
          </span>

          <button
            type="button"
            onClick={() => onChange({ ...lesson, type: lessonType === 'video' ? 'resource' : 'video' })}
            className="flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold border transition hover:opacity-80 shrink-0"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
              color: lessonType === 'video' ? 'var(--color-primary-600)' : '#10b981',
            }}
            title="Toggle between Video and Resource"
          >
            {lessonType === 'video' ? <Video className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
            <span className="capitalize">{lessonType}</span>
          </button>

          <input
            type="text"
            placeholder="Lesson title..."
            value={lesson.title || ''}
            onChange={e => onChange({ ...lesson, title: e.target.value })}
            className="w-full bg-transparent text-xs font-bold outline-none"
            style={{ color: 'var(--text-primary)' }}
          />

          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            {lesson.videoFile || lesson.videoUrl ? (
              <span className="rounded-full px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Media Ready
              </span>
            ) : (
              <span className="rounded-full px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                No Media
              </span>
            )}
            {lesson.attachedFile?.assetUrl || lesson.attachedFile?.url ? (
              <span className="rounded-full px-2 py-0.5 text-[9px] font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20">
                +Resource
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            <Clock className="h-3 w-3" />
            <input
              type="text"
              placeholder="12:00"
              value={lesson.duration || ''}
              onChange={e => onChange({ ...lesson, duration: e.target.value })}
              className="w-14 rounded-lg border px-1.5 py-0.5 text-[11px] outline-none text-center"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <label
            className="flex items-center gap-1 cursor-pointer text-[10px] font-bold px-2 py-1 rounded-lg border select-none transition"
            style={{
              borderColor: lesson.isFreePreview ? 'var(--color-primary-600)' : 'var(--border-subtle)',
              backgroundColor: lesson.isFreePreview ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-card)',
              color: lesson.isFreePreview ? 'var(--color-primary-600)' : 'var(--text-muted)',
            }}
          >
            <input
              type="checkbox"
              checked={!!lesson.isFreePreview}
              onChange={e => onChange({ ...lesson, isFreePreview: e.target.checked })}
              className="sr-only"
            />
            <Eye className="h-3 w-3" />
            <span>Preview</span>
          </label>

          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-1.5 rounded-lg border transition hover:opacity-80"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-muted)',
            }}
            title="Expand media uploads"
          >
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-lg transition hover:bg-rose-500/10 text-slate-400 hover:text-rose-500"
            title="Remove lesson"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t space-y-4" style={{ borderColor: 'var(--border-subtle)' }}>
          {lessonType === 'video' ? (
            <CourseFileUploadDropzone
              accept="video/*"
              type="video"
              uploadType="video"
              fileInfo={lesson.videoFile}
              onFileChange={file => onChange({ ...lesson, videoFile: file })}
              urlValue={lesson.videoUrl}
              onUrlChange={url => onChange({ ...lesson, videoUrl: url, videoFile: null })}
            />
          ) : (
            <CourseFileUploadDropzone
              accept=".pdf,.zip,.rar,.tar.gz,.doc,.docx,.ppt,.pptx,.txt"
              type="file"
              uploadType="resource"
              fileInfo={lesson.resourceFile}
              onFileChange={file => onChange({ ...lesson, resourceFile: file })}
              urlValue={lesson.resourceUrl}
              onUrlChange={url => onChange({ ...lesson, resourceUrl: url, resourceFile: null })}
            />
          )}

          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Paperclip className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Supplementary Material (Cheatsheet, Source Code ZIP)
              </span>
            </div>
            <CourseFileUploadDropzone
              accept=".pdf,.zip,.png,.jpg,.jpeg,.json"
              type="file"
              uploadType="attachment"
              fileInfo={
                lesson.attachedFile?.assetUrl || lesson.attachedFile?.url
                  ? lesson.attachedFile
                  : null
              }
              onFileChange={file => onChange({ ...lesson, attachedFile: file })}
              urlValue={lesson.attachedFile?.url || lesson.attachedFileUrl}
              onUrlChange={url =>
                onChange({
                  ...lesson,
                  attachedFile: { ...(lesson.attachedFile || {}), url },
                  attachedFileUrl: url,
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
