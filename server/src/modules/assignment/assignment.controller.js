const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Assignment = require('./assignment.model');
const AssignmentSubmission = require('./assignmentSubmission.model');
const Course = require('../course/course.model');
const Enrollment = require('../enrollment/enrollment.model');
const Notification = require('../notification/notification.model');
const { createNotification } = require('../../utils/notificationDispatcher');

const createAssignment = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId || req.body.courseId || req.body.course;
  const { title, instructions, dueDate, points = 100 } = req.body;

  if (!title || !title.trim()) {
    res.status(400);
    throw new Error('Assignment title is required');
  }

  if (!courseId) {
    res.status(400);
    throw new Error('Course ID is required');
  }

  const courseQuery = mongoose.Types.ObjectId.isValid(courseId)
    ? { _id: courseId }
    : { title: courseId };

  const course = await Course.findOne(courseQuery);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to create assignments for this course');
  }

  const assignment = await Assignment.create({
    title: title.trim(),
    course: course._id,
    instructor: req.user._id,
    instructions: instructions ? instructions.trim() : '',
    dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    points: Number(points) || 100,
    status: 'Open',
    submissionsCount: 0,
  });

  const enrollments = await Enrollment.find({ course: course._id, status: 'active' });
  if (enrollments.length > 0) {
    const studentNotifications = enrollments.map(e => ({
      recipient: e.student,
      recipientRole: 'student',
      category: 'Assessments',
      type: 'assignment',
      title: 'New Assignment Available',
      message: `A new assignment "${assignment.title}" has been published for ${course.title}.`,
      priority: 'normal',
      actionUrl: '/student/assignments',
      metadata: {
        assignmentId: assignment._id,
        courseId: course._id,
        courseTitle: course.title,
      },
    }));
    await Notification.insertMany(studentNotifications);
  }

  await createNotification({
    recipientRole: 'admin',
    category: 'Assessments',
    type: 'assignment',
    title: 'New Assignment Created',
    message: `Instructor ${req.user.name || 'Faculty Member'} created assignment "${assignment.title}" for ${course.title}.`,
    priority: 'low',
    actionUrl: '/admin/assignments',
    metadata: {
      assignmentId: assignment._id,
      courseId: course._id,
    },
  });

  const populated = await Assignment.findById(assignment._id)
    .populate('course', 'title thumbnail category level enrolled')
    .populate('instructor', 'name email avatar');

  res.status(201).json({
    success: true,
    message: 'Assignment created successfully',
    data: populated,
  });
});

const getAssignments = asyncHandler(async (req, res) => {
  const { courseId, search, status } = req.query;
  const query = {};

  if (status) query.status = status;
  if (courseId && mongoose.Types.ObjectId.isValid(courseId)) {
    query.course = courseId;
  }

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  if (req.user.role === 'student') {
    const enrollments = await Enrollment.find({ student: req.user._id }).select('course');
    const enrolledCourseIds = enrollments.map(e => e.course);

    if (enrolledCourseIds.length === 0) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    query.course = { $in: enrolledCourseIds };

    const assignments = await Assignment.find(query)
      .populate('course', 'title thumbnail category level')
      .populate('instructor', 'name email avatar')
      .sort({ dueDate: 1 });

    const assignmentIds = assignments.map(a => a._id);
    const submissions = await AssignmentSubmission.find({
      assignment: { $in: assignmentIds },
      student: req.user._id,
    });

    const subMap = new Map();
    submissions.forEach(s => subMap.set(s.assignment.toString(), s));

    const formatted = assignments.map(a => {
      const sub = subMap.get(a._id.toString());
      let studentStatus = 'Pending';
      if (sub) {
        studentStatus = sub.status === 'Graded' ? 'Graded' : 'Submitted';
      }

      return {
        id: a._id,
        _id: a._id,
        title: a.title,
        courseId: a.course?._id,
        courseTitle: a.course?.title || 'Course',
        course: a.course?.title || 'Course',
        instructor: a.instructor?.name || 'Instructor',
        dueDate: a.dueDate,
        points: a.points,
        instructions: a.instructions,
        status: studentStatus,
        grade: sub?.grade ?? null,
        feedback: sub?.feedback || '',
        submittedAt: sub?.submittedAt || null,
        deliverableFileName: sub?.deliverableFileName || '',
        deliverableUrl: sub?.deliverableUrl || '',
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  }

  if (req.user.role === 'instructor') {
    const courses = await Course.find({ instructor: req.user._id }).select('_id');
    const myCourseIds = courses.map(c => c._id);
    query.course = { $in: myCourseIds };
  }

  const assignments = await Assignment.find(query)
    .populate('course', 'title thumbnail category level enrolled')
    .populate('instructor', 'name email avatar')
    .sort({ createdAt: -1 });

  const formatted = assignments.map(a => ({
    id: a._id,
    _id: a._id,
    title: a.title,
    courseId: a.course?._id,
    course: a.course?.title || 'Course',
    instructor: a.instructor?.name || 'Instructor',
    dueDate: a.dueDate,
    points: a.points,
    instructions: a.instructions,
    status: a.status,
    submitted: a.submissionsCount || 0,
    total: a.course?.enrolled || 0,
  }));

  res.status(200).json({
    success: true,
    count: formatted.length,
    data: formatted,
  });
});

const getAssignmentById = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id)
    .populate('course', 'title thumbnail category level enrolled instructor')
    .populate('instructor', 'name email avatar');

  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  res.status(200).json({ success: true, data: assignment });
});

const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  if (assignment.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this assignment');
  }

  const { title, instructions, dueDate, points, status } = req.body;
  if (title) assignment.title = title.trim();
  if (instructions !== undefined) assignment.instructions = instructions.trim();
  if (dueDate) assignment.dueDate = new Date(dueDate);
  if (points !== undefined) assignment.points = Number(points);
  if (status) assignment.status = status;

  await assignment.save();

  const updated = await Assignment.findById(assignment._id)
    .populate('course', 'title thumbnail')
    .populate('instructor', 'name email');

  res.status(200).json({ success: true, data: updated });
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  if (assignment.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this assignment');
  }

  await AssignmentSubmission.deleteMany({ assignment: assignment._id });
  await assignment.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Assignment and related submissions deleted successfully',
  });
});

const submitAssignment = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;
  const { notes, deliverableUrl, fileName, deliverableFileName } = req.body;

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  const resolvedFileName = fileName || deliverableFileName || 'submission.zip';

  const submission = await AssignmentSubmission.findOneAndUpdate(
    { assignment: assignment._id, student: req.user._id },
    {
      course: assignment.course,
      notes: notes ? notes.trim() : '',
      deliverableUrl: deliverableUrl || '',
      deliverableFileName: resolvedFileName,
      submittedAt: new Date(),
      status: 'Submitted',
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const totalSubs = await AssignmentSubmission.countDocuments({ assignment: assignment._id });
  assignment.submissionsCount = totalSubs;
  await assignment.save();

  const courseObj = await Course.findById(assignment.course);
  if (courseObj?.instructor) {
    await createNotification({
      recipient: courseObj.instructor,
      recipientRole: 'instructor',
      category: 'Assessments',
      type: 'assignment',
      title: 'Assignment Deliverable Submitted',
      message: `${req.user.name || 'A student'} submitted deliverable for "${assignment.title}".`,
      priority: 'normal',
      actionUrl: '/instructor/assignments',
      metadata: {
        assignmentId: assignment._id,
        courseId: assignment.course,
        studentId: req.user._id,
      },
    });
  }

  res.status(201).json({
    success: true,
    message: 'Assignment submitted successfully',
    data: submission,
  });
});

const getSubmissions = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  if (assignment.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view submissions for this assignment');
  }

  const submissions = await AssignmentSubmission.find({ assignment: assignmentId })
    .populate('student', 'name email avatar')
    .sort({ submittedAt: -1 });

  res.status(200).json({
    success: true,
    count: submissions.length,
    data: submissions,
  });
});

const getMySubmission = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;

  const submission = await AssignmentSubmission.findOne({
    assignment: assignmentId,
    student: req.user._id,
  });

  res.status(200).json({
    success: true,
    data: submission || null,
  });
});

const gradeSubmission = asyncHandler(async (req, res) => {
  const submissionId = req.params.id;
  const { grade, feedback } = req.body;

  const submission = await AssignmentSubmission.findById(submissionId).populate('assignment');
  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  if (submission.assignment?.instructor?.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to grade this submission');
  }

  if (grade !== undefined) submission.grade = Number(grade);
  if (feedback !== undefined) submission.feedback = feedback.trim();
  submission.status = 'Graded';
  submission.gradedBy = req.user._id;
  submission.gradedAt = new Date();

  await submission.save();

  await createNotification({
    recipient: submission.student,
    recipientRole: 'student',
    category: 'Assessments',
    type: 'grade',
    title: 'Assignment Evaluated',
    message: `Your deliverable for "${submission.assignment?.title || 'Assignment'}" has been graded: ${submission.grade}/${submission.assignment?.points || 100}.`,
    priority: 'normal',
    actionUrl: '/student/assignments',
    metadata: {
      assignmentId: submission.assignment?._id,
      grade: submission.grade,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Submission graded successfully',
    data: submission,
  });
});

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
  getMySubmission,
  gradeSubmission,
};
