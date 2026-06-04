import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import DashboardPage from './pages/dashboard/DashboardPage';

// Placeholder for now
// const DashboardPage = () => <div className="p-10"><h1>Dashboard</h1><p>Protected content.</p></div>;

// import PlaceholderPage from './pages/dashboard/PlaceholderPage';
import CoursesPage from './pages/dashboard/CoursesPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import SettingsPage from './pages/dashboard/SettingsPage';
import CoursePlayerPage from './pages/dashboard/CoursePlayerPage';

import ProtectedRoute from './components/ProtectedRoute';

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
        ],
    },
]);
