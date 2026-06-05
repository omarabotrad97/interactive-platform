import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, RefreshCw, LogOut, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useStore } from '../../store/useStore';

export default function PendingApprovalPage() {
    const navigate = useNavigate();
    const { lang, checkAuth, logout, user } = useStore();
    const [isChecking, setIsChecking] = useState(false);

    const handleCheckStatus = async () => {
        setIsChecking(true);
        try {
            await checkAuth();
            // Store state will be updated. Check user from store
            const latestUser = useStore.getState().user;
            if (latestUser.isApproved) {
                if (latestUser.role === 'teacher') {
                    navigate('/teacher/courses');
                } else if (latestUser.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            console.error('Error checking approval status:', err);
        } finally {
            setIsChecking(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
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

            {/* Card Content */}
            <div className="w-full max-w-md backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl shadow-xl shadow-emerald-950/5 overflow-hidden p-8 relative z-10 text-center transition-all duration-300">
                
                {/* Logo and Icon */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4 relative">
                        <Clock className="w-8 h-8 text-white animate-pulse" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
                    </div>
                    
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-normal mb-2">
                        {lang === 'ar' ? 'بانتظار تفعيل الحساب' : 'Pending Account Activation'}
                    </h2>
                    
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-bold px-3 py-1 bg-amber-50 dark:bg-amber-950/20 rounded-full border border-amber-100 dark:border-amber-900/30 inline-flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {lang === 'ar' ? 'بوابة المعلمين - بيت الحكمة' : 'Teachers Portal - House of Wisdom'}
                    </p>
                </div>

                {/* Message Box */}
                <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-xl p-5 mb-6 text-right dir-rtl">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                        {lang === 'ar' 
                            ? `مرحباً بك يا ${user.firstName || 'أستاذ(ة)'}. تم تسجيل حسابك كمعلم في منصة بيت الحكمة بنجاح.` 
                            : `Welcome, ${user.firstName || 'Teacher'}. Your teacher account has been registered successfully.`
                        }
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {lang === 'ar'
                            ? 'طلب التفعيل الخاص بك قيد المراجعة حالياً من قبل الإدارة. سيتم إخطارك فور تفعيل حسابك لتتمكن من إنشاء صفك الدراسي ونشر دوراتك.'
                            : 'Your activation request is currently under review by the administration. You will be able to access your teacher panel once approved.'
                        }
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button
                        onClick={handleCheckStatus}
                        disabled={isChecking}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold py-2.5 rounded-xl shadow-md shadow-emerald-500/10 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                        <span>{lang === 'ar' ? 'تحديث الحالة' : 'Check Status'}</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/50 text-gray-700 dark:text-gray-300 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
                    </Button>
                </div>

                {/* Footer Decor */}
                <div className="mt-8 text-[10px] text-gray-400 dark:text-gray-600 font-medium">
                    {lang === 'ar'
                        ? 'إذا كان لديك أي استفسار، يرجى التواصل مع الدعم الفني: support@houseofwisdom.com'
                        : 'If you have any questions, please contact support: support@houseofwisdom.com'
                    }
                </div>
            </div>
        </div>
    );
}
