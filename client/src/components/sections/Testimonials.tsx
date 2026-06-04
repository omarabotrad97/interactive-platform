import { Star } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function Testimonials() {
    const { lang } = useStore();

    const feedbacks = [
        {
            nameKey: 't1_name' as const,
            titleKey: 't1_title' as const,
            commentKey: 't1_comment' as const,
            avatarLetter: 'Y'
        },
        {
            nameKey: 't2_name' as const,
            titleKey: 't2_title' as const,
            commentKey: 't2_comment' as const,
            avatarLetter: 'L'
        }
    ];

    return (
        <section id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-900/30 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                        {getTranslation(lang, 'testimonialsTitle')}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
                        {getTranslation(lang, 'testimonialsSubtitle')}
                    </p>
                </div>

                {/* Cards List */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {feedbacks.map((f, i) => (
                        <Card key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-900 shadow-md rounded-2xl hover:scale-[1.01] transition-transform">
                            <CardContent className="p-8 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-center gap-1 mb-4 text-yellow-500">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="w-4 h-4 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 italic leading-relaxed font-semibold">
                                        "{getTranslation(lang, f.commentKey)}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 border-t border-gray-50 dark:border-gray-800/80 pt-4 mt-auto">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shadow-inner">
                                        {f.avatarLetter}
                                    </div>
                                    <div>
                                        <div className="font-extrabold text-sm text-gray-900 dark:text-white">
                                            {getTranslation(lang, f.nameKey)}
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                            {getTranslation(lang, f.titleKey)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
