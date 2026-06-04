import { Request, Response } from 'express';
import { db } from '../db';
import { courses, lessons, quizzes, questions, flashcards } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const parseBilingual = (value: any): { en: string; ar: string } => {
    if (!value) return { en: '', ar: '' };
    if (typeof value === 'object' && value !== null) {
        const enVal = value.en || '';
        const arVal = value.ar || '';
        const resolvedEn = typeof enVal === 'string' && enVal.startsWith('{') ? parseBilingual(enVal).en : enVal;
        const resolvedAr = typeof arVal === 'string' && arVal.startsWith('{') ? parseBilingual(arVal).ar : arVal;
        return { en: resolvedEn || '', ar: resolvedAr || '' };
    }
    if (typeof value === 'string') {
        try {
            if (value.startsWith('{')) {
                const parsed = JSON.parse(value);
                return parseBilingual(parsed);
            }
        } catch (e) {}
        return { en: value, ar: value };
    }
    return { en: '', ar: '' };
};

const parseBilingualOptions = (value: any): { en: string[]; ar: string[] } => {
    if (!value) return { en: [], ar: [] };
    if (Array.isArray(value)) {
        return { en: value, ar: value };
    }
    if (typeof value === 'object' && value !== null) {
        const enVal = value.en || [];
        const arVal = value.ar || [];
        const resolvedEn = typeof enVal === 'string' && (enVal.startsWith('{') || enVal.startsWith('[')) ? parseBilingualOptions(enVal).en : enVal;
        const resolvedAr = typeof arVal === 'string' && (arVal.startsWith('{') || arVal.startsWith('[')) ? parseBilingualOptions(arVal).ar : arVal;
        return { en: Array.isArray(resolvedEn) ? resolvedEn : [], ar: Array.isArray(resolvedAr) ? resolvedAr : [] };
    }
    if (typeof value === 'string') {
        try {
            if (value.startsWith('{') || value.startsWith('[')) {
                const parsed = JSON.parse(value);
                return parseBilingualOptions(parsed);
            }
        } catch (e) {}
    }
    return { en: [], ar: [] };
};


const courseSchema = z.object({
    title: z.string().min(5),
    description: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    published: z.boolean().optional(),
});

export const getCourses = async (req: Request, res: Response) => {
    try {
        let showAll = false;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            try {
                const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
                if (decoded && (decoded.role === 'teacher' || decoded.role === 'admin')) {
                    showAll = true;
                }
            } catch (e) {}
        }

        // Fetch courses with all sub-resources (lessons, quizzes with questions, flashcards)
        const result = await db.query.courses.findMany({
            where: showAll ? undefined : eq(courses.published, true),
            with: {
                lessons: {
                    orderBy: (lessons, { asc }) => [asc(lessons.order)],
                },
                quizzes: {
                    with: {
                        questions: true,
                    }
                },
                flashcards: true,
            }
        });

        // Shape the courses to match the frontend expectations where quizzes are embedded inside lessons
        const formattedResult = result.map(course => {
            const formattedLessons = course.lessons.map(lesson => {
                // Find any quiz attached to this lesson
                const lessonQuiz = course.quizzes.find(q => q.lessonId === lesson.id);
                return {
                    id: String(lesson.id),
                    title: parseBilingual(lesson.title),
                    content: parseBilingual(lesson.content),
                    videoUrl: lesson.videoUrl || '',
                    quiz: lessonQuiz ? lessonQuiz.questions.map(q => ({
                        id: String(q.id),
                        text: parseBilingual(q.text),
                        options: parseBilingualOptions(q.options),
                        correctAnswer: q.correctAnswer
                    })) : undefined
                };
            });

            return {
                id: String(course.id),
                title: parseBilingual(course.title),
                description: parseBilingual(course.description),
                thumbnailUrl: course.thumbnailUrl || '',
                lessons: formattedLessons,
                published: course.published,
                flashcards: course.flashcards.map(fc => ({
                    id: String(fc.id),
                    question: fc.question,
                    answer: fc.answer,
                    courseId: String(fc.courseId),
                }))
            };
        });

        res.json(formattedResult);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCourseById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const course = await db.query.courses.findFirst({
            where: eq(courses.id, id),
            with: {
                lessons: {
                    orderBy: (lessons, { asc }) => [asc(lessons.order)],
                },
                quizzes: {
                    with: {
                        questions: true,
                    }
                },
                flashcards: true,
            }
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const formattedLessons = course.lessons.map(lesson => {
            const lessonQuiz = course.quizzes.find(q => q.lessonId === lesson.id);
            return {
                id: String(lesson.id),
                title: parseBilingual(lesson.title),
                content: parseBilingual(lesson.content),
                videoUrl: lesson.videoUrl || '',
                quiz: lessonQuiz ? lessonQuiz.questions.map(q => ({
                    id: String(q.id),
                    text: parseBilingual(q.text),
                    options: parseBilingualOptions(q.options),
                    correctAnswer: q.correctAnswer
                })) : undefined
            };
        });

        const formattedCourse = {
            id: String(course.id),
            title: parseBilingual(course.title),
            description: parseBilingual(course.description),
            thumbnailUrl: course.thumbnailUrl || '',
            lessons: formattedLessons,
            published: course.published,
            flashcards: course.flashcards.map(fc => ({
                id: String(fc.id),
                question: fc.question,
                answer: fc.answer,
                courseId: String(fc.courseId),
            }))
        };

        res.json(formattedCourse);
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createCourse = async (req: Request, res: Response) => {
    try {
        const { title, description, thumbnailUrl, published } = courseSchema.parse(req.body);

        // Assuming req.user is populated by auth middleware
        // @ts-ignore
        const teacherId = req.user.id;

        const result = await db.insert(courses).values({
            title,
            description,
            thumbnailUrl,
            teacherId: teacherId,
            published: published || false,
        }).returning();

        res.status(201).json(result[0]);

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { title, description, thumbnailUrl, published } = courseSchema.parse(req.body);
        
        // Verify owner
        const existing = await db.select().from(courses).where(eq(courses.id, id));
        if (existing.length === 0) return res.status(404).json({ message: 'Course not found' });
        // @ts-ignore
        if (existing[0].teacherId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const result = await db.update(courses).set({
            title,
            description,
            thumbnailUrl,
            published: published ?? existing[0].published,
        }).where(eq(courses.id, id)).returning();

        res.json(result[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await db.select().from(courses).where(eq(courses.id, id));
        if (existing.length === 0) return res.status(404).json({ message: 'Course not found' });
        // @ts-ignore
        if (existing[0].teacherId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Delete flashcards
        await db.delete(flashcards).where(eq(flashcards.courseId, id));
        // Find lessons in this course
        const courseLessons = await db.select().from(lessons).where(eq(lessons.courseId, id));
        const lessonIds = courseLessons.map(l => l.id);
        if (lessonIds.length > 0) {
            // Delete questions for quizzes
            const courseQuizzes = await db.select().from(quizzes).where(eq(quizzes.courseId, id));
            const quizIds = courseQuizzes.map(q => q.id);
            if (quizIds.length > 0) {
                for (const qId of quizIds) {
                    await db.delete(questions).where(eq(questions.quizId, qId));
                }
                await db.delete(quizzes).where(eq(quizzes.courseId, id));
            }
            await db.delete(lessons).where(eq(lessons.courseId, id));
        }

        await db.delete(courses).where(eq(courses.id, id));
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const lessonSchema = z.object({
    title: z.string().min(2),
    content: z.string().optional(),
    videoUrl: z.string().optional(),
    order: z.number().int(),
});

export const addLesson = async (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const { title, content, videoUrl, order } = lessonSchema.parse(req.body);

        // Verify owner
        const existingCourse = await db.select().from(courses).where(eq(courses.id, courseId));
        if (existingCourse.length === 0) return res.status(404).json({ message: 'Course not found' });
        // @ts-ignore
        if (existingCourse[0].teacherId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const result = await db.insert(lessons).values({
            courseId,
            title,
            content,
            videoUrl,
            order,
        }).returning();

        res.status(201).json(result[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateLesson = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { title, content, videoUrl, order } = lessonSchema.parse(req.body);

        const existingLesson = await db.select().from(lessons).where(eq(lessons.id, id));
        if (existingLesson.length === 0) return res.status(404).json({ message: 'Lesson not found' });

        // Verify owner of course
        const existingCourse = await db.select().from(courses).where(eq(courses.id, existingLesson[0].courseId));
        // @ts-ignore
        if (existingCourse[0].teacherId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const result = await db.update(lessons).set({
            title,
            content,
            videoUrl,
            order,
        }).where(eq(lessons.id, id)).returning();

        res.json(result[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteLesson = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const existingLesson = await db.select().from(lessons).where(eq(lessons.id, id));
        if (existingLesson.length === 0) return res.status(404).json({ message: 'Lesson not found' });

        // Verify owner of course
        const existingCourse = await db.select().from(courses).where(eq(courses.id, existingLesson[0].courseId));
        // @ts-ignore
        if (existingCourse[0].teacherId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Delete associated quizzes and questions
        const associatedQuizzes = await db.select().from(quizzes).where(eq(quizzes.lessonId, id));
        for (const quiz of associatedQuizzes) {
            await db.delete(questions).where(eq(questions.quizId, quiz.id));
        }
        await db.delete(quizzes).where(eq(quizzes.lessonId, id));

        await db.delete(lessons).where(eq(lessons.id, id));
        res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const questionInputSchema = z.object({
    text: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.number().int(),
});

const quizSchema = z.object({
    title: z.string(),
    questions: z.array(questionInputSchema),
});

export const saveQuiz = async (req: Request, res: Response) => {
    try {
        const lessonId = parseInt(req.params.lessonId);
        const { title, questions: quizQuestions } = quizSchema.parse(req.body);

        const existingLesson = await db.select().from(lessons).where(eq(lessons.id, lessonId));
        if (existingLesson.length === 0) return res.status(404).json({ message: 'Lesson not found' });

        // Verify owner of course
        const existingCourse = await db.select().from(courses).where(eq(courses.id, existingLesson[0].courseId));
        // @ts-ignore
        if (existingCourse[0].teacherId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Check if quiz exists
        let quizId: number;
        const existingQuizzes = await db.select().from(quizzes).where(eq(quizzes.lessonId, lessonId));

        if (existingQuizzes.length > 0) {
            quizId = existingQuizzes[0].id;
            await db.update(quizzes).set({ title }).where(eq(quizzes.id, quizId));
            // Delete old questions
            await db.delete(questions).where(eq(questions.quizId, quizId));
        } else {
            const insertedQuiz = await db.insert(quizzes).values({
                lessonId,
                courseId: existingLesson[0].courseId,
                title,
            }).returning();
            quizId = insertedQuiz[0].id;
        }

        // Insert new questions
        if (quizQuestions.length > 0) {
            await db.insert(questions).values(
                quizQuestions.map(q => ({
                    quizId,
                    text: q.text,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                }))
            );
        }

        res.json({ message: 'Quiz saved successfully', quizId });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        console.error('Error saving quiz:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
