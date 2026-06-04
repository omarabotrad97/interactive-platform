/// <reference types="vite/client" />
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import DashboardPage from './pages/dashboard/DashboardPage';

// Import Teacher Panel components
import TeacherLayout from './layouts/TeacherLayout';
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage';
import TeacherCoursesPage from './pages/teacher/TeacherCoursesPage';
import TeacherCourseEditPage from './pages/teacher/TeacherCourseEditPage';
import TeacherStudentStatsPage from './pages/teacher/TeacherStudentStatsPage';

import CoursesPage from './pages/dashboard/CoursesPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import SettingsPage from './pages/dashboard/SettingsPage';
import CoursePlayerPage from './pages/dashboard/CoursePlayerPage';

import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <LandingPage />,
            },
            {
                path: 'auth',
                children: [
                    {
                        path: 'login',
                        element: <LoginPage />
                    },
                    {
                        path: 'signup',
                        element: <SignUpPage />
                    }
                ]
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: 'dashboard',
                        element: <DashboardLayout />,
                        children: [
                            {
                                index: true,
                                element: <DashboardPage />,
                            },
                            {
                                path: 'courses',
                                element: <CoursesPage />,
                            },
                            {
                                path: 'courses/:courseId',
                                element: <CoursePlayerPage />,
                            },
                            {
                                path: 'profile',
                                element: <ProfilePage />,
                            },
                            {
                                path: 'settings',
                                element: <SettingsPage />,
                            },
                        ]
                    }
                ]
            },
            {
                element: <RoleProtectedRoute allowedRoles={['teacher', 'admin']} />,
                children: [
                    {
                        path: 'teacher',
                        element: <TeacherLayout />,
                        children: [
                            {
                                index: true,
                                element: <TeacherDashboardPage />,
                            },
                            {
                                path: 'courses',
                                element: <TeacherCoursesPage />,
                            },
                            {
                                path: 'courses/:courseId/edit',
                                element: <TeacherCourseEditPage />,
                            },
                            {
                                path: 'students',
                                element: <TeacherStudentStatsPage />,
                            },
                        ]
                    }
                ]
            },
        ],
    },
], {
    basename: import.meta.env.BASE_URL.replace(/\/$/, "")
});
