import { Router } from 'express';
import { getAdminCases, getAdminStats } from '../controllers/admin.controller.js';
import { adminOnly, protect } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/cases', protect, adminOnly, getAdminCases);
router.get('/stats', protect, adminOnly, getAdminStats);

export default router;
