import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from '../lib/api';

interface User {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    role?: 'admin' | 'teacher' | 'student';
    isApproved?: boolean;
    assignedTeacherId?: number | null;
    assignedTeacher?: { id: number; name: string; email: string } | null;
}

export interface ToastNotification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface Badge {
    key: string;
    name: string;
    description: string;
}


export interface Flashcard {
    id: string;
    question: { en: string; ar: string };
    answer: { en: string; ar: string };
    courseId: string;
    repetitions: number;
    easeFactor: number;
    interval: number; // in days
    nextReviewDue: number; // timestamp in ms
    lastGrade?: number;
}

export interface QuizQuestion {
    id: string;
    text: { en: string; ar: string };
    options: { en: string[]; ar: string[] };
    correctAnswer: number;
}

export interface Lesson {
    id: string;
    title: { en: string; ar: string };
    content: { en: string; ar: string };
    videoUrl: string;
    quiz?: QuizQuestion[];
}

export interface Course {
    id: string;
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    thumbnailUrl: string;
    published?: boolean;
    lessons: Lesson[];
    flashcards: Flashcard[];
}

interface AppState {
    // Theme
    isDarkMode: boolean;
    toggleDarkMode: () => void;

    // Localization
    lang: 'en' | 'ar';
    toggleLanguage: () => void;

    // Authentication
    isAuthenticated: boolean;
    login: (email?: string, password?: string) => Promise<void>;
    logout: () => void;
    user: User;
    updateUser: (user: Partial<User>) => void;
    checkAuth: () => Promise<void>;
    register: (name: string, email: string, password: string, role?: 'student' | 'teacher' | 'admin', assignedTeacherId?: number | null) => Promise<void>;

    // Courses & Lessons Completion
    courses: Course[];
    completedLessons: string[];
    loadCourses: () => Promise<void>;
    toggleLessonCompletion: (lessonId: string) => Promise<void>;

    // Notes
    notes: Record<string, string>; // lessonId -> content
    loadNoteForLesson: (lessonId: string) => Promise<void>;
    saveNote: (lessonId: string, content: string) => Promise<void>;

    // Gamification
    xp: number;
    level: number;
    badges: Badge[];
    addXP: (amount: number) => Promise<void>;
    showXPNotification: { show: boolean; amount: number } | null;
    showLevelUpNotification: { show: boolean; level: number } | null;
    showBadgeNotification: { show: boolean; badgeKey: string } | null;
    clearXPNotification: () => void;
    clearLevelUpNotification: () => void;
    clearBadgeNotification: () => void;

    // Flashcards (Anki Spaced Repetition)
    simulatedTime: number;
    simulateTimeForward: (days: number) => void;
    flashcards: Flashcard[];
    rateFlashcard: (cardId: string, grade: 1 | 2 | 3 | 4) => Promise<void>;
    addFlashcard: (courseId: string, question: string, answer: string) => void;

    // Interactive Onboarding Guide
    isGuideOpen: boolean;
    activeGuideStep: number;
    openGuide: () => void;
    closeGuide: () => void;
    setGuideStep: (step: number) => void;

    // Global Toast Notifications
    toasts: ToastNotification[];
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    removeToast: (id: string) => void;

    // Teacher & Admin Panel Actions & State
    teacherStats: {
        totalCourses: number;
        totalStudents: number;
        averageXp: number;
        students: Array<{
            id: number;
            name: string;
            email: string;
            xp: number;
            level: number;
            badges: Badge[];
            completedLessons: string[];
            enrolledCourses: string[];
        }>;
    } | null;
    loadTeacherStats: () => Promise<void>;
    createCourseAction: (courseData: { title: string; description: string; thumbnailUrl?: string; published?: boolean }) => Promise<any>;
    updateCourseAction: (courseId: string, courseData: { title: string; description: string; thumbnailUrl?: string; published?: boolean }) => Promise<any>;
    deleteCourseAction: (courseId: string) => Promise<void>;
    addLessonAction: (courseId: string, lessonData: { title: string; content?: string; videoUrl?: string; order: number }) => Promise<any>;
    updateLessonAction: (lessonId: string, lessonData: { title: string; content?: string; videoUrl?: string; order: number }) => Promise<any>;
    deleteLessonAction: (lessonId: string) => Promise<void>;
    saveQuizAction: (lessonId: string, quizData: { title: string; questions: Array<{ text: string; options: string[]; correctAnswer: number }> }) => Promise<any>;

    // Approved & Pending Teachers state and actions
    approvedTeachers: Array<{ id: number; name: string; email: string }>;
    loadApprovedTeachers: () => Promise<void>;
    pendingTeachers: Array<{ id: number; name: string; email: string; isApproved: boolean; createdAt?: string }>;
    loadPendingTeachers: () => Promise<void>;
    approveTeacherAction: (id: number) => Promise<void>;
    rejectTeacherAction: (id: number) => Promise<void>;
}

// Resilient Fallback Mock Data
const fallbackCourses: Course[] = [
    {
        id: 'react-101',
        title: {
            en: 'React & Modern Web Design',
            ar: 'React وتصميم الويب العصري'
        },
        description: {
            en: 'Build stunning, responsive interfaces with React, TailwindCSS, and state-of-the-art interactive modules.',
            ar: 'ابنِ واجهات مذهلة ومتجاوبة باستخدام React و TailwindCSS ووحدات تفاعلية متطورة للغاية.'
        },
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        lessons: [
            {
                id: 'react-l1',
                title: {
                    en: '1. Introduction to Components',
                    ar: '1. مقدمة في المكونات (Components)'
                },
                content: {
                    en: 'React components are reusable building blocks for the UI. They are declared as JavaScript functions that return JSX, representing HTML code inside JavaScript code.',
                    ar: 'مكونات React هي قطع برمجية قابلة لإعادة الاستخدام لواجهة المستخدم. يتم تعريفها كدوال JavaScript تقوم بإرجاع JSX الذي يمثل واجهات HTML داخل لغة JavaScript.'
                },
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                quiz: [
                    {
                        id: 'q-react-1',
                        text: {
                            en: 'What does a React component return?',
                            ar: 'ماذا ترجع مكونات React (Components)؟'
                        },
                        options: {
                            en: ['A JSON configuration file', 'A JSX element representing UI', 'A Direct SQL Query', 'A Text File'],
                            ar: ['ملف إعدادات JSON', 'عنصر JSX يمثل واجهة المستخدم', 'استعلام SQL مباشر', 'ملف نصي عادي']
                        },
                        correctAnswer: 1
                    }
                ]
            },
            {
                id: 'react-l2',
                title: {
                    en: '2. Understanding React State',
                    ar: '2. فهم حالة المكونات (React State)'
                },
                content: {
                    en: 'State represents the dynamic, reactive data stored inside a component. When state values change, React automatically re-renders the component to reflect updates.',
                    ar: 'تمثل الـ State البيانات الديناميكية والتفاعلية المخزنة داخل المكون. عندما تتغير قيمة الـ State، تقوم React تلقائياً بإعادة رسم المكون وتحديث الشاشة.'
                },
                videoUrl: 'https://www.w3schools.com/html/movie.mp4',
                quiz: [
                    {
                        id: 'q-react-2',
                        text: {
                            en: 'Why is state used in React?',
                            ar: 'لماذا تُستخدم الـ State في React؟'
                        },
                        options: {
                            en: ['To perform database queries', 'To handle dynamic/reactive data changes in the UI', 'To link stylesheets', 'To route pages'],
                            ar: ['لإجراء استعلامات قواعد البيانات', 'التحكم بالبيانات الديناميكية والتفاعلية وتحديث الواجهة', 'لربط ملفات التنسيق الخارجي', 'لتوجيه الصفحات والمواقع']
                        },
                        correctAnswer: 1
                    }
                ]
            }
        ],
        flashcards: []
    }
];

const fallbackFlashcards: Flashcard[] = [
    {
        id: 'fc-1',
        courseId: 'react-101',
        question: {
            en: 'What is the Virtual DOM?',
            ar: 'ما هو الـ Virtual DOM؟'
        },
        answer: {
            en: 'A lightweight JavaScript representation of the real DOM. React uses it to diff changes and patch only modified elements, accelerating rendering.',
            ar: 'تمثيل برمجى خفيف للـ DOM الحقيقي في الذاكرة. تستخدمه React لمعرفة الفروقات وتحديث الأجزاء المتغيرة فقط مما يسرع عملية العرض.'
        },
        repetitions: 0,
        easeFactor: 2.5,
        interval: 0,
        nextReviewDue: 0
    },
    {
        id: 'fc-2',
        courseId: 'react-101',
        question: {
            en: 'What is a Pure Component in React?',
            ar: 'ما هو الـ Pure Component في React؟'
        },
        answer: {
            en: 'A component that returns the exact same UI output for the same props and state, avoiding redundant re-renders.',
            ar: 'مكون يقوم بإرجاع نفس واجهة المستخدم تماماً طالما أن الـ props والـ state لم تتغير، مما يمنع عمليات إعادة التحديث غير الضرورية.'
        },
        repetitions: 0,
        easeFactor: 2.5,
        interval: 0,
        nextReviewDue: 0
    }
];

// Map course flashcards in fallback
fallbackCourses[0].flashcards = fallbackFlashcards;

const parseBilingualClient = (value: any): { en: string; ar: string } => {
    if (!value) return { en: '', ar: '' };
    if (typeof value === 'object' && value !== null) {
        return { en: value.en || '', ar: value.ar || '' };
    }
    if (typeof value === 'string') {
        try {
            if (value.startsWith('{')) {
                const parsed = JSON.parse(value);
                return parseBilingualClient(parsed);
            }
        } catch (e) {}
        return { en: value, ar: value };
    }
    return { en: '', ar: '' };
};

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Theme
            isDarkMode: false,
            toggleDarkMode: () => set((state) => {
                const newMode = !state.isDarkMode;
                if (newMode) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                return { isDarkMode: newMode };
            }),

            // Localization
            lang: 'ar', // Default to Arabic
            toggleLanguage: () => set((state) => {
                const nextLang = state.lang === 'ar' ? 'en' : 'ar';
                document.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
                return { lang: nextLang };
            }),

            // Authentication
            isAuthenticated: false,
            toasts: [],
            showToast: (message, type = 'info') => {
                const id = Math.random().toString(36).substring(2, 9);
                set((state) => ({
                    toasts: [...state.toasts, { id, message, type }]
                }));
                setTimeout(() => {
                    get().removeToast(id);
                }, 4000);
            },
            removeToast: (id) => set((state) => ({
                toasts: state.toasts.filter(t => t.id !== id)
            })),

            user: {
                firstName: '',
                lastName: '',
                email: '',
                bio: ''
            },
            updateUser: (updatedUser) => set((state) => ({ user: { ...state.user, ...updatedUser } })),

            checkAuth: async () => {
                const token = localStorage.getItem('token');
                if (!token) return;
                try {
                    const res = await api.auth.getProfile();
                    const dbUser = res.data;
                    set({
                        isAuthenticated: true,
                        xp: dbUser.xp,
                        level: dbUser.level,
                        badges: dbUser.badges || [],
                        completedLessons: dbUser.completedLessons || [],
                        user: {
                            firstName: dbUser.name.split(' ')[0] || '',
                            lastName: dbUser.name.split(' ').slice(1).join(' ') || '',
                            email: dbUser.email,
                            role: dbUser.role,
                            isApproved: dbUser.isApproved,
                            assignedTeacherId: dbUser.assignedTeacherId,
                            assignedTeacher: dbUser.assignedTeacher,
                            bio: 'متصل بقاعدة البيانات السحابية.',
                        }
                    });
                    await get().loadCourses();
                } catch (err) {
                    console.warn('API getProfile failed. Clearing session.', err);
                    localStorage.removeItem('token');
                    set({ isAuthenticated: false, user: { firstName: '', lastName: '', email: '', bio: '' } });
                }
            },

            login: async (email, password) => {
                const finalEmail = email || 'teacher@houseofwisdom.com';
                const finalPassword = password || 'teacher123';
                
                try {
                    const res = await api.auth.login({ email: finalEmail, password: finalPassword });
                    const { user: dbUser, token } = res.data;
                    
                    localStorage.setItem('token', token);
                    set({
                        isAuthenticated: true,
                        xp: dbUser.xp,
                        level: dbUser.level,
                        badges: dbUser.badges || [],
                        completedLessons: dbUser.completedLessons || [],
                        user: {
                            firstName: dbUser.name.split(' ')[0] || '',
                            lastName: dbUser.name.split(' ').slice(1).join(' ') || '',
                            email: dbUser.email,
                            role: dbUser.role,
                            isApproved: dbUser.isApproved,
                            assignedTeacherId: dbUser.assignedTeacherId,
                            assignedTeacher: dbUser.assignedTeacher,
                            bio: 'متصل بقاعدة بيانات بيت الحكمة السحابية.',
                        }
                    });
                    await get().loadCourses();
                    get().showToast(get().lang === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!', 'success');
                } catch (err) {
                    console.error('API login failed:', err);
                    get().showToast(get().lang === 'ar' ? 'فشل تسجيل الدخول: البريد الإلكتروني أو كلمة المرور غير صحيحة أو السيرفر غير متصل' : 'Login failed: Invalid credentials or server is offline', 'error');
                    throw err;
                }
            },

            register: async (name, email, password, role = 'student', assignedTeacherId = null) => {
                try {
                    const res = await api.auth.register({ name, email, password, role, assignedTeacherId });
                    const { user: dbUser, token } = res.data;
                    
                    localStorage.setItem('token', token);
                    set({
                        isAuthenticated: true,
                        xp: dbUser.xp,
                        level: dbUser.level,
                        badges: dbUser.badges || [],
                        completedLessons: dbUser.completedLessons || [],
                        user: {
                            firstName: dbUser.name.split(' ')[0] || '',
                            lastName: dbUser.name.split(' ').slice(1).join(' ') || '',
                            email: dbUser.email,
                            role: dbUser.role,
                            isApproved: dbUser.isApproved,
                            assignedTeacherId: dbUser.assignedTeacherId,
                            assignedTeacher: dbUser.assignedTeacher,
                            bio: 'حساب مسجل سحابياً بنجاح.',
                        }
                    });
                    await get().loadCourses();
                    get().showToast(get().lang === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!', 'success');
                } catch (err) {
                    console.error('API registration failed:', err);
                    get().showToast(get().lang === 'ar' ? 'فشل إنشاء الحساب: البريد الإلكتروني مستخدم بالفعل أو السيرفر غير متصل' : 'Registration failed: Email already in use or server is offline', 'error');
                    throw err;
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                set({
                    isAuthenticated: false,
                    xp: 0,
                    level: 1,
                    badges: [],
                    completedLessons: [],
                    notes: {},
                    user: { firstName: '', lastName: '', email: '', bio: '', role: undefined, isApproved: undefined, assignedTeacherId: undefined, assignedTeacher: undefined },
                    courses: [],
                    flashcards: []
                });
                get().showToast(get().lang === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully', 'info');
            },

            // Courses
            courses: [],
            completedLessons: [],
            
            loadCourses: async () => {
                try {
                    const res = await api.courses.getAll();
                    const fetchedCourses = res.data;
                    
                    if (get().isAuthenticated) {
                        const progressRes = await api.student.getFlashcardProgress();
                        const progress = progressRes.data;
                        
                        const updatedCourses = fetchedCourses.map((c: any) => ({
                            ...c,
                            flashcards: c.flashcards.map((fc: any) => {
                                const cardProgress = progress.find((p: any) => p.id === fc.id);
                                return {
                                    ...fc,
                                    repetitions: cardProgress ? cardProgress.repetitions : 0,
                                    easeFactor: cardProgress ? cardProgress.easeFactor : 2.5,
                                    interval: cardProgress ? cardProgress.interval : 0,
                                    nextReviewDue: cardProgress ? cardProgress.nextReviewDue : 0,
                                };
                            })
                        }));
                        
                        const allFlashcards = updatedCourses.flatMap((c: any) => c.flashcards);
                        set({ 
                            courses: updatedCourses,
                            flashcards: allFlashcards 
                        });
                    } else {
                        const allFlashcards = fetchedCourses.flatMap((c: any) => c.flashcards);
                        set({ 
                            courses: fetchedCourses,
                            flashcards: allFlashcards 
                        });
                    }
                } catch (err) {
                    console.error('Error loading courses:', err);
                    set({
                        courses: fallbackCourses,
                        flashcards: fallbackFlashcards
                    });
                }
            },

            toggleLessonCompletion: async (lessonId) => {
                const state = get();
                const isCompleted = state.completedLessons.includes(lessonId);
                const nextCompleted = isCompleted
                    ? state.completedLessons.filter(id => id !== lessonId)
                    : [...state.completedLessons, lessonId];

                set({ completedLessons: nextCompleted });

                const xpToAdd = !isCompleted ? 100 : 0;

                // Sync locally first
                if (xpToAdd > 0) {
                    set({ showXPNotification: { show: true, amount: xpToAdd } });
                    
                    const expectedLevel = Math.floor((state.xp + xpToAdd) / 500) + 1;
                    if (expectedLevel > state.level) {
                        setTimeout(() => {
                            set({
                                level: expectedLevel,
                                showLevelUpNotification: { show: true, level: expectedLevel }
                            });
                        }, 600);
                    }
                    set((prev) => ({ xp: prev.xp + xpToAdd }));
                }

                let badgeToUnlock: any = null;
                const hasFirstStep = state.badges.some(b => typeof b === 'string' ? b === 'first_step' : b.key === 'first_step');
                if (!isCompleted && state.completedLessons.length === 0 && !hasFirstStep) {
                    badgeToUnlock = {
                        key: 'first_step',
                        name: 'الخطوة الأولى',
                        description: 'أكملت أول درس لك بنجاح'
                    };
                    setTimeout(() => {
                        set((prev) => ({ 
                            badges: [...prev.badges, { key: 'first_step', name: 'الخطوة الأولى', description: 'أكملت أول درس لك بنجاح' }],
                            showBadgeNotification: { show: true, badgeKey: 'first_step' } 
                        }));
                    }, 800);
                }

                try {
                    const res = await api.student.updateGamification({
                        xpToAdd,
                        completedLessons: nextCompleted,
                        badge: badgeToUnlock || undefined
                    });

                    const dbUser = res.data;
                    set({
                        xp: dbUser.xp,
                        level: dbUser.level,
                        badges: dbUser.badges || [],
                    });
                } catch (err) {
                    console.warn('API error toggling completion:', err);
                }
            },

            // Notes
            notes: {},
            loadNoteForLesson: async (lessonId) => {
                try {
                    const res = await api.student.getNote(lessonId);
                    set((state) => ({
                        notes: { ...state.notes, [lessonId]: res.data.content }
                    }));
                } catch (err) {
                    console.warn('Error loading note dynamically:', err);
                }
            },
            saveNote: async (lessonId, content) => {
                set((state) => ({
                    notes: { ...state.notes, [lessonId]: content }
                }));

                try {
                    await api.student.saveNote(parseInt(lessonId), content);
                } catch (err) {
                    console.warn('Error saving note to database:', err);
                }
            },

            // Gamification
            xp: 0,
            level: 1,
            badges: [],
            showXPNotification: null,
            showLevelUpNotification: null,
            showBadgeNotification: null,

            addXP: async (amount) => {
                const state = get();
                const newXP = state.xp + amount;
                const expectedLevel = Math.floor(newXP / 500) + 1;
                const leveledUp = expectedLevel > state.level;

                set({
                    xp: newXP,
                    showXPNotification: { show: true, amount }
                });

                if (leveledUp) {
                    setTimeout(() => {
                        set({
                            level: expectedLevel,
                            showLevelUpNotification: { show: true, level: expectedLevel }
                        });
                    }, 600);
                }

                try {
                    const res = await api.student.updateGamification({ xpToAdd: amount });
                    const dbUser = res.data;
                    
                    set({
                        xp: dbUser.xp,
                        level: dbUser.level,
                        badges: dbUser.badges || [],
                    });
                } catch (err) {
                    console.warn('Error adding XP to cloud DB, synced locally:', err);
                }
            },
            
            clearXPNotification: () => set({ showXPNotification: null }),
            clearLevelUpNotification: () => set({ showLevelUpNotification: null }),
            clearBadgeNotification: () => set({ showBadgeNotification: null }),

            // Flashcards
            simulatedTime: Date.now(),
            simulateTimeForward: (days) => set((state) => ({ 
                simulatedTime: state.simulatedTime + days * 24 * 60 * 60 * 1000 
            })),
            
            flashcards: [],
            
            rateFlashcard: async (cardId, grade) => {
                const currentStore = get();
                const targetCard = currentStore.flashcards.find(c => c.id === cardId);
                if (!targetCard) return;

                // Sync locally first using standard SM-2 algorithm
                let repetitions = targetCard.repetitions || 0;
                let easeFactor = targetCard.easeFactor || 2.5;
                let interval = targetCard.interval || 0;

                if (grade === 1) {
                    repetitions = 0;
                    interval = 0;
                    easeFactor = Math.max(1.3, easeFactor - 0.2);
                } else {
                    repetitions = repetitions + 1;
                    if (repetitions === 1) {
                        interval = 1;
                    } else if (repetitions === 2) {
                        interval = 3;
                    } else {
                        interval = Math.round(interval * easeFactor);
                    }
                    const q = grade + 1; 
                    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
                }

                const nextDueOffset = grade === 1 ? 10 * 60 * 1000 : interval * 24 * 60 * 60 * 1000;
                const nextReviewDue = currentStore.simulatedTime + nextDueOffset;

                // Update flat flashcards array in state
                const updatedCards = currentStore.flashcards.map(c => 
                    c.id === cardId 
                        ? { ...c, repetitions, easeFactor, interval, nextReviewDue, lastGrade: grade } 
                        : c
                );

                // Update inside courses state as well
                const updatedCourses = currentStore.courses.map(course => ({
                    ...course,
                    flashcards: course.flashcards.map(fc => 
                        fc.id === cardId 
                            ? { ...fc, repetitions, easeFactor, interval, nextReviewDue, lastGrade: grade }
                            : fc
                    )
                }));

                set({ 
                    flashcards: updatedCards,
                    courses: updatedCourses
                });

                // Trigger Local Gamification updates
                const xpToAdd = 15;
                set((prev) => ({ xp: prev.xp + xpToAdd, showXPNotification: { show: true, amount: xpToAdd } }));

                let badgeToUnlock: any = null;
                const hasLeitnerPro = currentStore.badges.some(b => typeof b === 'string' ? b === 'leitner_pro' : b.key === 'leitner_pro');
                if (currentStore.badges.length < 5 && !hasLeitnerPro) {
                    badgeToUnlock = {
                        key: 'leitner_pro',
                        name: 'محترف التكرار',
                        description: 'راجعت 5 بطاقات استذكار تعليمية'
                    };
                    setTimeout(() => {
                        set((prev) => ({ 
                            badges: [...prev.badges, { key: 'leitner_pro', name: 'محترف التكرار', description: 'راجعت 5 بطاقات استذكار تعليمية' }],
                            showBadgeNotification: { show: true, badgeKey: 'leitner_pro' } 
                        }));
                    }, 1000);
                }

                try {
                    // Send rating to backend database
                    const res = await api.student.rateFlashcard(parseInt(cardId), grade);
                    const savedProgress = res.data;
                    
                    // Sync backend SM-2 progress metrics
                    const finalCards = get().flashcards.map(c => 
                        c.id === cardId 
                            ? { 
                                ...c, 
                                repetitions: savedProgress.repetitions, 
                                easeFactor: savedProgress.easeFactor, 
                                interval: savedProgress.interval, 
                                nextReviewDue: savedProgress.nextReviewDue,
                              } 
                            : c
                    );
                    
                    const finalCourses = get().courses.map(course => ({
                        ...course,
                        flashcards: course.flashcards.map(fc => 
                            fc.id === cardId 
                                ? { 
                                    ...fc, 
                                    repetitions: savedProgress.repetitions, 
                                    easeFactor: savedProgress.easeFactor, 
                                    interval: savedProgress.interval, 
                                    nextReviewDue: savedProgress.nextReviewDue,
                                  }
                                : fc
                        )
                    }));

                    set({ 
                        flashcards: finalCards,
                        courses: finalCourses
                    });

                    // Sync gamification on backend database
                    const gamificationRes = await api.student.updateGamification({
                        xpToAdd,
                        badge: badgeToUnlock || undefined
                    });

                    const dbUser = gamificationRes.data;
                    set({
                        xp: dbUser.xp,
                        level: dbUser.level,
                        badges: dbUser.badges || [],
                    });

                } catch (err) {
                    console.warn('API rate flashcard failed, retained local calculations.', err);
                }
            },

            addFlashcard: (courseId, question, answer) => set((state) => {
                const newCard: Flashcard = {
                    id: `fc-user-${Date.now()}`,
                    courseId,
                    question: { en: question, ar: question },
                    answer: { en: answer, ar: answer },
                    repetitions: 0,
                    easeFactor: 2.5,
                    interval: 0,
                    nextReviewDue: 0
                };
                return { flashcards: [...state.flashcards, newCard] };
            }),

            // Teacher Panel Actions
            teacherStats: null,
            loadTeacherStats: async () => {
                try {
                    const res = await api.teacher.getStats();
                    set({ teacherStats: res.data });
                } catch (err) {
                    console.error('Error loading teacher stats:', err);
                }
            },
            createCourseAction: async (courseData) => {
                try {
                    const res = await api.courses.create(courseData);
                    await get().loadCourses();
                    return res.data;
                } catch (err) {
                    console.error('Error creating course:', err);
                    throw err;
                }
            },
            updateCourseAction: async (courseId, courseData) => {
                try {
                    const res = await api.courses.update(courseId, courseData);
                    await get().loadCourses();
                    return res.data;
                } catch (err) {
                    console.error('Error updating course:', err);
                    throw err;
                }
            },
            deleteCourseAction: async (courseId) => {
                try {
                    await api.courses.delete(courseId);
                    await get().loadCourses();
                    get().showToast(get().lang === 'ar' ? 'تم حذف الدورة بنجاح' : 'Course deleted successfully', 'success');
                } catch (err) {
                    console.error('Error deleting course:', err);
                    get().showToast(get().lang === 'ar' ? 'فشل حذف الدورة: السيرفر غير متصل' : 'Failed to delete course: Server is offline', 'error');
                    throw err;
                }
            },
            addLessonAction: async (courseId, lessonData) => {
                try {
                    const res = await api.courses.addLesson(courseId, lessonData);
                    await get().loadCourses();
                    get().showToast(get().lang === 'ar' ? 'تم إضافة الدرس بنجاح!' : 'Lesson added successfully!', 'success');
                    return res.data;
                } catch (err) {
                    console.error('Error adding lesson:', err);
                    get().showToast(get().lang === 'ar' ? 'فشل إضافة الدرس: السيرفر غير متصل' : 'Failed to add lesson: Server is offline', 'error');
                    throw err;
                }
            },
            updateLessonAction: async (lessonId, lessonData) => {
                try {
                    const res = await api.courses.updateLesson(lessonId, lessonData);
                    await get().loadCourses();
                    get().showToast(get().lang === 'ar' ? 'تم تحديث الدرس بنجاح' : 'Lesson updated successfully', 'success');
                    return res.data;
                } catch (err) {
                    console.error('Error updating lesson:', err);
                    get().showToast(get().lang === 'ar' ? 'فشل تحديث الدرس: السيرفر غير متصل' : 'Failed to update lesson: Server is offline', 'error');
                    throw err;
                }
            },
            deleteLessonAction: async (lessonId) => {
                try {
                    await api.courses.deleteLesson(lessonId);
                    await get().loadCourses();
                    get().showToast(get().lang === 'ar' ? 'تم حذف الدرس بنجاح' : 'Lesson deleted successfully', 'success');
                } catch (err) {
                    console.error('Error deleting lesson:', err);
                    get().showToast(get().lang === 'ar' ? 'فشل حذف الدرس: السيرفر غير متصل' : 'Failed to delete lesson: Server is offline', 'error');
                    throw err;
                }
            },
            saveQuizAction: async (lessonId, quizData) => {
                try {
                    const res = await api.courses.saveQuiz(lessonId, quizData);
                    await get().loadCourses();
                    get().showToast(get().lang === 'ar' ? 'تم حفظ الاختبار بنجاح!' : 'Quiz saved successfully!', 'success');
                    return res.data;
                } catch (err) {
                    console.error('Error saving quiz:', err);
                    get().showToast(get().lang === 'ar' ? 'فشل حفظ الاختبار: السيرفر غير متصل' : 'Failed to save quiz: Server is offline', 'error');
                    throw err;
                }
            },

            // Interactive Onboarding Guide
            isGuideOpen: false,
            activeGuideStep: 1,
            openGuide: () => set({ isGuideOpen: true, activeGuideStep: 1 }),
            closeGuide: () => set({ isGuideOpen: false }),
            setGuideStep: (step) => set({ activeGuideStep: step }),

            // Approved & Pending Teachers state and actions
            approvedTeachers: [],
            pendingTeachers: [],

            loadApprovedTeachers: async () => {
                try {
                    const res = await api.auth.getApprovedTeachers();
                    set({ approvedTeachers: res.data });
                } catch (err) {
                    console.error('Error loading approved teachers:', err);
                    get().showToast(get().lang === 'ar' ? 'خطأ في تحميل المعلمين المعتمدين' : 'Error loading approved teachers', 'error');
                }
            },

            loadPendingTeachers: async () => {
                try {
                    const res = await api.admin.getPendingTeachers();
                    set({ pendingTeachers: res.data });
                } catch (err) {
                    console.error('Error loading pending teachers:', err);
                    get().showToast(get().lang === 'ar' ? 'خطأ في تحميل طلبات المعلمين' : 'Error loading pending teachers', 'error');
                }
            },

            approveTeacherAction: async (id) => {
                try {
                    await api.admin.approveTeacher(id);
                    await get().loadPendingTeachers();
                    await get().loadApprovedTeachers();
                    get().showToast(get().lang === 'ar' ? 'تم الموافقة على المعلم وتفعيل حسابه!' : 'Teacher approved and activated successfully!', 'success');
                } catch (err) {
                    console.error('Error approving teacher:', err);
                    get().showToast(get().lang === 'ar' ? 'فشل تفعيل المعلم: السيرفر غير متصل' : 'Failed to approve teacher: Server is offline', 'error');
                    throw err;
                }
            },

            rejectTeacherAction: async (id) => {
                try {
                    await api.admin.rejectTeacher(id);
                    await get().loadPendingTeachers();
                    get().showToast(get().lang === 'ar' ? 'تم رفض طلب المعلم بنجاح' : 'Teacher request rejected successfully', 'info');
                } catch (err) {
                    console.error('Error rejecting teacher:', err);
                    get().showToast(get().lang === 'ar' ? 'فشل رفض المعلم: السيرفر غير متصل' : 'Failed to reject teacher: Server is offline', 'error');
                    throw err;
                }
            }
        }),
        {
            name: 'lms-storage-bilingual',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    document.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
                    if (state.isDarkMode) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                }
            }
        }
    )
);
