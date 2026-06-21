const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: [
        'ticket_purchased',
        'ticket_sold',
        'event_reminder_week',
        'event_reminder_day',
        'ticket_expired',
        'seller_approved',
        'seller_rejected',
        'report_opened',
        'report_updated',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: { type: String },
    relatedId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
