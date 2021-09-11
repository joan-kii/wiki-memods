const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const useCaseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  descrption: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  articles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }]
});

module.exports = mongoose.model('Use Case', useCaseSchema);
