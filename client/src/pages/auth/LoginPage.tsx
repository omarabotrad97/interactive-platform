import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, BookOpen, GraduationCap, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';
import { cn } from '../../lib/utils';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, loginWithGoogle, lang, toggleLanguage, approvedTeachers, loadApprovedTeachers } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Google role selection popup state
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [tempGoogleToken, setTempGoogleToken] = useState('');
    const [googleProfile, setGoogleProfile] = useState({ name: '', email: '' });
    const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);

    useEffect(() => {
        loadApprovedTeachers();
    }, [loadApprovedTeachers]);

    useEffect(() => {
        if (approvedTeachers && approvedTeachers.length > 0) {
            setSelectedTeacherId(approvedTeachers[0].id);
        }
    }, [approvedTeachers]);

    const handleGoogleSignIn = () => {
        // @ts-ignore
        if (typeof window.google === 'undefined') {
            setError(lang === 'ar' ? 'فشل تحميل مكتبة جوجل، يرجى المحاولة لاحقاً' : 'Google Identity SDK not loaded yet.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            // @ts-ignore
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                scope: 'email profile openid',
                callback: async (tokenResponse: any) => {
                    if (tokenResponse.error) {
                        setError(lang === 'ar' ? 'فشل الاتصال بجوجل' : 'Failed to connect to Google');
                        setIsLoading(false);
                        return;
                    }

                    try {
                        const res = await loginWithGoogle(tokenResponse.access_token);

                        if (res && res.isNewUser) {
                            setTempGoogleToken(tokenResponse.access_token);
                            setGoogleProfile({
                                name: res.name,
                                email: res.email
                            });
                            setShowRoleModal(true);
                        } else {
                            const latestUser = useStore.getState().user;
                            if (latestUser.role === 'teacher' && !latestUser.isApproved) {
                                navigate('/auth/pending');
                            } else if (latestUser.role === 'admin') {
                                navigate('/admin');
                            } else if (latestUser.role === 'teacher') {
                                navigate('/teacher/courses');
                            } else {
                                navigate('/dashboard');
                            }
                        }
                    } catch (err: any) {
                        const message = err.response?.data?.message || err.message;
                        setError(message || (lang === 'ar' ? 'فشل تسجيل الدخول بجوجل' : 'Google login failed'));
                    } finally {
                        setIsLoading(false);
                    }
                },
            });
            client.requestAccessToken();
        } catch (err) {
            console.error('Google initialization error:', err);
            setError(lang === 'ar' ? 'فشل تهيئة تسجيل الدخول بجوجل' : 'Google init failed');
            setIsLoading(false);
        }
    };

    const handleCompleteRegistration = async () => {
        setError('');
        setIsLoading(true);

        try {
            await loginWithGoogle(
                tempGoogleToken,
                selectedRole,
                selectedRole === 'student' ? selectedTeacherId : null
            );

            setShowRoleModal(false);
            const latestUser = useStore.getState().user;
            if (latestUser.role === 'teacher' && !latestUser.isApproved) {
                navigate('/auth/pending');
            } else if (latestUser.role === 'admin') {
                navigate('/admin');
            } else if (latestUser.role === 'teacher') {
                navigate('/teacher/courses');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(lang === 'ar' ? 'فشل إكمال التسجيل' : 'Failed to complete registration');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            await login(email, password);
            const latestUser = useStore.getState().user;
            if (latestUser.role === 'teacher' && !latestUser.isApproved) {
                navigate('/auth/pending');
            } else if (latestUser.role === 'admin') {
                navigate('/admin');
            } else if (latestUser.role === 'teacher') {
                navigate('/teacher/courses');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(lang === 'ar' ? 'فشل تسجيل الدخول: البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Login failed: Invalid email or password');
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
                <div className="mb-6">
                    <Button 
                        type="button"
                        onClick={handleGoogleSignIn}
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-2.5 border-gray-200 hover:border-emerald-200 dark:border-gray-800 dark:hover:border-emerald-900 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 text-gray-700 dark:text-gray-300 transition-all duration-300 py-2.5 h-11"
                    >
                        <Mail className="w-5 h-5 text-red-500" />
                        <span className="font-bold text-xs">
                            {getTranslation(lang, 'authGoogleSignIn')}
                        </span>
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
                        name="email"
                        type="email"
                        label={getTranslation(lang, 'authEmailLabel')}
                        placeholder="name@example.com"
                        className="focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-700/50"
                        required
                    />

                    <div>
                        <Input
                            id="password"
                            name="password"
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
                        <span>{isLoading ? getTranslation(lang, 'authCreatingAccount').replace('Creating', 'Logging in').replace('جاري إنشاء', 'جاري تسجيل') : getTranslation(lang, 'login')}</span>
                        {!isLoading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />}
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

            {/* Premium Role Selection Modal for new Google users */}
            {showRoleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl shadow-2xl p-6 relative">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">
                                {lang === 'ar' ? 'إكمال تسجيل الحساب' : 'Complete Account Registration'}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {lang === 'ar' 
                                    ? `مرحباً ${googleProfile.name}، يرجى اختيار نوع حسابك للمتابعة:` 
                                    : `Welcome ${googleProfile.name}, please select your account type:`}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <button
                                type="button"
                                onClick={() => setSelectedRole('student')}
                                className={cn(
                                    "p-4 rounded-xl border-2 text-center transition-all active:scale-[0.98] flex flex-col items-center gap-2",
                                    selectedRole === 'student'
                                        ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-bold"
                                        : "border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                            >
                                <GraduationCap className="w-8 h-8" />
                                <span className="text-sm">{lang === 'ar' ? 'طالب' : 'Student'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRole('teacher')}
                                className={cn(
                                    "p-4 rounded-xl border-2 text-center transition-all active:scale-[0.98] flex flex-col items-center gap-2",
                                    selectedRole === 'teacher'
                                        ? "border-amber-500 bg-amber-50/30 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 font-bold"
                                        : "border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                            >
                                <User className="w-8 h-8" />
                                <span className="text-sm">{lang === 'ar' ? 'معلم' : 'Teacher'}</span>
                            </button>
                        </div>

                        {selectedRole === 'student' && (
                            <div className="space-y-1.5 text-right mb-6 dir-rtl">
                                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                                    {lang === 'ar' ? 'المعلم المشرف' : 'Supervising Teacher'}
                                </label>
                                <select
                                    value={selectedTeacherId || ''}
                                    onChange={(e) => setSelectedTeacherId(e.target.value ? parseInt(e.target.value, 10) : null)}
                                    className="w-full h-10 px-3 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 hover:border-emerald-350 dark:hover:border-emerald-750/30 font-bold transition-all shadow-sm outline-none"
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

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowRoleModal(false);
                                    setIsLoading(false);
                                }}
                                className="rounded-xl text-xs font-bold"
                            >
                                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                            </Button>
                            <Button
                                onClick={handleCompleteRegistration}
                                className="rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/10"
                                disabled={isLoading}
                            >
                                {lang === 'ar' ? 'إتمام التسجيل' : 'Complete Sign Up'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
