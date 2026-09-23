import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Layers,
  FileCheck,
  Check,
  ArrowRight,
  Sparkles,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getCourseById, updateCourse } from '../../services/course.api';
import CourseBasicInfoForm from '../../components/instructor/courses/CourseBasicInfoForm';
import CourseCurriculumOutline from '../../components/instructor/courses/CourseCurriculumOutline';
import CoursePublishReview from '../../components/instructor/courses/CoursePublishReview';

const STEPS = [
  { id: 1, label: 'Course Details', icon: Layers, description: 'Title, category & pricing' },
  { id: 2, label: 'Curriculum & Uploads', icon: FileCheck, description: 'Chapters, videos & resources' },
  { id: 3, label: 'Review & Update', icon: Sparkles, description: 'Verify changes & preview' },
];

const mapLessonFromApi = lesson => ({
  id: lesson._id || lesson.id,
  title: lesson.title || '',
  type: lesson.type || 'video',
  duration: lesson.duration || '',
  isFreePreview: Boolean(lesson.isFreePreview),
  videoUrl: lesson.videoUrl || '',
  videoPublicId: lesson.videoPublicId || '',
  content: lesson.content || '',
  videoFile: lesson.videoUrl
    ? {
        assetUrl: lesson.videoUrl,
        publicId: lesson.videoPublicId || '',
        name: 'Uploaded video',
        size: '',
        status: 'ready',
        uploadedAt: 'Saved',
      }
    : null,
  attachedFile:
    lesson.attachedFile?.url
      ? {
          assetUrl: lesson.attachedFile.url,
          publicId: lesson.attachedFile.publicId || '',
          name: lesson.attachedFile.name || 'Attached file',
          size: lesson.attachedFile.size || '',
          type: lesson.attachedFile.type || '',
          status: 'ready',
          url: lesson.attachedFile.url,
          uploadedAt: 'Saved',
        }
      : null,
});

const mapChapterFromApi = chapter => ({
  id: chapter._id || chapter.id,
  title: chapter.title || '',
  description: chapter.description || '',
  lessons: (chapter.lessons || []).map(mapLessonFromApi),
});

const buildChapterPayload = chapters =>
  chapters.map(ch => ({
    title: ch.title || '',
    description: ch.description || '',
    lessons: (ch.lessons || []).map((l, lIdx) => ({
      title: l.title || '',
      type: l.type || 'video',
      duration: l.duration || '',
      isFreePreview: Boolean(l.isFreePreview),
      videoUrl: l.videoFile?.assetUrl || l.videoUrl || '',
      videoPublicId: l.videoFile?.publicId || l.videoPublicId || '',
      content: l.content || '',
      attachedFile: l.attachedFile
        ? {
            name: l.attachedFile.name || '',
            size: l.attachedFile.size || '',
            type: l.attachedFile.type || '',
            url: l.attachedFile.assetUrl || l.attachedFile.url || '',
            publicId: l.attachedFile.publicId || '',
          }
        : undefined,
      order: lIdx,
    })),
  }));

export default function InstructorEditCoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [level, setLevel] = useState('intermediate');
  const [price, setPrice] = useState('0');
  const [language, setLanguage] = useState('English');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    if (!courseId || courseId.length !== 24) {
      setIsLoading(false);
      setLoadError('Invalid course ID');
      return;
    }

    let isMounted = true;

    const fetchCourse = async () => {
      try {
        const res = await getCourseById(courseId);
        if (res?.success && res.data && isMounted) {
          const catId = c.category?._id || (typeof c.category === 'string' && c.category.length === 24 ? c.category : '');
          const catName = c.category?.name || (typeof c.category === 'string' ? c.category : '');
          setTitle(c.title || '');
          setSubtitle(c.subtitle || '');
          setCategory(catId);
          setCategoryName(catName);
          setLevel(c.level ? c.level.toLowerCase() : 'intermediate');
          setPrice(String(c.price ?? '0'));
          setLanguage(c.language || 'English');
          setThumbnail(c.thumbnail || '');
          setDescription(c.description || '');
          setChapters((c.chapters || []).map(mapChapterFromApi));
        }
      } catch (err) {
        if (isMounted) setLoadError(err.response?.data?.message || 'Failed to load course');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCourse();

    return () => { isMounted = false; };
  }, [courseId]);

  const handleCategoryChange = (id, name) => {
    setCategory(id);
    setCategoryName(name);
  };

  const handleAddChapter = () => {
    setChapters(prev => [
      ...prev,
      {
        id: `ch_${Date.now()}`,
        title: `Chapter ${prev.length + 1}: `,
        description: '',
        lessons: [
          {
            id: `l_${Date.now()}_1`,
            title: 'Lesson 1: Introduction',
            type: 'video',
            duration: '',
            videoUrl: '',
            isFreePreview: false,
          },
        ],
      },
    ]);
  };

  const handleUpdateChapter = (chapterIndex, updatedChapter) => {
    setChapters(prev => {
      const updated = [...prev];
      updated[chapterIndex] = updatedChapter;
      return updated;
    });
  };

  const handleRemoveChapter = chapterIndex => {
    setChapters(prev => prev.filter((_, idx) => idx !== chapterIndex));
  };

  const handleMoveChapter = (chapterIndex, direction) => {
    setChapters(prev => {
      const targetIdx = chapterIndex + direction;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const updated = [...prev];
      [updated[chapterIndex], updated[targetIdx]] = [updated[targetIdx], updated[chapterIndex]];
      return updated;
    });
  };

  const validateStep = stepNumber => {
    if (stepNumber === 1) {
      if (!title.trim()) { toast.error('Please enter a course title'); return false; }
      if (!category) { toast.error('Please select a course category'); return false; }
    }
    if (stepNumber === 2) {
      if (chapters.length === 0) { toast.error('Please add at least one chapter'); return false; }
      const hasEmptyLesson = chapters.some(ch => !ch.lessons || ch.lessons.length === 0);
      if (hasEmptyLesson) { toast.error('Each chapter must contain at least one lesson'); return false; }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSave = async () => {
    if (!validateStep(1) || !validateStep(2)) return;

    setIsSaving(true);
    try {
      await updateCourse(courseId, {
        title: title.trim(),
        subtitle: subtitle.trim(),
        category,
        level,
        price,
        language,
        thumbnail,
        description: description.trim(),
        chapters: buildChapterPayload(chapters),
      });
      toast.success('Course updated successfully!');
      navigate('/instructor/courses');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const courseData = { title, subtitle, category: categoryName || category, level, price, language, thumbnail, description, chapters };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <p className="text-sm font-semibold text-rose-500">{loadError}</p>
        <button onClick={() => navigate('/instructor/courses')} className="text-xs font-bold text-blue-500 hover:underline">
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/instructor/courses')}
          className="flex items-center gap-1.5 text-xs font-semibold hover:underline"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Courses
        </button>

        <div className="flex items-center gap-2">
          <Link
            to={`/instructor/courses/${courseId}/preview`}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold border transition hover:opacity-80"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--color-primary-600)',
            }}
          >
            <Eye className="h-3.5 w-3.5" />
            Live Preview
          </Link>
          <span
            className="rounded-lg px-2.5 py-1 text-xs font-bold"
            style={{ backgroundColor: 'rgba(37, 99, 235, 0.08)', color: 'var(--color-primary-600, #2563eb)' }}
          >
            Editing
          </span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Edit Course & Curriculum Studio
        </h1>
        <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Update curriculum, replace lecture videos, and manage downloadable course files.
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 rounded-2xl border"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        {STEPS.map(step => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const StepIcon = step.icon;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                if (step.id < currentStep || validateStep(currentStep)) setCurrentStep(step.id);
              }}
              className={`flex items-center gap-3 rounded-xl p-3 text-left transition-all ${
                isCurrent ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-500/10'
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  isCurrent
                    ? 'bg-white/20 text-white'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-slate-500/10 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-bold truncate ${!isCurrent ? 'text-slate-200 dark:text-slate-100' : ''}`}>
                  {step.label}
                </p>
                <p className={`text-[10px] truncate ${isCurrent ? 'text-white/80' : 'text-slate-400'}`}>
                  {step.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {currentStep === 1 && (
        <CourseBasicInfoForm
          title={title} onTitleChange={setTitle}
          subtitle={subtitle} onSubtitleChange={setSubtitle}
          category={category} onCategoryChange={handleCategoryChange}
          level={level} onLevelChange={setLevel}
          price={price} onPriceChange={setPrice}
          language={language} onLanguageChange={setLanguage}
          thumbnail={thumbnail} onThumbnailChange={setThumbnail}
          description={description} onDescriptionChange={setDescription}
        />
      )}

      {currentStep === 2 && (
        <CourseCurriculumOutline
          chapters={chapters}
          onAddChapter={handleAddChapter}
          onUpdateChapter={handleUpdateChapter}
          onRemoveChapter={handleRemoveChapter}
          onMoveChapter={handleMoveChapter}
        />
      )}

      {currentStep === 3 && (
        <CoursePublishReview
          courseData={courseData}
          onPublish={handleSave}
          isPublishing={isSaving}
          previewUrl={`/instructor/courses/${courseId}/preview`}
        />
      )}

      <div
        className="flex items-center justify-between pt-5 border-t"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={handlePrevStep}
          className="rounded-2xl px-5 py-2.5 text-xs font-semibold border transition hover:opacity-80 disabled:opacity-40"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
          }}
        >
          Previous Step
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-2xl border px-4 py-2.5 text-xs font-semibold transition hover:opacity-80"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
            }}
          >
            <Save className="h-3.5 w-3.5 text-blue-500" />
            Save Draft
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
              style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
            >
              <span>Continue to {currentStep === 1 ? 'Curriculum' : 'Review'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-2xl px-7 py-2.5 text-xs font-bold text-white shadow-md transition hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save & Update Course'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
