const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    unique: true,
    maxlength: 500
  },
  category_ids: {
    type: [String], // array of strings
    default: []
  },
  img_urls: {
    type: [String], // array of URLs or image paths
    required: true
  },
  discount:{type:Number,required: true},
  links: {
    type: [String], // array of URLs
    // required: true
  },
  starting_at: {
    type: Date,
    required: true
  },
  ending_at: {
    type: Date,
    required: true
  },
  deleted_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Offer', offerSchema);
