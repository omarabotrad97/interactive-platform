import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

export const requireRole = (roles: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.sendStatus(401);
        }
        try {
            const dbUserResult = await db.select().from(users).where(eq(users.id, req.user.id));
            const dbUser = dbUserResult[0];
            if (!dbUser) {
                return res.status(403).json({ message: "User not found." });
            }
            if (!dbUser.role || !roles.includes(dbUser.role)) {
                return res.sendStatus(403);
            }
            if (!dbUser.isApproved) {
                return res.status(403).json({ message: "Account disabled or pending approval." });
            }
            next();
        } catch (error) {
            return res.status(500).json({ message: "Server error during authorization check" });
        }
    };
};
