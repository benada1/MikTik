const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceEach: { type: Number, required: true },
    fee: { type: Number, required: true },
    totalPaid: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
    orderNumber: { type: String, index: true, sparse: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

purchaseSchema.virtual('orderId').get(function (this: any) {
  return this.orderNumber || `ORD-${this._id.toString().slice(-6).toUpperCase()}`;
});

module.exports = mongoose.model('Purchase', purchaseSchema);
