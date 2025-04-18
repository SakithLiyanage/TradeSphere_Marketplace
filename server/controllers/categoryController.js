// server/controllers/categoryController.js
const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  // Only get parent categories by default
  const parentOnly = req.query.parentOnly === 'true';
  
  // Build filter
  const filter = parentOnly ? { parent: null } : {};
  
  // Get categories
  const categories = await Category.find(filter)
    .sort('name')
    .populate({
      path: 'subcategories',
      select: 'name slug icon',
      options: { sort: { name: 1 } }
    });
  
  res.json({
    success: true,
    count: categories.length,
    categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  // Find by ID or slug
  const query = req.params.id.match(/^[0-9a-fA-F]{24}$/) 
    ? { _id: req.params.id }
    : { slug: req.params.id };
  
  const category = await Category.findOne(query)
    .populate({
      path: 'subcategories',
      select: 'name slug icon description'
    });
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  // Get parent category if this is a subcategory
  let parentCategory = null;
  if (category.parent) {
    parentCategory = await Category.findById(category.parent)
      .select('name slug');
  }
  
  res.json({
    success: true,
    category,
    parentCategory
  });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, color, image, parent } = req.body;
  
  // Check if parent category exists if specified
  if (parent) {
    const parentExists = await Category.findById(parent);
    if (!parentExists) {
      res.status(400);
      throw new Error('Parent category not found');
    }
  }
  
  // Create category
  const category = await Category.create({
    name,
    description,
    icon,
    color,
    image,
    parent: parent || null
  });
  
  res.status(201).json({
    success: true,
    category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  let category = await Category.findById(req.params.id);
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  // Check if parent category exists if being updated
  if (req.body.parent) {
    const parentExists = await Category.findById(req.body.parent);
    if (!parentExists) {
      res.status(400);
      throw new Error('Parent category not found');
    }
    
    // Prevent category from being its own parent
    if (req.body.parent === req.params.id) {
      res.status(400);
      throw new Error('Category cannot be its own parent');
    }
  }
  
  // Update category
  category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.json({
    success: true,
    category
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  await category.remove();
  
  res.json({
    success: true,
    message: 'Category removed'
  });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};