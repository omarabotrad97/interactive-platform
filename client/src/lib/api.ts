import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Add a request interceptor to add the JWT token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const auth = {
    register: (userData: any) => api.post('/auth/register', userData),
    login: (credentials: any) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/me'),
};

export const courses = {
    getAll: () => api.get('/courses'),
    getById: (id: string) => api.get(`/courses/${id}`),
    create: (courseData: any) => api.post('/courses', courseData),
    update: (id: string, courseData: any) => api.put(`/courses/${id}`, courseData),
    delete: (id: string) => api.delete(`/courses/${id}`),
    addLesson: (courseId: string, lessonData: any) => api.post(`/courses/${courseId}/lessons`, lessonData),
    updateLesson: (lessonId: string, lessonData: any) => api.put(`/courses/lessons/${lessonId}`, lessonData),
    deleteLesson: (lessonId: string) => api.delete(`/courses/lessons/${lessonId}`),
    saveQuiz: (lessonId: string, quizData: any) => api.post(`/courses/lessons/${lessonId}/quiz`, quizData),
};

export const teacher = {
    getStats: () => api.get('/teacher/stats'),
};

export const student = {
    getNote: (lessonId: string) => api.get(`/student/notes/${lessonId}`),
    saveNote: (lessonId: number, content: string) => api.post('/student/notes', { lessonId, content }),
    updateGamification: (data: { xpToAdd?: number; level?: number; badge?: any; completedLessons?: string[] }) => api.post('/student/gamification', data),
    getFlashcardProgress: () => api.get('/student/flashcards/progress'),
    rateFlashcard: (cardId: number, grade: number) => api.post('/student/flashcards/rate', { cardId, grade }),
};

export default api;
