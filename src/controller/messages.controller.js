import Message from '../models/Message.js';

export const listMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const items = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.json(items);
  } catch (err) { next(err); }
};
