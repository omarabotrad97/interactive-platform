import { useStore } from '../../store/useStore';

export default function Stats() {
    const { lang } = useStore();

    const stats = [
        { 
            label: lang === 'ar' ? 'متعلم نشط 🧑‍🎓' : 'Active Learners 🧑‍🎓', 
            value: lang === 'ar' ? '١٠,٠٠٠+' : '10,000+',
            bgColor: 'bg-white',
            rotateClass: '-rotate-1'
        },
        { 
            label: lang === 'ar' ? 'نسبة إتمام الدروس 📈' : 'Lesson Completion Rate 📈', 
            value: '98%',
            bgColor: 'bg-[#e8f4fd]', // Light Blue
            rotateClass: 'rotate-1'
        },
        { 
            label: lang === 'ar' ? 'دورة تعليمية تفاعلية 📚' : 'Interactive Courses 📚', 
            value: lang === 'ar' ? '٥٠+' : '50+',
            bgColor: 'bg-[#fdebf0]', // Light Pink
            rotateClass: '-rotate-1'
        },
        { 
            label: lang === 'ar' ? 'تقييم ممتاز من الأهالي 💛' : 'Rating from Grown-ups 💛', 
            value: '4.9 ★',
            bgColor: 'bg-[#ebfaf6]', // Light Green
            rotateClass: 'rotate-1'
        },
    ];

    return (
        <section className="py-12 bg-[#ffde00] border-y-3 border-slate-900 transition-colors duration-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div 
                            key={i} 
                            className={`rounded-2xl border-brutal shadow-brutal p-5 text-center flex flex-col justify-center items-center gap-1.5 transform ${stat.rotateClass} hover:rotate-0 transition-transform ${stat.bgColor}`}
                        >
                            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit select-none">
                                {stat.value}
                            </div>
                            <div className="text-[10px] sm:text-xs font-black text-slate-700 leading-normal font-cairo">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
