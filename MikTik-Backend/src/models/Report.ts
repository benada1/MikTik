const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    purchase: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', default: null },
    orderId: { type: String, required: true, trim: true },
    eventName: { type: String, trim: true, default: '' },
    reason: { type: String, required: true, trim: true },
    status: { type: String, enum: ['open', 'pending', 'closed'], default: 'open' },
    adminNote: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
