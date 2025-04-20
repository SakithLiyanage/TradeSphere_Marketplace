const mongoose = require('mongoose');
const slugify = require('slugify');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    minlength: [20, 'Description must be at least 20 characters long']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    trim: true
  },
  condition: {
    type: String,
    required: [true, 'Please specify the condition'],
    enum: ['new', 'like-new', 'excellent', 'good', 'fair', 'poor']
  },
  images: {
    type: [String],
    required: [true, 'Please upload at least one image'],
    validate: {
      validator: function(v) {
        return v.length > 0 && v.length <= 8;
      },
      message: 'Please upload between 1 and 8 images'
    }
  },
  location: {
    type: String,
    required: [true, 'Please provide a location']
  },
  specifications: {
    type: Object,
    default: {}
  },
  featured: {
    type: Boolean,
    default: false
  },
  sold: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  favoriteCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title
ListingSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true }) + '-' + Math.floor(Math.random() * 1000000).toString();
  }
  next();
});

module.exports = mongoose.model('Listing', ListingSchema);