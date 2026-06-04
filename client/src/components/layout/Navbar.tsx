import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';


export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const navLinks = [
        { label: 'Features', href: '#features' },
        { label: 'Courses', href: '#courses' },
        { label: 'Testimonials', href: '#testimonials' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
                        <BookOpen className="w-6 h-6" />
                        <span>LMS Platform</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/auth/login">
                            <Button variant="ghost">Sign In</Button>
                        </Link>
                        <Link to="/auth/signup">
                            <Button>Get Started</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                    <div className="px-4 py-6 space-y-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="block text-base font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="pt-4 flex flex-col gap-3">
                            <Button variant="outline" className="w-full justify-center" onClick={() => navigate('/auth/login')}>
                                Sign In
                            </Button>
                            <Button className="w-full justify-center" onClick={() => navigate('/auth/signup')}>
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
