import { Github, Twitter, Linkedin } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../lib/translations';

export default function Footer() {
    const { lang } = useStore();

    const cols = lang === 'ar' ? [
        { title: 'المنصة', links: ['المزايا', 'الأسعار', 'الدورات'] },
        { title: 'الشركة', links: ['من نحن', 'المدونة', 'اتصل بنا'] },
        { title: 'القانونية', links: ['الخصوصية', 'الشروط', 'الأمان'] },
    ] : [
        { title: 'Product', links: ['Features', 'Pricing', 'Courses'] },
        { title: 'Company', links: ['About', 'Blog', 'Contact'] },
        { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
    ];

    return (
        <footer className="bg-brutal-cream border-t-2 border-slate-900 py-16 transition-colors duration-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1 dir-rtl text-right">
                        <div className="flex items-center gap-2 font-black text-xl text-slate-900 mb-4 font-cairo">
                            <div className="w-8 h-8 rounded-full bg-[#ffde00] border-2 border-slate-900 flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]">
                                <span className="text-xs">😊</span>
                            </div>
                            <span>{getTranslation(lang, 'home')}</span>
                        </div>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-bold font-cairo">
                            {getTranslation(lang, 'footerDesc')}
                        </p>
                    </div>

                    {cols.map((col) => (
                        <div key={col.title} className="dir-rtl text-right">
                            <h3 className="font-black text-xs sm:text-sm text-slate-900 mb-4 uppercase tracking-wider font-cairo">{col.title}</h3>
                            <ul className="space-y-3">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-xs sm:text-sm font-bold text-slate-500 hover:text-[#ff3b69] transition-colors font-cairo">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t-2 border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] sm:text-xs font-black text-slate-400 font-cairo">
                        © {new Date().getFullYear()} {getTranslation(lang, 'home')}. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
                    </p>
                    <div className="flex items-center gap-4">
                        {[Github, Twitter, Linkedin].map((Icon, i) => (
                            <a 
                                key={i} 
                                href="#" 
                                className="w-9 h-9 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all text-slate-800"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
