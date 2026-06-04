import { Request, Response } from 'express';
import { db } from '../db';
import { notes, flashcardProgress, users, flashcards } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

interface AuthRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}

// Validation schemas
const noteSaveSchema = z.object({
    lessonId: z.number(),
    content: z.string(),
});

const flashcardRateSchema = z.object({
    cardId: z.number(),
    grade: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});

const gamificationUpdateSchema = z.object({
    xpToAdd: z.number().optional(),
    level: z.number().optional(),
    badge: z.object({
        key: z.string(),
        name: z.string(),
        description: z.string(),
    }).optional(),
    completedLessons: z.array(z.string()).optional(),
});

// NOTES
export const getNoteByLesson = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const lessonId = parseInt(req.params.lessonId);

        const result = await db.select().from(notes).where(
            and(
                eq(notes.userId, userId),
                eq(notes.lessonId, lessonId)
            )
        );

        if (result.length === 0) {
            return res.json({ content: '' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const saveNote = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { lessonId, content } = noteSaveSchema.parse(req.body);

        // Check if note exists
        const existing = await db.select().from(notes).where(
            and(
                eq(notes.userId, userId),
                eq(notes.lessonId, lessonId)
            )
        );

        let savedNote;
        if (existing.length > 0) {
            // Update
            const updated = await db.update(notes)
                .set({ content, updatedAt: new Date() })
                .where(eq(notes.id, existing[0].id))
                .returning();
            savedNote = updated[0];
        } else {
            // Insert
            const inserted = await db.insert(notes)
                .values({ userId, lessonId, content })
                .returning();
            savedNote = inserted[0];
        }

        res.json(savedNote);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        console.error('Error saving note:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GAMIFICATION
export const updateGamification = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { xpToAdd, level, badge, completedLessons } = gamificationUpdateSchema.parse(req.body);

        // Fetch current user
        const userResult = await db.select().from(users).where(eq(users.id, userId));
        const user = userResult[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let newXp = user.xp;
        let newLevel = user.level;
        let newBadges = [...(user.badges as any[])];
        let newCompletedLessons = [...(user.completedLessons as string[])];

        if (xpToAdd) {
            newXp += xpToAdd;
        }

        if (level) {
            newLevel = level;
        }

        if (badge) {
            const alreadyHasBadge = newBadges.some(b => b.key === badge.key);
            if (!alreadyHasBadge) {
                newBadges.push(badge);
            }
        }

        if (completedLessons) {
            newCompletedLessons = completedLessons;
        }

        const updated = await db.update(users)
            .set({ xp: newXp, level: newLevel, badges: newBadges, completedLessons: newCompletedLessons })
            .where(eq(users.id, userId))
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                xp: users.xp,
                level: users.level,
                badges: users.badges,
                completedLessons: users.completedLessons
            });

        res.json(updated[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        console.error('Error updating gamification:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// SPACED REPETITION (SM-2 ALGORITHM)
export const getFlashcardProgress = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        
        const result = await db.select().from(flashcardProgress).where(
            eq(flashcardProgress.userId, userId)
        );

        res.json(result.map(r => ({
            id: String(r.flashcardId), // Map flashcard ID as key
            repetitions: r.repetitions,
            easeFactor: r.easeFactor,
            interval: r.interval,
            nextReviewDue: r.nextReviewDue.getTime()
        })));
    } catch (error) {
        console.error('Error fetching flashcard progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const rateFlashcard = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { cardId, grade } = flashcardRateSchema.parse(req.body);

        // Check if progress exists
        const existingResult = await db.select().from(flashcardProgress).where(
            and(
                eq(flashcardProgress.userId, userId),
                eq(flashcardProgress.flashcardId, cardId)
            )
        );

        const existing = existingResult[0];

        let repetitions = existing ? existing.repetitions : 0;
        let easeFactor = existing ? existing.easeFactor : 2.5;
        let interval = existing ? existing.interval : 0;

        // SM-2 Algorithm Implementation
        if (grade === 1) { // "Again" - Reset interval and repetitions
            repetitions = 0;
            interval = 0; // 0 means review again today
        } else { // Hard (2), Good (3), Easy (4)
            if (repetitions === 0) {
                interval = 1; // 1 day
            } else if (repetitions === 1) {
                interval = 3; // 3 days
            } else {
                interval = Math.round(interval * easeFactor);
            }
            repetitions += 1;
        }

        // Adjust Ease Factor (EF) based on grade
        // EF':= EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        // q ranges from 1 to 4 in our rating, map to q=2 to q=5 for standard formula
        const q = grade + 1; // Map 1-4 to 2-5 for SM-2
        easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        
        // Cap Ease Factor to a minimum of 1.3
        if (easeFactor < 1.3) {
            easeFactor = 1.3;
        }

        // Calculate next review timestamp
        // If interval is 0, schedule in 10 minutes
        const msToAdd = interval === 0 ? 10 * 60 * 1000 : interval * 24 * 60 * 60 * 1000;
        const nextReviewDue = new Date(Date.now() + msToAdd);

        let savedProgress;
        if (existing) {
            // Update
            const updated = await db.update(flashcardProgress)
                .set({ repetitions, easeFactor, interval, nextReviewDue })
                .where(eq(flashcardProgress.id, existing.id))
                .returning();
            savedProgress = updated[0];
        } else {
            // Insert
            const inserted = await db.insert(flashcardProgress)
                .values({
                    userId,
                    flashcardId: cardId,
                    repetitions,
                    easeFactor,
                    interval,
                    nextReviewDue
                })
                .returning();
            savedProgress = inserted[0];
        }

        res.json({
            id: String(savedProgress.flashcardId),
            repetitions: savedProgress.repetitions,
            easeFactor: savedProgress.easeFactor,
            interval: savedProgress.interval,
            nextReviewDue: savedProgress.nextReviewDue.getTime()
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        console.error('Error rating flashcard:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
