import { Router } from 'express';
import { getCourses, getCourseById, createCourse } from '../controllers/courseController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', authenticateToken, createCourse);

export default router;
