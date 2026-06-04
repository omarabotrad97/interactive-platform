import { useState } from 'react';
import { useStore, Flashcard } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';
import { Plus, ChevronRight, ChevronLeft, ArrowRightLeft, Sparkles, BookOpen, Calendar, Zap, ListFilter } from 'lucide-react';

interface FlashcardStudyProps {
    courseId: string;
}

export default function FlashcardStudy({ courseId }: FlashcardStudyProps) {
    const { lang, flashcards, rateFlashcard, addFlashcard, simulatedTime, simulateTimeForward } = useStore();
    const [isFlipped, setIsFlipped] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    
    // Filter tabs: 'due' | 'all'
    const [filterTab, setFilterTab] = useState<'due' | 'all'>('due');

    // Get cards for this course
    const courseCards = flashcards.filter(card => card.courseId === courseId);
    
    // Split into Due vs All
    const dueCards = courseCards.filter(c => (c.nextReviewDue || 0) <= simulatedTime);
    const activeCardsQueue = filterTab === 'due' ? dueCards : courseCards;
    const activeCard: Flashcard | undefined = activeCardsQueue[currentIndex];

    // Spaced repetition interval calculators for preview values
    const getNextIntervalPreview = (card: Flashcard, grade: 1 | 2 | 3 | 4) => {
        if (grade === 1) return lang === 'ar' ? '10 د' : '10m';
        
        let repetitions = card.repetitions || 0;
        let easeFactor = card.easeFactor || 2.5;
        let interval = card.interval || 0;
        
        // Simulate next repetitions count increment
        repetitions = repetitions + 1;
        let nextInterval = 1;
        if (repetitions === 1) {
            nextInterval = grade === 2 ? 1 : grade === 3 ? 1 : 2;
        } else if (repetitions === 2) {
            nextInterval = grade === 2 ? 2 : grade === 3 ? 6 : 8;
        } else {
            const multiplier = grade === 2 ? 1.2 : grade === 3 ? easeFactor : easeFactor * 1.3;
            nextInterval = Math.ceil(interval * multiplier);
        }
        
        return lang === 'ar' ? `${nextInterval} ي` : `${nextInterval}d`;
    };

    const handleRate = (grade: 1 | 2 | 3 | 4) => {
        if (!activeCard) return;
        rateFlashcard(activeCard.id, grade);
        setIsFlipped(false);
        
        // Safety bounds check when cards queue shifts
        setTimeout(() => {
            if (currentIndex >= activeCardsQueue.length - 1) {
                setCurrentIndex(0);
            }
        }, 300);
    };

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newQuestion.trim() || !newAnswer.trim()) return;
        addFlashcard(courseId, newQuestion, newAnswer);
        setNewQuestion('');
        setNewAnswer('');
        setShowAddForm(false);
        setFilterTab('all');
        setCurrentIndex(courseCards.length); // Focus new card
    };

    const formattedDate = new Date(simulatedTime).toLocaleDateString(
        lang === 'ar' ? 'ar-EG' : 'en-US', 
        { weekday: 'long', month: 'long', day: 'numeric' }
    );

    return (
        <div id="guide-flashcards" className="space-y-6">
            
            {/* Spaced Repetition Calibration Panel */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-2xl p-4 border border-indigo-100/50 dark:border-indigo-900/20 space-y-3.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                        <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <div>
                            <div className="text-[10px] text-indigo-500/80 uppercase">{lang === 'ar' ? 'التوقيت الافتراضي للمنصة' : 'Platform System Clock'}</div>
                            <div className="text-xs">{formattedDate}</div>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => simulateTimeForward(1)}
                        className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60 rounded-xl text-xs font-black hover:bg-indigo-50 dark:hover:bg-indigo-900/20 active:scale-95 transition-all shadow-sm shrink-0"
                    >
                        <Zap className="w-3.5 h-3.5 fill-current text-yellow-500" />
                        {lang === 'ar' ? 'محاكاة +1 يوم' : 'Simulate +1 Day'}
                    </button>
                </div>

                {/* Queue filter tabs Due Now vs All */}
                <div className="flex bg-white dark:bg-gray-900 rounded-xl p-1 border border-gray-100 dark:border-gray-850 shadow-sm">
                    <button
                        onClick={() => { setFilterTab('due'); setCurrentIndex(0); setIsFlipped(false); }}
                        className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                            filterTab === 'due'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-500 hover:text-gray-850 dark:hover:text-gray-300'
                        }`}
                    >
                        <ListFilter className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'المستحقة للمراجعة' : 'Due for Review'}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                            filterTab === 'due' ? 'bg-indigo-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                            {dueCards.length}
                        </span>
                    </button>
                    <button
                        onClick={() => { setFilterTab('all'); setCurrentIndex(0); setIsFlipped(false); }}
                        className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                            filterTab === 'all'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-500 hover:text-gray-850 dark:hover:text-gray-300'
                        }`}
                    >
                        <span>{lang === 'ar' ? 'جميع بطاقات الكورس' : 'All Decks'}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                            filterTab === 'all' ? 'bg-indigo-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                            {courseCards.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* Flashcard Area */}
            {activeCard ? (
                <div className="flex flex-col items-center">
                    
                    {/* Flippable Card Container */}
                    <div 
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="w-full max-w-sm h-72 perspective-1000 cursor-pointer group"
                    >
                        <div className={`relative w-full h-full transform-style-3d transition-transform duration-500 rounded-2xl shadow-xl ${
                            isFlipped ? 'rotate-y-180' : ''
                        }`}>
                            
                            {/* Front Side */}
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white rounded-2xl backface-hidden p-6 flex flex-col justify-between border border-indigo-400/20">
                                <div className="flex items-center justify-between text-xs opacity-75 font-semibold">
                                    <span className="flex items-center gap-1">
                                        <BookOpen className="w-3.5 h-3.5" />
                                        {lang === 'ar' ? 'سؤال استذكاري' : 'Anki Flashcard'}
                                    </span>
                                    <span className="bg-white/20 px-2 py-0.5 rounded-full">
                                        {lang === 'ar' ? `سهولة: ${activeCard.easeFactor.toFixed(2)}` : `EF: ${activeCard.easeFactor.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="text-center text-lg font-bold leading-relaxed px-4 my-auto">
                                    {activeCard.question[lang]}
                                </div>
                                <div className="text-center text-[10px] uppercase font-bold tracking-wider opacity-75 flex items-center justify-center gap-1.5 animate-pulse">
                                    <ArrowRightLeft className="w-3.5 h-3.5" />
                                    {getTranslation(lang, 'clickToFlip')}
                                </div>
                            </div>

                            {/* Back Side (with SM-2 Metadata info) */}
                            <div className="absolute inset-0 w-full h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl backface-hidden rotate-y-180 p-6 flex flex-col justify-between border-2 border-indigo-500/30">
                                <div className="flex items-center justify-between text-xs text-indigo-500 dark:text-indigo-400 font-bold border-b border-gray-100 dark:border-gray-800 pb-2">
                                    <span className="flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        {lang === 'ar' ? 'الإجابة والجدولة' : 'Spaced Retention Details'}
                                    </span>
                                </div>
                                
                                <div className="text-center text-sm font-semibold leading-relaxed overflow-y-auto max-h-24 px-4 my-auto">
                                    {activeCard.answer[lang]}
                                </div>

                                {/* Spaced Repetition parameters display panel */}
                                <div className="bg-gray-50 dark:bg-gray-850 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-[10px] font-bold text-gray-500 grid grid-cols-3 gap-2 text-center mt-3">
                                    <div>
                                        <div className="text-gray-800 dark:text-gray-300 font-black">{activeCard.easeFactor.toFixed(2)}</div>
                                        <div>{lang === 'ar' ? 'معامل السهولة' : 'Ease Factor'}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-800 dark:text-gray-300 font-black">{activeCard.repetitions}</div>
                                        <div>{lang === 'ar' ? 'التكرارات' : 'Repetitions'}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-800 dark:text-gray-300 font-black">
                                            {activeCard.interval === 0 ? '-' : `${activeCard.interval}d`}
                                        </div>
                                        <div>{lang === 'ar' ? 'المباعدة' : 'Interval'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pagination controls */}
                    <div className="flex items-center gap-4 mt-6">
                        <button
                            disabled={currentIndex === 0}
                            onClick={() => { setIsFlipped(false); setCurrentIndex(p => p - 1); }}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            {lang === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </button>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                            {currentIndex + 1} / {activeCardsQueue.length}
                        </span>
                        <button
                            disabled={currentIndex === activeCardsQueue.length - 1}
                            onClick={() => { setIsFlipped(false); setCurrentIndex(p => p + 1); }}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            {lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Spaced Repetition Grading Controls (4 Anki Buttons with dynamic intervals rendered above them) */}
                    <div className={`w-full max-w-sm mt-5 space-y-2.5 transition-all duration-300 ${
                        isFlipped ? 'opacity-100 translate-y-0' : 'opacity-35 pointer-events-none translate-y-2'
                    }`}>
                        <p className="text-xs font-bold text-center text-gray-500 dark:text-gray-400">
                            {getTranslation(lang, 'rateDifficulty')}
                        </p>
                        
                        <div className="grid grid-cols-4 gap-1.5">
                            {/* Again Button */}
                            <button
                                onClick={() => handleRate(1)}
                                className="flex flex-col items-center justify-between p-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-950/40 active:scale-95 transition-all h-14"
                            >
                                <span className="text-[10px] font-black opacity-85">{getNextIntervalPreview(activeCard, 1)}</span>
                                <span className="text-[10px] font-extrabold">{lang === 'ar' ? 'مجدداً' : 'Again'}</span>
                            </button>

                            {/* Hard Button */}
                            <button
                                onClick={() => handleRate(2)}
                                className="flex flex-col items-center justify-between p-2 bg-yellow-50/50 dark:bg-yellow-950/10 text-yellow-600 dark:text-yellow-400 rounded-xl border border-yellow-200/50 dark:border-yellow-900/30 hover:bg-yellow-100/60 dark:hover:bg-yellow-950/30 active:scale-95 transition-all h-14"
                            >
                                <span className="text-[10px] font-black opacity-85">{getNextIntervalPreview(activeCard, 2)}</span>
                                <span className="text-[10px] font-extrabold">{lang === 'ar' ? 'صعب' : 'Hard'}</span>
                            </button>

                            {/* Good Button */}
                            <button
                                onClick={() => handleRate(3)}
                                className="flex flex-col items-center justify-between p-2 bg-indigo-50/60 dark:bg-indigo-950/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-200/50 dark:border-indigo-900/30 hover:bg-indigo-100/60 dark:hover:bg-indigo-950/30 active:scale-95 transition-all h-14"
                            >
                                <span className="text-[10px] font-black opacity-85">{getNextIntervalPreview(activeCard, 3)}</span>
                                <span className="text-[10px] font-extrabold">{lang === 'ar' ? 'جيد' : 'Good'}</span>
                            </button>

                            {/* Easy Button */}
                            <button
                                onClick={() => handleRate(4)}
                                className="flex flex-col items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-xl border border-green-200 dark:border-green-900/50 hover:bg-green-100 dark:hover:bg-green-950/40 active:scale-95 transition-all h-14"
                            >
                                <span className="text-[10px] font-black opacity-85">{getNextIntervalPreview(activeCard, 4)}</span>
                                <span className="text-[10px] font-extrabold">{lang === 'ar' ? 'سهل' : 'Easy'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 dark:bg-gray-900/30 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-gray-500 font-bold text-sm">
                    {filterTab === 'due' ? (
                        <div className="space-y-2">
                            <Sparkles className="w-8 h-8 text-yellow-500 animate-bounce mx-auto" />
                            <p>{lang === 'ar' ? '🎉 تهانينا! لقد أنهيت جميع المراجعات المستحقة لهذا اليوم.' : '🎉 Perfect! No flashcards due for review today.'}</p>
                            <p className="text-xs text-gray-400 font-medium">{lang === 'ar' ? 'اضغط على زر "محاكاة +1 يوم" لتقديم الساعة ودراسة بطاقات الغد.' : 'Click "Simulate +1 Day" to jump calendar forward.'}</p>
                        </div>
                    ) : (
                        getTranslation(lang, 'noFlashcards')
                    )}
                </div>
            )}

            {/* Add Custom Flashcard form wrapper */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                {!showAddForm ? (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-500 hover:text-indigo-600 hover:border-indigo-300 dark:hover:text-indigo-400 dark:hover:border-indigo-800 transition-all active:scale-98"
                    >
                        <Plus className="w-4 h-4" />
                        {lang === 'ar' ? 'أضف بطاقة استذكار جديدة خاصة بك' : 'Add Your Own Flashcard'}
                    </button>
                ) : (
                    <form onSubmit={handleAddCard} className="space-y-4 bg-gray-50 dark:bg-gray-850 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-gray-400">
                                {lang === 'ar' ? 'السؤال / المفهوم:' : 'Question / Concept:'}
                            </label>
                            <input
                                type="text"
                                value={newQuestion}
                                onChange={e => setNewQuestion(e.target.value)}
                                className="w-full p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                placeholder={lang === 'ar' ? 'مثال: ما هو كود التنسيق النظيف؟' : 'e.g., What is Clean Styling?'}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-gray-400">
                                {lang === 'ar' ? 'الجواب / الشرح المبسط:' : 'Answer / Summary:'}
                            </label>
                            <textarea
                                value={newAnswer}
                                onChange={e => setNewAnswer(e.target.value)}
                                className="w-full p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 h-20 resize-none"
                                placeholder={lang === 'ar' ? 'اكتب الشرح المختصر والواضح هنا...' : 'e.g., Styling that reduces layout shifts and code duplication.'}
                                required
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="py-2 px-4 border border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-xs font-bold transition-all"
                            >
                                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button
                                type="submit"
                                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/10"
                            >
                                {lang === 'ar' ? 'إضافة بطاقة' : 'Create Card'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
