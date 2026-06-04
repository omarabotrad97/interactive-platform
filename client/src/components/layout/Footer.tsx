import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400 mb-4">
                            <BookOpen className="w-6 h-6" />
                            <span>LMS Platform</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Empowering learners worldwide with accessible, high-quality education.
                        </p>
                    </div>

                    {[
                        { title: 'Product', links: ['Features', 'Pricing', 'Courses', 'Enterprise'] },
                        { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
                        { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
                    ].map((col) => (
                        <div key={col.title}>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{col.title}</h3>
                            <ul className="space-y-2">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} LMS Platform. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {[Github, Twitter, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                <Icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
