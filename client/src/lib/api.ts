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
    // getProfile: () => api.get('/auth/me'), // Use store for now
};

export const courses = {
    getAll: () => api.get('/courses'),
    getById: (id: string) => api.get(`/courses/${id}`),
    create: (courseData: any) => api.post('/courses', courseData),
};

export default api;
