const mongoose = require('mongoose');

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ticketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Concert', 'Sports', 'Theater', 'Festival', 'Comedy', 'Other'],
    },
    date: { type: Date, required: true },
    venue: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    section: { type: String, default: '', trim: true },
    row: { type: String, default: '', trim: true },
    seat: { type: String, default: '', trim: true },
    seatDetails: [
      {
        section: { type: String, trim: true },
        row: { type: String, trim: true },
        seat: { type: String, trim: true },
      },
    ],
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    available: { type: Number, required: true, default: 1 },
    description: { type: String, default: '', trim: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sellerName: { type: String, trim: true },
    sellerRating: { type: Number, default: 0 },
    sellerReviews: { type: Number, default: 0 },
    sellerSince: { type: String },
    verified: { type: Boolean, default: false },
    instant: { type: Boolean, default: false },
    bundleOnly: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'sold', 'pending'], default: 'active' },
    files: [{ type: String }],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

ticketSchema.virtual('month').get(function (this: any) {
  return MONTH_NAMES[this.date.getUTCMonth()];
});

ticketSchema.virtual('day').get(function (this: any) {
  return String(this.date.getUTCDate());
});

ticketSchema.virtual('discount').get(function (this: any) {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round((1 - this.price / this.originalPrice) * 100);
});

module.exports = mongoose.model('Ticket', ticketSchema);
