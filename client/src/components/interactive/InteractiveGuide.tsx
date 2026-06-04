import { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, X, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function InteractiveGuide() {
    const { 
        lang, 
        isGuideOpen, 
        activeGuideStep, 
        closeGuide, 
        setGuideStep 
    } = useStore();

    const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

    const steps = [
        {
            id: 'guide-gamification',
            titleKey: 'guide_step_1_title' as const,
            descKey: 'guide_step_1_desc' as const,
            targetSelector: '#guide-gamification'
        },
        {
            id: 'guide-lang',
            titleKey: 'guide_step_2_title' as const,
            descKey: 'guide_step_2_desc' as const,
            targetSelector: '#guide-lang'
        },
        {
            id: 'guide-pomodoro',
            titleKey: 'guide_step_3_title' as const,
            descKey: 'guide_step_3_desc' as const,
            targetSelector: '#guide-pomodoro'
        },
        {
            id: 'guide-flashcards',
            titleKey: 'guide_step_4_title' as const,
            descKey: 'guide_step_4_desc' as const,
            targetSelector: '#guide-flashcards'
        },
        {
            id: 'guide-notes',
            titleKey: 'guide_step_5_title' as const,
            descKey: 'guide_step_5_desc' as const,
            targetSelector: '#guide-notes'
        }
    ];

    const currentStep = steps[activeGuideStep - 1];

    useEffect(() => {
        if (!isGuideOpen || !currentStep) {
            setCoords(null);
            return;
        }

        const updatePosition = () => {
            const el = document.querySelector(currentStep.targetSelector);
            if (el) {
                const rect = el.getBoundingClientRect();
                setCoords({
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                    height: rect.height
                });
            } else {
                setCoords(null); // Fallback to center screen overlay
            }
        };

        // Delay slightly for any layout rendering
        const timeout = setTimeout(updatePosition, 100);
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [isGuideOpen, activeGuideStep, currentStep]);

    if (!isGuideOpen || !currentStep) return null;

    const handleNext = () => {
        if (activeGuideStep < steps.length) {
            setGuideStep(activeGuideStep + 1);
        } else {
            closeGuide();
        }
    };

    const handlePrev = () => {
        if (activeGuideStep > 1) {
            setGuideStep(activeGuideStep - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
            {/* Dark Backdrop Overlay */}
            <div className="absolute inset-0 bg-black/60 dark:bg-black/80 transition-opacity duration-300 pointer-events-auto" onClick={closeGuide} />

            {/* Glowing spotlight mask if element exists */}
            {coords && (
                <div 
                    className="absolute border-2 border-indigo-500 rounded-lg shadow-[0_0_20px_5px_rgba(99,102,241,0.5)] animate-pulse-ring transition-all duration-300 pointer-events-none"
                    style={{
                        top: coords.top - 6,
                        left: coords.left - 6,
                        width: coords.width + 12,
                        height: coords.height + 12
                    }}
                />
            )}

            {/* Guide Card Box */}
            <div 
                className={`absolute pointer-events-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-800 transition-all duration-300 ${
                    coords 
                        ? 'max-w-sm' 
                        : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full px-8'
                }`}
                style={
                    coords 
                        ? {
                            top: Math.min(window.innerHeight - 260, Math.max(20, coords.top + coords.height + 16)),
                            left: lang === 'ar'
                                ? Math.max(20, coords.left + coords.width - 320)
                                : Math.min(window.innerWidth - 360, Math.max(20, coords.left)),
                          }
                        : {}
                }
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="w-4 h-4 animate-spin-slow" />
                        {getTranslation(lang, 'guideWelcome')} ({activeGuideStep}/{steps.length})
                    </span>
                    <button 
                        onClick={closeGuide} 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-2 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {getTranslation(lang, currentStep.titleKey)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {getTranslation(lang, currentStep.descKey)}
                    </p>
                    
                    {!coords && (
                        <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-2 font-medium">
                            {lang === 'ar' 
                                ? '💡 (هذه الميزة متوفرة داخل مشغل الدروس)' 
                                : '💡 (This feature is available inside the Lesson Player)'}
                        </p>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                        {steps.map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                    activeGuideStep === i + 1 
                                        ? 'w-4 bg-indigo-600 dark:bg-indigo-400' 
                                        : 'bg-gray-200 dark:bg-gray-700'
                                }`} 
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        {activeGuideStep > 1 && (
                            <button
                                onClick={handlePrev}
                                className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95"
                            >
                                {lang === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-all shadow-md active:scale-95 shadow-indigo-500/20"
                        >
                            {activeGuideStep === steps.length 
                                ? getTranslation(lang, 'guideFinish') 
                                : getTranslation(lang, 'guideNext')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
