import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'XAF' },
    status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
    payment: {
      provider: String, //  Airtel, Moov
      transactionId: String,
      reference: String,
      meta: Object
    }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
