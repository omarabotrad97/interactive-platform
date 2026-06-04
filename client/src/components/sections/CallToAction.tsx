import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function CallToAction() {
    const { lang } = useStore();

    return (
        <section className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 dark:from-emerald-950/40 dark:via-emerald-900/30 dark:to-teal-950/20 relative overflow-hidden transition-colors duration-200 border-t border-emerald-500/10">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center text-white space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                    {getTranslation(lang, 'ctaTitle')}
                </h2>
                
                <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
                    {getTranslation(lang, 'ctaSubtitle')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm sm:max-w-none mx-auto animate-fade-in-up">
                    <Link to="/auth/signup" className="w-full sm:w-auto">
                        <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 border-transparent h-14 px-8 text-base font-extrabold w-full sm:w-auto rounded-xl active:scale-95 transition-all shadow-lg shadow-black/5">
                            {getTranslation(lang, 'getStarted')}
                        </Button>
                    </Link>
                    <Link to="/auth/login" className="w-full sm:w-auto">
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 h-14 px-8 text-base font-extrabold w-full sm:w-auto rounded-xl active:scale-95 transition-all">
                            {getTranslation(lang, 'login')}
                        </Button>
                    </Link>
                </div>

                <p className="text-[10px] text-emerald-200/80 font-bold uppercase tracking-wider mt-4">
                    ✓ {lang === 'ar' ? 'لا توجد مصاريف خفية - ابدأ في دقيقة واحدة' : 'No credit card required to start learning'}
                </p>
            </div>
        </section>
    );
}
