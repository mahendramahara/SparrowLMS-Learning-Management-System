import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  Clock,
  Star,
  BookOpen,
  Users,
  User,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { getCourseById } from '../../services/course.api';
import { enrollInCourse } from '../../services/enrollment.api';
import { initiatePayment } from '../../services/payment.api';
import EsewaCheckoutForm from '../../components/payment/EsewaCheckoutForm';
import UniversalVideoPlayer from '../../components/common/UniversalVideoPlayer';

export default function StudentCoursePreviewPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(Boolean(courseId));
  const [activeLesson, setActiveLesson] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);

  useEffect(() => {
    if (!courseId) return;
    let isMounted = true;

    const fetchCourse = async () => {
      try {
        const res = await getCourseById(courseId);
        if (res?.data && isMounted) {
          const c = res.data;
          setCourse(c);

          const chapters = c.chapters || [];
          let initialLesson = null;
          for (const ch of chapters) {
            for (const l of ch.lessons || []) {
              if (l.isFreePreview && l.videoUrl) {
                initialLesson = { ...l, chapterTitle: ch.title };
                break;
              }
              if (!initialLesson && l.videoUrl) {
                initialLesson = { ...l, chapterTitle: ch.title };
              }
            }
            if (initialLesson?.isFreePreview) break;
          }

          if (!initialLesson && chapters[0]?.lessons?.[0]) {
            initialLesson = {
              ...chapters[0].lessons[0],
              chapterTitle: chapters[0].title,
            };
          }

          setActiveLesson(initialLesson);
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

  const chapters = course?.chapters || [];
  const totalLessons = chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0);

  const activeVideoUrl = activeLesson?.videoUrl || course?.previewVideoUrl || '';

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll in this course');
      navigate('/login', { state: { from: `/student/courses/${courseId}/preview` } });
      return;
    }

    const price = Number(course.price) || 0;
    if (price === 0) {
      try {
        const res = await enrollInCourse(course._id);
        toast.success(res?.message || 'Enrolled successfully!');
        navigate('/student/courses');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to enroll');
      }
      return;
    }

    try {
      const res = await initiatePayment(course._id);
      if (res.isFree || res.alreadyEnrolled) {
        toast.success(res.message);
        navigate('/student/courses');
        return;
      }
      if (res.data?.formData && res.data?.paymentUrl) {
        setCheckoutData({
          formData: res.data.formData,
          paymentUrl: res.data.paymentUrl,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
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
          The requested course preview is unavailable.
        </p>
        <button
          onClick={() => navigate('/student/browse')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition hover:opacity-80"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ backgroundColor: 'var(--color-primary-600)' }}
          >
            {course.category?.name || 'Course Preview'}
          </span>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold border"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            {course.level || 'All Levels'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div
            className="overflow-hidden rounded-3xl border bg-black shadow-xl"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
              <UniversalVideoPlayer
                videoUrl={activeVideoUrl}
                poster={course.thumbnail}
                title={activeLesson?.title || course.title}
              />
            </div>

            <div
              className="flex items-center justify-between p-4 px-6 border-t text-xs"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="space-y-0.5 min-w-0">
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                  {activeLesson?.chapterTitle || 'Selected Preview Lecture'}
                </span>
                <p className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                  {activeLesson?.title || course.title}
                </p>
              </div>

              {activeLesson?.isFreePreview && (
                <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-500 border border-emerald-500/20 shrink-0">
                  Free Preview
                </span>
              )}
            </div>
          </div>

          <div
            className="rounded-3xl border p-6 space-y-4"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {course.title}
              </h1>
              {course.subtitle && (
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {course.subtitle}
                </p>
              )}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {course.description}
            </p>

            <div
              className="flex flex-wrap items-center gap-6 pt-4 border-t text-xs"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {course.instructor?.name || 'Course Instructor'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{course.duration ? `${course.duration} hours` : 'Self-paced'}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span>{totalLessons} Lectures</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span>{course.enrolled || 0} Learners</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                <Star className="h-4 w-4 fill-amber-500" />
                <span>{course.rating > 0 ? Number(course.rating).toFixed(1) : '5.0'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="rounded-3xl border p-6 space-y-5 shadow-lg"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
                Enrollment Fee
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {course.price ? `NPR ${course.price}` : 'Free'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleEnroll}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-98"
              style={{ backgroundColor: 'var(--color-primary-600)' }}
            >
              <span>{course.price ? 'Enroll with eSewa' : 'Enroll for Free'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="space-y-2.5 pt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Instant full lifetime access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Access on mobile, tablet, and desktop</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Certificate of completion included</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-3xl border overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div
              className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                Course Curriculum
              </h3>
              <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                {totalLessons} lessons
              </span>
            </div>

            <div className="divide-y max-h-[460px] overflow-y-auto" style={{ borderColor: 'var(--border-subtle)' }}>
              {chapters.map((ch, chIdx) => (
                <div key={ch._id || chIdx} className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      {ch.title || `Chapter ${chIdx + 1}`}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {(ch.lessons || []).length} lessons
                    </span>
                  </div>

                  <div className="space-y-1">
                    {(ch.lessons || []).map((lesson, lIdx) => {
                      const isSelected = activeLesson?._id === lesson._id || activeLesson?.id === lesson._id;
                      const canPreview = Boolean(lesson.videoUrl);

                      return (
                        <button
                          key={lesson._id || lIdx}
                          type="button"
                          onClick={() => setActiveLesson({ ...lesson, chapterTitle: ch.title })}
                          className="flex w-full items-center justify-between gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs transition active:scale-98"
                          style={{
                            backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                            color: isSelected ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                          }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                              style={{
                                backgroundColor: isSelected ? 'var(--color-primary-600)' : 'var(--bg-subtle)',
                                color: isSelected ? '#ffffff' : 'var(--text-muted)',
                              }}
                            >
                              {lesson.isFreePreview || canPreview ? (
                                <Play className="h-2.5 w-2.5 fill-current" />
                              ) : (
                                <Lock className="h-2.5 w-2.5" />
                              )}
                            </div>
                            <span className="truncate text-xs font-medium">
                              {lesson.title || `Lesson ${lIdx + 1}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {lesson.isFreePreview && (
                              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">
                                Preview
                              </span>
                            )}
                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                              {lesson.duration || '5 min'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {checkoutData && (
        <EsewaCheckoutForm
          formData={checkoutData.formData}
          paymentUrl={checkoutData.paymentUrl}
          onCancel={() => setCheckoutData(null)}
        />
      )}
    </div>
  );
}
