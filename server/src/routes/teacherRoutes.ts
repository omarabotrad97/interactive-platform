import { Router } from 'express';
import { getTeacherStats } from '../controllers/teacherController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticateToken, requireRole(['teacher', 'admin']), getTeacherStats);

export default router;
