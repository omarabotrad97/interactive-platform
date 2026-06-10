import { Link } from 'react-router-dom';
import { Star, ArrowUpRight, BookOpen } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function FeaturedCourses() {
    const { lang, courses } = useStore();

    const steps = [
        {
            num: '1',
            numBg: 'bg-[#ff7675]',
            title: lang === 'ar' ? 'سجل دخولك مجاناً 🚀' : 'Sign in easily 🚀',
            desc: lang === 'ar' 
                ? 'سجل دخولك الآمن والمباشر بواسطة حساب Google لتجهيز ملفك الشخصي في ثوانٍ معدودة.'
                : 'Sign in securely with your Google account to initialize your profile and dashboard in seconds.',
            icon: '🔑'
        },
        {
            num: '2',
            numBg: 'bg-[#ffeaa7]',
            title: lang === 'ar' ? 'ادرس المفاهيم بذكاء 🧠' : 'Study smart with tools 🧠',
            desc: lang === 'ar'
                ? 'شاهد المحتوى، تدرب بالاختبارات، وراجع المفاهيم ببطاقات التكرار المتباعد الذكية (Anki).'
                : 'Watch lessons, take interactive quizzes, and schedule memory card reviews using spaced repetition.',
            icon: '📚'
        },
        {
            num: '3',
            numBg: 'bg-[#55efc4]',
            title: lang === 'ar' ? 'ارتقِ في المستوى واكتسب الأوسمة 🏆' : 'Earn XP & Achievements 🏆',
            desc: lang === 'ar'
                ? 'اكتسب نقاط الخبرة XP، ارتقِ في المستويات، وافتح الأوسمة، وصدر ملخصاتك بصيغة Markdown.'
                : 'Accumulate XP, level up, unlock achievement badges, and export your smart notes to Markdown.',
            icon: '🎉'
        }
    ];

    return (
        <section id="courses" className="py-24 bg-brutal-cream transition-colors duration-200 border-t-2 border-slate-900">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-cairo">
                        {getTranslation(lang, 'featuredCoursesTitle')}
                    </h2>
                    
                    {/* Wavy line decor */}
                    <div className="flex justify-center my-2">
                        <svg width="40" height="8" viewBox="0 0 40 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 6C4.1 6 5.5 2 7.6 2C9.7 2 11.1 6 13.2 6C15.3 6 16.7 2 18.8 2C20.9 2 22.3 6 24.4 6C26.5 6 27.9 2 30 2C32.1 2 33.5 6 35.6 6C37.7 6 38.5 2 39 2" stroke="#ff7675" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                    </div>

                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-bold font-cairo">
                        {getTranslation(lang, 'featuredCoursesSubtitle')}
                    </p>
                </div>

                {/* Neobrutalist Courses Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
                    {courses.map((course, idx) => {
                        const bgCardColor = idx % 2 === 0 ? 'bg-white' : 'bg-[#e8f4fd]';
                        return (
                            <div 
                                key={course.id} 
                                className={`group overflow-hidden border-brutal rounded-2xl shadow-brutal-lg flex flex-col ${bgCardColor} hover:translate-y-[-4px] hover:shadow-brutal-xl transition-all duration-200`}
                            >
                                <div className="aspect-video bg-slate-100 relative overflow-hidden h-48 border-b-3 border-slate-900">
                                    <img 
                                        src={course.thumbnailUrl} 
                                        alt={course.title[lang]} 
                                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                        <Link to="/auth/login">
                                            <button className="h-10 px-5 text-xs font-black bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
                                                {lang === 'ar' ? 'دخول فوري' : 'Quick Access'}
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white border-2 border-slate-900 shadow-[1px_1px_0px_0px_#000]">
                                                {course.id === 'react-101' ? (lang === 'ar' ? 'برمجة ويب' : 'Web Dev') : (lang === 'ar' ? 'ذكاء اصطناعي' : 'AI')}
                                            </span>
                                            <span className="text-xs text-slate-700 flex items-center gap-1 font-black">
                                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> 
                                                4.9
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 mb-2 font-cairo">
                                            {course.title[lang]}
                                        </h3>
                                        <p className="text-xs text-slate-600 leading-relaxed font-bold mb-4 line-clamp-2 font-cairo">
                                            {course.description[lang]}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between border-t-2 border-dashed border-slate-200 pt-4 mt-auto">
                                        <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                                            <BookOpen className="w-4 h-4 text-emerald-600" />
                                            <span className="font-cairo">{course.lessons.length} {lang === 'ar' ? 'دروس تفاعلية' : 'Lessons'}</span>
                                        </div>
                                        <span className="font-black text-xs text-emerald-700 font-cairo">
                                            {lang === 'ar' ? 'متاح للجميع' : 'Free access'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 3-Step Timeline Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-cairo">
                        {lang === 'ar' ? 'كيف تبدأ التعلم في بيت الحكمة؟ 🚀' : 'How kids learn with Wisdom House'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-black mt-2 font-cairo">
                        {lang === 'ar' ? 'ثلاث خطوات يسيرة يومياً. بدون ضغوط. نتائج رائعة.' : 'Three tiny steps a day. Zero tears. Maximum success.'}
                    </p>
                </div>

                {/* Timeline Cards Container */}
                <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                    {steps.map((step, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white border-brutal rounded-2xl shadow-brutal p-5 flex flex-col sm:flex-row items-center gap-4 hover:translate-y-[-2px] hover:shadow-brutal-lg transition-all duration-200"
                        >
                            {/* Step Number Circle */}
                            <div className={`w-10 h-10 rounded-full ${step.numBg} border-2 border-slate-900 flex items-center justify-center font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] text-sm shrink-0`}>
                                {step.num}
                            </div>
                            
                            {/* Step content */}
                            <div className="text-center sm:text-right flex-1 min-w-0 dir-rtl">
                                <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                                    <span className="text-sm">{step.icon}</span>
                                    <h4 className="text-sm font-black text-slate-900 font-cairo">{step.title}</h4>
                                </div>
                                <p className="text-xs text-slate-600 font-bold leading-relaxed font-cairo">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
