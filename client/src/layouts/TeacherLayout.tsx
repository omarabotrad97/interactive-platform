import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, Home, LayoutDashboard, LogOut, Menu, UserCheck, X, Languages, GraduationCap, Shield } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { useStore } from '../store/useStore';
import { getTranslation } from '../lib/translations';

const teacherSidebarItems = [
    { icon: LayoutDashboard, labelEn: 'Teacher Dashboard', labelAr: 'لوحة المعلم', href: '/teacher' },
    { icon: BookOpen, labelEn: 'Manage Courses', labelAr: 'إدارة الدورات', href: '/teacher/courses' },
    { icon: UserCheck, labelEn: 'Student Stats', labelAr: 'إحصاءات الطلاب', href: '/teacher/students' },
];

export default function TeacherLayout() {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { lang, toggleLanguage, user, logout } = useStore();

    // Determine typography styles dynamically
    const bodyFont = lang === 'ar' ? 'font-cairo' : 'font-outfit';

    return (
        <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-200", bodyFont)}>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Responsive Sidebar */}
            <aside 
                className={cn(
                    "w-64 bg-white dark:bg-gray-900 fixed h-full flex flex-col z-50 transition-all duration-300 transform",
                    // RTL vs LTR layout alignments
                    lang === 'ar' 
                        ? "right-0 border-l border-emerald-100 dark:border-emerald-950/30" 
                        : "left-0 border-r border-emerald-100 dark:border-emerald-950/30",
                    // Slide translation animations
                    isSidebarOpen 
                        ? "translate-x-0" 
                        : lang === 'ar' 
                            ? "translate-x-full md:translate-x-0" 
                            : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-emerald-50 dark:border-emerald-950/20">
                    <Link to="/" className="flex items-center gap-2 font-black text-xl text-emerald-600 dark:text-emerald-400">
                        <Home className="w-5 h-5" />
                        <span>{getTranslation(lang, 'home')}</span>
                    </Link>
                    <button
                        className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Profile Card Summary */}
                <div className="p-4">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-xl mb-2 border border-emerald-100/50 dark:border-emerald-900/10">
                        <Avatar
                            fallback={`${user.firstName[0]}${user.lastName[0]}`}
                            size="md"
                            className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                        />
                        <div className="overflow-hidden">
                            <p className="text-sm font-extrabold truncate text-gray-900 dark:text-gray-100">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 truncate font-semibold uppercase tracking-wider">
                                {lang === 'ar' ? 'معلم / إداري' : 'Teacher Portal'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Navigation Link List */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {teacherSidebarItems.map((item) => {
                        const isActive = location.pathname === item.href || (item.href !== '/teacher' && location.pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border border-transparent active:scale-[0.98]",
                                    isActive
                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 font-extrabold"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {lang === 'ar' ? item.labelAr : item.labelEn}
                            </Link>
                        );
                    })}
                </nav>

                {/* Link Back to Student Learning Portal */}
                <div className="px-4 py-2 border-t border-emerald-50 dark:border-emerald-950/20">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/20 transition-all"
                    >
                        <GraduationCap className="w-4 h-4" />
                        {lang === 'ar' ? 'بوابة التعلم (طالب)' : 'Learning Portal (Student)'}
                    </Link>
                </div>

                {/* Link Back to Admin Panel for Admin Role */}
                {user.role === 'admin' && (
                    <div className="px-4 py-2 border-t border-emerald-50 dark:border-emerald-950/20">
                        <Link
                            to="/admin"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all"
                        >
                            <Shield className="w-4 h-4" />
                            {lang === 'ar' ? 'بوابة الإدارة' : 'Admin Panel'}
                        </Link>
                    </div>
                )}

                {/* Sign Out Button Footer */}
                <div className="p-4 border-t border-emerald-50 dark:border-emerald-950/20">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl"
                        onClick={logout}
                    >
                        <LogOut className={cn("w-4 h-4", lang === 'ar' ? 'ml-3' : 'mr-3')} />
                        {getTranslation(lang, 'signOut')}
                    </Button>
                </div>
            </aside>

            {/* Main Workspace Frame */}
            <main 
                className={cn(
                    "flex-1 min-h-screen transition-all duration-300 flex flex-col",
                    // Handle responsive margins on desktop based on direction RTL / LTR
                    lang === 'ar' ? "md:mr-64" : "md:ml-64"
                )}
            >
                {/* Header Navbar */}
                <header className="h-16 bg-white dark:bg-gray-900 border-b border-emerald-50 dark:border-emerald-950/20 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-colors duration-200">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="font-extrabold text-gray-800 dark:text-gray-100 text-base">
                            {lang === 'ar' 
                                ? (teacherSidebarItems.find(i => i.href === location.pathname || (i.href !== '/teacher' && location.pathname.startsWith(i.href)))?.labelAr || 'لوحة المعلم')
                                : (teacherSidebarItems.find(i => i.href === location.pathname || (i.href !== '/teacher' && location.pathname.startsWith(i.href)))?.labelEn || 'Teacher Panel')
                            }
                        </h2>
                    </div>

                    {/* Navigation Top Utility Bar */}
                    <div className="flex items-center gap-3">
                        {/* Language Switcher Button */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-full active:scale-95 transition-all shadow-sm"
                            title={lang === 'ar' ? 'English' : 'العربية'}
                        >
                            <Languages className="w-4 h-4" />
                            <span className="hidden sm:inline">{lang === 'ar' ? 'English' : 'العربية'}</span>
                        </button>
                    </div>
                </header>

                {/* Sub-page Router outlet wrapper */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
