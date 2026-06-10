import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

// Validators
const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['student', 'teacher', 'admin']).optional().default('student'),
    assignedTeacherId: z.number().int().optional().nullable(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, assignedTeacherId } = registerSchema.parse(req.body);

        // Check if user exists
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Teachers require admin approval, students/admins are approved immediately
        const isApproved = role !== 'teacher';

        // Create user
        const newUser = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role,
            isApproved,
            assignedTeacherId: role === 'student' ? assignedTeacherId : null,
        }).returning({ 
            id: users.id, 
            name: users.name, 
            email: users.email, 
            role: users.role,
            isApproved: users.isApproved,
            assignedTeacherId: users.assignedTeacherId,
            xp: users.xp,
            level: users.level,
            badges: users.badges,
            completedLessons: users.completedLessons
        });

        const user = newUser[0];

        // Generate token
        const token = jwt.sign({ id: user.id, role: user.role, isApproved: user.isApproved }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

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
        const token = jwt.sign({ id: user.id, role: user.role, isApproved: user.isApproved }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                assignedTeacherId: user.assignedTeacherId,
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

        let assignedTeacher = null;
        if (user.assignedTeacherId) {
            const teacherResult = await db.select({
                id: users.id,
                name: users.name,
                email: users.email
            })
            .from(users)
            .where(eq(users.id, user.assignedTeacherId));
            
            if (teacherResult.length > 0) {
                assignedTeacher = teacherResult[0];
            }
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            assignedTeacherId: user.assignedTeacherId,
            assignedTeacher,
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

export const getApprovedTeachers = async (req: Request, res: Response) => {
    try {
        const teachersList = await db.select({
            id: users.id,
            name: users.name,
            email: users.email
        })
        .from(users)
        .where(
            and(
                eq(users.role, 'teacher'),
                eq(users.isApproved, true)
            )
        );
        res.json(teachersList);
    } catch (error) {
        console.error('Error fetching approved teachers:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { accessToken, role, assignedTeacherId } = req.body;
        
        if (!accessToken) {
            return res.status(400).json({ message: 'Access token is required' });
        }

        // Fetch user info from Google
        const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!googleResponse.ok) {
            return res.status(401).json({ message: 'Invalid Google access token' });
        }

        const googleUser = await googleResponse.json();
        const { sub, email, name } = googleUser;

        if (!email) {
            return res.status(400).json({ message: 'Email not provided by Google' });
        }

        // Check if user exists by googleId
        let dbUserResult = await db.select().from(users).where(eq(users.googleId, sub));
        let user = dbUserResult[0];

        // If not found by googleId, check by email (to support linking existing accounts)
        if (!user) {
            dbUserResult = await db.select().from(users).where(eq(users.email, email));
            user = dbUserResult[0];
            
            if (user) {
                // Link Google account to this existing email user
                await db.update(users).set({ googleId: sub }).where(eq(users.id, user.id));
                user.googleId = sub;
            }
        }

        // If user still does not exist, it's a new registration via Google
        if (!user) {
            if (!role) {
                return res.json({
                    isNewUser: true,
                    email,
                    name,
                    googleId: sub
                });
            }

            // Create new user
            const isApproved = role !== 'teacher';
            const newUserResult = await db.insert(users).values({
                name,
                email,
                googleId: sub,
                role,
                isApproved,
                assignedTeacherId: role === 'student' ? assignedTeacherId : null,
            }).returning();
            
            user = newUserResult[0];
        }

        // Teachers require approval
        if (user.role === 'teacher' && !user.isApproved) {
            return res.status(403).json({
                message: 'Account pending approval',
                isApproved: false,
                role: 'teacher'
            });
        }

        // Generate token
        const token = jwt.sign({ id: user.id, role: user.role, isApproved: user.isApproved }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                assignedTeacherId: user.assignedTeacherId,
                xp: user.xp,
                level: user.level,
                badges: user.badges,
                completedLessons: user.completedLessons
            },
            token
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: 'Server error during Google authentication' });
    }
};

