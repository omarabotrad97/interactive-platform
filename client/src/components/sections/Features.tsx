import { Flame, Sparkles, FileText } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function Features() {
    const { lang } = useStore();

    const features = [
        {
            titleKey: 'feature_timer' as const,
            descKey: 'feature_timer_desc' as const,
            icon: Flame,
            color: 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400',
        },
        {
            titleKey: 'feature_cards' as const,
            descKey: 'feature_cards_desc' as const,
            icon: Sparkles,
            color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400',
        },
        {
            titleKey: 'feature_notes' as const,
            descKey: 'feature_notes_desc' as const,
            icon: FileText,
            color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400',
        }
    ];

    return (
        <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900/30 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                        {getTranslation(lang, 'featuresTitle')}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
                        {getTranslation(lang, 'featuresSubtitle')}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={i} className="border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl bg-white dark:bg-gray-900 hover:scale-[1.02]">
                                <CardContent className="pt-6 pb-6">
                                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5 shadow-sm`}>
                                        <Icon className="w-6 h-6 animate-pulse-ring" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                        {getTranslation(lang, feature.titleKey)}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                                        {getTranslation(lang, feature.descKey)}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
