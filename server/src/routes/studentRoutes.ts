import { Router } from 'express';
import { getNoteByLesson, saveNote, updateGamification, getFlashcardProgress, rateFlashcard } from '../controllers/studentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all student routes
router.use(authenticateToken);

// Notes routes
router.get('/notes/:lessonId', getNoteByLesson);
router.post('/notes', saveNote);

// Gamification routes
router.post('/gamification', updateGamification);

// Flashcards routes
router.get('/flashcards/progress', getFlashcardProgress);
router.post('/flashcards/rate', rateFlashcard);

export default router;
