import Product from '../models/Product.js';

export const createProduct = async (req, res, next) => {
  try {
    const images = (req.files || []).map(f => `/uploads/${f.filename}`);
    const product = await Product.create({
      ...req.body,
      price: Number(req.body.price),
      images,
      seller: req.user._id
    });
    res.status(201).json(product);
  } catch (err) { next(err); }
};

export const listProducts = async (req, res, next) => {
  try {
    const { q, category, city, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (city) filter.city = city;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('seller', 'name city'),
      Product.countDocuments(filter)
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
};

export const getProduct = async (req, res, next) => {
  try {
    const item = await Product.findById(req.params.id).populate('seller', 'name city');
    if (!item) return res.status(404).json({ message: 'Product not found' });
    res.json(item);
  } catch (err) { next(err); }
};

export const updateProduct = async (req, res, next) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Product not found' });
    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const images = (req.files || []).map(f => `/uploads/${f.filename}`);
    const update = { ...req.body };
    if (images.length) update.images = images;
    if (update.price) update.price = Number(update.price);
    const updated = await Product.findByIdAndUpdate(item._id, update, { new: true });
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Product not found' });
    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await item.deleteOne();
    res.json({ ok: true });
  } catch (err) { next(err); }
};
