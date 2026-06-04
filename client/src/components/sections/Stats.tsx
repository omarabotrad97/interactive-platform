import { Users, GraduationCap, BookOpen, PlayCircle } from 'lucide-react';

export default function Stats() {
    return (
        <section className="py-12 border-y border-gray-100 dark:border-gray-900 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { label: 'Active Students', value: '10k+', icon: Users },
                        { label: 'Expert Instructors', value: '200+', icon: GraduationCap },
                        { label: 'Total Courses', value: '500+', icon: BookOpen },
                        { label: 'Course Hours', value: '1200+', icon: PlayCircle },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <stat.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
