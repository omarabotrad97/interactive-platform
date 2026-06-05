import { pgTable, serial, text, timestamp, boolean, integer, pgEnum, jsonb, real } from "drizzle-orm/pg-core";
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
    isApproved: boolean('is_approved').default(true).notNull(), // True for students/admins, false for teachers until approved
    assignedTeacherId: integer('assigned_teacher_id').references((): any => users.id), // Reference to the assigned teacher user
    xp: integer('xp').default(0).notNull(),
    level: integer('level').default(1).notNull(),
    badges: jsonb('badges').default([]).notNull(), // List of unlocked badges [{key, name, description}]
    completedLessons: jsonb('completed_lessons').default([]).notNull(), // List of completed lesson IDs
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
    text: text('text').notNull(), // Bilingual representation or standard text
    options: jsonb('options').notNull(), // Array of strings stored as JSON
    correctAnswer: integer('correct_answer').notNull(), // Index of correct option
});

// Results / Progress (Quiz completion)
export const results = pgTable('results', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    quizId: integer('quiz_id').references(() => quizzes.id).notNull(),
    score: integer('score').notNull(),
    completedAt: timestamp('completed_at').defaultNow(),
});

// Smart Notes Table
export const notes = pgTable('notes', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    lessonId: integer('lesson_id').references(() => lessons.id).notNull(),
    content: text('content').notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Flashcards Table (at course level)
export const flashcards = pgTable('flashcards', {
    id: serial('id').primaryKey(),
    courseId: integer('course_id').references(() => courses.id).notNull(),
    question: jsonb('question').notNull(), // { en: string, ar: string }
    answer: jsonb('answer').notNull(), // { en: string, ar: string }
    createdAt: timestamp('created_at').defaultNow(),
});

// User Spaced Repetition Flashcard Progress Table
export const flashcardProgress = pgTable('flashcard_progress', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    flashcardId: integer('flashcard_id').references(() => flashcards.id).notNull(),
    repetitions: integer('repetitions').default(0).notNull(),
    easeFactor: real('ease_factor').default(2.5).notNull(),
    interval: integer('interval').default(0).notNull(), // in days
    nextReviewDue: timestamp('next_review_due').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    courses: many(courses), // As a teacher
    enrollments: many(enrollments), // As a student
    results: many(results),
    notes: many(notes),
    flashcardProgress: many(flashcardProgress),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
    teacher: one(users, {
        fields: [courses.teacherId],
        references: [users.id],
    }),
    lessons: many(lessons),
    enrollments: many(enrollments),
    quizzes: many(quizzes),
    flashcards: many(flashcards),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    course: one(courses, {
        fields: [lessons.courseId],
        references: [courses.id],
    }),
    notes: many(notes),
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

export const notesRelations = relations(notes, ({ one }) => ({
    user: one(users, {
        fields: [notes.userId],
        references: [users.id],
    }),
    lesson: one(lessons, {
        fields: [notes.lessonId],
        references: [lessons.id],
    }),
}));

export const flashcardsRelations = relations(flashcards, ({ one, many }) => ({
    course: one(courses, {
        fields: [flashcards.courseId],
        references: [courses.id],
    }),
    progress: many(flashcardProgress),
}));

export const flashcardProgressRelations = relations(flashcardProgress, ({ one }) => ({
    user: one(users, {
        fields: [flashcardProgress.userId],
        references: [users.id],
    }),
    flashcard: one(flashcards, {
        fields: [flashcardProgress.flashcardId],
        references: [flashcards.id],
    }),
}));
