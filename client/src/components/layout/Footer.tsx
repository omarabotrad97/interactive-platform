import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';
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
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 py-12 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 font-black text-xl text-emerald-600 dark:text-emerald-400 mb-4">
                            <BookOpen className="w-6 h-6" />
                            <span>{getTranslation(lang, 'home')}</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
                            {getTranslation(lang, 'footerDesc')}
                        </p>
                    </div>

                    {cols.map((col) => (
                        <div key={col.title}>
                            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wider">{col.title}</h3>
                            <ul className="space-y-2">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-bold text-gray-400">
                        © {new Date().getFullYear()} {getTranslation(lang, 'home')}. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
                    </p>
                    <div className="flex items-center gap-4">
                        {[Github, Twitter, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                <Icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
