import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId).populate('seller');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot order your own product' });
    }
    const order = await Order.create({
      buyer: req.user._id,
      seller: product.seller._id,
      product: product._id,
      amount: product.price,
      currency: product.currency
    });
    res.status(201).json(order);
  } catch (err) { next(err); }
};

export const myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ $or: [{ buyer: req.user._id }, { seller: req.user._id }] })
      .sort({ createdAt: -1 })
      .populate('product', 'title price')
      .populate('buyer', 'name')
      .populate('seller', 'name');
    res.json(orders);
  } catch (err) { next(err); }
};

export const markPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    order.status = 'paid';
    order.payment = {
      provider: 'MANUAL',
      transactionId: req.body.transactionId || '',
      reference: req.body.reference || ''
    };
    await order.save();
    res.json(order);
  } catch (err) { next(err); }
};
