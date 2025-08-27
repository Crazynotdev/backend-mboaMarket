import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: String, index: true }, // ex: productId:buyerId:sellerId
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
