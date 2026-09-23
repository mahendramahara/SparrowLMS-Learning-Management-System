const asyncHandler = require('express-async-handler');
const Course = require('../course/course.model');
const Enrollment = require('../enrollment/enrollment.model');

const getInstructorDashboard = asyncHandler(async (req, res) => {
  const instructorId = req.user._id || req.user.id;

  const courses = await Course.find({ instructor: instructorId })
    .populate('category', 'name')
    .sort({ createdAt: -1 });

  const courseIds = courses.map(c => c._id);
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(c => c.isPublished).length;
  const draftCourses = totalCourses - publishedCourses;
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolled || 0), 0);

  const averageRating =
    courses.length > 0
      ? (courses.reduce((sum, c) => sum + (c.rating || 5.0), 0) / courses.length).toFixed(1)
      : '5.0';

  const enrollments = await Enrollment.find({ course: { $in: courseIds } })
    .populate('student', 'name email avatar')
    .populate('course', 'title category')
    .sort({ lastAccessedAt: -1, createdAt: -1 })
    .limit(8);

  const recentStudents = enrollments
    .filter(e => e.student && e.course)
    .map(e => ({
      id: e._id,
      name: e.student?.name || 'Student',
      email: e.student?.email || '',
      avatar: e.student?.avatar || '',
      course: e.course?.title || 'Course',
      courseId: e.course?._id,
      progress: e.progress || 0,
      lastActive: new Date(e.lastAccessedAt || e.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      status: e.progress >= 100 ? 'Completed' : 'In Progress',
    }));

  const gradients = [
    'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
    'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
    'linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)',
    'linear-gradient(135deg, #78350f 0%, #b45309 100%)',
  ];

  const dashboardCourses = courses.slice(0, 4).map((c, idx) => ({
    id: c._id,
    title: c.title,
    status: c.isPublished ? 'Published' : 'Draft',
    lessons: 10,
    rating: c.rating || 5.0,
    reviewsCount: c.reviewCount || 0,
    studentsCount: c.enrolled || 0,
    tag: c.category?.name || 'Course',
    gradient: gradients[idx % gradients.length],
  }));

  const stats = [
    {
      id: 'students',
      title: 'Total Students',
      value: String(totalStudents),
      trend: `${totalStudents} enrolled across courses`,
      icon: 'users',
      color: '#2563eb',
      bg: 'rgba(37, 99, 235, 0.1)',
    },
    {
      id: 'courses',
      title: 'Active Courses',
      value: String(publishedCourses),
      trend: `${publishedCourses} published / ${totalCourses} total`,
      icon: 'book',
      color: '#7c3aed',
      bg: 'rgba(124, 58, 237, 0.1)',
    },
    {
      id: 'drafts',
      title: 'Draft Courses',
      value: String(draftCourses),
      trend: `${draftCourses} in development`,
      icon: 'video',
      color: '#0891b2',
      bg: 'rgba(8, 145, 178, 0.1)',
    },
    {
      id: 'rating',
      title: 'Overall Rating',
      value: String(averageRating),
      trend: 'Student satisfaction',
      icon: 'star',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
  ];

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const studentProgress = {
    days: last7Days,
    counts: [
      Math.max(1, Math.round(totalStudents * 0.3)),
      Math.max(2, Math.round(totalStudents * 0.5)),
      Math.max(1, Math.round(totalStudents * 0.45)),
      Math.max(3, Math.round(totalStudents * 0.8)),
      Math.max(2, Math.round(totalStudents * 0.7)),
      Math.max(4, Math.round(totalStudents * 1.1)),
      Math.max(3, totalStudents),
    ],
    highlight: {
      date: 'Latest Engagement',
      text: `${totalStudents} Active Learners`,
    },
  };

  const completedCount = enrollments.filter(e => (e.progress || 0) >= 100).length;
  const avgCompletionPct = enrollments.length > 0 ? Math.round((completedCount / enrollments.length) * 100) : 0;

  const courseStats = [
    {
      id: 'enrolled',
      title: 'Total Enrolled',
      value: String(totalStudents),
      trend: `${totalStudents} students`,
      icon: 'users',
      color: '#2563eb',
      bg: 'rgba(37, 99, 235, 0.1)',
    },
    {
      id: 'completion',
      title: 'Course Completion',
      value: `${avgCompletionPct}%`,
      trend: `${completedCount} completed`,
      icon: 'check-circle',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
    },
    {
      id: 'active_curriculums',
      title: 'Live Curriculums',
      value: String(publishedCourses),
      trend: `${draftCourses} in draft`,
      icon: 'clock',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
  ];

  const latestActivity = enrollments.slice(0, 4).map(e => ({
    id: `act_${e._id}`,
    title: 'Student progress updated',
    desc: `${e.student?.name || 'Student'} achieved ${e.progress || 0}% in ${e.course?.title || 'course'}`,
    time: 'Recently',
    icon: 'award',
    color: '#3b82f6',
  }));

  res.status(200).json({
    success: true,
    data: {
      instructor: {
        name: req.user.name,
        role: req.user.headline || 'Course Instructor',
        bio: req.user.bio || 'Passionate educator sharing practical industry skills.',
      },
      banner: {
        greeting: `Welcome, ${req.user.name}!`,
        subtitle: `You are managing ${publishedCourses} published courses with ${totalStudents} active learners.`,
        quote: 'Share Knowledge · Create Impact',
      },
      stats,
      courses: dashboardCourses,
      studentProgress,
      courseStats,
      recentStudents,
      upcomingClasses: [
        {
          id: 'cls_1',
          title: 'Course Q&A & Mentorship Session',
          time: 'Today • 2:00 PM',
          course: courses[0]?.title || 'Main Course',
        },
      ],
      quickActions: [
        { id: 'qa_create', title: 'Create Course', to: '/instructor/courses/create', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.1)' },
        { id: 'qa_students', title: 'View Students', to: '/instructor/students', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
        { id: 'qa_earnings', title: 'Sales & Earnings', to: '/instructor/earnings', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)' },
        { id: 'qa_assignments', title: 'Assignments', to: '/instructor/assignments', color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)' },
      ],
      latestActivity,
    },
  });
});

const getMyCourses = asyncHandler(async (req, res) => {
  const instructorId = req.user._id || req.user.id;

  const { page = 1, limit = 10, isPublished } = req.query;

  const query = { instructor: instructorId };
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const courses = await Course.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Course.countDocuments(query);

  res.status(200).json({
    success: true,
    data: courses,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  });
});

const getMyStudents = asyncHandler(async (req, res) => {
  const instructorId = req.user._id || req.user.id;
  const { search, courseId } = req.query;

  let courseFilter = { instructor: instructorId };
  if (req.user.role === 'admin' && !req.query.instructor) {
    courseFilter = {};
  }

  const courses = await Course.find(courseFilter).select('_id title category level');
  const courseIds = courses.map(c => c._id);

  const enrollmentQuery = {
    course: courseId ? courseId : { $in: courseIds },
  };

  const enrollments = await Enrollment.find(enrollmentQuery)
    .populate('student', 'name email avatar')
    .populate('course', 'title category level')
    .sort({ enrolledAt: -1, createdAt: -1 });

  let mapped = enrollments
    .filter(e => e.student)
    .map(e => ({
      id: e._id,
      _id: e._id,
      studentId: e.student?._id,
      name: e.student?.name || 'Student',
      email: e.student?.email || 'N/A',
      avatar: e.student?.avatar || '',
      course: e.course?.title || 'Unknown Course',
      courseId: e.course?._id,
      progress: typeof e.progress === 'number' ? e.progress : 0,
      enrolledDate: e.enrolledAt
        ? new Date(e.enrolledAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Recently',
      rawEnrolledAt: e.enrolledAt,
      status: e.progress >= 100 || e.status === 'completed' ? 'Completed' : 'In Progress',
    }));

  if (search && search.trim()) {
    const q = search.toLowerCase();
    mapped = mapped.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    success: true,
    count: mapped.length,
    data: mapped,
  });
});

const publishCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to publish this course');
  }

  course.isPublished = true;
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Course published successfully',
    data: course,
  });
});

const unpublishCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to unpublish this course');
  }

  course.isPublished = false;
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Course unpublished successfully',
    data: course,
  });
});

const getCourseAnalytics = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to view this course analytics');
  }

  res.status(200).json({
    success: true,
    data: {
      courseId: course._id,
      title: course.title,
      enrolled: course.enrolled,
      rating: course.rating,
      reviewCount: course.reviewCount,
      revenue: course.price * course.enrolled,
    },
  });
});

module.exports = {
  getInstructorDashboard,
  getMyCourses,
  getMyStudents,
  publishCourse,
  unpublishCourse,
  getCourseAnalytics,
};
