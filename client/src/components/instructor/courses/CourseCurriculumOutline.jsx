import { Plus, BookOpen, Video, FileText, Layers } from 'lucide-react';
import CourseChapterCard from './CourseChapterCard';

export default function CourseCurriculumOutline({
  chapters = [],
  onAddChapter,
  onUpdateChapter,
  onRemoveChapter,
  onMoveChapter,
}) {
  const totalLessons = chapters.reduce((sum, ch) => sum + (ch.lessons ? ch.lessons.length : 0), 0);
  const totalVideos = chapters.reduce(
    (sum, ch) => sum + (ch.lessons ? ch.lessons.filter(l => (l.type || 'video') === 'video').length : 0),
    0
  );
  const totalFiles = chapters.reduce(
    (sum, ch) =>
      sum +
      (ch.lessons
        ? ch.lessons.filter(l => l.type === 'resource' || l.attachedFile || l.resourceFile).length
        : 0),
    0
  );

  return (
    <div className="space-y-5">
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl p-6 border shadow-sm"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Curriculum &amp; Chapter Syllabus
            </h2>
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--color-primary-600)',
              }}
            >
              Interactive Builder
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Organize modules into chapters, attach streamable video lectures, and provide downloadable student code files.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold border"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-500" />
            <span>{chapters.length} Chapters</span>
          </span>

          <span
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold border"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            <Video className="h-3.5 w-3.5 text-emerald-500" />
            <span>{totalVideos} Videos</span>
          </span>

          <span
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold border"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            <FileText className="h-3.5 w-3.5 text-purple-500" />
            <span>{totalFiles} Resources</span>
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {chapters.map((chapter, cIdx) => (
          <CourseChapterCard
            key={chapter.id || cIdx}
            chapterIndex={cIdx}
            totalChapters={chapters.length}
            chapter={chapter}
            onUpdateChapter={updated => onUpdateChapter(cIdx, updated)}
            onRemoveChapter={() => onRemoveChapter(cIdx)}
            onMoveChapter={onMoveChapter}
          />
        ))}

        {chapters.length === 0 && (
          <div
            className="rounded-3xl border border-dashed p-12 text-center"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-muted)',
            }}
          >
            <Layers className="h-10 w-10 mx-auto mb-3 opacity-40 text-blue-500" />
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              No chapters in syllabus yet
            </h3>
            <p className="text-xs mt-1 max-w-sm mx-auto">
              Start building your course structure by clicking the button below to add Chapter 1.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onAddChapter}
          className="inline-flex items-center gap-2 rounded-2xl border-2 border-dashed px-7 py-3.5 text-xs font-bold transition hover:opacity-80 active:scale-95 shadow-sm"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--color-primary-600)',
          }}
        >
          <Plus className="h-4 w-4" />
          <span>Add New Chapter / Section</span>
        </button>
      </div>
    </div>
  );
}
