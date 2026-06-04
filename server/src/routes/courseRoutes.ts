import { Router } from 'express';
import { 
    getCourses, 
    getCourseById, 
    createCourse, 
    updateCourse, 
    deleteCourse, 
    addLesson, 
    updateLesson, 
    deleteLesson, 
    saveQuiz 
} from '../controllers/courseController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);

// Teacher-protected routes
router.post('/', authenticateToken, requireRole(['teacher', 'admin']), createCourse);
router.put('/:id', authenticateToken, requireRole(['teacher', 'admin']), updateCourse);
router.delete('/:id', authenticateToken, requireRole(['teacher', 'admin']), deleteCourse);

router.post('/:courseId/lessons', authenticateToken, requireRole(['teacher', 'admin']), addLesson);
router.put('/lessons/:id', authenticateToken, requireRole(['teacher', 'admin']), updateLesson);
router.delete('/lessons/:id', authenticateToken, requireRole(['teacher', 'admin']), deleteLesson);

router.post('/lessons/:lessonId/quiz', authenticateToken, requireRole(['teacher', 'admin']), saveQuiz);

export default router;
