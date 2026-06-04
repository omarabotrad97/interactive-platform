import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from '../lib/api';

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
    register: (name: string, email: string, password: string) => Promise<void>;

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
    badges: string[];
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
}

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
                            bio: '',
                        }
                    });
                    await get().loadCourses();
                } catch (err) {
                    console.error('Session expired or error checking auth:', err);
                    localStorage.removeItem('token');
                    set({ isAuthenticated: false });
                }
            },

            login: async (email, password) => {
                const finalEmail = email || 'teacher@houseofwisdom.com';
                const finalPassword = password || 'teacher123';
                
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
                        bio: '',
                    }
                });
                await get().loadCourses();
            },

            register: async (name, email, password) => {
                const res = await api.auth.register({ name, email, password });
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
                        bio: '',
                    }
                });
                await get().loadCourses();
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
                    user: { firstName: '', lastName: '', email: '', bio: '' }
                });
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
                }
            },

            toggleLessonCompletion: async (lessonId) => {
                const state = get();
                const isCompleted = state.completedLessons.includes(lessonId);
                const nextCompleted = isCompleted
                    ? state.completedLessons.filter(id => id !== lessonId)
                    : [...state.completedLessons, lessonId];

                set({ completedLessons: nextCompleted });

                try {
                    const xpToAdd = !isCompleted ? 100 : 0;
                    
                    let badgeToUnlock: any = null;
                    if (!isCompleted && state.completedLessons.length === 0 && !state.badges.includes('first_step')) {
                        badgeToUnlock = {
                            key: 'first_step',
                            name: 'الخطوة الأولى',
                            description: 'أكملت أول درس لك بنجاح'
                        };
                    }

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

                    if (xpToAdd > 0) {
                        set({ showXPNotification: { show: true, amount: xpToAdd } });
                        
                        const expectedLevel = Math.floor(dbUser.xp / 500) + 1;
                        if (expectedLevel > state.level) {
                            setTimeout(async () => {
                                await api.student.updateGamification({ level: expectedLevel });
                                set({
                                    level: expectedLevel,
                                    showLevelUpNotification: { show: true, level: expectedLevel }
                                });
                            }, 600);
                        }
                    }

                    if (badgeToUnlock) {
                        setTimeout(() => {
                            set({ showBadgeNotification: { show: true, badgeKey: 'first_step' } });
                        }, 800);
                    }
                } catch (err) {
                    console.error('Error toggling lesson completion:', err);
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
                    console.error('Error loading note:', err);
                }
            },
            saveNote: async (lessonId, content) => {
                set((state) => ({
                    notes: { ...state.notes, [lessonId]: content }
                }));
                try {
                    await api.student.saveNote(parseInt(lessonId), content);
                } catch (err) {
                    console.error('Error saving note:', err);
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
                try {
                    const state = get();
                    const res = await api.student.updateGamification({ xpToAdd: amount });
                    const dbUser = res.data;
                    
                    set({
                        xp: dbUser.xp,
                        showXPNotification: { show: true, amount }
                    });

                    const expectedLevel = Math.floor(dbUser.xp / 500) + 1;
                    if (expectedLevel > state.level) {
                        setTimeout(async () => {
                            await api.student.updateGamification({ level: expectedLevel });
                            set({
                                level: expectedLevel,
                                showLevelUpNotification: { show: true, level: expectedLevel }
                            });
                        }, 600);
                    }
                } catch (err) {
                    console.error('Error adding XP:', err);
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
                try {
                    const res = await api.student.rateFlashcard(parseInt(cardId), grade);
                    const savedProgress = res.data;
                    
                    const updatedCards = currentStore.flashcards.map(c => 
                        c.id === cardId 
                            ? { 
                                ...c, 
                                repetitions: savedProgress.repetitions, 
                                easeFactor: savedProgress.easeFactor, 
                                interval: savedProgress.interval, 
                                nextReviewDue: savedProgress.nextReviewDue,
                                lastGrade: grade 
                              } 
                            : c
                    );

                    const updatedCourses = currentStore.courses.map(course => ({
                        ...course,
                        flashcards: course.flashcards.map(fc => 
                            fc.id === cardId 
                                ? { 
                                    ...fc, 
                                    repetitions: savedProgress.repetitions, 
                                    easeFactor: savedProgress.easeFactor, 
                                    interval: savedProgress.interval, 
                                    nextReviewDue: savedProgress.nextReviewDue,
                                    lastGrade: grade 
                                  }
                                : fc
                        )
                    }));

                    set({ 
                        flashcards: updatedCards,
                        courses: updatedCourses
                    });

                    const xpToAdd = 15;
                    
                    let badgeToUnlock: any = null;
                    if (currentStore.badges.length < 5 && !currentStore.badges.includes('leitner_pro')) {
                        badgeToUnlock = {
                            key: 'leitner_pro',
                            name: 'محترف التكرار',
                            description: 'راجعت 5 بطاقات استذكار تعليمية'
                        };
                    }

                    const gamificationRes = await api.student.updateGamification({
                        xpToAdd,
                        badge: badgeToUnlock || undefined
                    });

                    const dbUser = gamificationRes.data;
                    set({
                        xp: dbUser.xp,
                        level: dbUser.level,
                        badges: dbUser.badges || [],
                        showXPNotification: { show: true, amount: xpToAdd }
                    });

                    const expectedLevel = Math.floor(dbUser.xp / 500) + 1;
                    if (expectedLevel > currentStore.level) {
                        setTimeout(async () => {
                            await api.student.updateGamification({ level: expectedLevel });
                            set({
                                level: expectedLevel,
                                showLevelUpNotification: { show: true, level: expectedLevel }
                            });
                        }, 600);
                    }

                    if (badgeToUnlock) {
                        setTimeout(() => {
                            set({ showBadgeNotification: { show: true, badgeKey: 'leitner_pro' } });
                        }, 1000);
                    }
                } catch (err) {
                    console.error('Error rating flashcard:', err);
                }
            },

            addFlashcard: (courseId, question, answer) => set((state) => {
                // Keep local-only adding for student-created cards as a fallback
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
