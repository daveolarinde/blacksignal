// models/ChatRoom.js
import mongoose from 'mongoose';

const chatRoomSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, unique: true }
  },
  { timestamps: true }
);

export default mongoose.model('ChatRoom', chatRoomSchema);