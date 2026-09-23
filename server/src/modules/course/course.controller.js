const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Course = require('./course.model');
const Chapter = require('./chapter.model');
const Lesson = require('./lesson.model');
const Category = require('../admin/category.model');
const Enrollment = require('../enrollment/enrollment.model');

const normalizeLessonPayload = (l, lIdx) => ({
  title: l.title || `Lesson ${lIdx + 1}`,
  type: l.type || 'video',
  duration: l.duration || '',
  videoUrl: l.videoFile?.assetUrl || l.videoUrl || '',
  videoPublicId: l.videoFile?.publicId || l.videoPublicId || '',
  content: l.content || '',
  thumbnailUrl: l.thumbnailUrl || '',
  isFreePreview: Boolean(l.isFreePreview),
  attachedFile: {
    name: l.attachedFile?.name || '',
    size: l.attachedFile?.size || '',
    type: l.attachedFile?.type || '',
    url: l.attachedFile?.assetUrl || l.attachedFile?.url || '',
    publicId: l.attachedFile?.publicId || '',
  },
  order: lIdx,
});

const populateCourseQuery = query =>
  query
    .populate('instructor', 'name email avatar bio')
    .populate('category', 'name slug icon')
    .populate({
      path: 'chapters',
      options: { sort: { order: 1 } },
      populate: {
        path: 'lessons',
        options: { sort: { order: 1 } },
      },
    });

const resolveCategoryId = async categoryInput => {
  if (!categoryInput) return null;
  const inputStr = categoryInput.toString();
  if (/^[0-9a-fA-F]{24}$/.test(inputStr)) return inputStr;
  const found = await Category.findOne({
    $or: [{ slug: inputStr }, { name: inputStr }],
  });
  return found ? found._id : null;
};

const normalizeLevel = val => {
  if (!val) return 'beginner';
  const clean = val.toString().trim().toLowerCase();
  if (['beginner', 'intermediate', 'advanced', 'all levels'].includes(clean)) {
    return clean;
  }
  if (clean === 'all') return 'all levels';
  return 'beginner';
};

const getCourses = asyncHandler(async (req, res) => {
  const { category, level, search, instructor, isPublished, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (category) {
    if (/^[0-9a-fA-F]{24}$/.test(category)) {
      filter.category = category;
    } else {
      const foundCat = await Category.findOne({
        $or: [{ slug: category }, { name: category }],
      });
      if (foundCat) filter.category = foundCat._id;
    }
  }
  if (level && level.toLowerCase() !== 'all' && level.toLowerCase() !== 'all levels') {
    filter.level = normalizeLevel(level);
  }
  if (instructor) filter.instructor = instructor;
  if (isPublished !== undefined) filter.isPublished = isPublished === 'true';

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const total = await Course.countDocuments(filter);

  const courses = await populateCourseQuery(
    Course.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10))
  );

  res.status(200).json({
    success: true,
    count: courses.length,
    total,
    page: parseInt(page, 10),
    pages: Math.ceil(total / parseInt(limit, 10)),
    data: courses,
  });
});

const getMyCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, status } = req.query;
  const filter = { instructor: req.user.id };

  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const total = await Course.countDocuments(filter);

  const courses = await populateCourseQuery(
    Course.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10))
  );

  res.status(200).json({
    success: true,
    count: courses.length,
    total,
    page: parseInt(page, 10),
    pages: Math.ceil(total / parseInt(limit, 10)),
    data: courses,
  });
});

const getCourseById = asyncHandler(async (req, res) => {
  const idOrSlug = req.params.id;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

  const course = await populateCourseQuery(Course.findOne(query));

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  res.status(200).json({ success: true, data: course });
});

const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    subtitle,
    category,
    level,
    price,
    language,
    thumbnail,
    thumbnailPublicId,
    description,
    chapters = [],
    tags,
    isPublished = true,
    status = 'published',
  } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error('Please provide title, category, and description');
  }

  const categoryId = await resolveCategoryId(category);
  if (!categoryId) {
    res.status(400);
    throw new Error('Invalid category. Please select a valid category from the list.');
  }

  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) {
    res.status(400);
    throw new Error('Selected category does not exist');
  }

  const course = await Course.create({
    title: title.trim(),
    subtitle: subtitle ? subtitle.trim() : '',
    description,
    category: categoryId,
    level: normalizeLevel(level),
    price: Number(price) || 0,
    language: language || 'English',
    thumbnail: thumbnail || '',
    thumbnailPublicId: thumbnailPublicId || '',
    instructor: req.user.id,
    isPublished: Boolean(isPublished),
    status,
    tags: Array.isArray(tags) ? tags : [],
  });

  for (let cIdx = 0; cIdx < chapters.length; cIdx++) {
    const ch = chapters[cIdx];
    const createdChapter = await Chapter.create({
      courseId: course._id,
      title: ch.title || `Chapter ${cIdx + 1}`,
      description: ch.description || '',
      order: cIdx,
    });

    if (Array.isArray(ch.lessons) && ch.lessons.length > 0) {
      const lessonDocs = ch.lessons.map((l, lIdx) => ({
        courseId: course._id,
        chapterId: createdChapter._id,
        ...normalizeLessonPayload(l, lIdx),
      }));
      await Lesson.insertMany(lessonDocs);
    }
  }

  const populated = await populateCourseQuery(Course.findById(course._id));

  res.status(201).json({ success: true, data: populated });
});

const updateCourse = asyncHandler(async (req, res) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this course');
  }

  const {
    title,
    subtitle,
    category,
    level,
    price,
    language,
    thumbnail,
    thumbnailPublicId,
    description,
    chapters,
    tags,
    isPublished,
    status,
  } = req.body;

  if (title) course.title = title.trim();
  if (subtitle !== undefined) course.subtitle = subtitle.trim();

  if (category) {
    const categoryId = await resolveCategoryId(category);
    if (!categoryId) {
      res.status(400);
      throw new Error('Invalid category provided');
    }
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      res.status(400);
      throw new Error('Selected category does not exist');
    }
    course.category = categoryId;
  }

  if (level !== undefined) course.level = normalizeLevel(level);
  if (price !== undefined) course.price = Number(price);
  if (language) course.language = language;
  if (thumbnail !== undefined) course.thumbnail = thumbnail;
  if (thumbnailPublicId !== undefined) course.thumbnailPublicId = thumbnailPublicId;
  if (description) course.description = description;
  if (tags !== undefined) course.tags = tags;
  if (isPublished !== undefined) course.isPublished = Boolean(isPublished);
  if (status) course.status = status;

  await course.save();

  if (Array.isArray(chapters)) {
    await Lesson.deleteMany({ courseId: course._id });
    await Chapter.deleteMany({ courseId: course._id });

    for (let cIdx = 0; cIdx < chapters.length; cIdx++) {
      const ch = chapters[cIdx];
      const createdChapter = await Chapter.create({
        courseId: course._id,
        title: ch.title || `Chapter ${cIdx + 1}`,
        description: ch.description || '',
        order: cIdx,
      });

      if (Array.isArray(ch.lessons) && ch.lessons.length > 0) {
        const lessonDocs = ch.lessons.map((l, lIdx) => ({
          courseId: course._id,
          chapterId: createdChapter._id,
          ...normalizeLessonPayload(l, lIdx),
        }));
        await Lesson.insertMany(lessonDocs);
      }
    }
  }

  const updated = await populateCourseQuery(Course.findById(course._id));

  res.status(200).json({ success: true, data: updated });
});

const togglePublish = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to modify this course');
  }

  course.isPublished = !course.isPublished;
  course.status = course.isPublished ? 'published' : 'draft';
  await course.save();

  res.status(200).json({
    success: true,
    data: {
      isPublished: course.isPublished,
      status: course.status,
    },
  });
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this course');
  }

  const enrollmentCount = await Enrollment.countDocuments({ course: course._id });
  if (enrollmentCount > 0 || (course.enrolled && course.enrolled > 0)) {
    res.status(400);
    throw new Error(`Cannot delete course because ${enrollmentCount || course.enrolled} student(s) are currently enrolled`);
  }

  await Lesson.deleteMany({ courseId: course._id });
  await Chapter.deleteMany({ courseId: course._id });
  await course.deleteOne();

  res.status(200).json({ success: true, message: 'Course and curriculum deleted successfully' });
});

module.exports = {
  getCourses,
  getMyCourses,
  getCourseById,
  createCourse,
  updateCourse,
  togglePublish,
  deleteCourse,
};
