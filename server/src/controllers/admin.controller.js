import Case from '../models/Case.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

export async function getAdminCases(_req, res) {
  const cases = await Case.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ cases });
}

export async function getAdminStats(_req, res) {
  const [totalUsers, totalCases, openCases, totalMessages] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Case.countDocuments(),
    Case.countDocuments({ status: { $in: ['submitted', 'reviewing', 'in-progress'] } }),
    Message.countDocuments()
  ]);

  res.json({ stats: { totalUsers, totalCases, openCases, totalMessages } });
}
