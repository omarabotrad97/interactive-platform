import { useEffect, useState } from 'react';
import { ShieldCheck, UserX, UserCheck, Mail, Calendar, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';

export default function AdminDashboardPage() {
    const { lang, pendingTeachers, loadPendingTeachers, approveTeacherAction, rejectTeacherAction } = useStore();
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    useEffect(() => {
        const fetchPending = async () => {
            setLoading(true);
            try {
                await loadPendingTeachers();
            } catch (err) {
                console.error('Failed to load pending teachers:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPending();
    }, [loadPendingTeachers]);

    const handleApprove = async (id: number) => {
        setActionLoadingId(id);
        try {
            await approveTeacherAction(id);
        } catch (err) {
            console.error('Failed to approve teacher:', err);
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleReject = async (id: number) => {
        if (!confirm(lang === 'ar' ? 'هل أنت متأكد من رفض وحذف طلب هذا المعلم؟' : 'Are you sure you want to reject and delete this teacher request?')) {
            return;
        }
        setActionLoadingId(id);
        try {
            await rejectTeacherAction(id);
        } catch (err) {
            console.error('Failed to reject teacher:', err);
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Dashboard Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-15 mix-blend-overlay">
                    <svg className="w-full h-full stroke-white fill-none" width="100%" height="100%">
                        <pattern id="admin-banner-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
                            <path d="M 40,0 L 80,40 L 40,80 L 0,40 Z" strokeWidth="1" />
                            <circle cx="40" cy="40" r="15" strokeWidth="1" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#admin-banner-pattern)" />
                    </svg>
                </div>
                
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black mb-2 flex items-center gap-2">
                            <ShieldCheck className="w-8 h-8 text-amber-300" />
                            {lang === 'ar' ? 'إدارة المعلمين وتفعيل الحسابات' : 'Teacher Management & Approval'}
                        </h1>
                        <p className="text-emerald-100 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl">
                            {lang === 'ar' 
                                ? 'مرحباً بك في لوحة تحكم الإدارة. هنا يمكنك مراجعة طلبات تسجيل المعلمين الجدد، وتفعيل حساباتهم للبدء بإنشاء الصفوف الدراسية وتدريس الطلاب.' 
                                : 'Welcome to the Admin dashboard. Review incoming teacher registration requests and activate accounts to permit them to create classrooms.'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white dark:bg-gray-900 border border-emerald-100/50 dark:border-emerald-900/20 rounded-2xl shadow-sm overflow-hidden p-6 transition-all">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                    <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                        {lang === 'ar' ? 'طلبات التسجيل المعلقة' : 'Pending Requests'}
                        <span className="px-2 py-0.5 text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-black rounded-full border border-amber-100 dark:border-amber-900/30">
                            {pendingTeachers.length}
                        </span>
                    </h2>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-500">
                        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                        <span className="text-xs font-bold">{lang === 'ar' ? 'جاري تحميل الطلبات...' : 'Loading requests...'}</span>
                    </div>
                ) : pendingTeachers.length === 0 ? (
                    <div className="py-16 text-center border-2 border-dashed border-gray-100 dark:border-gray-850 rounded-2xl">
                        <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                            {lang === 'ar' ? 'لا توجد طلبات معلقة' : 'No Pending Requests'}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {lang === 'ar' ? 'تمت معالجة جميع طلبات المعلمين بنجاح.' : 'All teacher registration requests have been processed.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingTeachers.map((teacher) => (
                            <div 
                                key={teacher.id} 
                                className="border border-emerald-100/50 dark:border-emerald-900/10 rounded-xl p-5 bg-gradient-to-br from-white to-emerald-50/10 dark:from-gray-900 dark:to-emerald-950/5 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900/40 transition-all flex flex-col justify-between gap-4"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-extrabold text-sm border border-amber-100 dark:border-amber-900/20">
                                            {teacher.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white leading-tight">
                                                {teacher.name}
                                            </h3>
                                            <span className="inline-block px-2 py-0.5 text-[10px] bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 font-bold rounded-full mt-1">
                                                {lang === 'ar' ? 'معلم قيد الانتظار' : 'Teacher (Pending)'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-50 dark:border-gray-850">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-450" />
                                            <span className="truncate">{teacher.email}</span>
                                        </div>
                                        {teacher.createdAt && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-450" />
                                                <span>
                                                    {lang === 'ar' ? 'تاريخ التسجيل: ' : 'Registered: '}
                                                    {new Date(teacher.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2.5 pt-2">
                                    <Button
                                        onClick={() => handleApprove(teacher.id)}
                                        disabled={actionLoadingId === teacher.id}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/10 active:scale-95 transition-all"
                                    >
                                        {actionLoadingId === teacher.id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <UserCheck className="w-3.5 h-3.5" />
                                        )}
                                        <span>{lang === 'ar' ? 'موافقة وتفعيل' : 'Approve & Activate'}</span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => handleReject(teacher.id)}
                                        disabled={actionLoadingId === teacher.id}
                                        className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-950 dark:hover:bg-red-950/20 font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                                    >
                                        <UserX className="w-3.5 h-3.5" />
                                        <span>{lang === 'ar' ? 'رفض' : 'Reject'}</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
