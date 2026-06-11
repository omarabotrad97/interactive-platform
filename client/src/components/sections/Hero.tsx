import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';
import { Button } from '../ui/Button';

export default function Hero() {
    const { lang } = useStore();

    return (
        <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-brutal-cream transition-colors duration-200">
            {/* Ambient stars */}
            <div className="absolute top-20 left-12 w-6 h-6 text-amber-400 select-none animate-bounce hidden sm:block">⭐</div>
            <div className="absolute top-24 right-20 w-6 h-6 text-sky-400 select-none animate-pulse hidden sm:block">⭐</div>
            <div className="absolute bottom-20 left-20 w-6 h-6 text-[#ff3b69] select-none hidden sm:block">⭐</div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                {/* Green word worm bubble */}
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#55efc4] border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] text-slate-900 text-xs font-black mb-10 transform -rotate-1 hover:rotate-0 transition-transform cursor-pointer">
                    <span>🐛</span>
                    <span className="font-cairo">
                        {lang === 'ar' 
                            ? 'جديد: مستويات بيت الحكمة التفاعلية متوفرة الآن!' 
                            : 'New: The Interactive Wisdom levels are here!'}
                    </span>
                </div>

                {/* Main Heading with Wiggle-Style Boxes */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-8 font-outfit select-none">
                    {lang === 'ar' ? (
                        <div className="leading-[1.4] font-cairo">
                            التعلم الذي{' '}
                            <span className="inline-block px-4 py-1 bg-[#ffde00] border-3 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0f172a] transform -rotate-2 mx-1">
                                يمرح
                            </span>
                            ،{' '}
                            <span className="inline-block px-4 py-1 bg-[#74b9ff] border-3 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0f172a] transform rotate-2 mx-1 text-slate-900">
                                يبهج
                            </span>{' '}
                            ويترسخ!
                        </div>
                    ) : (
                        <div className="leading-[1.3] font-outfit">
                            Learning that{' '}
                            <span className="inline-block px-4 py-1 bg-[#ffde00] border-3 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0f172a] transform -rotate-2 mx-1">
                                wiggles
                            </span>
                            ,{' '}
                            <span className="inline-block px-4 py-1 bg-[#74b9ff] border-3 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0f172a] transform rotate-2 mx-1 text-slate-900">
                                giggles
                            </span>{' '}
                            & sticks!
                        </div>
                    )}
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-700 max-w-xl mx-auto mb-10 leading-relaxed font-bold font-cairo">
                    {lang === 'ar'
                        ? 'منصة بيت الحكمة تحوّل المفاهيم الصعبة والمذاكرة الأسبوعية إلى مغامرات ممتعة يتعلمها الطالب بكل شغف واهتمام وبوتيرة مريحة! 📚✨'
                        : 'House of Wisdom turns challenging topics and weekly revision into laugh-out-loud, interactive adventures that build long-term memory retention! 📚✨'}
                </p>

                {/* Playful Neobrutalist Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm sm:max-w-none mx-auto mb-8">
                    <Link to="/auth/signup" className="w-full sm:w-auto">
                        <Button variant="brutal" className="w-full sm:w-auto h-14 px-8 text-base bg-[#ff5252] hover:bg-[#ff6b6b] text-white font-cairo">
                            <span>{getTranslation(lang, 'getStarted')} 🚀</span>
                        </Button>
                    </Link>
                    <Link to="/auth/login" className="w-full sm:w-auto">
                        <Button variant="brutal" className="w-full sm:w-auto h-14 px-8 text-base bg-white hover:bg-slate-50 text-slate-900 font-cairo">
                            <span>{getTranslation(lang, 'exploreCourses')} 👀</span>
                        </Button>
                    </Link>
                </div>

                {/* Pink wavy svg divider */}
                <div className="flex justify-center mb-4">
                    <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 10C5.1 10 7.2 2 10.3 2C13.4 2 15.5 10 18.6 10C21.7 10 23.8 2 26.9 2C30 2 32.1 10 35.2 10C38.3 10 40.4 2 43.5 2C46.6 2 48.7 10 51.8 10C54.9 10 57 2 58.2 2" stroke="#ff8a9b" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                </div>

                {/* Sub-banners */}
                <div className="text-xs font-black text-slate-500 font-cairo">
                    {lang === 'ar'
                        ? 'تثبيت بالذاكرة (Anki) • مؤقت بومودورو للتركيز • لوحة تحكم إشرافية للمعلمين'
                        : 'Anki Spaced Repetition • Pomodoro Focus Timers • Teacher Oversight Panel'}
                </div>
            </div>
        </section>
    );
}
