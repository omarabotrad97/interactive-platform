import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function Features() {
    const { lang } = useStore();

    const features = [
        {
            titleKey: 'feature_timer' as const,
            descKey: 'feature_timer_desc' as const,
            emoji: '⏰',
            bgColor: 'bg-[#ffde00]', // Yellow
            rotateClass: '-rotate-1 hover:rotate-0'
        },
        {
            titleKey: 'feature_cards' as const,
            descKey: 'feature_cards_desc' as const,
            emoji: '🧠',
            bgColor: 'bg-[#74b9ff]', // Sky Blue
            rotateClass: 'rotate-1 hover:rotate-0'
        },
        {
            titleKey: 'feature_notes' as const,
            descKey: 'feature_notes_desc' as const,
            emoji: '📝',
            bgColor: 'bg-[#55efc4]', // Soft Green
            rotateClass: '-rotate-1 hover:rotate-0'
        }
    ];

    return (
        <section id="features" className="py-24 bg-brutal-cream transition-colors duration-200 border-t-2 border-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-cairo">
                        {lang === 'ar' ? 'لماذا يعشق الطلاب التعلم في بيت الحكمة؟ 🌟' : getTranslation(lang, 'featuresTitle')}
                    </h2>
                    
                    {/* Wavy line decor */}
                    <div className="flex justify-center my-2">
                        <svg width="40" height="8" viewBox="0 0 40 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 6C4.1 6 5.5 2 7.6 2C9.7 2 11.1 6 13.2 6C15.3 6 16.7 2 18.8 2C20.9 2 22.3 6 24.4 6C26.5 6 27.9 2 30 2C32.1 2 33.5 6 35.6 6C37.7 6 38.5 2 39 2" stroke="#ffde00" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                    </div>

                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-bold font-cairo">
                        {getTranslation(lang, 'featuresSubtitle')}
                    </p>
                </div>

                {/* Playful Features Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, i) => {
                        return (
                            <div 
                                key={i} 
                                className={`rounded-2xl border-brutal shadow-brutal-lg p-8 transform ${feature.rotateClass} transition-all duration-200 ${feature.bgColor}`}
                            >
                                {/* Large Emoji Sticker */}
                                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-900 flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_#0f172a] text-3xl select-none">
                                    {feature.emoji}
                                </div>
                                
                                <h3 className="text-xl font-black text-slate-900 mb-4 font-cairo">
                                    {getTranslation(lang, feature.titleKey)}
                                </h3>
                                
                                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-bold font-cairo">
                                    {getTranslation(lang, feature.descKey)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
