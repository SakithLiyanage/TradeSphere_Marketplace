// server/models/Listing.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  priceType: {
    type: String,
    enum: ['fixed', 'negotiable', 'free', 'contact'],
    default: 'fixed'
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'excellent', 'good', 'fair', 'poor'],
    default: 'good'
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'expired', 'pending', 'draft'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  images: {
    type: [String],
    required: [true, 'Please add at least one image'],
    validate: {
      validator: function(v) {
        return v.length > 0 && v.length <= 10;
      },
      message: 'Please add between 1 and 10 images'
    }
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Default expiration is 30 days from now
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title
ListingSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    // Create base slug
    let baseSlug = slugify(this.title, { lower: true });
    
    // Add a random string to ensure uniqueness
    const randomStr = Math.random().toString(36).substring(2, 7);
    this.slug = `${baseSlug}-${randomStr}`;
  }
  next();
});

// Increment view count
ListingSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

// Reverse populate with virtuals - favorites
ListingSchema.virtual('favorites', {
  ref: 'Favorite',
  localField: '_id',
  foreignField: 'listing',
  justOne: false
});

// Reverse populate with virtuals - messages
ListingSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'listing',
  justOne: false
});

module.exports = mongoose.model('Listing', ListingSchema);