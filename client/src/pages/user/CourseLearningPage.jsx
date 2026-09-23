import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import ClassroomTopNav from '../../components/classroom/ClassroomTopNav';
import ClassroomVideoPlayer from '../../components/classroom/ClassroomVideoPlayer';
import ClassroomTabContent from '../../components/classroom/ClassroomTabContent';
import ClassroomCurriculumSidebar from '../../components/classroom/ClassroomCurriculumSidebar';
import { getCourseById } from '../../services/course.api';

export default function CourseLearningPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [realCourse, setRealCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(courseId));

  useEffect(() => {
    if (!courseId) return;
    let isMounted = true;

    const fetchRealCourse = async () => {
      try {
        const res = await getCourseById(courseId);
        if (res?.success && res.data && isMounted) {
          setRealCourse(res.data);
        }
      } catch {
        if (isMounted) setRealCourse(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRealCourse();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const course = useMemo(() => {
    if (!realCourse) {
      return {
        id: courseId,
        title: 'Course Classroom',
        overallProgress: 0,
        totalLessonsCount: 0,
        completedLessonsCount: 0,
        currentLessonId: '',
        modules: [],
        lessonsDetail: {},
      };
    }

    const chapters = realCourse.chapters || [];
    const modules = chapters.map((ch, chIdx) => ({
      id: ch._id,
      title: ch.title || `Chapter ${chIdx + 1}`,
      duration: `${(ch.lessons || []).length * 10} min`,
      lessons: (ch.lessons || []).map((l, lIdx) => ({
        id: l._id,
        title: l.title || `Lesson ${lIdx + 1}`,
        duration: l.duration || '10 min',
        completed: false,
        locked: false,
        type: l.type || 'video',
      })),
    }));

    const lessonsDetail = {};
    chapters.forEach(ch => {
      (ch.lessons || []).forEach(l => {
        lessonsDetail[l._id] = {
          id: l._id,
          title: l.title,
          moduleTitle: ch.title,
          videoUrl: l.videoUrl || 'https://vjs.zencdn.net/v/oceans.mp4',
          description: l.content || 'Explore course material and complete assignments.',
          notes: 'Take notes while following along with this lesson.',
          resources: l.attachedFile?.url ? [l.attachedFile] : [],
        };
      });
    });

    const firstLessonId = modules[0]?.lessons[0]?.id || '';
    const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

    return {
      id: realCourse._id,
      title: realCourse.title,
      overallProgress: 0,
      totalLessonsCount: totalLessons,
      completedLessonsCount: 0,
      currentLessonId: firstLessonId,
      modules,
      lessonsDetail,
    };
  }, [realCourse, courseId]);

  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const activeLessonId = selectedLessonId || course.currentLessonId;
  const [activeTab, setActiveTab] = useState('overview');
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(course.overallProgress);
  const [completedCount, setCompletedCount] = useState(course.completedLessonsCount);

  const currentLesson = useMemo(() => {
    return (
      course.lessonsDetail[activeLessonId] || {
        id: activeLessonId,
        title: 'Active Lesson',
        moduleTitle: 'Current Module',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        description: 'Explore course material and practice with practical exercises.',
        notes: 'Take comprehensive notes while watching this lesson.',
        resources: [],
      }
    );
  }, [course, activeLessonId]);

  const handleToggleComplete = () => {
    setIsCompleted(prev => {
      const next = !prev;
      if (next) {
        setProgress(p => Math.min(100, p + 10));
        setCompletedCount(c => Math.min(course.totalLessonsCount, c + 1));
      } else {
        setProgress(p => Math.max(0, p - 10));
        setCompletedCount(c => Math.max(0, c - 1));
      }
      return next;
    });
  };

  const handleNextLesson = () => {
    const allLessons = course.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === activeLessonId);
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      if (!nextLesson.locked) {
        setSelectedLessonId(nextLesson.id);
        setIsCompleted(nextLesson.completed);
      }
    }
  };

  const handleSelectLesson = lessonId => {
    setSelectedLessonId(lessonId);
    const allLessons = course.modules.flatMap(m => m.lessons);
    const selected = allLessons.find(l => l.id === lessonId);
    if (selected) {
      setIsCompleted(selected.completed);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!realCourse) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 px-4 space-y-4">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Course Not Found
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          The requested course content could not be located or is not yet available.
        </p>
        <button
          onClick={() => navigate('/student/courses')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Enrolled Courses
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <ClassroomTopNav
        courseTitle={course.title}
        lessonTitle={currentLesson.title}
        progress={progress}
        completedCount={completedCount}
        totalCount={course.totalLessonsCount}
        isCompleted={isCompleted}
        onToggleComplete={handleToggleComplete}
        onNextLesson={handleNextLesson}
        onBack={() => navigate('/student/courses')}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ClassroomVideoPlayer
            videoUrl={currentLesson.videoUrl}
            title={currentLesson.title}
            duration={currentLesson.duration}
          />

          <ClassroomTabContent
            lesson={currentLesson}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div>
          <ClassroomCurriculumSidebar
            modules={course.modules}
            activeLessonId={activeLessonId}
            onSelectLesson={handleSelectLesson}
          />
        </div>
      </div>
    </div>
  );
}
