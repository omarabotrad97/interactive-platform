import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Globe, EyeOff } from 'lucide-react';

export default function TeacherCoursesPage() {
    const { lang, courses, loadCourses, createCourseAction, updateCourseAction, deleteCourseAction } = useStore();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadCourses();
    }, []);

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setIsLoading(true);
        try {
            await createCourseAction({
                title,
                description,
                thumbnailUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80',
                published: false
            });
            setTitle('');
            setDescription('');
            setIsCreateOpen(false);
        } catch (err) {
            console.error('Failed to create course:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTogglePublish = async (courseId: string, currentPublished: boolean) => {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;
        try {
            // Drizzle expects plain titles/descriptions on backend or we map them.
            // On updates, we pass the title and description as plain strings.
            await updateCourseAction(courseId, {
                title: typeof course.title === 'string' ? course.title : course.title.ar || course.title.en,
                description: typeof course.description === 'string' ? course.description : course.description.ar || course.description.en,
                published: !currentPublished
            });
        } catch (err) {
            console.error('Failed to toggle publish status:', err);
        }
    };

    const handleDeleteCourse = async (courseId: string) => {
        if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الدورة بالكامل مع دروسها وبطاقاتها؟' : 'Are you sure you want to delete this course and all its lessons/flashcards?')) {
            return;
        }
        try {
            await deleteCourseAction(courseId);
        } catch (err) {
            console.error('Failed to delete course:', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                        {lang === 'ar' ? 'إدارة الدورات التعليمية' : 'Manage Courses'}
                    </h1>
                    <p className="text-xs text-gray-400">
                        {lang === 'ar' ? 'قم بإنشاء وتعديل محتوى مناهج بيت الحكمة.' : 'Formulate and adjust learning pathways for your students.'}
                    </p>
                </div>
                <Button 
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/10"
                >
                    <Plus className="w-4 h-4" />
                    {lang === 'ar' ? 'دورة جديدة' : 'Add Course'}
                </Button>
            </div>

            {/* Modal for creating a new course */}
            {isCreateOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">
                            {lang === 'ar' ? 'إنشاء دورة تعليمية جديدة' : 'Create New Course'}
                        </h3>
                        <form onSubmit={handleCreateCourse} className="space-y-4">
                            <Input
                                label={lang === 'ar' ? 'عنوان الدورة' : 'Course Title'}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={lang === 'ar' ? 'مثال: أسس الجبر والخوارزميات' : 'e.g. Neural Networks Basics'}
                                required
                            />
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500">{lang === 'ar' ? 'وصف مختصر' : 'Description'}</label>
                                <textarea
                                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[80px]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder={lang === 'ar' ? 'اكتب وصفاً جذاباً لهذه الدورة...' : 'Enter a brief description...'}
                                />
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button 
                                    variant="outline" 
                                    type="button" 
                                    onClick={() => setIsCreateOpen(false)}
                                    className="border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-300"
                                >
                                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    {isLoading ? (lang === 'ar' ? 'جاري الإنشاء...' : 'Creating...') : (lang === 'ar' ? 'تأكيد وحفظ' : 'Confirm & Save')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Courses grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                    const isPublished = course.published; // wait, is it mapped? Let's check how the fallback sets it or Drizzle outputs it
                    
                    return (
                        <Card key={course.id} className="overflow-hidden border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-lg transition-all flex flex-col h-full">
                            <div className="h-40 overflow-hidden relative bg-gray-100">
                                <img 
                                    src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80'} 
                                    alt={typeof course.title === 'string' ? course.title : course.title[lang]} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3 left-3 flex justify-end">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm flex items-center gap-1.5 ${
                                        isPublished
                                            ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50'
                                            : 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50'
                                    }`}>
                                        {isPublished ? <Globe className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        {isPublished ? (lang === 'ar' ? 'منشور' : 'Published') : (lang === 'ar' ? 'مسودة' : 'Draft')}
                                    </span>
                                </div>
                            </div>
                            <CardContent className="p-5 flex-1 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
                                        {typeof course.title === 'string' ? course.title : course.title[lang]}
                                    </h3>
                                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                                        {typeof course.description === 'string' ? course.description : course.description[lang]}
                                    </p>
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                        {course.lessons.length} {lang === 'ar' ? 'درس تعليمي مضاف' : 'Lessons Added'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between gap-3 pt-5 border-t border-gray-100 dark:border-gray-800 mt-4">
                                    <div className="flex items-center gap-1.5">
                                        <Link to={`/teacher/courses/${course.id}/edit`}>
                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-gray-200 text-gray-600 dark:border-gray-850 dark:text-gray-400">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </Link>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            onClick={() => handleDeleteCourse(course.id)}
                                            className="h-8 w-8 p-0 border-red-100 hover:bg-red-50 text-red-600 dark:border-red-950/20 dark:hover:bg-red-950/10"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={() => handleTogglePublish(course.id, !!isPublished)}
                                        className={`text-xs font-bold h-8 border ${
                                            isPublished 
                                                ? 'border-yellow-200 text-yellow-700 bg-yellow-50/20 hover:bg-yellow-50 dark:border-yellow-900/30 dark:text-yellow-400' 
                                                : 'border-green-200 text-green-700 bg-green-50/20 hover:bg-green-50 dark:border-green-900/30 dark:text-green-400'
                                        }`}
                                    >
                                        {isPublished ? (lang === 'ar' ? 'تحويل لمسودة' : 'Revert to Draft') : (lang === 'ar' ? 'نشر المحتوى' : 'Publish Course')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {courses.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
                        <p className="text-sm text-gray-400 font-semibold">{lang === 'ar' ? 'لم تقم بإنشاء أي دورات بعد.' : 'No courses created yet.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
