import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, Home, LayoutDashboard, LogOut, Menu, Settings, User, X, HelpCircle, Languages, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { useStore } from '../store/useStore';
import { getTranslation } from '../lib/translations';

const sidebarItems = [
    { icon: LayoutDashboard, labelKey: 'overview' as const, href: '/dashboard' },
    { icon: BookOpen, labelKey: 'myCourses' as const, href: '/dashboard/courses' },
    { icon: User, labelKey: 'profile' as const, href: '/dashboard/profile' },
    { icon: Settings, labelKey: 'settings' as const, href: '/dashboard/settings' },
];

export default function DashboardLayout() {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { lang, toggleLanguage, user, logout, xp, level, openGuide } = useStore();

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
                        ? "right-0 border-l border-gray-200 dark:border-gray-800" 
                        : "left-0 border-r border-gray-200 dark:border-gray-800",
                    // Slide translation animations
                    isSidebarOpen 
                        ? "translate-x-0" 
                        : lang === 'ar' 
                            ? "translate-x-full md:translate-x-0" 
                            : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
                    <Link to="/" className="flex items-center gap-2 font-black text-xl text-indigo-600 dark:text-indigo-400">
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
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-850 rounded-xl mb-2">
                        <Avatar
                            fallback={`${user.firstName[0]}${user.lastName[0]}`}
                            size="md"
                            className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                        />
                        <div className="overflow-hidden">
                            <p className="text-sm font-extrabold truncate text-gray-900 dark:text-gray-100">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate font-semibold">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Navigation Link List */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border border-transparent active:scale-[0.98]",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 font-extrabold"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-850 hover:text-gray-900 dark:hover:text-gray-200"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {getTranslation(lang, item.labelKey)}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign Out Button Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl"
                        onClick={() => {
                            logout();
                        }}
                    >
                        <LogOut className={`w-4 h-4 ${lang === 'ar' ? 'ml-3' : 'mr-3'}`} />
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
                <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-colors duration-200">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="font-extrabold text-gray-800 dark:text-gray-100 text-base">
                            {getTranslation(lang, sidebarItems.find(i => i.href === location.pathname)?.labelKey || 'overview')}
                        </h2>
                    </div>

                    {/* Navigation Top Utility Bar */}
                    <div className="flex items-center gap-3">
                        
                        {/* Live XP Level Header Mini Widget */}
                        <div 
                            title={`${xp} XP`}
                            className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-indigo-950 px-3 py-1.5 rounded-full text-xs font-black shadow-sm"
                        >
                            <Trophy className="w-3.5 h-3.5 fill-current" />
                            <span>{getTranslation(lang, 'level')} {level}</span>
                        </div>

                        {/* Language Switcher Button (#guide-lang) */}
                        <button
                            id="guide-lang"
                            onClick={toggleLanguage}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-850 rounded-full active:scale-95 transition-all shadow-sm"
                            title={lang === 'ar' ? 'English' : 'العربية'}
                        >
                            <Languages className="w-4 h-4" />
                            <span className="hidden sm:inline">{lang === 'ar' ? 'English' : 'العربية'}</span>
                        </button>

                        {/* Interactive Self-Explanatory Onboarding Guide Trigger */}
                        <button
                            onClick={openGuide}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full active:scale-95 transition-all shadow-md shadow-indigo-600/10"
                        >
                            <HelpCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">{getTranslation(lang, 'guideStartBtn')}</span>
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
