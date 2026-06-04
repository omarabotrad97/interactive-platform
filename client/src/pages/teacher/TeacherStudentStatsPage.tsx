import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Trophy, Award, BookOpen, X, Search, Star } from 'lucide-react';

export default function TeacherStudentStatsPage() {
    const { lang, teacherStats, loadTeacherStats } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

    useEffect(() => {
        loadTeacherStats();
    }, []);

    const filteredStudents = teacherStats?.students.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="space-y-6 relative">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                    {lang === 'ar' ? 'إحصاءات وتقارير الطلاب' : 'Student Statistics'}
                </h1>
                <p className="text-xs text-gray-400">
                    {lang === 'ar' ? 'تابع إنجازات وتفاعل الطلاب المسجلين في مناهجك الدراسية.' : 'Track the progress, XP, and lesson completions of students.'}
                </p>
            </div>

            {/* Roster Table Card */}
            <Card className="border border-gray-100 dark:border-gray-800 shadow-md">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
                    <CardTitle className="text-sm font-black flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-emerald-500" />
                        {lang === 'ar' ? 'قائمة الطلاب المسجلين' : 'Enrolled Student Roster'}
                    </CardTitle>
                    <div className="relative max-w-xs w-full">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder={lang === 'ar' ? 'ابحث باسم الطالب أو البريد...' : 'Search student...'}
                            className="text-xs pl-9 pr-4 py-2 w-full rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-emerald-50/20 dark:bg-emerald-950/10 border-b border-gray-100 dark:border-gray-800">
                                    <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                                    <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</th>
                                    <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">{lang === 'ar' ? 'المستوى' : 'Level'}</th>
                                    <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">{lang === 'ar' ? 'نقاط الخبرة' : 'XP Score'}</th>
                                    <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredStudents.map((student) => (
                                    <tr 
                                        key={student.id} 
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900/25 transition-colors cursor-pointer text-xs font-bold"
                                        onClick={() => setSelectedStudent(student)}
                                    >
                                        <td className="p-4 text-gray-950 dark:text-gray-100">{student.name}</td>
                                        <td className="p-4 text-gray-400 font-semibold">{student.email}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 font-black">
                                                {student.level}
                                            </span>
                                        </td>
                                        <td className="p-4 text-emerald-700 dark:text-emerald-400">{student.xp} XP</td>
                                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                onClick={() => setSelectedStudent(student)}
                                                className="h-7 px-2 border-emerald-100 text-emerald-700 dark:border-emerald-900/30 dark:text-emerald-400 text-[10px]"
                                            >
                                                {lang === 'ar' ? 'تقرير التقدم' : 'Progress Report'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}

                                {filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-400">
                                            {lang === 'ar' ? 'لم يتم العثور على نتائج للبحث.' : 'No students found.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Interactive Student Details Drawer Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
                    <div className="bg-white dark:bg-gray-900 border-l border-emerald-100 dark:border-emerald-950/30 w-full max-w-lg h-full p-6 shadow-2xl relative flex flex-col justify-between overflow-y-auto animate-slide-in-right">
                        <div className="space-y-6">
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center justify-center font-black text-base shadow-sm">
                                        {selectedStudent.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-gray-900 dark:text-white">{selectedStudent.name}</h3>
                                        <p className="text-xs text-gray-400">{selectedStudent.email}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedStudent(null)}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Student Stats Cards Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-50/20 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/10 text-center">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{lang === 'ar' ? 'المستوى' : 'Level'}</span>
                                    <p className="text-3xl font-black text-emerald-600 mt-1">{selectedStudent.level}</p>
                                </div>
                                <div className="p-4 bg-emerald-50/20 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/10 text-center">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{lang === 'ar' ? 'نقاط الخبرة' : 'Total XP'}</span>
                                    <p className="text-3xl font-black text-emerald-600 mt-1">{selectedStudent.xp}</p>
                                </div>
                            </div>

                            {/* Enrolled Courses */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-black text-gray-500 uppercase flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-emerald-500" />
                                    {lang === 'ar' ? 'الدورات المسجل بها' : 'Enrolled Courses'}
                                </h4>
                                <div className="space-y-1.5">
                                    {selectedStudent.enrolledCourses && selectedStudent.enrolledCourses.length > 0 ? (
                                        selectedStudent.enrolledCourses.map((cName: string, idx: number) => (
                                            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-850 rounded-xl text-xs font-bold text-gray-900 dark:text-white border border-gray-150 dark:border-gray-800">
                                                {cName}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[10px] text-gray-400 font-semibold italic">{lang === 'ar' ? 'لم يسجل في دورات بعد.' : 'No active course enrollments.'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Unlocked Badges */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-black text-gray-500 uppercase flex items-center gap-2">
                                    <Award className="w-4 h-4 text-emerald-500" />
                                    {lang === 'ar' ? 'الأوسمة والإنجازات المكتسبة' : 'Unlocked Badges'}
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {selectedStudent.badges && selectedStudent.badges.length > 0 ? (
                                        selectedStudent.badges.map((badge: any) => {
                                            const bKey = typeof badge === 'string' ? badge : badge.key;
                                            const bName = typeof badge === 'string' ? badge : badge.name;
                                            const bDesc = typeof badge === 'string' ? '' : badge.description;
                                            
                                            return (
                                                <div key={bKey} className="p-3 rounded-xl border border-amber-150 bg-amber-50/20 text-center flex flex-col items-center justify-center">
                                                    <Star className="w-5 h-5 text-amber-500 fill-amber-500 mb-1" />
                                                    <h5 className="text-[11px] font-black text-gray-900 dark:text-white">{bName}</h5>
                                                    <p className="text-[9px] text-gray-400 leading-snug">{bDesc}</p>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-[10px] text-gray-400 font-semibold italic col-span-2">{lang === 'ar' ? 'لم يحصل على أوسمة بعد.' : 'No badges earned yet.'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Completed Lessons */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-black text-gray-500 uppercase flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-emerald-500" />
                                    {lang === 'ar' ? 'الدروس التي أكملها' : 'Completed Lessons'}
                                </h4>
                                <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded-xl text-xs font-bold text-gray-900 dark:text-white border border-gray-150 dark:border-gray-800">
                                    <p className="text-emerald-700 dark:text-emerald-400">
                                        {lang === 'ar' 
                                            ? `أكمل الطالب عدد ${selectedStudent.completedLessons?.length || 0} درساً بالمنصة.` 
                                            : `Completed ${selectedStudent.completedLessons?.length || 0} lessons overall.`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-6">
                            <Button 
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 text-xs rounded-xl"
                                onClick={() => setSelectedStudent(null)}
                            >
                                {lang === 'ar' ? 'إغلاق التقرير' : 'Close Roster View'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
