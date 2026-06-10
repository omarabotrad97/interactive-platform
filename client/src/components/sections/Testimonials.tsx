import { Star } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function Testimonials() {
    const { lang } = useStore();

    const feedbacks = [
        {
            nameKey: 't1_name' as const,
            titleKey: 't1_title' as const,
            commentKey: 't1_comment' as const,
            avatarLetter: 'Y',
            avatarBg: 'bg-[#ffde00]', // Yellow
            rotateClass: '-rotate-1'
        },
        {
            nameKey: 't2_name' as const,
            titleKey: 't2_title' as const,
            commentKey: 't2_comment' as const,
            avatarLetter: 'L',
            avatarBg: 'bg-[#74b9ff]', // Blue
            rotateClass: 'rotate-1'
        }
    ];

    return (
        <section id="testimonials" className="py-24 bg-brutal-cream transition-colors duration-200 border-t-2 border-slate-900">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-cairo">
                        {lang === 'ar' ? 'آباء ومعلمون يبتسمون أيضاً 😄' : 'Grown-ups are grinning too 😄'}
                    </h2>
                    
                    {/* Wavy line decor */}
                    <div className="flex justify-center my-2">
                        <svg width="40" height="8" viewBox="0 0 40 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 6C4.1 6 5.5 2 7.6 2C9.7 2 11.1 6 13.2 6C15.3 6 16.7 2 18.8 2C20.9 2 22.3 6 24.4 6C26.5 6 27.9 2 30 2C32.1 2 33.5 6 35.6 6C37.7 6 38.5 2 39 2" stroke="#55efc4" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed font-bold font-cairo">
                        {getTranslation(lang, 'testimonialsSubtitle')}
                    </p>
                </div>

                {/* Cards List */}
                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    {feedbacks.map((f, i) => (
                        <div key={i} className={`flex flex-col transform ${f.rotateClass} hover:rotate-0 transition-transform duration-200`}>
                            {/* Speech Bubble Box */}
                            <div className="relative bg-white border-brutal rounded-2xl shadow-brutal p-8 mb-6">
                                {/* Small Star indicator */}
                                <div className="absolute top-2 right-2 text-xs text-amber-400 select-none">⭐</div>
                                
                                <div className="flex items-center gap-0.5 mb-4 text-amber-500">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <p className="text-sm sm:text-base text-slate-700 font-bold leading-relaxed font-cairo">
                                    "{getTranslation(lang, f.commentKey)}"
                                </p>

                                {/* Speech Bubble Pointer Arrow */}
                                <div className="absolute bottom-[-10px] left-8 w-5 h-5 bg-white border-b-3 border-r-3 border-slate-900 transform rotate-45 z-10"></div>
                            </div>

                            {/* User Avatar & Identity (Below Bubble) */}
                            <div className="flex items-center gap-3 pl-8 select-none">
                                <div className={`w-10 h-10 rounded-full ${f.avatarBg} border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_#000]`}>
                                    {f.avatarLetter}
                                </div>
                                <div className="dir-rtl text-right">
                                    <div className="font-black text-xs sm:text-sm text-slate-900 font-cairo">
                                        {getTranslation(lang, f.nameKey)}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-cairo">
                                        {getTranslation(lang, f.titleKey)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
