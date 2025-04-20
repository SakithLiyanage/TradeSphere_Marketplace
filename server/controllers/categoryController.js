const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

// @desc    Get single category
// @route   GET /api/categories/:slug
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error while fetching category'
    });
  }
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    
    if (!name) {
      res.status(400);
      throw new Error('Name is required');
    }
    
    // Check if category already exists
    const categoryExists = await Category.findOne({ name });
    
    if (categoryExists) {
      res.status(400);
      throw new Error('Category already exists');
    }
    
    // Create category
    const category = await Category.create({
      name,
      description: description || '',
      icon: icon || 'tag'
    });
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error while creating category'
    });
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    
    // Update fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (icon) category.icon = icon;
    
    const updatedCategory = await category.save();
    
    res.status(200).json({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error while updating category'
    });
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    
    await category.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Category removed'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error while deleting category'
    });
  }
});

// @desc    Initialize default categories
// @route   POST /api/categories/initialize
// @access  Private/Admin
const initializeCategories = asyncHandler(async (req, res) => {
  try {
    const defaultCategories = [
      {
        name: 'Vehicles',
        description: 'Cars, motorcycles, bicycles, and other vehicles',
        icon: 'car',
        slug: 'vehicles'
      },
      {
        name: 'Properties',
        description: 'Houses, apartments, and land for sale or rent',
        icon: 'home',
        slug: 'properties'
      },
      {
        name: 'Electronics',
        description: 'Phones, computers, TVs, and other electronic items',
        icon: 'laptop',
        slug: 'electronics'
      },
      {
        name: 'Furniture',
        description: 'Tables, chairs, beds, and other furniture',
        icon: 'couch',
        slug: 'furniture'
      },
      {
        name: 'Jobs',
        description: 'Job listings and opportunities',
        icon: 'briefcase',
        slug: 'jobs'
      },
      {
        name: 'Services',
        description: 'Professional services offered by individuals and businesses',
        icon: 'concierge-bell',
        slug: 'services'
      }
    ];
    
    // Check how many categories already exist
    const existingCount = await Category.countDocuments();
    
    if (existingCount > 0) {
      res.status(400);
      throw new Error('Categories already exist. Delete them first.');
    }
    
    // Create all default categories
    const result = await Category.insertMany(defaultCategories);
    
    res.status(201).json({
      success: true,
      message: `Created ${result.length} categories`,
      data: result
    });
  } catch (error) {
    console.error('Error initializing categories:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error while initializing categories'
    });
  }
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  initializeCategories
};