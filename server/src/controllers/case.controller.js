// controllers/case.controller.js
import Case from '../models/Case.js';
import ChatRoom from '../models/ChatRoom.js';

export async function createCase(req, res) {
  const proofDocumentUrl = req.file ? `/uploads/${req.file.filename}` : '';

  const recoveryCase = await Case.create({
    user: req.user._id,
    ...req.body,
    proofDocumentUrl
  });

  // Auto-create a chat room tied to this case
  await ChatRoom.create({
    user: req.user._id,
    case: recoveryCase._id
  });

  res.status(201).json({ case: recoveryCase });
}

export async function getMyCases(req, res) {
  const cases = await Case.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ cases });
}

export async function getCaseById(req, res) {
  const recoveryCase = await Case.findOne({
    _id: req.params.id,
    // non-admins can only fetch their own
    ...(req.user.role !== 'admin' && { user: req.user._id })
  }).lean();

  if (!recoveryCase) return res.status(404).json({ message: 'Case not found' });
  res.json({ case: recoveryCase });
}