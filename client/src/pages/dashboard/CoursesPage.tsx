import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, GraduationCap, Flame, Play, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function CoursesPage() {
    const { lang, courses, completedLessons } = useStore();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = courses.filter(course =>
        course.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description[lang].toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        {getTranslation(lang, 'myCourses')}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                        {lang === 'ar' 
                            ? 'اكتشف دوراتك الحالية وواصل التعلم بنقاط الخبرة الحية.' 
                            : 'Explore your active courses and continue learning with live XP.'}
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        {/* Adjust search icon alignment for RTL / LTR */}
                        <Search className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-3.5 w-4 h-4 text-gray-400`} />
                        <Input
                            className={`${lang === 'ar' ? 'pr-10 pl-3' : 'pl-10 pr-3'} h-11 bg-white dark:bg-gray-900`}
                            placeholder={lang === 'ar' ? 'ابحث عن الدورات...' : 'Search courses...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                    const courseLessons = course.lessons || [];
                    const completedInThisCourse = courseLessons.filter(l => completedLessons.includes(l.id)).length;
                    const progress = courseLessons.length > 0 
                        ? Math.floor((completedInThisCourse / courseLessons.length) * 100) 
                        : 0;

                    return (
                        <Card key={course.id} variant="elevated" className="overflow-hidden flex flex-col group border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
                            {/* Course Image Header with micro-overlay */}
                            <div className="relative h-44 overflow-hidden">
                                <img 
                                    src={course.thumbnailUrl} 
                                    alt={course.title[lang]} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <span className="absolute bottom-4 left-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase w-fit flex items-center gap-1">
                                    <Flame className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                    {courseLessons.length} {lang === 'ar' ? 'دروس' : 'Lessons'}
                                </span>
                            </div>
                            
                            <CardHeader className="flex-1">
                                <CardTitle className="line-clamp-1 font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                    {course.title[lang]}
                                </CardTitle>
                                <CardDescription className="line-clamp-3 text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium leading-relaxed">
                                    {course.description[lang]}
                                </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="pt-0">
                                <div className="space-y-2.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-500">{lang === 'ar' ? 'نسبة التقدم' : 'Progress'}</span>
                                        <span className="text-indigo-600 dark:text-indigo-400">{progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold flex items-center gap-1 justify-end">
                                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                        {completedInThisCourse} / {courseLessons.length} {lang === 'ar' ? 'الدروس المنجزة' : 'completed'}
                                    </p>
                                </div>
                            </CardContent>
                            
                            <CardFooter className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-100 dark:border-gray-800">
                                <Link to={`/dashboard/courses/${course.id}`} className="w-full">
                                    <Button className="w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm" variant={progress > 0 ? 'primary' : 'outline'}>
                                        <Play className="w-4 h-4 fill-current" />
                                        {progress > 0 
                                            ? (lang === 'ar' ? 'مواصلة التعلم' : 'Continue Learning') 
                                            : (lang === 'ar' ? 'بدء الدورة' : 'Start Course')}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
