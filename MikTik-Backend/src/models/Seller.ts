const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    // Personal details (populated from seller application)
    fullName: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    phone: { type: String, required: true, trim: true },
    idNumber: { type: String, default: '', trim: true },
    dateOfBirth: { type: Date },

    // Address
    address: {
      street: { type: String, default: '', trim: true },
      city: { type: String, default: '', trim: true },
      country: { type: String, default: 'Israel', trim: true },
    },

    // Profile
    bio: { type: String, default: '', trim: true, maxlength: 160 },
    description: { type: String, default: '', trim: true, maxlength: 1000 },
    location: { type: String, default: '', trim: true },
    socialLinks: {
      instagram: { type: String, default: '', trim: true },
      twitter: { type: String, default: '', trim: true },
    },

    // ID verification
    verification: {
      status: {
        type: String,
        enum: ['unverified', 'pending', 'verified', 'rejected'],
        default: 'unverified',
      },
      submittedAt: { type: Date },
      reviewedAt: { type: Date },
      rejectionReason: { type: String, default: '' },
    },

    commissionRate: { type: Number, default: 5, min: 0, max: 100 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, autoCreate: true }
);

module.exports = mongoose.model('Seller', sellerSchema);
