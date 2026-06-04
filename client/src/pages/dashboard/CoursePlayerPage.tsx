import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, PlayCircle, Clock, FileText, ChevronRight, ChevronLeft, Download, ShieldCheck, HelpCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { useStore, Lesson } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';
import PomodoroTimer from '../../components/interactive/PomodoroTimer';
import FlashcardStudy from '../../components/interactive/FlashcardStudy';

export default function CoursePlayerPage() {
    const { courseId } = useParams<{ courseId: string }>();
    const { 
        lang, 
        courses, 
        completedLessons, 
        toggleLessonCompletion, 
        notes, 
        saveNote, 
        addXP,
        badges
    } = useStore();

    // Find current course
    const course = courses.find(c => c.id === courseId) || courses[0];
    const lessons = course.lessons;

    // Active lesson tracking
    const [activeLessonIndex, setActiveLessonIndex] = useState(0);
    const currentLesson: Lesson = lessons[activeLessonIndex] || lessons[0];
    const isCompleted = completedLessons.includes(currentLesson.id);

    // Sidebar Study Tabs: 'notes' | 'flashcards' | 'pomodoro'
    const [studyTab, setStudyTab] = useState<'notes' | 'flashcards' | 'pomodoro'>('notes');

    // Notes State
    const [noteText, setNoteText] = useState('');
    const [isSavingNote, setIsSavingNote] = useState(false);

    // Quiz Player State
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({}); // questionId -> selectedIndex
    const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({}); // quizQuestionId -> submitted
    const [quizResult, setQuizResult] = useState<Record<string, 'correct' | 'incorrect'>>({}); // quizQuestionId -> status
    const [quizShowFeedback, setQuizShowFeedback] = useState(false);

    // Sync note state when lesson changes
    useEffect(() => {
        setNoteText(notes[currentLesson.id] || '');
        setIsSavingNote(false);
        // Reset quiz state for current lesson
        setQuizShowFeedback(false);
    }, [currentLesson.id, notes]);

    // Autosave notes simulation
    const handleNoteChange = (text: string) => {
        setNoteText(text);
        setIsSavingNote(true);
        saveNote(currentLesson.id, text);
        
        // Reset save state after brief timeout
        const t = setTimeout(() => setIsSavingNote(false), 800);
        return () => clearTimeout(t);
    };

    // Export notes to Markdown file
    const exportNotesToMarkdown = () => {
        const blob = new Blob([
            `# Notes on ${currentLesson.title[lang]}\n\nCourse: ${course.title[lang]}\n\n${noteText}`
        ], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notes-${currentLesson.id}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Quiz action handlers
    const handleQuizOptionSelect = (questionId: string, optionIndex: number) => {
        if (quizSubmitted[questionId]) return;
        setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleQuizSubmit = (questionId: string, correctAnswerIndex: number) => {
        const selected = quizAnswers[questionId];
        if (selected === undefined) return;

        const isCorrect = selected === correctAnswerIndex;
        setQuizSubmitted(prev => ({ ...prev, [questionId]: true }));
        setQuizResult(prev => ({ ...prev, [questionId]: isCorrect ? 'correct' : 'incorrect' }));
        setQuizShowFeedback(true);

        if (isCorrect) {
            // Reward 30 XP for correct answer
            addXP(30);
            
            // Check if user unlocks Quiz Master badge
            if (!badges.includes('quiz_master')) {
                // Instantly unlocks the Quiz Master badge
                useStore.setState(prev => ({
                    badges: [...prev.badges, 'quiz_master'],
                    showBadgeNotification: { show: true, badgeKey: 'quiz_master' }
                }));
            }
        }
    };

    const handleQuizRetry = (questionId: string) => {
        setQuizAnswers(prev => {
            const copy = { ...prev };
            delete copy[questionId];
            return copy;
        });
        setQuizSubmitted(prev => ({ ...prev, [questionId]: false }));
        setQuizResult(prev => {
            const copy = { ...prev };
            delete copy[questionId];
            return copy;
        });
        setQuizShowFeedback(false);
    };

    // Calculate progression
    const completedCountInThisCourse = lessons.filter(l => completedLessons.includes(l.id)).length;
    const progressPercent = Math.round((completedCountInThisCourse / lessons.length) * 100);

    return (
        <div className="space-y-6">
            {/* Header / Nav Back */}
            <div className="flex items-center justify-between">
                <Link 
                    to="/dashboard/courses" 
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                    {lang === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    {getTranslation(lang, 'myCourses')}
                </Link>
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/30">
                    {course.title[lang]}
                </div>
            </div>

            {/* 3-Column Responsive Dashboard Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                
                {/* Column 1: Curriculum Navigator (Left / Bottom) */}
                <div className="xl:col-span-1 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-md">
                    <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                        <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                            {getTranslation(lang, 'lessons')}
                        </h3>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-gray-500">
                                <span>{progressPercent}% {lang === 'ar' ? 'مكتمل' : 'Complete'}</span>
                                <span>{completedCountInThisCourse}/{lessons.length}</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-800/60 max-h-[400px] overflow-y-auto">
                        {lessons.map((lesson, index) => {
                            const isActive = index === activeLessonIndex;
                            const isLessonCompleted = completedLessons.includes(lesson.id);

                            return (
                                <button
                                    key={lesson.id}
                                    onClick={() => setActiveLessonIndex(index)}
                                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 text-left transition-colors duration-150 ${
                                        isActive 
                                            ? 'bg-indigo-50/50 dark:bg-indigo-950/10 border-l-4 border-indigo-600 dark:border-indigo-400' 
                                            : 'border-l-4 border-transparent'
                                    }`}
                                >
                                    {isLessonCompleted ? (
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    ) : (
                                        <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${
                                            isActive ? 'border-indigo-600 dark:border-indigo-400' : 'border-gray-300 dark:border-gray-700'
                                        }`}>
                                            {isActive && <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-bold leading-normal truncate ${
                                            isActive 
                                                ? 'text-indigo-700 dark:text-indigo-400' 
                                                : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                            {lesson.title[lang]}
                                        </p>
                                        <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 font-semibold">
                                            <Clock className="w-3 h-3" />
                                            {lang === 'ar' ? 'فيديو + نص' : 'Video & Text'}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Column 2: Player & Main Content (Middle) */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Interactive Video Player */}
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden relative group shadow-lg border border-gray-800 flex items-center justify-center">
                        <video 
                            src={currentLesson.videoUrl} 
                            controls 
                            className="w-full h-full object-cover"
                            poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
                            <PlayCircle className="w-16 h-16 text-white/80 group-hover:scale-105 transition-transform duration-300" />
                        </div>
                    </div>

                    {/* Lesson Meta Data */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                                    {currentLesson.title[lang]}
                                </h1>
                            </div>
                            <Button
                                variant={isCompleted ? "outline" : "primary"}
                                onClick={() => toggleLessonCompletion(currentLesson.id)}
                                className={`rounded-xl font-bold h-10 px-5 active:scale-95 transition-all shrink-0 ${
                                    isCompleted 
                                        ? "text-green-600 border-green-200 bg-green-50/50 hover:bg-green-100 dark:bg-green-950/20 dark:border-green-900/50 dark:hover:bg-green-950/40" 
                                        : "shadow-md shadow-indigo-500/10"
                                }`}
                            >
                                {isCompleted ? (
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircle className="w-4 h-4" />
                                        {getTranslation(lang, 'lessonIncomplete')}
                                    </span>
                                ) : (
                                    getTranslation(lang, 'lessonCompleted')
                                )}
                            </Button>
                        </div>

                        {/* Lesson Content Explanations */}
                        <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                            <p>{currentLesson.content[lang]}</p>
                        </div>
                    </div>

                    {/* Interactive Lesson Quiz */}
                    {currentLesson.quiz && currentLesson.quiz.map((q) => {
                        const hasSubmitted = quizSubmitted[q.id];
                        const isCorrect = quizResult[q.id] === 'correct';
                        const selectedAnswer = quizAnswers[q.id];

                        return (
                            <Card key={q.id} className="border border-gray-200 dark:border-gray-800 shadow-md rounded-2xl overflow-hidden">
                                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 border-b border-indigo-100/50 dark:border-indigo-900/20 flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
                                        {getTranslation(lang, 'interactiveQuiz')}
                                    </h3>
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    <p className="text-base font-bold text-gray-800 dark:text-white leading-relaxed">
                                        {q.text[lang]}
                                    </p>

                                    <div className="grid grid-cols-1 gap-3">
                                        {q.options[lang].map((option, oIdx) => {
                                            const isSelected = selectedAnswer === oIdx;
                                            
                                            let optionClass = 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850';
                                            if (isSelected) {
                                                optionClass = 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400 font-bold';
                                            }
                                            if (hasSubmitted) {
                                                if (oIdx === q.correctAnswer) {
                                                    optionClass = 'bg-green-50 dark:bg-green-950/40 border-green-500 text-green-700 dark:text-green-400 font-bold';
                                                } else if (isSelected && !isCorrect) {
                                                    optionClass = 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-400 font-bold';
                                                } else {
                                                    optionClass = 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-850 text-gray-400 dark:text-gray-600 opacity-60';
                                                }
                                            }

                                            return (
                                                <button
                                                    key={oIdx}
                                                    disabled={hasSubmitted}
                                                    onClick={() => handleQuizOptionSelect(q.id, oIdx)}
                                                    className={`w-full text-left p-3.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${optionClass}`}
                                                >
                                                    <span>{option}</span>
                                                    {hasSubmitted && oIdx === q.correctAnswer && (
                                                        <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Action Bar */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                                        <div>
                                            {quizShowFeedback && (
                                                <span className={`text-sm font-black flex items-center gap-1 ${
                                                    isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                                }`}>
                                                    {isCorrect 
                                                        ? getTranslation(lang, 'correct') 
                                                        : getTranslation(lang, 'incorrect')}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            {hasSubmitted && !isCorrect && (
                                                <Button 
                                                    onClick={() => handleQuizRetry(q.id)} 
                                                    variant="outline" 
                                                    size="sm"
                                                    className="rounded-xl text-xs font-bold"
                                                >
                                                    {getTranslation(lang, 'retry')}
                                                </Button>
                                            )}
                                            {!hasSubmitted ? (
                                                <Button
                                                    disabled={selectedAnswer === undefined}
                                                    onClick={() => handleQuizSubmit(q.id, q.correctAnswer)}
                                                    size="sm"
                                                    className="rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10 px-5"
                                                >
                                                    {getTranslation(lang, 'submitAnswer')}
                                                </Button>
                                            ) : null}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Column 3: Interactive Tab Utilities (Right / Top Sidebar) */}
                <div className="xl:col-span-1 space-y-6">
                    {/* Tab Navigation header */}
                    <div className="flex bg-gray-100 dark:bg-gray-800/80 rounded-xl p-1 w-full border border-gray-200/50 dark:border-gray-800/60 shadow-inner">
                        {[
                            { id: 'notes', labelKey: 'notesTab' as const },
                            { id: 'flashcards', labelKey: 'flashcardsTab' as const },
                            { id: 'pomodoro', labelKey: 'pomodoroTab' as const }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setStudyTab(tab.id as any)}
                                className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${
                                    studyTab === tab.id
                                        ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-md font-bold'
                                        : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                                }`}
                            >
                                {getTranslation(lang, tab.labelKey)}
                            </button>
                        ))}
                    </div>

                    {/* Active Widget View */}
                    <div className="transition-all duration-200">
                        {studyTab === 'notes' && (
                            <Card id="guide-notes" className="border border-gray-200 dark:border-gray-800 shadow-md rounded-2xl p-5 space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                                    <span className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                                        <FileText className="w-4 h-4" />
                                        {getTranslation(lang, 'notesTab')}
                                    </span>
                                    {isSavingNote && (
                                        <span className="text-[10px] text-green-500 font-bold bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full animate-pulse">
                                            {lang === 'ar' ? 'حفظ تلقائي...' : 'Autosaved...'}
                                        </span>
                                    )}
                                </div>

                                <textarea
                                    value={noteText}
                                    onChange={(e) => handleNoteChange(e.target.value)}
                                    className="w-full min-h-[220px] p-4 bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none font-medium leading-relaxed"
                                    placeholder={getTranslation(lang, 'writeNotesHere')}
                                />

                                <Button 
                                    onClick={exportNotesToMarkdown}
                                    disabled={!noteText.trim()}
                                    className="w-full flex items-center justify-center gap-1.5 h-11 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10"
                                >
                                    <Download className="w-4 h-4" />
                                    {getTranslation(lang, 'exportNotes')}
                                </Button>
                            </Card>
                        )}

                        {studyTab === 'flashcards' && (
                            <FlashcardStudy courseId={course.id} />
                        )}

                        {studyTab === 'pomodoro' && (
                            <PomodoroTimer />
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
