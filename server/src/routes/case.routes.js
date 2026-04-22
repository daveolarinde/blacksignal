// routes/case.routes.js
import { Router } from 'express';
import { createCase, getCaseById, getMyCases } from '../controllers/case.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = Router();
router.post('/', protect, upload.single('proofDocument'), createCase);
router.get('/my-cases', protect, getMyCases);
router.get('/:id', protect, getCaseById);   // <-- new

export default router;