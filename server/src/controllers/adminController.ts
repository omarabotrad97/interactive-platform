import { Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export const getPendingTeachers = async (req: Request, res: Response) => {
    try {
        const pendingTeachers = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            isApproved: users.isApproved,
            createdAt: users.createdAt
        })
        .from(users)
        .where(
            and(
                eq(users.role, 'teacher'),
                eq(users.isApproved, false)
            )
        );
        
        res.json(pendingTeachers);
    } catch (error) {
        console.error('Error fetching pending teachers:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const approveTeacher = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const teacherId = parseInt(id, 10);

        if (isNaN(teacherId)) {
            return res.status(400).json({ message: 'Invalid teacher ID' });
        }

        const updated = await db.update(users)
            .set({ isApproved: true })
            .where(eq(users.id, teacherId))
            .returning({ id: users.id, name: users.name, email: users.email, isApproved: users.isApproved });

        if (updated.length === 0) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.json({ message: 'Teacher approved successfully', teacher: updated[0] });
    } catch (error) {
        console.error('Error approving teacher:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const rejectTeacher = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const teacherId = parseInt(id, 10);

        if (isNaN(teacherId)) {
            return res.status(400).json({ message: 'Invalid teacher ID' });
        }

        const deleted = await db.delete(users)
            .where(
                and(
                    eq(users.id, teacherId),
                    eq(users.role, 'teacher'),
                    eq(users.isApproved, false)
                )
            )
            .returning({ id: users.id, name: users.name, email: users.email });

        if (deleted.length === 0) {
            return res.status(404).json({ message: 'Pending teacher not found or cannot be deleted' });
        }

        res.json({ message: 'Teacher registration rejected and deleted', teacher: deleted[0] });
    } catch (error) {
        console.error('Error rejecting teacher:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
