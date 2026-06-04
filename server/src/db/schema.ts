import { pgTable, serial, text, timestamp, boolean, integer, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum('role', ['admin', 'teacher', 'student']);
export const contentTypeEnum = pgEnum('content_type', ['video', 'text', 'quiz']);

// Users Table
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: roleEnum('role').default('student'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Courses Table
export const courses = pgTable('courses', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    thumbnailUrl: text('thumbnail_url'),
    teacherId: integer('teacher_id').references(() => users.id).notNull(),
    published: boolean('published').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

// Lessons Table
export const lessons = pgTable('lessons', {
    id: serial('id').primaryKey(),
    courseId: integer('course_id').references(() => courses.id).notNull(),
    title: text('title').notNull(),
    content: text('content'), // For text content
    videoUrl: text('video_url'), // For video content
    order: integer('order').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// Enrollments (Students <-> Courses)
export const enrollments = pgTable('enrollments', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    courseId: integer('course_id').references(() => courses.id).notNull(),
    enrolledAt: timestamp('enrolled_at').defaultNow(),
});

// Quizzes
export const quizzes = pgTable('quizzes', {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id').references(() => lessons.id), // Optional: Quiz can be attached to a lesson
    courseId: integer('course_id').references(() => courses.id).notNull(),
    title: text('title').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// Questions
export const questions = pgTable('questions', {
    id: serial('id').primaryKey(),
    quizId: integer('quiz_id').references(() => quizzes.id).notNull(),
    text: text('text').notNull(),
    options: jsonb('options').notNull(), // Array of strings stored as JSON
    correctAnswer: integer('correct_answer').notNull(), // Index of correct option
});

// Results / Progress
export const results = pgTable('results', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    quizId: integer('quiz_id').references(() => quizzes.id).notNull(),
    score: integer('score').notNull(),
    completedAt: timestamp('completed_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    courses: many(courses), // As a teacher
    enrollments: many(enrollments), // As a student
    results: many(results),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
    teacher: one(users, {
        fields: [courses.teacherId],
        references: [users.id],
    }),
    lessons: many(lessons),
    enrollments: many(enrollments),
    quizzes: many(quizzes),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
    course: one(courses, {
        fields: [lessons.courseId],
        references: [courses.id],
    }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
    user: one(users, {
        fields: [enrollments.userId],
        references: [users.id],
    }),
    course: one(courses, {
        fields: [enrollments.courseId],
        references: [courses.id],
    }),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
    course: one(courses, {
        fields: [quizzes.courseId],
        references: [courses.id],
    }),
    questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
    quiz: one(quizzes, {
        fields: [questions.quizId],
        references: [quizzes.id],
    }),
}));
