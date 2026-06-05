import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Github, Mail, ArrowRight, BookOpen, User, GraduationCap } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';
import { cn } from '../../lib/utils';

export default function SignUpPage() {
    const navigate = useNavigate();
    const { register, lang, toggleLanguage, approvedTeachers, loadApprovedTeachers } = useStore();
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [assignedTeacherId, setAssignedTeacherId] = useState<number | null>(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadApprovedTeachers();
    }, [loadApprovedTeachers]);

    useEffect(() => {
        // Set default teacher if list is loaded and user is student
        if (approvedTeachers && approvedTeachers.length > 0) {
            setAssignedTeacherId(approvedTeachers[0].id);
        }
    }, [approvedTeachers]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!termsAccepted) {
            setError(getTranslation(lang, 'authTermsError'));
            return;
        }

        if (password.length < 8) {
            setError(getTranslation(lang, 'authPassLengthError'));
            return;
        }

        setIsLoading(true);

        try {
            await register(
                `${firstName} ${lastName}`,
                email,
                password,
                role,
                role === 'student' ? assignedTeacherId : null
            );
            
            // Get latest store state for approval redirection
            const latestUser = useStore.getState().user;
            if (role === 'teacher' && !latestUser.isApproved) {
                navigate('/auth/pending');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(lang === 'ar' ? 'فشل إنشاء الحساب: البريد الإلكتروني مستخدم بالفعل' : 'Registration failed: Email already in use');
        } finally {
            setIsLoading(false);
        }
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
                    <pattern id="auth-arabesque-signup" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M 50,0 L 100,50 L 50,100 L 0,50 Z" strokeWidth="0.75" />
                        <circle cx="50" cy="50" r="20" strokeWidth="0.75" />
                        <path d="M 0,0 L 100,100 M 100,0 L 0,100" strokeWidth="0.75" />
                        <polygon points="50,15 62,50 50,85 38,50" strokeWidth="0.5" />
                        <polygon points="15,50 50,62 85,50 50,38" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="5" className="fill-emerald-500/5 dark:fill-emerald-400/5" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#auth-arabesque-signup)" />
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
                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4 animate-pulse-ring">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight text-center leading-normal">
                        {getTranslation(lang, 'authSignUpTitle')}
                    </h2>
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 text-center font-semibold max-w-xs leading-relaxed">
                        {getTranslation(lang, 'authSignUpSubtitle')}
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
                            {getTranslation(lang, 'authOrSignUpWith')}
                        </span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="firstName"
                            label={getTranslation(lang, 'authFirstNameLabel')}
                            placeholder="John"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-700/50"
                            required
                        />
                        <Input
                            id="lastName"
                            label={getTranslation(lang, 'authLastNameLabel')}
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-700/50"
                            required
                        />
                    </div>

                    {/* Role Selection Toggle */}
                    <div className="space-y-1.5 text-right">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            {lang === 'ar' ? 'نوع الحساب' : 'Account Type'}
                        </label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-150 dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/55">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={cn(
                                    "flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-black transition-all active:scale-[0.97]",
                                    role === 'student'
                                        ? "bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-100/55 dark:border-emerald-900/30"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-705 dark:hover:text-gray-300"
                                )}
                            >
                                <GraduationCap className="w-4 h-4" />
                                <span>{lang === 'ar' ? 'طالب' : 'Student'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('teacher')}
                                className={cn(
                                    "flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-black transition-all active:scale-[0.97]",
                                    role === 'teacher'
                                        ? "bg-white dark:bg-gray-700 text-amber-700 dark:text-amber-300 shadow-sm border border-amber-100/55 dark:border-amber-900/30"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-705 dark:hover:text-gray-300"
                                )}
                            >
                                <User className="w-4 h-4" />
                                <span>{lang === 'ar' ? 'معلم' : 'Teacher'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Supervising Teacher Selection Dropdown (Only for Students) */}
                    {role === 'student' && (
                        <div className="space-y-1.5 text-right dir-rtl">
                            <label htmlFor="assignedTeacher" className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                                {lang === 'ar' ? 'اختر المعلم المشرف' : 'Select Classroom Teacher'}
                            </label>
                            <select
                                id="assignedTeacher"
                                value={assignedTeacherId || ''}
                                onChange={(e) => setAssignedTeacherId(e.target.value ? parseInt(e.target.value, 10) : null)}
                                className="w-full h-10 px-3 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-250 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 hover:border-emerald-350 dark:hover:border-emerald-750/30 font-bold transition-all shadow-sm outline-none"
                                required={role === 'student'}
                            >
                                {approvedTeachers && approvedTeachers.length > 0 ? (
                                    approvedTeachers.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} ({t.email})
                                        </option>
                                    ))
                                ) : (
                                    <option value="">
                                        {lang === 'ar' ? 'المعلم الافتراضي (بيت الحكمة)' : 'Default Master Teacher'}
                                    </option>
                                )}
                            </select>
                        </div>
                    )}

                    <Input
                        id="email"
                        type="email"
                        label={getTranslation(lang, 'authEmailLabel')}
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-700/50"
                        required
                    />

                    <Input
                        id="password"
                        type="password"
                        label={getTranslation(lang, 'authPasswordLabel')}
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-700/50"
                        required
                    />

                    <div className="flex items-start py-1">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                aria-describedby="terms-description"
                                name="terms"
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="w-4 h-4 border-gray-300 dark:border-gray-700 rounded text-emerald-600 focus:ring-emerald-500 dark:bg-gray-900 accent-emerald-600"
                            />
                        </div>
                        <div className="mx-3 text-xs leading-normal">
                            <label htmlFor="terms" className="font-semibold text-gray-500 dark:text-gray-400">
                                {getTranslation(lang, 'authTermsAgree')}
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div className="text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2.5 rounded-lg border border-red-200/50 dark:border-red-900/30">
                            {error}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        className="w-full h-11 text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/25 border-0 flex items-center justify-center gap-2 group transition-all" 
                        size="lg" 
                        disabled={isLoading}
                    >
                        <span>{isLoading ? getTranslation(lang, 'authCreatingAccount') : getTranslation(lang, 'signup')}</span>
                        {!isLoading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />}
                    </Button>
                </form>

                {/* Footer Switch Link */}
                <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400 font-semibold">
                    {getTranslation(lang, 'authAlreadyAccount')}{' '}
                    <Link to="/auth/login" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 underline underline-offset-4">
                        {getTranslation(lang, 'login')}
                    </Link>
                </p>

                {/* Wisdom Quote */}
                <div className="mt-6 pt-6 border-t border-emerald-100/50 dark:border-emerald-900/30 text-center">
                    <p className="text-xs italic text-gray-400 dark:text-gray-500 font-medium px-4 leading-relaxed">
                        "{getTranslation(lang, 'authQuote')}"
                    </p>
                </div>
            </div>
        </div>
    );
}
