const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxLength: 100
  },
  description: {
    type: String,
    required: true
  },
  markdown: {
    type: String,
    required: true,
    minLength: 100
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }],
  useCase: [{
    type: Schema.Types.ObjectId,
    ref: 'Use Case',
    required: true
  }]
});

articleSchema.pre('validate', function() {
  if (this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true
    });
  }
})

module.exports = mongoose.model('Article', articleSchema);
