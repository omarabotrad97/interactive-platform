import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
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
    lessons: Lesson[];
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
    login: () => void;
    logout: () => void;
    user: User;
    updateUser: (user: Partial<User>) => void;

    // Courses & Lessons Completion
    courses: Course[];
    completedLessons: string[];
    toggleLessonCompletion: (lessonId: string) => void;

    // Notes
    notes: Record<string, string>; // lessonId -> content
    saveNote: (lessonId: string, content: string) => void;

    // Gamification
    xp: number;
    level: number;
    badges: string[];
    addXP: (amount: number) => void;
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
    rateFlashcard: (cardId: string, grade: 1 | 2 | 3 | 4) => void;
    addFlashcard: (courseId: string, question: string, answer: string) => void;

    // Interactive Onboarding Guide
    isGuideOpen: boolean;
    activeGuideStep: number;
    openGuide: () => void;
    closeGuide: () => void;
    setGuideStep: (step: number) => void;
}

// Initial mock courses populated in bilingual format
const mockCourses: Course[] = [
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
        ]
    },
    {
        id: 'ai-prompting',
        title: {
            en: 'AI & Prompt Engineering',
            ar: 'الذكاء الاصطناعي وهندسة الأوامر'
        },
        description: {
            en: 'Master the art of prompting LLMs, understanding context windows, zero-shot, and chain-of-thought engineering.',
            ar: 'احترف مهارة توجيه النماذج اللغوية الضخمة وفهم سياق النوافذ، التلقين الصِفري وسلاسل الأفكار المنطقية.'
        },
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
        lessons: [
            {
                id: 'ai-l1',
                title: {
                    en: '1. Fundamentals of LLMs',
                    ar: '1. أساسيات النماذج اللغوية الضخمة'
                },
                content: {
                    en: 'Large Language Models (LLMs) are deep learning neural networks trained on billions of parameters to predict the most likely next word in a sequence of text.',
                    ar: 'النماذج اللغوية الضخمة (LLMs) هي شبكات عصبونية عميقة مدربة على مليارات المعاملات البرمجية للتنبؤ بالكلمة التالية الأكثر احتمالاً في نص معين.'
                },
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                quiz: [
                    {
                        id: 'q-ai-1',
                        text: {
                            en: 'What is the primary mechanism of an LLM prediction?',
                            ar: 'ما هي الآلية الأساسية لتنبؤات النموذج اللغوي الضخم؟'
                        },
                        options: {
                            en: ['Compiling C++ code', 'Predicting the most likely next word in a sequence', 'Running a spreadsheet macro', 'Optimizing database tables'],
                            ar: ['ترجمة وتجميع كود لغة C++', 'التنبؤ بالكلمة التالية الأكثر احتمالاً في النص المتتابع', 'تشغيل وحدات ماكرو في الجداول', 'تحسين أداء جداول قواعد البيانات']
                        },
                        correctAnswer: 1
                    }
                ]
            }
        ]
    }
];

// Initial mock flashcards
const mockFlashcards: Flashcard[] = [
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
    },
    {
        id: 'fc-3',
        courseId: 'ai-prompting',
        question: {
            en: 'What is Zero-Shot Prompting?',
            ar: 'ما هو التلقين الصفري (Zero-Shot)؟'
        },
        answer: {
            en: 'Asking an LLM to complete a task directly without giving it any prior examples in the prompt.',
            ar: 'أن تطلب من النموذج إنجاز مهمة معينة مباشرة دون تزويده بأي أمثلة توضيحية مسبقة في نص الطلب.'
        },
        repetitions: 0,
        easeFactor: 2.5,
        interval: 0,
        nextReviewDue: 0
    }
];

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
            lang: 'ar', // Default to Arabic as requested primarily
            toggleLanguage: () => set((state) => {
                const nextLang = state.lang === 'ar' ? 'en' : 'ar';
                document.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
                return { lang: nextLang };
            }),

            // Authentication
            isAuthenticated: false,
            login: () => set({ isAuthenticated: true }),
            logout: () => set({ isAuthenticated: false }),
            user: {
                firstName: 'أحمد',
                lastName: 'المنصوري',
                email: 'ahmed.dev@example.com',
                bio: 'مطور برمجيات طموح وشغوف بتعلم كل ما هو جديد ومبتكر في عالم الويب والذكاء الاصطناعي.'
            },
            updateUser: (updatedUser) => set((state) => ({ user: { ...state.user, ...updatedUser } })),

            // Courses
            courses: mockCourses,
            completedLessons: [],
            toggleLessonCompletion: (lessonId) => {
                const state = get();
                const isCompleted = state.completedLessons.includes(lessonId);
                const nextCompleted = isCompleted
                    ? state.completedLessons.filter(id => id !== lessonId)
                    : [...state.completedLessons, lessonId];

                set({ completedLessons: nextCompleted });

                // Gain XP if completing a new lesson
                if (!isCompleted) {
                    state.addXP(100);

                    // Unlock First Steps badge if it is the first lesson completed
                    if (state.completedLessons.length === 0 && !state.badges.includes('first_step')) {
                        setTimeout(() => {
                            set(prev => ({
                                badges: [...prev.badges, 'first_step'],
                                showBadgeNotification: { show: true, badgeKey: 'first_step' }
                            }));
                        }, 800);
                    }
                }
            },

            // Notes
            notes: {},
            saveNote: (lessonId, content) => set((state) => ({
                notes: { ...state.notes, [lessonId]: content }
            })),

            // Gamification
            xp: 0,
            level: 1,
            badges: [],
            showXPNotification: null,
            showLevelUpNotification: null,
            showBadgeNotification: null,

            addXP: (amount) => {
                const currentStore = get();
                const newXP = currentStore.xp + amount;
                // Threshold for level up: 500 XP per level
                const expectedLevel = Math.floor(newXP / 500) + 1;
                const leveledUp = expectedLevel > currentStore.level;

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
            },
            clearXPNotification: () => set({ showXPNotification: null }),
            clearLevelUpNotification: () => set({ showLevelUpNotification: null }),
            clearBadgeNotification: () => set({ showBadgeNotification: null }),

            // Flashcards
            simulatedTime: Date.now(),
            simulateTimeForward: (days) => set((state) => ({ 
                simulatedTime: state.simulatedTime + days * 24 * 60 * 60 * 1000 
            })),
            flashcards: mockFlashcards,
            rateFlashcard: (cardId, grade) => {
                const currentStore = get();
                const targetCard = currentStore.flashcards.find(c => c.id === cardId);
                if (!targetCard) return;

                let repetitions = targetCard.repetitions || 0;
                let easeFactor = targetCard.easeFactor || 2.5;
                let interval = targetCard.interval || 0;

                if (grade === 1) {
                    // Again / Reset
                    repetitions = 0;
                    interval = 0; // Show in 10 mins instead of days
                    easeFactor = Math.max(1.3, easeFactor - 0.2);
                } else {
                    // Correct answers (Hard=2, Good=3, Easy=4)
                    repetitions = repetitions + 1;
                    if (repetitions === 1) {
                        interval = grade === 2 ? 1 : grade === 3 ? 1 : 2; // Days
                    } else if (repetitions === 2) {
                        interval = grade === 2 ? 2 : grade === 3 ? 6 : 8; // Days
                    } else {
                        const multiplier = grade === 2 ? 1.2 : grade === 3 ? easeFactor : easeFactor * 1.3;
                        interval = Math.ceil(interval * multiplier);
                    }

                    // Adjust Ease Factor (SM2 formula)
                    const q = grade + 1; 
                    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
                }

                // Spacing offset math: Again = 10 mins, others = interval in days
                const nextDueOffset = grade === 1 
                    ? 10 * 60 * 1000 // 10 minutes
                    : interval * 24 * 60 * 60 * 1000; // interval in days

                const nextReviewDue = currentStore.simulatedTime + nextDueOffset;

                const updatedCards = currentStore.flashcards.map(c => 
                    c.id === cardId 
                        ? { ...c, repetitions, easeFactor, interval, nextReviewDue, lastGrade: grade } 
                        : c
                );

                set({ flashcards: updatedCards });

                // Add XP for reviewing flashcards
                currentStore.addXP(15);

                // Unlock Leitner Pro badge on reviewing cards
                if (currentStore.badges.length < 4 && !currentStore.badges.includes('leitner_pro')) {
                    setTimeout(() => {
                        set(prev => ({
                            badges: [...prev.badges, 'leitner_pro'],
                            showBadgeNotification: { show: true, badgeKey: 'leitner_pro' }
                        }));
                    }, 1000);
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

            // Interactive Onboarding Guide
            isGuideOpen: false,
            activeGuideStep: 1,
            openGuide: () => set({ isGuideOpen: true, activeGuideStep: 1 }),
            closeGuide: () => set({ isGuideOpen: false }),
            setGuideStep: (step) => set({ activeGuideStep: step })
        }),
        {
            name: 'lms-storage-bilingual',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Reapply document settings on rehydration
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
