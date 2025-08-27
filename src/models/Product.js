import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'XAF' },
    images: [{ type: String }], // chemins vers /uploads
    category: { type: String, index: true },
    city: { type: String, index: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
