// controllers/chat.controller.js
import ChatRoom from '../models/ChatRoom.js';
import Message from '../models/Message.js';

// Resolve room by caseId — used by both user and admin
async function resolveRoomByCase(caseId) {
  const room = await ChatRoom.findOne({ case: caseId });
  if (!room) throw new Error('Chat room not found for this case');
  return room;
}

// GET /chat/thread?caseId=...
export async function getThread(req, res) {
  const { caseId } = req.query;
  if (!caseId) return res.status(400).json({ message: 'caseId is required' });

  const room = await resolveRoomByCase(caseId);

  // Users can only read their own room
  if (req.user.role !== 'admin' && String(room.user) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const messages = await Message.find({ room: room._id })
    .populate('sender', 'name role')
    .sort({ createdAt: 1 })
    .lean();

  res.json({ roomId: room._id, messages });
}

// POST /chat/message
export async function postMessage(req, res) {
  const { roomId, message } = req.body;
  if (!roomId || !message) return res.status(400).json({ message: 'roomId and message are required' });

  const room = await ChatRoom.findById(roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });

  // Users can only post to their own room
  if (req.user.role !== 'admin' && String(room.user) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const saved = await Message.create({ room: roomId, sender: req.user._id, content: message });
  const populated = await saved.populate('sender', 'name role');

  res.status(201).json({
    message: {
      ...populated.toObject(),
      caseId: String(room.case),
      room: roomId
    }
  });
}

// GET /chat/rooms  (admin only — lists all rooms with case info)
export async function getAvailableUserThreads(_req, res) {
  const rooms = await ChatRoom.find()
    .populate('user', 'name email')
    .populate('case', 'recoveryType status createdAt')
    .sort({ updatedAt: -1 });
  res.json({ rooms });
}