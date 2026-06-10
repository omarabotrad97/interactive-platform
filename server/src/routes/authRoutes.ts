import { Router } from 'express';
import { register, login, getProfile, getApprovedTeachers, googleLogin } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', authenticateToken, getProfile);
router.get('/teachers', getApprovedTeachers);

export default router;
