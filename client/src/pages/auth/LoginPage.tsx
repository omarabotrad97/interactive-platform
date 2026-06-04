import { useNavigate, Link } from 'react-router-dom';
import { Github, Mail, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, lang, toggleLanguage } = useStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login
        login();
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 relative overflow-hidden transition-colors duration-200">
            {/* Background elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-white to-gray-50 dark:from-emerald-950/5 dark:via-gray-950 dark:to-gray-950" />
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-l from-emerald-100/10 to-transparent dark:from-emerald-900/5 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-amber-100/10 to-transparent dark:from-amber-900/5 blur-3xl opacity-50" />
            </div>

            {/* Mathematically generated repeating SVG geometric Arabesque background pattern */}
            <div className="absolute inset-0 -z-5 pointer-events-none opacity-25 dark:opacity-10">
                <svg className="absolute inset-0 w-full h-full stroke-emerald-600/10 dark:stroke-emerald-400/10 fill-none" width="100%" height="100%">
                    <pattern id="auth-arabesque" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M 50,0 L 100,50 L 50,100 L 0,50 Z" strokeWidth="0.75" />
                        <circle cx="50" cy="50" r="20" strokeWidth="0.75" />
                        <path d="M 0,0 L 100,100 M 100,0 L 0,100" strokeWidth="0.75" />
                        <polygon points="50,15 62,50 50,85 38,50" strokeWidth="0.5" />
                        <polygon points="15,50 50,62 85,50 50,38" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="5" className="fill-emerald-500/5 dark:fill-emerald-400/5" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#auth-arabesque)" />
                </svg>
            </div>

            {/* Floating Language Switcher */}
            <div className="absolute top-6 right-6 left-6 flex justify-end z-20">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLanguage}
                    className="border-emerald-600/20 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-400/20 dark:text-emerald-400 dark:hover:bg-emerald-950/20 text-xs font-bold px-3 py-1.5 h-auto transition-colors"
                >
                    {lang === 'ar' ? 'English' : 'العربية'}
                </Button>
            </div>

            {/* Card Content */}
            <div className="w-full max-w-md backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl shadow-xl shadow-emerald-950/5 overflow-hidden p-8 relative z-10 transition-all duration-300">
                
                {/* Logo and Greeting */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4 animate-pulse-ring">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight text-center leading-normal">
                        {getTranslation(lang, 'authWelcomeBack')}
                    </h2>
                    <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400 text-center font-bold px-2 py-0.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-full border border-emerald-100/50 dark:border-emerald-900/30">
                        {getTranslation(lang, 'heroBadge')}
                    </p>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-2 border-gray-200 hover:border-emerald-200 dark:border-gray-800 dark:hover:border-emerald-900 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                        <Github className="w-5 h-5 text-gray-900 dark:text-white" />
                        <span className="font-semibold text-xs">GitHub</span>
                    </Button>
                    <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-2 border-gray-200 hover:border-emerald-200 dark:border-gray-800 dark:hover:border-emerald-900 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                        <Mail className="w-5 h-5 text-red-500" />
                        <span className="font-semibold text-xs">Google</span>
                    </Button>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-emerald-100/30 dark:border-emerald-900/20" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white/0 px-3 text-gray-400 dark:text-gray-500 font-semibold">
                            {getTranslation(lang, 'authOrContinue')}
                        </span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        id="email"
                        type="email"
                        label={getTranslation(lang, 'authEmailLabel')}
                        placeholder="name@example.com"
                        className="focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-700/50"
                        required
                    />

                    <div>
                        <Input
                            id="password"
                            type="password"
                            label={getTranslation(lang, 'authPasswordLabel')}
                            placeholder="••••••••"
                            className="focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-700/50"
                            required
                        />
                        <div className="flex items-center justify-end mt-2">
                            <Link to="#" className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
                                {getTranslation(lang, 'authForgotPass')}
                            </Link>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full h-11 text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/25 border-0 flex items-center justify-center gap-2 group transition-all"
                        size="lg"
                    >
                        <span>{getTranslation(lang, 'login')}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
                    </Button>
                </form>

                {/* Footer Switch Link */}
                <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400 font-semibold">
                    {getTranslation(lang, 'authNoAccount')}{' '}
                    <Link to="/auth/signup" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 underline underline-offset-4">
                        {getTranslation(lang, 'signup')}
                    </Link>
                </p>

                {/* Wisdom Quote */}
                <div className="mt-8 pt-6 border-t border-emerald-100/50 dark:border-emerald-900/30 text-center">
                    <p className="text-xs italic text-gray-400 dark:text-gray-500 font-medium px-4 leading-relaxed">
                        "{getTranslation(lang, 'authQuote')}"
                    </p>
                </div>
            </div>
        </div>
    );
}
