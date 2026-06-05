import { Router } from 'express';
import { getPendingTeachers, approveTeacher, rejectTeacher } from '../controllers/adminController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Protect all admin routes with auth token & admin role
router.use(authenticateToken);
router.use(requireRole(['admin']));

router.get('/pending-teachers', getPendingTeachers);
router.post('/approve-teacher/:id', approveTeacher);
router.post('/reject-teacher/:id', rejectTeacher);

export default router;
