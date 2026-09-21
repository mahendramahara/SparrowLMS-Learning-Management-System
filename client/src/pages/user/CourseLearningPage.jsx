import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClassroomTopNav from '../../components/classroom/ClassroomTopNav';
import ClassroomVideoPlayer from '../../components/classroom/ClassroomVideoPlayer';
import ClassroomTabContent from '../../components/classroom/ClassroomTabContent';
import ClassroomCurriculumSidebar from '../../components/classroom/ClassroomCurriculumSidebar';
import learningData from '../../demo/courseLearningData.json';

export default function CourseLearningPage() {
  const { courseId = 'c1' } = useParams();
  const navigate = useNavigate();

  const course = learningData[courseId] || learningData['c1'];

  const [activeLessonId, setActiveLessonId] = useState(course.currentLessonId || 'l3-3');
  const [activeTab, setActiveTab] = useState('overview');
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(course.overallProgress);
  const [completedCount, setCompletedCount] = useState(course.completedLessonsCount);

  const currentLesson = useMemo(() => {
    return (
      course.lessonsDetail[activeLessonId] ||
      course.lessonsDetail['l3-3'] || {
        id: activeLessonId,
        title: 'Active Lesson',
        moduleTitle: 'Current Module',
        videoUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
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
        setProgress(p => Math.min(100, p + 5));
        setCompletedCount(c => Math.min(course.totalLessonsCount, c + 1));
      } else {
        setProgress(p => Math.max(0, p - 5));
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
        setActiveLessonId(nextLesson.id);
        setIsCompleted(nextLesson.completed);
      }
    }
  };

  const handleSelectLesson = lessonId => {
    setActiveLessonId(lessonId);
    const allLessons = course.modules.flatMap(m => m.lessons);
    const selected = allLessons.find(l => l.id === lessonId);
    if (selected) {
      setIsCompleted(selected.completed);
    }
  };

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
