import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useStore } from '../../store/useStore';
import { BookOpen, Users, Award, BookMarked, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TeacherDashboardPage() {
    const { lang, teacherStats, loadTeacherStats } = useStore();

    useEffect(() => {
        loadTeacherStats();
    }, []);

    const stats = [
        {
            title: lang === 'ar' ? 'إجمالي الدورات' : 'Total Courses',
            value: teacherStats?.totalCourses?.toString() || '0',
            icon: BookOpen,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/20',
        },
        {
            title: lang === 'ar' ? 'الطلاب المسجلين' : 'Enrolled Students',
            value: teacherStats?.totalStudents?.toString() || '0',
            icon: Users,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/20',
        },
        {
            title: lang === 'ar' ? 'متوسط نقاط الخبرة للطلاب' : 'Average Student XP',
            value: teacherStats?.averageXp?.toString() || '0',
            icon: Award,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/20',
        },
    ];

    return (
        <div className="space-y-6 relative">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 shadow-xl">
                <div className="absolute right-0 bottom-0 w-80 h-80 bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-3xl opacity-50" />
                <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full blur-3xl opacity-50" />
                
                {/* Mathematically generated repeating SVG geometric Arabesque background pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <svg className="w-full h-full stroke-white fill-none" width="100%" height="100%">
                        <pattern id="dashboard-arabesque" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 50,0 L 100,50 L 50,100 L 0,50 Z" strokeWidth="0.75" />
                            <circle cx="50" cy="50" r="20" strokeWidth="0.75" />
                            <path d="M 0,0 L 100,100 M 100,0 L 0,100" strokeWidth="0.75" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#dashboard-arabesque)" />
                    </svg>
                </div>

                <div className="relative z-10 space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {lang === 'ar' ? 'أهلاً بك في لوحة المعلم' : 'Welcome to the Teacher Panel'}
                    </h1>
                    <p className="text-emerald-100/90 text-sm max-w-xl font-medium leading-relaxed">
                        {lang === 'ar' 
                            ? 'تابع تفاعل الطلاب مع المحتوى، وقم بإنشاء وتعديل الدروس والبطاقات الذكية لتسريع تعلم طلاب بيت الحكمة.' 
                            : 'Monitor student engagement, structure interactive courses, and build spaced repetition decks to elevate their learning paths.'
                        }
                    </p>
                </div>
            </div>

            {/* Stats Roster Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} variant="elevated" className="border border-emerald-50 dark:border-emerald-950/20 hover:scale-[1.01] transition-transform duration-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-xl ${stat.bg}`}>
                                    <Icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-extrabold text-gray-900 dark:text-white tabular-nums">{stat.value}</div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
                                    {lang === 'ar' ? 'بيانات حية ومزامنة سحابية' : 'Live data synchronized in real-time'}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Split view: Quick Actions & Roster */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Roster list */}
                <Card className="lg:col-span-2 border border-gray-100 dark:border-gray-800 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-emerald-500" />
                            {lang === 'ar' ? 'الطلاب الجدد في دوراتك' : 'Recently Active Students'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {teacherStats?.students && teacherStats.students.length > 0 ? (
                                teacherStats.students.slice(0, 4).map((student, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                                                {student.name[0]}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{student.name}</h4>
                                                <p className="text-xs text-gray-400">{student.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-full">
                                                {student.xp} XP
                                            </span>
                                            <p className="text-[10px] text-gray-400 mt-1">{lang === 'ar' ? 'المستوى' : 'Level'} {student.level}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-6 text-sm text-gray-400">
                                    {lang === 'ar' ? 'لا يوجد طلاب مسجلين في دوراتك بعد.' : 'No students enrolled in your courses yet.'}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick actions panel */}
                <Card className="border border-gray-100 dark:border-gray-800 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <BookMarked className="w-5 h-5 text-emerald-500" />
                            {lang === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link 
                            to="/teacher/courses" 
                            className="w-full flex items-center justify-center h-11 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-600/10"
                        >
                            {lang === 'ar' ? 'إضافة دورة جديدة' : 'Create a New Course'}
                        </Link>
                        <Link 
                            to="/teacher/students" 
                            className="w-full flex items-center justify-center h-11 text-xs font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40 rounded-xl transition-all border border-emerald-200/50 dark:border-emerald-900/30"
                        >
                            {lang === 'ar' ? 'عرض تفاصيل الطلاب' : 'View Full Student Roster'}
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
