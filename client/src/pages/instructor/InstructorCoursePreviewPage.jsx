import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  Clock,
  Star,
  BookOpen,
  Layers,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Video,
  FileText,
  Download,
} from 'lucide-react';
import InstructorPreviewTopNav from '../../components/instructor/courses/preview/InstructorPreviewTopNav';
import InstructorPreviewCurriculumSidebar from '../../components/instructor/courses/preview/InstructorPreviewCurriculumSidebar';
import UniversalVideoPlayer from '../../components/common/UniversalVideoPlayer';
import { getCourseById } from '../../services/course.api';

export default function InstructorCoursePreviewPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(Boolean(courseId));
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeChapterTitle, setActiveChapterTitle] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!courseId) return;
    let isMounted = true;

    const fetchCourse = async () => {
      try {
        const res = await getCourseById(courseId);
        if (res?.data && isMounted) {
          const c = res.data;
          setCourse(c);
          const chs = c.chapters || [];

          let initialLesson = null;
          let initialChapterTitle = chs[0]?.title || 'Course Outline';
          for (const ch of chs) {
            if (ch.lessons && ch.lessons.length > 0) {
              initialLesson = ch.lessons[0];
              initialChapterTitle = ch.title;
              break;
            }
          }

          if (!initialLesson) {
            initialLesson = {
              _id: 'overview',
              id: 'overview',
              title: c.title || 'Course Overview',
              duration: 'Curriculum Intro',
              videoUrl: '',
              isFreePreview: true,
              content: c.description || 'Welcome to this course curriculum.',
            };
          }

          setActiveLesson(initialLesson);
          setActiveChapterTitle(initialChapterTitle);
        }
      } catch {
        if (isMounted) setCourse(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourse();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const handleSelectLesson = (lesson, chapter) => {
    setActiveLesson(lesson);
    if (chapter) setActiveChapterTitle(chapter.title);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 px-4 space-y-4">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Course Not Found
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          The requested course could not be loaded.
        </p>
        <button
          onClick={() => navigate('/instructor/courses')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </button>
      </div>
    );
  }

  const chapters = course.chapters || [];
  const currentLesson = activeLesson || {
    id: 'preview',
    title: 'Lesson Content',
    duration: '10 min',
    videoUrl: '',
    isFreePreview: true,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <InstructorPreviewTopNav
        course={course}
        onBack={() => navigate('/instructor/courses')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div
            className="overflow-hidden rounded-2xl border bg-black shadow-md"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
              <UniversalVideoPlayer
                videoUrl={currentLesson.videoUrl}
                poster={course.thumbnail}
                title={currentLesson.title}
              />
            </div>

            <div
              className="p-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div>
                <span className="text-[11px] font-semibold text-slate-400">
                  {activeChapterTitle}
                </span>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  {currentLesson.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  <span>{currentLesson.duration}</span>
                </span>

                {currentLesson.isFreePreview && (
                  <span
                    className="rounded-lg px-2.5 py-1 text-xs font-bold"
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      color: '#10b981',
                    }}
                  >
                    Free Preview
                  </span>
                )}
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl border p-5 space-y-4"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: 'var(--border-subtle)' }}>
              {['overview', 'outcomes'].map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {currentLesson.content && (
                  <div
                    className="p-3.5 rounded-xl border"
                    style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-subtle)' }}
                  >
                    <p className="text-[11px] font-bold text-slate-400 mb-1">Lesson Content</p>
                    <p style={{ color: 'var(--text-primary)' }}>{currentLesson.content}</p>
                  </div>
                )}

                {currentLesson.attachedFile?.url && (
                  <div
                    className="flex items-center justify-between p-3 rounded-xl border"
                    style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-subtle)' }}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
                          {currentLesson.attachedFile.name || 'Lesson Resource'}
                        </p>
                        <p className="text-[10px] text-slate-400">{currentLesson.attachedFile.size || 'Attachment'}</p>
                      </div>
                    </div>
                    <a
                      href={currentLesson.attachedFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  </div>
                )}

                <p>{course.description || course.subtitle}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                    <p className="text-[10px] text-slate-400">Category</p>
                    <p className="font-bold text-xs mt-0.5" style={{ color: 'var(--text-primary)' }}>
                      {course.category?.name || (typeof course.category === 'string' ? course.category : 'General')}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                    <p className="text-[10px] text-slate-400">Level</p>
                    <p className="font-bold text-xs mt-0.5" style={{ color: 'var(--text-primary)' }}>
                      {course.level}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                    <p className="text-[10px] text-slate-400">Enrolled</p>
                    <p className="font-bold text-xs mt-0.5" style={{ color: 'var(--text-primary)' }}>
                      {course.enrolled ?? course.students ?? 0} students
                    </p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                    <p className="text-[10px] text-slate-400">Rating</p>
                    <p className="font-bold text-xs mt-0.5 flex items-center gap-1 text-amber-500">
                      <Star className="h-3 w-3 fill-amber-500" />
                      <span>{course.rating || 'New'}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'outcomes' && (
              <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Comprehensive hands-on implementation with production architecture.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Real-world exercises and verifiable portfolio project artifacts.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>High quality video streaming and interactive code reviews.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <InstructorPreviewCurriculumSidebar
            chapters={chapters}
            activeLessonId={currentLesson._id || currentLesson.id}
            onSelectLesson={handleSelectLesson}
          />
        </div>
      </div>
    </div>
  );
}
