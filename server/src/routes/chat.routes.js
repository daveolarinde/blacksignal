import { Router } from 'express';
import { getAvailableUserThreads, getThread, postMessage } from '../controllers/chat.controller.js';
import { adminOnly, protect } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/thread', protect, getThread);
router.post('/message', protect, postMessage);
router.get('/rooms', protect, adminOnly, getAvailableUserThreads);

export default router;
