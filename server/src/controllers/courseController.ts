import { Request, Response } from 'express';
import { db } from '../db';
import { courses } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const courseSchema = z.object({
    title: z.string().min(5),
    description: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    published: z.boolean().optional(),
});

export const getCourses = async (req: Request, res: Response) => {
    try {
        // Fetch courses with all sub-resources (lessons, quizzes with questions, flashcards)
        const result = await db.query.courses.findMany({
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
                    title: { en: lesson.title, ar: lesson.title }, // In simulated db we just use same text or expand it
                    content: { en: lesson.content || '', ar: lesson.content || '' },
                    videoUrl: lesson.videoUrl || '',
                    quiz: lessonQuiz ? lessonQuiz.questions.map(q => ({
                        id: String(q.id),
                        text: { en: q.text, ar: q.text },
                        options: { 
                            en: (q.options as string[]) || [], 
                            ar: (q.options as string[]) || [] 
                        },
                        correctAnswer: q.correctAnswer
                    })) : undefined
                };
            });

            return {
                id: String(course.id),
                title: { en: course.title, ar: course.title },
                description: { en: course.description || '', ar: course.description || '' },
                thumbnailUrl: course.thumbnailUrl || '',
                lessons: formattedLessons,
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
                title: { en: lesson.title, ar: lesson.title },
                content: { en: lesson.content || '', ar: lesson.content || '' },
                videoUrl: lesson.videoUrl || '',
                quiz: lessonQuiz ? lessonQuiz.questions.map(q => ({
                    id: String(q.id),
                    text: { en: q.text, ar: q.text },
                    options: { 
                        en: (q.options as string[]) || [], 
                        ar: (q.options as string[]) || [] 
                    },
                    correctAnswer: q.correctAnswer
                })) : undefined
            };
        });

        const formattedCourse = {
            id: String(course.id),
            title: { en: course.title, ar: course.title },
            description: { en: course.description || '', ar: course.description || '' },
            thumbnailUrl: course.thumbnailUrl || '',
            lessons: formattedLessons,
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
        const { title, description, thumbnailUrl } = courseSchema.parse(req.body);

        // Assuming req.user is populated by auth middleware
        // @ts-ignore
        const teacherId = req.user.id;

        const result = await db.insert(courses).values({
            title,
            description,
            thumbnailUrl,
            teacherId: teacherId,
        }).returning();

        res.status(201).json(result[0]);

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
