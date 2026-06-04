import { Request, Response } from 'express';
import { db } from '../db';
import { courses, enrollments, users } from '../db/schema';
import { eq, inArray } from 'drizzle-orm';

interface AuthRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}

export const getTeacherStats = async (req: AuthRequest, res: Response) => {
    try {
        const teacherId = req.user!.id;

        // 1. Fetch courses owned by the teacher
        const teacherCourses = await db.select().from(courses).where(eq(courses.teacherId, teacherId));
        const courseIds = teacherCourses.map(c => c.id);

        if (courseIds.length === 0) {
            return res.json({
                totalCourses: 0,
                totalStudents: 0,
                averageXp: 0,
                students: []
            });
        }

        // 2. Fetch enrollments in these courses
        const teacherEnrollments = await db.select().from(enrollments).where(inArray(enrollments.courseId, courseIds));
        const studentIds = Array.from(new Set(teacherEnrollments.map(e => e.userId)));

        if (studentIds.length === 0) {
            return res.json({
                totalCourses: teacherCourses.length,
                totalStudents: 0,
                averageXp: 0,
                students: []
            });
        }

        // 3. Fetch students' profiles
        const studentProfiles = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            xp: users.xp,
            level: users.level,
            badges: users.badges,
            completedLessons: users.completedLessons,
        }).from(users).where(inArray(users.id, studentIds));

        // Calculate aggregate statistics
        const totalXp = studentProfiles.reduce((acc, s) => acc + s.xp, 0);
        const averageXp = Math.round(totalXp / studentProfiles.length);

        // Map course names to students for the roster
        const studentsList = studentProfiles.map(s => {
            // Find which courses this student is enrolled in
            const studentEnrolledCourseIds = teacherEnrollments
                .filter(e => e.userId === s.id)
                .map(e => e.courseId);
            
            const studentEnrolledCourses = teacherCourses
                .filter(c => studentEnrolledCourseIds.includes(c.id))
                .map(c => c.title);

            return {
                ...s,
                enrolledCourses: studentEnrolledCourses,
            };
        });

        res.json({
            totalCourses: teacherCourses.length,
            totalStudents: studentProfiles.length,
            averageXp,
            students: studentsList,
        });

    } catch (error) {
        console.error('Error fetching teacher stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
