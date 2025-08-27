import Order from '../models/Order.js';
import { initiateMobileMoney, verifyWebhook } from '../services/paymentService.js';

export const initPayment = async (req, res, next) => {
  try {
    const { orderId, payerPhone } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order not pending' });
    }

    const session = await initiateMobileMoney({
      amount: order.amount,
      currency: order.currency,
      phone: payerPhone,
      reference: `ORD-${order._id}`
    });

    return res.json({ ok: true, session });
  } catch (err) { next(err); }
};

export const paymentWebhook = async (req, res, next) => {
  try {
    const verified = verifyWebhook(req);
    if (!verified) return res.status(400).json({ message: 'Invalid signature' });

    const { reference, status, transactionId, provider, meta } = req.body;
    const orderId = reference?.replace('ORD-', '');
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status === 'SUCCESS') {
      order.status = 'paid';
      order.payment = { provider, transactionId, reference, meta };
      await order.save();
    }

    res.json({ ok: true });
  } catch (err) { next(err); }
};
