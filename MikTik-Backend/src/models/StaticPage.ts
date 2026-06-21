const mongoose = require('mongoose');

const staticPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    content: { type: String, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StaticPage', staticPageSchema);
