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
        const result = await db.select().from(courses);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCourseById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.select().from(courses).where(eq(courses.id, id));

        if (result.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(result[0]);
    } catch (error) {
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
