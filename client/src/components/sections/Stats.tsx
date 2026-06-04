import { Users, GraduationCap, BookOpen, PlayCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function Stats() {
    const { lang } = useStore();

    const stats = lang === 'ar' ? [
        { label: getTranslation(lang, 'statsLearners'), value: '١٠,٠٠٠+', icon: Users },
        { label: getTranslation(lang, 'statsCourses'), value: '٥٠+', icon: BookOpen },
        { label: getTranslation(lang, 'statsHours'), value: '١,٢٠٠+', icon: PlayCircle },
        { label: lang === 'ar' ? 'أوسمة منجزة' : 'Achievements Unlocked', value: '٤,٥٠٠+', icon: GraduationCap },
    ] : [
        { label: getTranslation(lang, 'statsLearners'), value: '10,000+', icon: Users },
        { label: getTranslation(lang, 'statsCourses'), value: '50+', icon: BookOpen },
        { label: getTranslation(lang, 'statsHours'), value: '1,200+', icon: PlayCircle },
        { label: 'Achievements Unlocked', value: '4,500+', icon: GraduationCap },
    ];

    return (
        <section className="py-12 border-y border-gray-100 dark:border-gray-900 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <stat.icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mb-1" />
                            <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{stat.value}</div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
