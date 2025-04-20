const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  // Get only top-level categories (those without a parent)
  const categories = await Category.find({ parent: null })
    .populate('subcategories');
  
  res.json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  // Find category by ID or slug
  const query = req.params.id.match(/^[0-9a-fA-F]{24}$/) 
    ? { _id: req.params.id }
    : { slug: req.params.id };
  
  const category = await Category.findOne(query)
    .populate('subcategories');
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  res.json({
    success: true,
    data: category
  });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, color, parent } = req.body;
  
  // Create category
  const category = await Category.create({
    name,
    icon,
    color,
    parent: parent || null
  });
  
  res.status(201).json({
    success: true,
    data: category
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
  
  // Update category
  category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.json({
    success: true,
    data: category
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
  
  // Check if category has subcategories
  const hasSubcategories = await Category.findOne({ parent: category._id });
  
  if (hasSubcategories) {
    res.status(400);
    throw new Error('Cannot delete category with subcategories. Delete subcategories first.');
  }
  
  await category.remove();
  
  res.json({
    success: true,
    message: 'Category removed'
  });
});

// @desc    Create default categories if none exist
// @route   POST /api/categories/init
// @access  Private/Admin
const initializeCategories = asyncHandler(async (req, res) => {
  // Check if categories already exist
  const count = await Category.countDocuments();
  
  if (count > 0) {
    res.status(400);
    throw new Error('Categories already initialized');
  }
  
  // Create default categories
  const defaultCategories = [
    { name: 'Electronics', icon: 'FaMobile', color: '#3B82F6', slug: 'electronics' },
    { name: 'Vehicles', icon: 'FaCar', color: '#EF4444', slug: 'vehicles' },
    { name: 'Property', icon: 'FaHome', color: '#10B981', slug: 'property' },
    { name: 'Furniture', icon: 'FaCouch', color: '#F59E0B', slug: 'furniture' },
    { name: 'Jobs', icon: 'FaBriefcase', color: '#8B5CF6', slug: 'jobs' },
    { name: 'Services', icon: 'FaTools', color: '#EC4899', slug: 'services' },
    { name: 'Fashion', icon: 'FaTshirt', color: '#6366F1', slug: 'fashion' },
    { name: 'Books', icon: 'FaBook', color: '#F97316', slug: 'books' }
  ];
  
  const categories = await Category.insertMany(defaultCategories);
  
  res.status(201).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  initializeCategories
};