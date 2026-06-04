import { Link } from 'react-router-dom';
import { Star, ArrowUpRight, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function FeaturedCourses() {
    const { lang, courses } = useStore();

    return (
        <section id="courses" className="py-24 bg-white dark:bg-gray-950 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                            {getTranslation(lang, 'featuredCoursesTitle')}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                            {getTranslation(lang, 'featuredCoursesSubtitle')}
                        </p>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {courses.map((course) => (
                        <Card key={course.id} className="group overflow-hidden border border-gray-100 dark:border-gray-900 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors rounded-2xl shadow-md flex flex-col bg-white dark:bg-gray-900">
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden h-48">
                                <img 
                                    src={course.thumbnailUrl} 
                                    alt={course.title[lang]} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                    <Link to="/auth/login">
                                        <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1">
                                            {lang === 'ar' ? 'معاينة الدورة' : 'Preview Course'}
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <CardContent className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                            {course.id === 'react-101' ? (lang === 'ar' ? 'تطوير ويب' : 'Web Dev') : (lang === 'ar' ? 'ذكاء اصطناعي' : 'AI')}
                                        </span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1 font-bold">
                                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> 
                                            4.9
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">
                                        {course.title[lang]}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mb-4 line-clamp-2">
                                        {course.description[lang]}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 mt-auto">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                        <BookOpen className="w-4 h-4 text-emerald-500" />
                                        <span>{course.lessons.length} {lang === 'ar' ? 'دروس تفاعلية' : 'Lessons'}</span>
                                    </div>
                                    <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                                        {lang === 'ar' ? 'مجاناً للتعلم' : 'Free to learn'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
