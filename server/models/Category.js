// server/models/Category.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  icon: {
    type: String,
    default: '📦'
  },
  color: {
    type: String,
    default: 'from-gray-500 to-gray-600'
  },
  image: {
    type: String,
    default: ''
  },
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from name
CategorySchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Cascade delete listings when a category is deleted
CategorySchema.pre('remove', async function(next) {
  await this.model('Listing').deleteMany({ category: this._id });
  next();
});

// Reverse populate with virtuals - subcategories
CategorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
  justOne: false
});

// Reverse populate with virtuals - listings
CategorySchema.virtual('listings', {
  ref: 'Listing',
  localField: '_id',
  foreignField: 'category',
  justOne: false
});

module.exports = mongoose.model('Category', CategorySchema);