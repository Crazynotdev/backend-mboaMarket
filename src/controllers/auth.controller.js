import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { registerSchema, loginSchema } from '../utils/validate.js';

const sign = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const exists = await User.findOne({ email: value.email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const user = await User.create(value);
    const token = sign(user);
    res.status(201).json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(value.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = sign(user);
    res.json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (err) { next(err); }
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};
