import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Video,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  Eye,
} from 'lucide-react';

export default function CoursePublishReview({
  courseData,
  onPublish,
  isPublishing = false,
  previewUrl,
}) {
  const {
    title,
    subtitle,
    category,
    level,
    price,
    thumbnail,
    description,
    chapters = [],
  } = courseData;

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

  const checklist = [
    { label: 'Course title defined', pass: !!(title && title.trim().length > 5) },
    { label: 'Category assigned', pass: !!category },
    { label: 'Thumbnail asset configured', pass: !!thumbnail },
    { label: 'At least one chapter with lessons', pass: chapters.length > 0 && totalLessons > 0 },
    { label: 'Individual video & file assets uploaded', pass: totalVideos > 0 },
    { label: 'Course overview and outcomes written', pass: !!(description && description.trim().length > 15) },
  ];

  const allPassed = checklist.every(c => c.pass);

  return (
    <div className="space-y-6">
      <div
        className="rounded-3xl p-6 sm:p-8 border shadow-sm"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div
            className="w-full lg:w-72 shrink-0 rounded-2xl overflow-hidden border shadow-sm"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
              {thumbnail ? (
                <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-500">
                  <Video className="h-8 w-8 opacity-40" />
                </div>
              )}
              <span className="absolute top-2 left-2 rounded-lg bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white">
                {category}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-bold text-sm line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                {title || 'Untitled Course Curriculum'}
              </h3>
              <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                {subtitle || description || 'No summary provided.'}
              </p>

              <div className="flex items-center justify-between pt-2 border-t text-xs font-semibold" style={{ borderColor: 'var(--border-subtle)' }}>
                <span className="text-slate-400">{level}</span>
                <span className="text-base font-extrabold text-blue-500">
                  {price ? `$${price}` : 'Free'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 w-full">
            <div>
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                }}
              >
                Curriculum Overview
              </span>
              <h2 className="text-xl font-extrabold mt-1" style={{ color: 'var(--text-primary)' }}>
                Ready to Publish &amp; Distribute
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Review syllabus structure, verification checklist, and administrative approval standards before final publishing.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div
                className="rounded-2xl p-3.5 border"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center gap-2 text-blue-500">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs font-semibold text-slate-400">Chapters</span>
                </div>
                <p className="text-lg font-extrabold mt-1" style={{ color: 'var(--text-primary)' }}>
                  {chapters.length} Modules
                </p>
              </div>

              <div
                className="rounded-2xl p-3.5 border"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center gap-2 text-emerald-500">
                  <Video className="h-4 w-4" />
                  <span className="text-xs font-semibold text-slate-400">Lectures</span>
                </div>
                <p className="text-lg font-extrabold mt-1" style={{ color: 'var(--text-primary)' }}>
                  {totalVideos} Videos
                </p>
              </div>

              <div
                className="rounded-2xl p-3.5 border col-span-2 sm:col-span-1"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center gap-2 text-purple-500">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs font-semibold text-slate-400">Files &amp; Code</span>
                </div>
                <p className="text-lg font-extrabold mt-1" style={{ color: 'var(--text-primary)' }}>
                  {totalFiles} Attachments
                </p>
              </div>
            </div>

            <div
              className="rounded-2xl p-4 border space-y-2"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Pre-Publication Quality Checklist
              </span>
              <div className="space-y-1.5">
                {checklist.map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    {item.pass ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    )}
                    <span
                      className="font-medium"
                      style={{ color: item.pass ? 'var(--text-primary)' : 'var(--text-muted)' }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">
                All media assets pre-uploaded individually. Submitting lightweight JSON metadata only.
              </p>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                {previewUrl && (
                  <Link
                    to={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-2xl border px-4 py-3 text-xs font-bold transition hover:opacity-80"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span>Live Preview</span>
                  </Link>
                )}

                <button
                  type="button"
                  disabled={!allPassed || isPublishing}
                  onClick={onPublish}
                  className="inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 text-xs font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isPublishing ? 'Submitting to Catalog...' : 'Publish Course to Catalog'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
