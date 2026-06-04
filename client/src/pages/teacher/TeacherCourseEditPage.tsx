import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore, Course, Lesson } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, ArrowUp, ArrowDown, Trash2, Plus, Play, Sparkles, BookOpen, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ensureBilingual } from '../../lib/bilingual';

export default function TeacherCourseEditPage() {
    const { courseId } = useParams<{ courseId: string }>();
    const { 
        lang, 
        courses, 
        loadCourses, 
        updateCourseAction, 
        addLessonAction, 
        updateLessonAction, 
        deleteLessonAction, 
        saveQuizAction 
    } = useStore();

    const [course, setCourse] = useState<Course | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'lessons'>('details');

    // Course state
    const [titleEn, setTitleEn] = useState('');
    const [titleAr, setTitleAr] = useState('');
    const [descEn, setDescEn] = useState('');
    const [descAr, setDescAr] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [isSavingCourse, setIsSavingCourse] = useState(false);

    // Lessons state
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [lessonTitleEn, setLessonTitleEn] = useState('');
    const [lessonTitleAr, setLessonTitleAr] = useState('');
    const [lessonContentEn, setLessonContentEn] = useState('');
    const [lessonContentAr, setLessonContentAr] = useState('');
    const [lessonVideoUrl, setLessonVideoUrl] = useState('');
    const [isSavingLesson, setIsSavingLesson] = useState(false);

    // Quiz state inside selected lesson
    const [quizTitle, setQuizTitle] = useState('');
    const [quizQuestions, setQuizQuestions] = useState<Array<{
        text: string;
        options: string[];
        correctAnswer: number;
    }>>([]);

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        const found = courses.find(c => String(c.id) === courseId);
        if (found) {
            setCourse(found);
            
            // Parse bilingual properties or strings
            const parsedTitle = ensureBilingual(found.title);
            const parsedDesc = ensureBilingual(found.description);

            setTitleEn(parsedTitle.en);
            setTitleAr(parsedTitle.ar);
            setDescEn(parsedDesc.en);
            setDescAr(parsedDesc.ar);
            setThumbnailUrl(found.thumbnailUrl || '');
        }
    }, [courses, courseId]);

    const handleSaveCourseDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseId) return;
        setIsSavingCourse(true);
        try {
            // Serialize bilingual fields as JSON strings for Drizzle text columns
            const serializedTitle = JSON.stringify({ en: titleEn, ar: titleAr });
            const serializedDesc = JSON.stringify({ en: descEn, ar: descAr });

            await updateCourseAction(courseId, {
                title: serializedTitle,
                description: serializedDesc,
                thumbnailUrl
            });
            alert(lang === 'ar' ? 'تم حفظ التعديلات بنجاح!' : 'Course details saved successfully!');
        } catch (err) {
            console.error(err);
        } finally {
            setIsSavingCourse(false);
        }
    };

    const handleSelectLesson = (lesson: Lesson) => {
        setSelectedLesson(lesson);
        
        const parsedTitle = ensureBilingual(lesson.title);
        const parsedContent = ensureBilingual(lesson.content);

        setLessonTitleEn(parsedTitle.en);
        setLessonTitleAr(parsedTitle.ar);
        setLessonContentEn(parsedContent.en);
        setLessonContentAr(parsedContent.ar);
        setLessonVideoUrl(lesson.videoUrl || '');

        // Populate quiz state
        if (lesson.quiz && lesson.quiz.length > 0) {
            setQuizTitle(lang === 'ar' ? 'اختبار الدرس التفاعلي' : 'Interactive Quiz');
            setQuizQuestions(lesson.quiz.map(q => ({
                text: typeof q.text === 'object' ? q.text.ar || q.text.en : q.text,
                options: Array.isArray(q.options) ? q.options : (q.options as any).ar || (q.options as any).en || [],
                correctAnswer: q.correctAnswer
            })));
        } else {
            setQuizTitle('');
            setQuizQuestions([]);
        }
    };

    const handleAddLesson = async () => {
        if (!courseId) return;
        const newOrder = (course?.lessons.length || 0) + 1;
        try {
            const emptyTitle = JSON.stringify({ en: 'New Lesson', ar: 'درس جديد' });
            await addLessonAction(courseId, {
                title: emptyTitle,
                content: '',
                videoUrl: '',
                order: newOrder
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLesson) return;
        setIsSavingLesson(true);
        try {
            const serializedTitle = JSON.stringify({ en: lessonTitleEn, ar: lessonTitleAr });
            const serializedContent = JSON.stringify({ en: lessonContentEn, ar: lessonContentAr });

            await updateLessonAction(selectedLesson.id, {
                title: serializedTitle,
                content: serializedContent,
                videoUrl: lessonVideoUrl,
                order: selectedLesson.id ? 1 : 1 // Keep existing order or calculate
            });

            // Save Quiz if questions exist
            if (quizQuestions.length > 0) {
                await saveQuizAction(selectedLesson.id, {
                    title: quizTitle || 'Quiz',
                    questions: quizQuestions
                });
            }

            alert(lang === 'ar' ? 'تم حفظ الدرس والاختبار بنجاح!' : 'Lesson and Quiz saved successfully!');
            setSelectedLesson(null);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSavingLesson(false);
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا الدرس نهائياً؟' : 'Are you sure you want to delete this lesson?')) {
            return;
        }
        try {
            await deleteLessonAction(lessonId);
            if (selectedLesson?.id === lessonId) {
                setSelectedLesson(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleMoveLesson = async (index: number, direction: 'up' | 'down') => {
        if (!course) return;
        const list = [...course.lessons];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= list.length) return;

        // Swap order numbers
        const current = list[index];
        const target = list[targetIndex];

        try {
            // Update order values in database
            await updateLessonAction(current.id, {
                title: JSON.stringify(current.title),
                content: JSON.stringify(current.content),
                videoUrl: current.videoUrl,
                order: targetIndex + 1
            });
            await updateLessonAction(target.id, {
                title: JSON.stringify(target.title),
                content: JSON.stringify(target.content),
                videoUrl: target.videoUrl,
                order: index + 1
            });
            await loadCourses();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddQuizQuestion = () => {
        setQuizQuestions(prev => [
            ...prev,
            { text: '', options: ['', '', ''], correctAnswer: 0 }
        ]);
    };

    const handleRemoveQuizQuestion = (qIndex: number) => {
        setQuizQuestions(prev => prev.filter((_, idx) => idx !== qIndex));
    };

    if (!course) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-gray-400 font-semibold">{lang === 'ar' ? 'جاري تحميل الدورة...' : 'Loading course details...'}</p>
            </div>
        );
    }

    const parsedTitle = ensureBilingual(course.title);
    const titleStr = parsedTitle[lang];

    return (
        <div className="space-y-6">
            {/* Nav Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link to="/teacher/courses" className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                            {lang === 'ar' ? 'تعديل الدورة التعليمية' : 'Edit Course'}
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                        </h1>
                        <p className="text-xs text-gray-400 font-bold">{titleStr}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link to={`/dashboard/courses/${course.id}`} target="_blank">
                        <Button className="flex items-center gap-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/10">
                            <Play className="w-3.5 h-3.5" />
                            {lang === 'ar' ? 'معاينة كطالب' : 'Preview as Student'}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`px-6 py-3 text-xs font-black transition-all ${
                        activeTab === 'details'
                            ? 'border-b-2 border-emerald-600 text-emerald-700 dark:text-emerald-400'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    {lang === 'ar' ? 'خصائص الدورة' : 'Course Details'}
                </button>
                <button
                    onClick={() => setActiveTab('lessons')}
                    className={`px-6 py-3 text-xs font-black transition-all ${
                        activeTab === 'lessons'
                            ? 'border-b-2 border-emerald-600 text-emerald-700 dark:text-emerald-400'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    {lang === 'ar' ? 'الدروس والاختبارات' : 'Lessons & Quizzes'}
                </button>
            </div>

            {/* Content Tabs */}
            {activeTab === 'details' ? (
                <Card className="border border-gray-150 dark:border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-sm font-black flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-emerald-500" />
                            {lang === 'ar' ? 'الإعدادات الأساسية (ثنائي اللغة)' : 'Basic Properties (Bilingual)'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSaveCourseDetails} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label={lang === 'ar' ? 'العنوان بالإنجليزية' : 'Title (English)'}
                                    value={titleEn}
                                    onChange={(e) => setTitleEn(e.target.value)}
                                    required
                                />
                                <Input
                                    label={lang === 'ar' ? 'العنوان بالعربية' : 'Title (Arabic)'}
                                    value={titleAr}
                                    onChange={(e) => setTitleAr(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">{lang === 'ar' ? 'الوصف بالإنجليزية' : 'Description (English)'}</label>
                                    <textarea
                                        className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[100px]"
                                        value={descEn}
                                        onChange={(e) => setDescEn(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">{lang === 'ar' ? 'الوصف بالعربية' : 'Description (Arabic)'}</label>
                                    <textarea
                                        className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-105 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[100px]"
                                        value={descAr}
                                        onChange={(e) => setDescAr(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Input
                                label={lang === 'ar' ? 'رابط الصورة الرمزية للمنهج' : 'Course Thumbnail URL'}
                                value={thumbnailUrl}
                                onChange={(e) => setThumbnailUrl(e.target.value)}
                            />

                            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                                <Button type="submit" disabled={isSavingCourse} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6">
                                    {isSavingCourse ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ إعدادات المنهج' : 'Save Properties')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Lesson List */}
                    <Card className="lg:col-span-1 border border-gray-100 dark:border-gray-800 self-start">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-black">{lang === 'ar' ? 'هيكل الدروس' : 'Course Outline'}</CardTitle>
                            <Button 
                                size="sm" 
                                onClick={handleAddLesson}
                                className="h-7 px-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 text-[10px]"
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                {lang === 'ar' ? 'إضافة درس' : 'Add Lesson'}
                            </Button>
                        </CardHeader>
                        <CardContent className="p-3">
                            <div className="space-y-1.5">
                                {course.lessons.map((lesson, idx) => {
                                    const parsedTitle = ensureBilingual(lesson.title);
                                    const lTitle = parsedTitle[lang];
                                    const isSelected = selectedLesson?.id === lesson.id;
                                    
                                    return (
                                        <div 
                                            key={lesson.id} 
                                            className={cn(
                                                "p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-bold transition-all cursor-pointer active:scale-[0.99]",
                                                isSelected 
                                                    ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50' 
                                                    : 'bg-white border-gray-150 hover:bg-gray-50/50 dark:bg-gray-900 dark:border-gray-800'
                                            )}
                                            onClick={() => handleSelectLesson(lesson)}
                                        >
                                            <div className="overflow-hidden">
                                                <p className="truncate text-gray-900 dark:text-white">{lTitle}</p>
                                                <p className="text-[10px] text-gray-400 font-semibold">{lang === 'ar' ? 'ترتيب:' : 'Order:'} {idx + 1}</p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                                                <button 
                                                    disabled={idx === 0} 
                                                    onClick={() => handleMoveLesson(idx, 'up')}
                                                    className="p-1 rounded bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 hover:dark:bg-gray-700 disabled:opacity-30"
                                                >
                                                    <ArrowUp className="w-3 h-3 text-gray-500" />
                                                </button>
                                                <button 
                                                    disabled={idx === course.lessons.length - 1} 
                                                    onClick={() => handleMoveLesson(idx, 'down')}
                                                    className="p-1 rounded bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 hover:dark:bg-gray-700 disabled:opacity-30"
                                                >
                                                    <ArrowDown className="w-3 h-3 text-gray-500" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteLesson(lesson.id)}
                                                    className="p-1 rounded bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-600"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {course.lessons.length === 0 && (
                                    <p className="text-center py-6 text-[10px] text-gray-400 font-semibold">
                                        {lang === 'ar' ? 'لا توجد دروس مضافة حالياً.' : 'No lessons added yet.'}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column: Editor Workspace */}
                    <div className="lg:col-span-2 space-y-6">
                        {selectedLesson ? (
                            <form onSubmit={handleSaveLesson} className="space-y-6">
                                <Card className="border border-gray-100 dark:border-gray-800 shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-sm font-black flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-emerald-500" />
                                            {lang === 'ar' ? 'تعديل محتوى الدرس' : 'Edit Lesson Workspace'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <Input
                                                label={lang === 'ar' ? 'عنوان الدرس بالإنجليزية' : 'Lesson Title (English)'}
                                                value={lessonTitleEn}
                                                onChange={(e) => setLessonTitleEn(e.target.value)}
                                                required
                                            />
                                            <Input
                                                label={lang === 'ar' ? 'عنوان الدرس بالعربية' : 'Lesson Title (Arabic)'}
                                                value={lessonTitleAr}
                                                onChange={(e) => setLessonTitleAr(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500">{lang === 'ar' ? 'محتوى الدرس بالإنجليزية' : 'Content (English)'}</label>
                                                <textarea
                                                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[120px]"
                                                    value={lessonContentEn}
                                                    onChange={(e) => setLessonContentEn(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500">{lang === 'ar' ? 'محتوى الدرس بالعربية' : 'Content (Arabic)'}</label>
                                                <textarea
                                                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-105 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[120px]"
                                                    value={lessonContentAr}
                                                    onChange={(e) => setLessonContentAr(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <Input
                                            label={lang === 'ar' ? 'رابط ملف الفيديو (فيديو الدرس)' : 'Video URL'}
                                            value={lessonVideoUrl}
                                            onChange={(e) => setLessonVideoUrl(e.target.value)}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Quiz Creator Widget */}
                                <Card className="border border-gray-100 dark:border-gray-800 shadow-md">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-black">
                                            {lang === 'ar' ? 'أسئلة الاختبار التفاعلي' : 'Lesson Quiz Setup'}
                                        </CardTitle>
                                        <Button 
                                            type="button" 
                                            size="sm" 
                                            onClick={handleAddQuizQuestion}
                                            className="h-7 px-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 text-[10px]"
                                        >
                                            <Plus className="w-3.5 h-3.5 mr-1" />
                                            {lang === 'ar' ? 'سؤال جديد' : 'Add Question'}
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {quizQuestions.map((q, qIdx) => (
                                            <div key={qIdx} className="p-4 border border-gray-150 dark:border-gray-800 rounded-xl space-y-3 relative">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveQuizQuestion(qIdx)}
                                                    className="absolute top-3 right-3 left-3 flex justify-end text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>

                                                <h4 className="text-xs font-extrabold text-emerald-600">
                                                    {lang === 'ar' ? 'سؤال' : 'Question'} #{qIdx + 1}
                                                </h4>

                                                <Input
                                                    label={lang === 'ar' ? 'نص السؤال بالعربية' : 'Question text'}
                                                    value={q.text}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setQuizQuestions(prev => prev.map((item, idx) => idx === qIdx ? { ...item, text: val } : item));
                                                    }}
                                                    required
                                                />

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    {q.options.map((opt, optIdx) => (
                                                        <Input
                                                            key={optIdx}
                                                            label={`${lang === 'ar' ? 'الخيار' : 'Option'} ${optIdx + 1}`}
                                                            value={opt}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setQuizQuestions(prev => prev.map((item, idx) => {
                                                                    if (idx !== qIdx) return item;
                                                                    const updatedOptions = [...item.options];
                                                                    updatedOptions[optIdx] = val;
                                                                    return { ...item, options: updatedOptions };
                                                                }));
                                                            }}
                                                            required
                                                        />
                                                    ))}
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500">{lang === 'ar' ? 'الإجابة الصحيحة (رقم الخيار)' : 'Correct Option'}</label>
                                                    <select
                                                        className="w-full text-xs px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                                        value={q.correctAnswer}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value);
                                                            setQuizQuestions(prev => prev.map((item, idx) => idx === qIdx ? { ...item, correctAnswer: val } : item));
                                                        }}
                                                    >
                                                        {q.options.map((_, oIdx) => (
                                                            <option key={oIdx} value={oIdx}>
                                                                {lang === 'ar' ? 'الخيار' : 'Option'} {oIdx + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        ))}

                                        {quizQuestions.length === 0 && (
                                            <p className="text-center py-4 text-[10px] text-gray-400 font-semibold">
                                                {lang === 'ar' ? 'لا يوجد اختبار مضاف لهذا الدرس.' : 'No quiz attached to this lesson.'}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-800">
                                    <Button 
                                        variant="outline" 
                                        type="button" 
                                        onClick={() => setSelectedLesson(null)}
                                        className="border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-300"
                                    >
                                        {lang === 'ar' ? 'إلغاء' : 'Close Workspace'}
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={isSavingLesson} 
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                    >
                                        {isSavingLesson ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ الدرس والتعديلات' : 'Save Lesson & Quiz')}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 p-6 text-center">
                                <FileText className="w-8 h-8 text-gray-300 mb-3" />
                                <p className="text-xs text-gray-400 font-bold">
                                    {lang === 'ar' ? 'اختر درساً من هيكل الدروس الأيمن لتعديله أو إضافة محتوى إليه.' : 'Select a lesson from the outline to configure its contents and quiz.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
