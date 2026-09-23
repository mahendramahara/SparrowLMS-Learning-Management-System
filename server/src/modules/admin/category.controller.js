const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Category = require('./category.model');
const Course = require('../course/course.model');

const getCategories = asyncHandler(async (req, res) => {
  const { includeCount = 'false', search } = req.query;

  const filter = { isActive: true };
  if (search) filter.name = { $regex: search, $options: 'i' };

  const categories = await Category.find(filter).sort({ name: 1 });

  if (includeCount === 'true') {
    const withCounts = await Promise.all(
      categories.map(async cat => {
        // ObjectId-based count — no string matching
        const coursesCount = await Course.countDocuments({ category: cat._id });
        return { ...cat.toObject(), coursesCount };
      })
    );
    return res.status(200).json({ success: true, count: withCounts.length, data: withCounts });
  }

  res.status(200).json({ success: true, count: categories.length, data: categories });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const coursesCount = await Course.countDocuments({ category: category._id });

  res.status(200).json({ success: true, data: { ...category.toObject(), coursesCount } });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body;

  if (!name?.trim()) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const slug = slugify(name.trim(), { lower: true, strict: true });

  const exists = await Category.findOne({ $or: [{ slug }, { name: name.trim() }] });
  if (exists) {
    res.status(409);
    throw new Error(`Category "${name.trim()}" already exists`);
  }

  const category = await Category.create({
    name: name.trim(),
    slug,
    description: description?.trim() || '',
    icon: icon || 'FolderTree',
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const { name, description, icon, isActive } = req.body;

  if (name && name.trim() !== category.name) {
    const slug = slugify(name.trim(), { lower: true, strict: true });
    const conflict = await Category.findOne({
      $or: [{ slug }, { name: name.trim() }],
      _id: { $ne: category._id },
    });
    if (conflict) {
      res.status(409);
      throw new Error(`Category "${name.trim()}" already exists`);
    }

    // No need to update courses — they reference category by ObjectId, not by name
    category.name = name.trim();
    category.slug = slug;
  }

  if (description !== undefined) category.description = description.trim();
  if (icon) category.icon = icon;
  if (isActive !== undefined) category.isActive = Boolean(isActive);

  await category.save();

  const coursesCount = await Course.countDocuments({ category: category._id });

  res.status(200).json({ success: true, data: { ...category.toObject(), coursesCount } });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (category.isDefault) {
    res.status(400);
    throw new Error('Cannot delete the default category');
  }

  const coursesCount = await Course.countDocuments({ category: category._id });

  if (coursesCount > 0) {
    // Reassign orphaned courses to the default "Uncategorized" category
    const fallback = await Category.findOne({ isDefault: true });
    if (fallback) {
      await Course.updateMany({ category: category._id }, { category: fallback._id });
    }
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: `Category deleted.${coursesCount > 0 ? ` ${coursesCount} course(s) moved to default category.` : ''}`,
  });
});

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
