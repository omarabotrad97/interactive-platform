import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X, Languages } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { lang, toggleLanguage } = useStore();

    const navLinks = [
        { labelKey: 'featuresLink' as const, href: '#features' },
        { labelKey: 'coursesLink' as const, href: '#courses' },
        { labelKey: 'testimonialsLink' as const, href: '#testimonials' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Brand Name */}
                    <Link to="/" className="flex items-center gap-2 font-black text-xl text-emerald-600 dark:text-emerald-400">
                        <BookOpen className="w-6 h-6" />
                        <span>{getTranslation(lang, 'home')}</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.labelKey}
                                href={link.href}
                                className="text-sm font-bold text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
                            >
                                {getTranslation(lang, link.labelKey)}
                            </a>
                        ))}
                    </div>

                    {/* Actions: Lang switcher, sign in, sign up */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Switcher */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 px-3 py-1.5 border border-gray-250/20 hover:border-emerald-350 dark:border-gray-800 rounded-full text-xs font-bold text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 active:scale-95 transition-all shadow-sm bg-white dark:bg-gray-900"
                        >
                            <Languages className="w-4 h-4" />
                            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
                        </button>

                        <Link to="/auth/login">
                            <Button variant="ghost" className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                                {getTranslation(lang, 'login')}
                            </Button>
                        </Link>
                        
                        <Link to="/auth/signup">
                            <Button className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/10">
                                {getTranslation(lang, 'getStarted')}
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        {/* Mobile Language Switcher */}
                        <button
                            onClick={toggleLanguage}
                            className="p-2 border border-gray-250/25 dark:border-gray-800 rounded-full text-gray-500 hover:text-emerald-600"
                        >
                            <Languages className="w-4 h-4" />
                        </button>

                        <button
                            className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 animate-fade-in-down">
                    <div className="px-4 py-6 space-y-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.labelKey}
                                href={link.href}
                                className="block text-base font-bold text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {getTranslation(lang, link.labelKey)}
                            </a>
                        ))}
                        
                        <div className="pt-4 flex flex-col gap-3">
                            <Button 
                                variant="outline" 
                                className="w-full justify-center text-sm font-bold border-gray-200 dark:border-gray-800" 
                                onClick={() => { setIsMenuOpen(false); navigate('/auth/login'); }}
                            >
                                {getTranslation(lang, 'login')}
                            </Button>
                            
                            <Button 
                                className="w-full justify-center text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl" 
                                onClick={() => { setIsMenuOpen(false); navigate('/auth/signup'); }}
                            >
                                {getTranslation(lang, 'getStarted')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
