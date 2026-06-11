import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export default function CallToAction() {
    const { lang } = useStore();

    return (
        <section className="py-24 bg-brutal-cream transition-colors duration-200 border-t-2 border-slate-900 pb-32">
            <div className="max-w-5xl mx-auto px-4 relative z-10">
                {/* Neobrutalist Sky-Blue Card */}
                <Card variant="brutal" className="relative bg-[#29b6f6] px-6 sm:px-12 py-14 text-center text-slate-900 overflow-hidden transform -rotate-0.5">
                    
                    {/* Floating stickers & stars */}
                    <div className="absolute top-4 left-4 text-xl select-none animate-bounce hidden sm:block">⭐</div>
                    <div className="absolute bottom-4 right-4 text-xl select-none animate-pulse hidden sm:block">⭐</div>
                    
                    {/* Smiling Green Badge */}
                    <div className="absolute -top-3 right-8 w-10 h-10 rounded-full bg-[#55efc4] border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#000] text-lg select-none">
                        😊
                    </div>
...
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight font-cairo">
                        {lang === 'ar' 
                            ? 'أولياء الأمور والمعلمون - هل أنتم جاهزون لتجربة تعلم ممتعة؟' 
                            : 'Ready for happier, gamified learning sessions?'}
                    </h2>
                    
                    <p className="text-sm sm:text-base text-slate-800 max-w-2xl mx-auto font-black leading-relaxed mb-10 font-cairo">
                        {getTranslation(lang, 'ctaSubtitle')}
                    </p>

                    {/* Massive Yellow Action Button */}
                    <div className="flex justify-center mb-8">
                        <Link to="/auth/signup" className="w-full sm:w-auto">
                            <Button variant="brutal" className="w-full sm:w-auto h-16 px-10 text-base sm:text-lg bg-[#ffde00] hover:bg-[#ffeaa7] text-slate-900 font-cairo">
                                <span>{getTranslation(lang, 'getStarted')} 🌈</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Sub-label */}
                    <p className="text-[10px] sm:text-xs font-black text-slate-700 tracking-wider font-cairo uppercase">
                        {lang === 'ar'
                            ? 'محبوب من قبل الطلاب • مصمم بواسطة خبراء التعليم • آمن 100% ومتوافق مع المعايير'
                            : 'Loved by active learners • Designed by expert teachers • 100% Safe & Secure'}
                    </p>
                </Card>
            </div>
        </section>
    );
}
