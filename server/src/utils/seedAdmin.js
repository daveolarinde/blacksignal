import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

export default async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const existing = await User.findOne({ email });
  if (existing) return;

  await User.create({
    name: process.env.ADMIN_NAME || 'Super Admin',
    email,
    password,
    role: 'admin'
  });

  console.log('Default admin seeded');
}
