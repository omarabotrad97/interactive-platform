import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function Hero() {
    const { lang } = useStore();
    console.log("Testing Antigravity integration - Hero section loaded successfully!");

    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-200">
            {/* Background elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-white to-white dark:from-emerald-950/5 dark:via-gray-950 dark:to-gray-950" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-100/30 to-transparent dark:from-emerald-900/10 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-amber-100/20 to-transparent dark:from-amber-900/5 blur-3xl opacity-50" />
            </div>

            {/* Mathematically generated repeating SVG geometric Arabesque background pattern */}
            <div className="absolute inset-0 -z-5 pointer-events-none opacity-40">
                <svg className="absolute inset-0 w-full h-full stroke-emerald-600/10 dark:stroke-emerald-400/10 fill-none" width="100%" height="100%">
                    <pattern id="arabesque" width="100" height="100" patternUnits="userSpaceOnUse">
                        {/* Star base */}
                        <path d="M 50,0 L 100,50 L 50,100 L 0,50 Z" strokeWidth="0.75" />
                        <circle cx="50" cy="50" r="20" strokeWidth="0.75" />
                        {/* Diagonals */}
                        <path d="M 0,0 L 100,100 M 100,0 L 0,100" strokeWidth="0.75" />
                        {/* Inner geometric detailing */}
                        <polygon points="50,15 62,50 50,85 38,50" strokeWidth="0.5" />
                        <polygon points="15,50 50,62 85,50 50,38" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="5" className="fill-emerald-500/5 dark:fill-emerald-400/5" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#arabesque)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                {/* Cultural Hook Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-8 animate-fade-in-up border border-emerald-100/50 dark:border-emerald-900/30">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse-ring" />
                    {getTranslation(lang, 'heroBadge')}
                </div>

                {/* Main Hero Header */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-700 to-amber-500 dark:from-emerald-400 dark:via-teal-400 dark:to-amber-400 leading-tight py-1 select-none">
                    {lang === 'ar' ? (
                        <>
                            امتلك ناصية المستقبل <br /> بالتعليم والتمكين الرقمي
                        </>
                    ) : (
                        getTranslation(lang, 'heroTitle')
                    )}
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-bold">
                    {getTranslation(lang, 'heroSubtitle')}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm sm:max-w-none mx-auto animate-fade-in-up delay-300">
                    <Link to="/auth/signup" className="w-full sm:w-auto">
                        <Button size="lg" className="h-14 px-8 text-base font-extrabold w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/10 active:scale-95 transition-all">
                            {getTranslation(lang, 'getStarted')}
                            {/* Flip arrow direction on RTL */}
                            <ArrowRight className={`w-5 h-5 ${lang === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                        </Button>
                    </Link>
                    <Link to="/auth/login" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="h-14 px-8 text-base font-extrabold w-full sm:w-auto border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl active:scale-95 transition-all">
                            {getTranslation(lang, 'exploreCourses')}
                        </Button>
                    </Link>
                </div>

                {/* Weekly news sub-indicator */}
                <div className="mt-8 text-xs font-bold text-gray-400 dark:text-gray-500">
                    💡 {getTranslation(lang, 'heroBanner')}
                </div>
            </div>
        </section>
    );
}
