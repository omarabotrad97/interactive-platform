import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Validators
const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = registerSchema.parse(req.body);

        // Check if user exists
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        }).returning({ 
            id: users.id, 
            name: users.name, 
            email: users.email, 
            role: users.role,
            xp: users.xp,
            level: users.level,
            badges: users.badges,
            completedLessons: users.completedLessons
        });

        const user = newUser[0];

        // Generate token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        res.status(201).json({ user, token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        // Find user
        const userResult = await db.select().from(users).where(eq(users.email, email));
        const user = userResult[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                xp: user.xp,
                level: user.level,
                badges: user.badges,
                completedLessons: user.completedLessons
            },
            token
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const userResult = await db.select().from(users).where(eq(users.id, userId));
        const user = userResult[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            xp: user.xp,
            level: user.level,
            badges: user.badges,
            completedLessons: user.completedLessons
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
