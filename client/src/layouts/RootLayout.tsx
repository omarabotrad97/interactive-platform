import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function RootLayout() {
    const { lang } = useStore();

    useEffect(() => {
        document.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }, [lang]);

    return (
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200 ${
            lang === 'ar' ? 'font-cairo' : 'font-outfit'
        }`}>
            <Outlet />
        </div>
    );
}

