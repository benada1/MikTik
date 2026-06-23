const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
    purchase: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', required: true, unique: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
