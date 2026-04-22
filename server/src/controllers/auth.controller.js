import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export async function register(req, res) {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role }
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const match = await user.comparePassword(password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  const token = generateToken(user._id);
  res.json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role }
  });
}

export async function me(req, res) {
  res.json({ user: req.user });
}
