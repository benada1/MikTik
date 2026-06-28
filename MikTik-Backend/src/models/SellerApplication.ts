const mongoose = require('mongoose');

const sellerApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    // Personal
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    idNumber: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },

    // Address
    address: {
      street: { type: String, default: '', trim: true },
      city: { type: String, required: true, trim: true },
      country: { type: String, default: 'Israel', trim: true },
    },

    // Profile
    bio: { type: String, default: '', trim: true },

    // Review
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'revoked'],
      default: 'pending',
    },
    reviewedAt: { type: Date },
    rejectionReason: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SellerApplication', sellerApplicationSchema);
